import { useState, useEffect } from 'react';
import GlassCard from '../../components/common/GlassCard';
import { getWorkers, addWorker, updateWorker, deleteWorker } from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: '', role: 'Mason', phone: '', dailyWage: '' });

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      const { data } = await getWorkers();
      setWorkers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorker = async () => {
    if (!newWorker.name) {
      toast.error('Worker name is required');
      return;
    }
    try {
      await addWorker({ ...newWorker, dailyWage: Number(newWorker.dailyWage) });
      toast.success('Worker added!');
      setNewWorker({ name: '', role: 'Mason', phone: '', dailyWage: '' });
      setShowForm(false);
      fetchWorkers();
    } catch (err) {
      toast.error('Failed to add worker');
    }
  };

  const handleToggleStatus = async (worker) => {
    const newStatus = worker.status === 'Assigned' ? 'Available' : 'Assigned';
    try {
      await updateWorker(worker._id, { status: newStatus });
      fetchWorkers();
    } catch (err) {
      toast.error('Failed to update worker');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWorker(id);
      toast.success('Worker removed');
      fetchWorkers();
    } catch (err) {
      toast.error('Failed to delete worker');
    }
  };

  if (loading) return <div className="text-center text-gray-400 py-10">Loading workers...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Workers</h2>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 btn-primary text-gray-900 font-semibold rounded-lg text-sm">
          {showForm ? 'Cancel' : '+ Add Worker'}
        </button>
      </div>

      {showForm && (
        <GlassCard className="p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <input type="text" placeholder="Name" className="p-3 rounded-lg input-field"
              value={newWorker.name} onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })} />
            <select className="p-3 rounded-lg input-field"
              value={newWorker.role} onChange={(e) => setNewWorker({ ...newWorker, role: e.target.value })}>
              <option>Mason</option><option>Plumber</option><option>Electrician</option>
              <option>Carpenter</option><option>Painter</option><option>Laborer</option><option>Supervisor</option>
            </select>
            <input type="text" placeholder="Phone" className="p-3 rounded-lg input-field"
              value={newWorker.phone} onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })} />
            <input type="number" placeholder="Daily Wage" className="p-3 rounded-lg input-field"
              value={newWorker.dailyWage} onChange={(e) => setNewWorker({ ...newWorker, dailyWage: e.target.value })} />
          </div>
          <button onClick={handleAddWorker} className="mt-4 px-6 py-2 btn-primary text-gray-900 font-bold rounded-lg">Add Worker</button>
        </GlassCard>
      )}

      <GlassCard className="p-8">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700 text-sm text-gray-400">
              <th className="py-2">Name</th>
              <th className="py-2">Role</th>
              <th className="py-2 text-center">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w._id} className="border-b border-gray-800">
                <td className="py-3">{w.name}</td>
                <td className="py-3">{w.role}</td>
                <td className="py-3 text-center">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${w.status === 'Assigned' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                    {w.status}
                  </span>
                </td>
                <td className="py-3 text-right space-x-3">
                  <button onClick={() => handleToggleStatus(w)} className="text-sm text-yellow-400 hover:underline">
                    {w.status === 'Assigned' ? 'Unassign' : 'Assign'}
                  </button>
                  <button onClick={() => handleDelete(w._id)} className="text-sm text-red-400 hover:underline">Remove</button>
                </td>
              </tr>
            ))}
            {workers.length === 0 && (
              <tr><td colSpan="4" className="py-6 text-center text-gray-400">No workers added yet.</td></tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
