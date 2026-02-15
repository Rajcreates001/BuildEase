import { useState } from 'react';
import GlassCard from '../../components/common/GlassCard';
import { generateBlueprint, aiEstimate } from '../../api/axios';

export default function AIDesigner() {
  const [formData, setFormData] = useState({
    area: 1200, bedrooms: 3, bathrooms: 2, floors: 1,
    style: 'modern', city: 'bangalore', quality: 'mid',
    garage: false, balcony: true,
  });
  const [extraFeatures, setExtraFeatures] = useState('');
  const [blueprint, setBlueprint] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = { ...formData, area: Number(formData.area), bedrooms: Number(formData.bedrooms), bathrooms: Number(formData.bathrooms), floors: Number(formData.floors), extraFeatures };
      const [bpRes, estRes] = await Promise.all([generateBlueprint(payload), aiEstimate(payload)]);
      setBlueprint(bpRes.data);
      setEstimate(estRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'AI service unavailable. Make sure the Python service is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-4 sm:p-6 md:p-8 fade-in">
        <h2 className="text-2xl font-bold mb-2">AI House Designer & Budget Estimator</h2>
        <p className="text-gray-400 mb-6">Enter your requirements and our ML model will generate a floor plan blueprint with accurate cost estimation.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-gray-300">Total Area (sq. ft.)</label>
            <input type="number" name="area" value={formData.area} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field" />
          </div>
          <div>
            <label className="text-sm text-gray-300">Bedrooms</label>
            <select name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field">
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-300">Bathrooms</label>
            <select name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field">
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-300">Floors</label>
            <select name="floors" value={formData.floors} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field">
              {[1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
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
            <label className="text-sm text-gray-300">Quality</label>
            <select name="quality" value={formData.quality} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field">
              <option value="basic">Basic</option>
              <option value="mid">Mid-Range</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-300">Style</label>
            <select name="style" value={formData.style} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field">
              <option value="modern">Modern</option>
              <option value="traditional">Traditional</option>
              <option value="contemporary">Contemporary</option>
            </select>
          </div>
          <div className="flex items-end gap-6 pb-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="garage" checked={formData.garage} onChange={handleChange} className="accent-yellow-400 w-4 h-4" /> <span className="text-sm">Garage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="balcony" checked={formData.balcony} onChange={handleChange} className="accent-yellow-400 w-4 h-4" /> <span className="text-sm">Balcony</span>
            </label>
          </div>
        </div>

        {/* Extra Features Text Box */}
        <div className="mt-4">
          <label className="text-sm text-gray-300">Additional Features / Requirements (optional)</label>
          <textarea
            value={extraFeatures}
            onChange={(e) => setExtraFeatures(e.target.value)}
            placeholder="E.g., study room, pooja room, home office, gym, utility room, walk-in closet, servant room, terrace, library, home theater..."
            className="w-full p-3 mt-1 rounded-lg input-field h-20 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">The AI will incorporate these features into the floor plan layout.</p>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="mt-6 px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition-all">
          {loading ? '⏳ Generating...' : '✨ Generate Blueprint & Estimate'}
        </button>
        {error && <p className="mt-3 text-red-400 text-sm">{error}</p>}
      </GlassCard>

      {/* Blueprint Results — One card per floor */}
      {blueprint && (
        <>
          {/* Summary Header */}
          <GlassCard className="p-6 fade-in">
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div>
                <h3 className="text-xl font-bold">Generated Floor Plans</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {blueprint.config} &bull; {blueprint.style} Style &bull; Total Area: {blueprint.totalArea?.toLocaleString()} sq.ft
                  {blueprint.floors?.length > 1 && ` (${blueprint.perFloorArea?.toLocaleString()} sq.ft / floor)`}
                </p>
              </div>
              <div className="text-right text-sm text-gray-400">
                <p>Plot: {blueprint.plotWidth}' × {blueprint.plotDepth}'</p>
                {blueprint.extraFeatures?.length > 0 && (
                  <p className="text-yellow-300 mt-1">+ {blueprint.extraFeatures.join(', ')}</p>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Per-floor cards */}
          {blueprint.floors?.map((floor, fi) => (
            <GlassCard key={fi} className="p-4 sm:p-6 md:p-8 fade-in">
              <h3 className="text-lg font-bold mb-1">{floor.label}</h3>
              <p className="text-xs text-gray-500 mb-4">Floor Area: {floor.area} sq.ft</p>

              {/* Blueprint Image */}
              <div className="flex justify-center bg-gray-900/80 rounded-lg p-4 border border-gray-700/50">
                <img
                  src={`data:image/png;base64,${floor.image}`}
                  alt={floor.label}
                  className="max-w-full rounded shadow-lg"
                />
              </div>

              {/* Room Dimensions */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-gray-300">Room Dimensions — {floor.label}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {floor.rooms?.map((room, i) => (
                    <div key={i} className="bg-gray-800/60 rounded-lg p-3 text-center">
                      <p className="font-semibold text-sm">{room.name}</p>
                      <p className="text-yellow-300 text-lg font-bold">{room.width}' × {room.length}'</p>
                      <p className="text-xs text-gray-400">{room.area} sq.ft.</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </>
      )}

      {/* Cost Estimation */}
      {estimate && (
        <GlassCard className="p-4 sm:p-6 md:p-8 fade-in">
          <h3 className="text-xl font-bold mb-2">ML Cost Estimation</h3>
          <p className="text-sm text-gray-400 mb-4">Confidence: <span className="text-green-400 font-semibold">{(estimate.confidence * 100).toFixed(0)}%</span></p>
          <p className="text-4xl font-bold neon-yellow-text mb-4">₹{estimate.estimatedCost?.toLocaleString('en-IN')}</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Breakdown */}
            <div>
              <h4 className="font-semibold mb-3 text-gray-300">Cost Breakdown</h4>
              <div className="space-y-2">
                {estimate.breakdown && Object.entries(estimate.breakdown).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                    <span>₹{val?.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Range & Tips */}
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-gray-300">Market Range ({formData.city})</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Low</span>
                  <span>₹{estimate.marketRange?.low?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">High</span>
                  <span>₹{estimate.marketRange?.high?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {estimate.tips?.length > 0 && (
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-gray-300">AI Tips</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    {estimate.tips.map((tip, i) => <li key={i}>💡 {tip}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
