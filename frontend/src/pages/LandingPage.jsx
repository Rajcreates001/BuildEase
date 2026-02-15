import { useState } from 'react';
import Logo from '../components/common/Logo';
import AuthModal from '../components/modals/AuthModal';

export default function LandingPage() {
  const [authModal, setAuthModal] = useState({ open: false, form: 'login', role: 'customer' });

  const openAuth = (form, role = 'customer') => {
    setAuthModal({ open: true, form, role });
  };

  return (
    <main className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 -left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-yellow-400/20 rounded-full filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-0 -right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-amber-500/20 rounded-full filter blur-3xl opacity-30 animate-pulse" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-3 sm:p-4">
        <nav className="container mx-auto flex justify-between items-center gap-2">
          <a href="#" className="flex items-center space-x-2 flex-shrink-0">
            <Logo size={32} />
            <span className="text-lg sm:text-2xl font-bold text-white">Buildease</span>
          </a>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => openAuth('login')} className="px-3 sm:px-4 py-2 text-sm sm:text-base text-white rounded-md hover:bg-white/10 transition">Login</button>
            <button onClick={() => openAuth('signup')} className="px-4 sm:px-6 py-2 text-sm sm:text-base btn-primary text-gray-900 font-semibold rounded-md shadow-lg shadow-yellow-500/20">Get Started</button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center text-center">
        <div className="container mx-auto px-4 z-10">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight">
            Your Home, Your Way –
            <br />
            <span className="animated-gradient text-transparent bg-clip-text">Powered by AI.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
            From 3D designs and budget planning to sourcing materials and hiring verified builders, Buildease is your all-in-one platform for seamless home construction.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button onClick={() => openAuth('signup', 'customer')}
              className="w-full sm:w-auto px-8 py-4 btn-primary text-gray-900 font-bold rounded-lg shadow-xl shadow-yellow-500/20 text-lg flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Sign Up as Customer
            </button>
            <button onClick={() => openAuth('signup', 'contractor')}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-bold rounded-lg border border-white/20 hover:bg-white/20 transition flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Sign Up as Contractor
            </button>
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-gray-500">
        &copy; 2025 Buildease. All rights reserved.
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={authModal.open} onClose={() => setAuthModal({ ...authModal, open: false })} initialForm={authModal.form} initialRole={authModal.role} />
    </main>
  );
}
