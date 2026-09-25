import React, { useState } from 'react';
import { FiX, FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiLogIn, FiUserPlus, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLoginTab) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      setName('');
      setEmail('');
      setPassword('');
      onClose();
    } catch (error) {
      // Toast handles error message
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#081210] border border-[#00f5a0]/30 rounded-3xl shadow-[0_0_50px_rgba(0,245,160,0.2)] overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-[#00f5a0]/15 bg-[#040908]/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#00f5a0]/10 rounded-2xl text-[#00f5a0] border border-[#00f5a0]/30 glow-mint">
              {isLoginTab ? <FiLogIn className="w-5 h-5" /> : <FiUserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight uppercase">
                {isLoginTab ? 'AUTHENTICATE WORKSPACE' : 'CREATE USER ACCOUNT'}
              </h2>
              <p className="text-[10px] text-zinc-500 font-mono">JobTrack AI Authentication Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border border-[#00f5a0]/20 bg-[#040908] p-1.5 gap-1.5 m-5 rounded-2xl">
          <button
            type="button"
            onClick={() => setIsLoginTab(true)}
            className={`flex-1 py-2.5 text-xs font-extrabold uppercase rounded-xl transition-all ${
              isLoginTab
                ? 'bg-[#00f5a0] text-black shadow-[0_0_15px_rgba(0,245,160,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLoginTab(false)}
            className={`flex-1 py-2.5 text-xs font-extrabold uppercase rounded-xl transition-all ${
              !isLoginTab
                ? 'bg-[#00f5a0] text-black shadow-[0_0_15px_rgba(0,245,160,0.4)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {!isLoginTab && (
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00f5a0] w-4 h-4" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-[#040908] border border-[#00f5a0]/20 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f5a0] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00f5a0] w-4 h-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-[#040908] border border-[#00f5a0]/20 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f5a0] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#00f5a0] w-4 h-4" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-[#040908] border border-[#00f5a0]/20 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#00f5a0] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3.5 bg-[#00f5a0] hover:bg-[#00d294] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(0,245,160,0.4)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting
              ? 'Authenticating...'
              : isLoginTab
              ? 'Sign In To Workspace'
              : 'Create Account Now'}
          </button>

          <p className="text-center text-xs text-zinc-500 pt-2">
            {isLoginTab ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setIsLoginTab(!isLoginTab)}
              className="text-[#00f5a0] font-bold hover:underline ml-1"
            >
              {isLoginTab ? 'Register here' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
