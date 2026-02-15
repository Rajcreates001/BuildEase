import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../common/Logo';

const customerNavItems = [
  { path: '/customer/dashboard', name: 'Dashboard', icon: '🏠' },
  { path: '/customer/ai-designer', name: 'AI Designer', icon: '✨' },
  { path: '/customer/marketplace', name: 'Marketplace', icon: '🛒' },
  { path: '/customer/hire-builders', name: 'Hire Builders', icon: '👷' },
  { path: '/customer/track-project', name: 'Track Project', icon: '📊' },
  { path: '/customer/billing', name: 'Billing', icon: '💳' },
  { path: '/customer/budget-prediction', name: 'AI Budget Predictor', icon: '📈' },
  { path: '/customer/profile', name: 'My Profile', icon: '👤' },
];

const contractorNavItems = [
  { path: '/contractor/dashboard', name: 'Dashboard', icon: '🏠' },
  { path: '/contractor/portfolio', name: 'My Portfolio', icon: '📑' },
  { path: '/contractor/view-projects', name: 'View Projects', icon: '📝' },
  { path: '/contractor/manage-workers', name: 'Manage Workers', icon: '💼' },
  { path: '/contractor/ai-quotation', name: 'AI Quotation Tool', icon: '📊' },
  { path: '/contractor/billing', name: 'Payouts', icon: '💳' },
  { path: '/contractor/profile', name: 'My Profile', icon: '👤' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navItems = user?.role === 'customer' ? customerNavItems : contractorNavItems;

  return (
    <aside className="w-64 bg-gray-900/50 border-r border-white/10 flex flex-col no-scrollbar overflow-y-auto flex-shrink-0">
      <div className="p-4 flex items-center space-x-2 border-b border-white/10 flex-shrink-0">
        <Logo />
        <span className="text-xl font-bold text-white">Buildease</span>
      </div>

      <div className="my-auto">
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2 text-left text-sm rounded-md transition ${
                  isActive
                    ? 'bg-yellow-400/20 text-yellow-300 font-semibold'
                    : 'text-gray-300 hover:bg-yellow-400/10 hover:text-yellow-300'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span> {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 flex-shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-yellow-400/10 hover:text-yellow-300 rounded-md transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
