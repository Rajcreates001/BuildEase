import { useState, useEffect } from 'react';
import GlassCard from '../../components/common/GlassCard';
import { useAuth } from '../../context/AuthContext';
import { getMyProjects } from '../../api/axios';

export default function Portfolio() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await getMyProjects();
        setProjects(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const completedProjects = projects.filter(p => p.status === 'completed');
  const totalBudget = projects.reduce((sum, p) => sum + (p.totalBudget || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <GlassCard className="p-6">
          <h3 className="font-bold text-xl mb-4">My Projects</h3>
          {loading ? (
            <p className="text-gray-400">Loading projects...</p>
          ) : projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p._id} className="bg-gray-800/50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.location} &bull; {p.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{p.progress}%</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'completed' ? 'bg-green-500/20 text-green-300' : p.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No projects yet. Win bids on open projects to build your portfolio!</p>
          )}
        </GlassCard>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <GlassCard className="p-6">
          <h3 className="font-bold text-xl mb-4">Key Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Company:</span><span className="font-bold text-yellow-300">{user?.company || user?.name || 'N/A'}</span></div>
            <div className="flex justify-between"><span>Total Projects:</span><span className="font-bold">{projects.length}</span></div>
            <div className="flex justify-between"><span>Completed:</span><span className="font-bold text-green-400">{completedProjects.length}</span></div>
            <div className="flex justify-between"><span>Total Budget Managed:</span><span className="font-bold">₹{totalBudget.toLocaleString('en-IN')}</span></div>
            {user?.experience && <div className="flex justify-between"><span>Experience:</span><span className="font-bold">{user.experience} years</span></div>}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="font-bold text-xl mb-4">Specializations</h3>
          {user?.specializations?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.specializations.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-yellow-400/20 text-yellow-300 text-sm rounded-full">{s}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Update your profile to add specializations.</p>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
