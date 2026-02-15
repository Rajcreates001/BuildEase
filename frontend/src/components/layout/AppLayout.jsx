import { useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header title={title} onMenuToggle={() => setSidebarOpen(true)} />
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto no-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
