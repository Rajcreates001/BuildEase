import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AppLayout from './components/layout/AppLayout';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import AIDesigner from './pages/customer/AIDesigner';
import Marketplace from './pages/customer/Marketplace';
import HireBuilders from './pages/customer/HireBuilders';
import TrackProject from './pages/customer/TrackProject';
import BudgetPrediction from './pages/customer/BudgetPrediction';
import ContractorDashboard from './pages/contractor/ContractorDashboard';
import Portfolio from './pages/contractor/Portfolio';
import ViewProjects from './pages/contractor/ViewProjects';
import ManageWorkers from './pages/contractor/ManageWorkers';
import AIQuotationTool from './pages/contractor/AIQuotationTool';
import Billing from './pages/Billing';
import Profile from './pages/Profile';

function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to={`/${user.role}/dashboard`} replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { background: '#1f2937', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <Routes>
        <Route path="/" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <LandingPage />} />

        {/* Customer Routes */}
        <Route path="/customer" element={<ProtectedRoute allowedRole="customer"><AppLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="ai-designer" element={<AIDesigner />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="hire-builders" element={<HireBuilders />} />
          <Route path="track-project" element={<TrackProject />} />
          <Route path="budget-prediction" element={<BudgetPrediction />} />
          <Route path="billing" element={<Billing />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Contractor Routes */}
        <Route path="/contractor" element={<ProtectedRoute allowedRole="contractor"><AppLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<ContractorDashboard />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="view-projects" element={<ViewProjects />} />
          <Route path="manage-workers" element={<ManageWorkers />} />
          <Route path="ai-quotation" element={<AIQuotationTool />} />
          <Route path="billing" element={<Billing />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
