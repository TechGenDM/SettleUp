import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { registerUser, loginUser } from '../services/authService';

const Login = () => {
  const { currentUser } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect immediately
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(email, password);
      }
      // Note: We don't manually setLoading(false) on success because the global auth state change
      // will trigger a redirect and unmount this component seamlessly.
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-[400px] animate-[fadeIn_0.4s_ease-out] rounded-2xl border border-slate-700 bg-slate-800 p-10 shadow-2xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-indigo-500">SettleUp</h1>
        <h2 className="mb-8 text-center text-xl text-slate-400">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-500">
            {error}
          </div>
        )}
        
        <form onSubmit={handleAuthAction}>
          <div className="mb-5">
            <label className="mb-2 block text-sm text-slate-400">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loading}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-slate-50 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-sm text-slate-400">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter your password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              disabled={loading}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-slate-50 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading} 
            className="mt-4 w-full rounded-lg bg-indigo-600 p-3 text-base font-semibold text-white transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
               <div className="flex items-center justify-center gap-2">
                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                 <span>Processing...</span>
               </div>
            ) : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button" 
            onClick={() => !loading && setIsLogin(!isLogin)} 
            disabled={loading}
            className="font-medium text-indigo-500 hover:underline disabled:cursor-default disabled:opacity-50"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
