import { useAuth } from '../../context/AuthContext';

export default function Header({ title, onMenuToggle }) {
  const { user } = useAuth();

  return (
    <header className="bg-gray-900/30 border-b border-white/10 p-3 sm:p-4 flex justify-between items-center gap-3">
      {/* Hamburger — visible on mobile only */}
      <button onClick={onMenuToggle} className="md:hidden text-gray-300 hover:text-white p-1 -ml-1 flex-shrink-0" aria-label="Open menu">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <h1 className="text-lg sm:text-2xl font-bold text-white truncate">{title}</h1>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <span className="hidden sm:inline text-sm text-gray-400">
          Welcome, <span className="text-white">{user?.name || 'User'}</span>!
        </span>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-yellow-400 bg-gray-700 flex items-center justify-center text-yellow-400 font-bold text-xs sm:text-sm">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
