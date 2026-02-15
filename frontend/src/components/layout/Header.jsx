import { useAuth } from '../../context/AuthContext';

export default function Header({ title }) {
  const { user } = useAuth();

  return (
    <header className="bg-gray-900/30 border-b border-white/10 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          Welcome, <span className="text-white">{user?.name || 'User'}</span>!
        </span>
        <div className="w-10 h-10 rounded-full border-2 border-yellow-400 bg-gray-700 flex items-center justify-center text-yellow-400 font-bold text-sm">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
