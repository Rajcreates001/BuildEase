import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard';
import { getMyProjects } from '../../api/axios';

export default function ContractorDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getMyProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-10">Loading dashboard...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <GlassCard className="p-6 fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl">Ongoing Projects</h3>
            <button onClick={() => navigate('/contractor/view-projects')} className="px-4 py-2 bg-yellow-400/20 text-yellow-300 font-semibold rounded-lg text-sm hover:bg-yellow-400/30">
              Find New Projects
            </button>
          </div>
          {projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p._id} className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs text-gray-400">Client: {p.customer?.name || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{p.progress}%</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'in-progress' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`}>
                      {p.status === 'in-progress' ? 'On Track' : p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No ongoing projects. Browse open projects to submit bids.</p>
          )}
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 text-center fade-in" onClick={() => navigate('/contractor/manage-workers')} style={{ animationDelay: '0.1s' }}>
            <h3 className="text-3xl mb-2">💼</h3>
            <p className="font-semibold">Manage Workers</p>
          </GlassCard>
          <GlassCard className="p-6 text-center fade-in" onClick={() => navigate('/contractor/ai-quotation')} style={{ animationDelay: '0.2s' }}>
            <h3 className="text-3xl mb-2">📊</h3>
            <p className="font-semibold">AI Quotation Tool</p>
          </GlassCard>
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <GlassCard className="p-6 fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-bold text-xl mb-4">Project Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-gray-400">Active Projects:</span><span className="font-bold text-yellow-300">{projects.filter(p => p.status === 'in-progress').length}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Total Projects:</span><span className="font-bold">{projects.length}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Total Budget:</span><span className="font-bold neon-yellow-text">₹{projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0).toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Completed:</span><span className="font-bold text-green-400">{projects.filter(p => p.status === 'completed').length}</span></div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-bold text-xl mb-4">Quick Links</h3>
          <div className="space-y-2">
            <button onClick={() => navigate('/contractor/portfolio')} className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800">📑 My Portfolio</button>
            <button onClick={() => navigate('/contractor/billing')} className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800">💳 Payouts & Billing</button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
