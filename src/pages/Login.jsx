import React, { useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { registerUser, loginUser } from '../services/authService';
import CustomButton from '../components/ui/CustomButton';

const Login = () => {
  const { currentUser } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  if (currentUser) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      isLogin ? await loginUser(email, password) : await registerUser(email, password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 selection:bg-brand-secondary selection:text-brand-primary">
      
      {/* ── Top left back button ── */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors">
        <ArrowLeft size={14} /> Back
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[360px]"
      >
        {/* ── Logo & Header ── */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-8 w-8 bg-text-primary rounded-md flex items-center justify-center mb-5">
            <span className="text-bg-secondary font-bold text-[12px]">SU</span>
          </div>
          <h1 className="text-[20px] font-semibold text-text-primary tracking-tight">
            {isLogin ? 'Log in to SettleUP' : 'Create an account'}
          </h1>
          <p className="text-[14px] text-text-secondary mt-1.5">
            {isLogin ? 'Enter your details below.' : 'Start splitting bills with precision.'}
          </p>
        </div>

        {/* ── Error Banner ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 rounded-md border border-error-bg bg-error-bg/50 p-3 text-[13px] text-error">
                <AlertCircle size={14} className="flex-shrink-0" />
                <p>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Form ── */}
        <div className="bg-bg-secondary rounded-lg border border-border p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[12px] font-medium text-text-primary block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                autoComplete="email"
                disabled={loading}
                className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-[14px] text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-brand-primary focus:ring-1 focus:ring-brand-primary disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-[12px] font-medium text-text-primary block mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                disabled={loading}
                className="w-full rounded-md border border-border bg-bg-primary px-3 py-2 text-[14px] text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-brand-primary focus:ring-1 focus:ring-brand-primary disabled:opacity-50"
              />
            </div>

            <CustomButton
              type="submit"
              disabled={loading}
              className="w-full mt-2 justify-center py-2 text-[14px]"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                isLogin ? 'Continue' : 'Sign up'
              )}
            </CustomButton>
          </form>
        </div>

        {/* ── Footer Toggle ── */}
        <p className="mt-6 text-center text-[13px] text-text-secondary">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            onClick={() => !loading && (setIsLogin(!isLogin), setError(null))}
            className="ml-1.5 font-medium text-text-primary hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
