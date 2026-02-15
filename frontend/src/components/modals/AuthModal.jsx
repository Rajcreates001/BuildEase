import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AuthModal({ isOpen, onClose, initialForm = 'login', initialRole = 'customer' }) {
  const { login, signup } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [accountType, setAccountType] = useState(initialRole);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    name: '', email: '', password: '', location: '',
    companyName: '', yearsOfExperience: '', specialization: 'Residential Construction', companyWebsite: '',
  });

  // Reset state when modal opens with new props
  useEffect(() => {
    if (isOpen) {
      setForm(initialForm);
      setAccountType(initialRole);
      setLoginData({ email: '', password: '' });
      setSignupData({
        name: '', email: '', password: '', location: '',
        companyName: '', yearsOfExperience: '', specialization: 'Residential Construction', companyWebsite: '',
      });
    }
  }, [isOpen, initialForm, initialRole]);

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData.email, loginData.password);
      toast.success('Logged in successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        role: accountType,
      };
      if (accountType === 'customer') {
        payload.location = signupData.location;
      } else {
        payload.companyName = signupData.companyName;
        payload.yearsOfExperience = Number(signupData.yearsOfExperience);
        payload.specialization = signupData.specialization;
        payload.companyWebsite = signupData.companyWebsite;
      }
      await signup(payload);
      toast.success('Account created successfully!');
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message
        || (err.response?.data?.errors && Array.isArray(err.response.data.errors)
          ? err.response.data.errors.map(e => e.msg).join(', ')
          : 'Signup failed. Please check your connection and try again.');
      console.error('Signup error:', err.response?.data || err.message);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className={`glass-card rounded-2xl w-full relative max-h-[90vh] flex flex-col ${accountType === 'contractor' && form === 'signup' ? 'max-w-xl' : 'max-w-md'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 overflow-y-auto no-scrollbar">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {form === 'login' ? (
            <>
              <h2 className="text-3xl font-bold text-center mb-6 text-white">Welcome Back</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input type="email" className="w-full p-3 rounded-lg input-field" placeholder="you@example.com" required
                    value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input type="password" className="w-full p-3 rounded-lg input-field" placeholder="••••••••" required
                    value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 btn-primary text-gray-900 font-bold rounded-lg disabled:opacity-50">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>
              <p className="text-center mt-4 text-sm text-gray-400">
                Don't have an account?{' '}
                <button onClick={() => setForm('signup')} className="font-semibold neon-yellow-text hover:underline">Sign Up</button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-center mb-4 text-white">Create Your Account</h2>
              <div className="flex justify-center mb-4 border border-gray-600 rounded-lg p-1">
                <button onClick={() => setAccountType('customer')}
                  className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${accountType === 'customer' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300'}`}>
                  I'm a Customer
                </button>
                <button onClick={() => setAccountType('contractor')}
                  className={`w-1/2 py-2 rounded-md text-sm font-semibold transition ${accountType === 'contractor' ? 'bg-yellow-400 text-gray-900' : 'text-gray-300'}`}>
                  I'm a Contractor
                </button>
              </div>

              <form onSubmit={handleSignup}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input type="text" className="w-full p-3 rounded-lg input-field" placeholder="John Doe" required
                      value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input type="email" className="w-full p-3 rounded-lg input-field" placeholder="you@example.com" required
                      value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} />
                  </div>
                </div>

                {accountType === 'contractor' && (
                  <div className="space-y-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                        <input type="text" className="w-full p-3 rounded-lg input-field" placeholder="Apex Constructions"
                          value={signupData.companyName} onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Years of Experience</label>
                        <input type="number" className="w-full p-3 rounded-lg input-field" placeholder="10"
                          value={signupData.yearsOfExperience} onChange={(e) => setSignupData({ ...signupData, yearsOfExperience: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Specialization</label>
                      <select className="w-full p-3 rounded-lg input-field"
                        value={signupData.specialization} onChange={(e) => setSignupData({ ...signupData, specialization: e.target.value })}>
                        <option>Residential Construction</option>
                        <option>Commercial Projects</option>
                        <option>Renovations & Remodeling</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Company Website (Optional)</label>
                      <input type="url" className="w-full p-3 rounded-lg input-field" placeholder="https://example.com"
                        value={signupData.companyWebsite} onChange={(e) => setSignupData({ ...signupData, companyWebsite: e.target.value })} />
                    </div>
                  </div>
                )}

                {accountType === 'customer' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Primary Location (City)</label>
                    <input type="text" className="w-full p-3 rounded-lg input-field" placeholder="e.g., Bangalore"
                      value={signupData.location} onChange={(e) => setSignupData({ ...signupData, location: e.target.value })} />
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input type="password" className="w-full p-3 rounded-lg input-field" placeholder="••••••••" required
                    value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 btn-primary text-gray-900 font-bold rounded-lg disabled:opacity-50">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
              <p className="text-center mt-4 text-sm text-gray-400">
                Already have an account?{' '}
                <button onClick={() => setForm('login')} className="font-semibold neon-yellow-text hover:underline">Login</button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
