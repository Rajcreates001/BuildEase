import { useState, useEffect } from 'react';
import GlassCard from '../../components/common/GlassCard';
import { getMyProjects } from '../../api/axios';

export default function TrackProject() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await getMyProjects();
        const active = data.find((p) => p.status === 'in-progress');
        setProject(active || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-10">Loading project...</div>;
  if (!project) return <div className="text-center text-gray-400 py-10">No active project found. Post a project first.</div>;

  const milestoneIcons = { completed: '✅', 'in-progress': '⏳', upcoming: '⚪' };
  const milestoneColors = { completed: 'bg-green-500/50', 'in-progress': 'bg-yellow-500/50', upcoming: 'bg-gray-500/50' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <GlassCard className="p-6">
          <h2 className="text-2xl font-bold mb-6">Project Progress: {project.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Overall Progress</span>
            <span className="font-bold neon-yellow-text">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-yellow-400 h-4 rounded-full" style={{ width: `${project.progress}%` }} />
          </div>
        </GlassCard>

        {/* Gallery */}
        {project.gallery?.length > 0 && (
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4">Progress Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {project.gallery.map((img, idx) => (
                <img key={idx} src={img} className="rounded-lg aspect-video object-cover cursor-pointer hover:scale-105 transition-transform" alt={`Progress ${idx + 1}`} />
              ))}
            </div>
          </GlassCard>
        )}

        {/* Updates */}
        {project.updates?.length > 0 && (
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold mb-4">Recent Updates</h3>
            <div className="space-y-4 text-sm border-l-2 border-yellow-400/50 pl-4">
              {project.updates.map((update, idx) => (
                <p key={idx}>
                  <strong className="block text-gray-300">{new Date(update.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}:</strong>
                  {update.text}
                </p>
              ))}
            </div>
          </GlassCard>
        )}
      </div>

      <div className="lg:col-span-1 space-y-6">
        {/* Timeline */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-4">Project Timeline</h3>
          <div className="space-y-4">
            {(project.milestones || []).map((m, idx) => (
              <div key={idx} className="flex gap-3">
                <div className={`w-6 h-6 rounded-full ${milestoneColors[m.status]} flex items-center justify-center text-sm flex-shrink-0`}>
                  {milestoneIcons[m.status]}
                </div>
                <div>
                  <p>{m.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{m.status === 'in-progress' ? 'In Progress' : m.status}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Documents */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold mb-4">Project Documents</h3>
          <div className="space-y-2 text-sm">
            <a href="#" className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800">📄 Blueprint.pdf</a>
            <a href="#" className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800">📄 Contract.pdf</a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
