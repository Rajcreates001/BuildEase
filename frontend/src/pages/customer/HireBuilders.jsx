import { useState, useEffect } from 'react';
import GlassCard from '../../components/common/GlassCard';
import { getContractors, createProject } from '../../api/axios';
import toast from 'react-hot-toast';

export default function HireBuilders() {
  const [contractors, setContractors] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [projectForm, setProjectForm] = useState({ title: '', location: '', budget: '' });

  useEffect(() => {
    fetchContractors();
  }, [filter]);

  const fetchContractors = async () => {
    try {
      const params = filter !== 'All' ? { specialization: filter } : {};
      const { data } = await getContractors(params);
      setContractors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostProject = async () => {
    if (!projectForm.title || !projectForm.location || !projectForm.budget) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await createProject({
        title: projectForm.title,
        location: projectForm.location,
        budget: projectForm.budget,
        type: 'New Construction',
        skills: ['Masonry', 'Plumbing', 'Electrical'],
      });
      toast.success('Project posted successfully!');
      setProjectForm({ title: '', location: '', budget: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post project');
    }
  };

  const filters = ['All', 'Residential Construction', 'Luxury Villas', 'Budget Homes'];

  return (
    <div>
      {/* Post Project */}
      <GlassCard className="p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
        <h2 className="text-2xl font-bold mb-4">Post a Project</h2>
        <p className="text-gray-400 mb-6">Describe your project to start receiving bids from top contractors.</p>
        <div className="grid md:grid-cols-3 gap-4">
          <input type="text" className="p-3 rounded-lg input-field" placeholder="Project Title, e.g., Build 2BHK House"
            value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} />
          <input type="text" className="p-3 rounded-lg input-field" placeholder="Location, e.g., Bangalore"
            value={projectForm.location} onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })} />
          <input type="text" className="p-3 rounded-lg input-field" placeholder="Budget, e.g., ₹25L"
            value={projectForm.budget} onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })} />
          <button onClick={handlePostProject} className="md:col-span-3 w-full py-3 btn-primary text-gray-900 font-bold rounded-lg mt-2">
            Post Project & Get Bids
          </button>
        </div>
      </GlassCard>

      {/* Filter */}
      <h2 className="text-2xl font-bold mb-4">Find & Hire Builders</h2>
      <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-gray-800">
        <span className="text-sm text-gray-400 w-full sm:w-auto">Filter by Specialization:</span>
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs font-semibold rounded-md ${filter === f ? 'bg-yellow-400/20 text-yellow-300' : 'bg-white/10 text-white'}`}>
            {f === 'Residential Construction' ? 'Residential' : f === 'Luxury Villas' ? 'Luxury' : f === 'Budget Homes' ? 'Budget' : f}
          </button>
        ))}
      </div>

      {/* Contractors List */}
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading contractors...</div>
      ) : (
        <div className="space-y-4">
          {contractors.length === 0 ? (
            <p className="text-center text-gray-400">No contractors found for this filter.</p>
          ) : (
            contractors.map((c) => (
              <GlassCard key={c._id} className="p-4 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h3 className="font-bold text-lg">{c.companyName || c.name}</h3>
                  <p className="text-sm text-yellow-400">⭐ {c.rating || 0} / 5.0 ({c.completedProjects || 0}+ Projects)</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Specialization</p>
                  <p className="font-semibold text-lg">{c.specialization || 'General'}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">Experience</p>
                  <p className="font-semibold text-lg">{c.yearsOfExperience || 0} years</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-4 py-2 bg-white/10 text-white text-sm font-semibold rounded-lg hover:bg-white/20">View Profile</button>
                  <button className="flex-1 sm:flex-none px-4 py-2 btn-primary text-gray-900 text-sm font-semibold rounded-lg">Request Quote</button>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      )}
    </div>
  );
}
