import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles = {
  'dashboard': 'Dashboard',
  'ai-designer': 'AI Designer',
  'marketplace': 'Marketplace',
  'hire-builders': 'Hire Builders',
  'track-project': 'Track Project',
  'budget-prediction': 'AI Budget Predictor',
  'billing': 'Billing',
  'profile': 'My Profile',
  'portfolio': 'My Portfolio',
  'view-projects': 'View Projects',
  'manage-workers': 'Manage Workers',
  'ai-quotation': 'AI Quotation Tool',
};

export default function AppLayout() {
  const location = useLocation();
  const lastSegment = location.pathname.split('/').pop();
  const title = pageTitles[lastSegment] || 'Dashboard';

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />
        <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
