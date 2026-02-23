import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="border-b dark:border-slate-800 border-slate-200 dark:bg-slate-900/80 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="w-full flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold dark:text-white text-slate-900">Memory Agent</h1>
            <p className="text-xs dark:text-slate-400 text-slate-500 italic">Welcome, {user?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl dark:hover:bg-slate-800 hover:bg-slate-100 transition-colors border dark:border-slate-700 border-slate-300"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg className="w-5 h-5 dark:text-slate-300 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 dark:text-slate-300 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Profile Section */}
          <div className="flex items-center px-1 py-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-base shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl dark:hover:bg-red-900/20 hover:bg-red-50 dark:text-red-400 text-red-600 transition-colors border dark:border-slate-700 border-slate-300 text-sm font-medium"
            title="Sign out"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};
