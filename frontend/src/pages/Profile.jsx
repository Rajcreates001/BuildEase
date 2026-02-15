import { useState } from 'react';
import GlassCard from '../components/common/GlassCard';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    companyName: user?.companyName || '',
    companyWebsite: user?.companyWebsite || '',
    specialization: user?.specialization || '',
    yearsOfExperience: user?.yearsOfExperience || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await updateProfile(formData);
      updateUser(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <GlassCard className="p-4 sm:p-6 md:p-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field" />
            </div>
            <div>
              <label className="block text-sm">Email</label>
              <input type="email" value={user?.email || ''} disabled className="w-full p-3 mt-1 rounded-lg input-field opacity-50" />
            </div>
          </div>

          {user?.role === 'customer' && (
            <div>
              <label className="block text-sm">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field" />
            </div>
          )}

          {user?.role === 'contractor' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">Company Name</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field" />
              </div>
              <div>
                <label className="block text-sm">Company Website</label>
                <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} className="w-full p-3 mt-1 rounded-lg input-field" />
              </div>
            </div>
          )}

          <div className="pt-4">
            <button onClick={handleSave} disabled={loading} className="px-6 py-2 btn-primary text-gray-900 font-bold rounded-lg disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
