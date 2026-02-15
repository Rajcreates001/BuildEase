import { useState } from 'react';
import GlassCard from '../../components/common/GlassCard';
import { aiPrediction } from '../../api/axios';

export default function BudgetPrediction() {
  const [formData, setFormData] = useState({ city: 'bangalore', area: 1200, quality: 'mid', bedrooms: 3, bathrooms: 2, floors: 1, contingency: 15 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const calculate = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = { ...formData, area: Number(formData.area), bedrooms: Number(formData.bedrooms), bathrooms: Number(formData.bathrooms), floors: Number(formData.floors), contingency: Number(formData.contingency) };
      const { data } = await aiPrediction(payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'AI service unavailable. Make sure the Python service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-8 fade-in">
        <h2 className="text-2xl font-bold mb-2">AI Budget Prediction Tool</h2>
        <p className="text-gray-400 mb-6">ML-powered estimation of what a contractor's full project cost might look like, including labour, permits, and overheads.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-300">City</label>
            <select name="city" value={formData.city} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field">
              <option value="bangalore">Bangalore</option>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="chennai">Chennai</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="pune">Pune</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-300">Area (sq. ft.)</label>
            <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field" />
          </div>
          <div>
            <label className="text-sm text-gray-300">Quality</label>
            <select name="quality" value={formData.quality} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field">
              <option value="basic">Basic</option>
              <option value="mid">Mid-Range</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-300">Bedrooms</label>
            <select name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field">
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-300">Bathrooms</label>
            <select name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field">
              {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-300">Floors</label>
            <select name="floors" value={formData.floors} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field">
              {[1,2,3].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-300">Contingency (%)</label>
            <input type="number" name="contingency" value={formData.contingency} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field" />
          </div>
        </div>

        <button onClick={calculate} disabled={loading} className="mt-6 px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition-all">
          {loading ? '⏳ Predicting...' : '📊 Get AI Prediction'}
        </button>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </GlassCard>

      {result && (
        <>
          {/* Total Cost */}
          <GlassCard className="p-8 fade-in">
            <h3 className="text-xl font-bold mb-2">Predicted Total Project Cost</h3>
            <p className="text-4xl font-bold neon-yellow-text mb-4">₹{result.totalPrediction?.toLocaleString('en-IN')}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Base Construction Cost:</span><span>₹{result.baseCost?.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Contingency ({result.contingency}%):</span><span>₹{result.contingencyAmount?.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between border-t border-gray-700 pt-2 mt-2"><span className="font-semibold">Predicted Total:</span><span className="font-semibold">₹{result.totalPrediction?.toLocaleString('en-IN')}</span></div>
            </div>
          </GlassCard>

          {/* Cost Categories */}
          {result.categories && (
            <GlassCard className="p-8 fade-in">
              <h3 className="text-xl font-bold mb-4">Category-wise Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(result.categories).map(([key, val]) => {
                  const pct = result.baseCost ? ((val / result.baseCost) * 100).toFixed(1) : 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span>₹{val?.toLocaleString('en-IN')} <span className="text-gray-500">({pct}%)</span></span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          )}

          {/* Comparison & Monthly Projection */}
          <div className="grid md:grid-cols-2 gap-6">
            {result.comparison && (
              <GlassCard className="p-6 fade-in">
                <h3 className="font-bold text-lg mb-3">Indian vs Foreign Material Comparison</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Indian Materials:</span><span>₹{result.comparison.indian?.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Foreign/Imported Materials:</span><span>₹{result.comparison.foreign?.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Savings with Indian:</span><span className="text-green-400 font-semibold">₹{result.comparison.savings?.toLocaleString('en-IN')}</span></div>
                </div>
              </GlassCard>
            )}
            {result.monthlyCost && (
              <GlassCard className="p-6 fade-in">
                <h3 className="font-bold text-lg mb-3">Monthly Cost Projection</h3>
                <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                  {result.monthlyCost.map((m) => (
                    <div key={m.month} className="flex justify-between">
                      <span className="text-gray-400">Month {m.month}</span>
                      <span>₹{m.cost?.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>
        </>
      )}
    </div>
  );
}
