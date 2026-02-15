import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/common/GlassCard';
import { getMyProjects, getNotifications } from '../../api/axios';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, notifRes] = await Promise.all([
          getMyProjects(),
          getNotifications().catch(() => ({ data: [] })),
        ]);
        const active = projRes.data.find((p) => p.status === 'in-progress');
        setProject(active || null);
        setNotifications(notifRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-10">Loading dashboard...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Active Project */}
        <GlassCard className="p-6 fade-in">
          <h3 className="font-bold text-xl mb-4">
            Active Project: <span className="neon-yellow-text">{project?.title || 'No active project'}</span>
          </h3>
          {project ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-300">Overall Progress</span>
                  <span className="text-sm font-bold text-yellow-300">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-300">Budget Spent</span>
                  <span className="text-sm font-bold text-gray-300">
                    ₹{(project.budgetSpent || 0).toLocaleString('en-IN')} / ₹{(project.totalBudget || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${project.totalBudget ? ((project.budgetSpent / project.totalBudget) * 100).toFixed(1) : 0}%` }} />
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <button onClick={() => navigate('/customer/track-project')} className="px-4 py-2 bg-yellow-400/20 text-yellow-300 font-semibold rounded-lg text-sm hover:bg-yellow-400/30">
                  Track Full Progress
                </button>
                <button className="px-4 py-2 bg-white/10 text-white font-semibold rounded-lg text-sm hover:bg-white/20">
                  Message Contractor
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No active project. Start by posting a project to get bids.</p>
          )}
        </GlassCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 text-center fade-in" onClick={() => navigate('/customer/ai-designer')} style={{ animationDelay: '0.1s' }}>
            <h3 className="text-3xl mb-2">✨</h3>
            <p className="font-semibold">AI Designer & Budget</p>
          </GlassCard>
          <GlassCard className="p-6 text-center fade-in" onClick={() => navigate('/customer/hire-builders')} style={{ animationDelay: '0.2s' }}>
            <h3 className="text-3xl mb-2">👷</h3>
            <p className="font-semibold">Hire Builders</p>
          </GlassCard>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        <GlassCard className="p-6 fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-bold text-xl mb-4">Notifications</h3>
          <div className="space-y-4">
            {notifications.length > 0 ? notifications.map((n) => (
              <div key={n._id || n.id} className="flex items-start gap-3">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${n.type === 'bid' ? 'bg-blue-400' : n.type === 'milestone' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                <div>
                  <p className="text-sm text-gray-200">{n.message || n.text}</p>
                  <p className="text-xs text-gray-500">{n.createdAt ? new Date(n.createdAt).toLocaleDateString() : n.time}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500">No notifications yet.</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6 fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-bold text-xl mb-4">Quick Links</h3>
          <div className="space-y-2">
            <button onClick={() => navigate('/customer/marketplace')} className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800">🛒 Marketplace</button>
            <button onClick={() => navigate('/customer/budget-prediction')} className="w-full text-left p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800">📈 AI Budget Predictor</button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
