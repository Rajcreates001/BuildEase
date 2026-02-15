import { useState } from 'react';
import GlassCard from '../../components/common/GlassCard';
import { aiQuotation } from '../../api/axios';

export default function AIQuotationTool() {
  const [formData, setFormData] = useState({ city: 'bangalore', area: 1200, quality: 'mid', bedrooms: 3, bathrooms: 2, floors: 1, margin: 15 });
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
      const payload = { ...formData, area: Number(formData.area), bedrooms: Number(formData.bedrooms), bathrooms: Number(formData.bathrooms), floors: Number(formData.floors), margin: Number(formData.margin) };
      const { data } = await aiQuotation(payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'AI service unavailable. Make sure the Python service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-4 sm:p-6 md:p-8 fade-in">
        <h2 className="text-2xl font-bold mb-2">AI Quotation Generator</h2>
        <p className="text-gray-400 mb-6">Generate a detailed, ML-powered project quotation including labour, supervision, permits, and phased timeline.</p>

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
            <label className="text-sm text-gray-300">Profit Margin (%)</label>
            <input type="number" name="margin" value={formData.margin} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field" />
          </div>
        </div>

        <button onClick={calculate} disabled={loading} className="mt-6 px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition-all">
          {loading ? '⏳ Generating...' : '📊 Generate Quotation'}
        </button>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </GlassCard>

      {result && (
        <>
          {/* Total Quote */}
          <GlassCard className="p-4 sm:p-6 md:p-8 fade-in">
            <h3 className="text-xl font-bold mb-2">Generated Quotation</h3>
            <p className="text-4xl font-bold neon-yellow-text mb-4">₹{result.totalQuote?.toLocaleString('en-IN')}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Material & Labour Cost:</span><span>₹{result.baseCost?.toLocaleString('en-IN')}</span></div>
              {result.laborOverhead != null && <div className="flex justify-between"><span className="text-gray-400">Labour Overhead:</span><span>₹{result.laborOverhead?.toLocaleString('en-IN')}</span></div>}
              {result.supervision != null && <div className="flex justify-between"><span className="text-gray-400">Supervision Charge:</span><span>₹{result.supervision?.toLocaleString('en-IN')}</span></div>}
              {result.permits != null && <div className="flex justify-between"><span className="text-gray-400">Permits & Approvals:</span><span>₹{result.permits?.toLocaleString('en-IN')}</span></div>}
              <div className="flex justify-between"><span className="text-gray-400">Profit Margin ({result.margin}%):</span><span>₹{result.profit?.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between border-t border-gray-700 pt-2 mt-2"><span className="font-semibold">Total Quote:</span><span className="font-semibold">₹{result.totalQuote?.toLocaleString('en-IN')}</span></div>
            </div>
          </GlassCard>

          {/* Construction Phases */}
          {result.phases?.length > 0 && (
            <GlassCard className="p-4 sm:p-6 md:p-8 fade-in">
              <h3 className="text-xl font-bold mb-4">Construction Phases & Timeline</h3>
              <div className="space-y-4">
                {result.phases.map((phase, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-xs text-yellow-300 font-semibold">Phase {i + 1}</span>
                        <h4 className="font-semibold">{phase.name}</h4>
                      </div>
                      <span className="text-sm text-gray-400">{phase.duration}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${phase.percentage}%` }} />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>{phase.percentage}% of total</span>
                      <span>₹{phase.cost?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </>
      )}
    </div>
  );
}
