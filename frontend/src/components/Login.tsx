import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (name.trim().length < 2) {
          throw new Error('Name must be at least 2 characters');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        await signup(name, email, password);
      }
      // Navigate to home after successful login/signup
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🧠 Memory Agent
          </h1>
          <p className="text-slate-400">Your intelligent personal assistant</p>
        </div>

        {/* Auth Form */}
        <div className="bg-slate-900/80 border-2 border-slate-700/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/80 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/80 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/80 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
                required
                minLength={6}
              />
              {!isLogin && (
                <p className="text-xs text-slate-400 mt-1">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {/* Toggle between login and signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <span className="text-blue-400 font-medium">Sign Up</span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span className="text-blue-400 font-medium">Sign In</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          Securely store your memories and set reminders
        </p>
      </div>
    </div>
  );
};
