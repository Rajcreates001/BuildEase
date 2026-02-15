import { useState, useEffect } from 'react';
import GlassCard from '../../components/common/GlassCard';
import { getProjects, submitBid } from '../../api/axios';
import toast from 'react-hot-toast';

export default function ViewProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getProjects({ status: 'open' });
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleBid = async (projectId) => {
    try {
      await submitBid(projectId, {
        amount: '₹24.5L',
        timeline: '8 months',
        message: 'We would love to work on this project.',
      });
      toast.success('Bid submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit bid');
    }
  };

  if (loading) return <div className="text-center text-gray-400 py-10">Loading projects...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Open Customer Projects</h2>
      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No open projects available right now.</p>
        ) : (
          projects.map((proj) => (
            <GlassCard key={proj._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">
                  {proj.title}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium ml-2">{proj.type}</span>
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {proj.location} - <span className="text-gray-300">Posted {new Date(proj.createdAt).toLocaleDateString()}</span>
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(proj.skills || []).map((s, idx) => (
                    <span key={idx} className="text-xs px-2 py-0.5 rounded bg-gray-700">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Budget</p>
                  <p className="font-semibold text-lg text-yellow-400">{proj.budget}</p>
                </div>
                <button onClick={() => handleBid(proj._id)} className="px-6 py-2 btn-primary text-gray-900 font-semibold rounded-lg w-full sm:w-auto">
                  Submit Bid
                </button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
