import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { WelNexLogo } from '../common/WelNexLogo';
import {
  X,
  Mail,
  User,
  ArrowRight
} from 'lucide-react';

export const ClerkAuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle, isClerkConfigured } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleOneClick = (email?: string, name?: string) => {
    setIsLoading(true);
    setTimeout(() => {
      signInWithGoogle(email, name);
      setIsLoading(false);
    }, 600);
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    setIsLoading(true);
    setTimeout(() => {
      signInWithGoogle(customEmail, customName || customEmail.split('@')[0]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/60 backdrop-blur-md animate-fadeIn"
      onClick={closeAuthModal}
    >
      <div
        className="w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard
          variant="elevated"
          glowEffect="champagne"
          className="p-6 sm:p-8 rounded-3xl border border-champagne-500/50 bg-[#FAF5EE]/95 shadow-2xl relative overflow-hidden text-left"
        >
          {/* Subtle warm halo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-copper-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-xl text-espresso-600 hover:text-espresso-950 hover:bg-champagne-500/20 transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <WelNexLogo size="md" showTagline={false} />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="copper" size="xs">
                {isClerkConfigured ? 'Clerk Enterprise Auth' : 'Clerk • Google OAuth'}
              </Badge>
              <Badge variant="champagne" size="xs">
                Encrypted Session
              </Badge>
            </div>
            <h3 className="text-2xl font-display font-extrabold text-espresso-950">
              {activeTab === 'signin' ? 'Welcome Back to WelNex' : 'Create WelNex Account'}
            </h3>
            <p className="text-xs text-espresso-600 mt-1">
              Access your saved simulators, stress-test portfolios, and private research notes.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-xl bg-champagne-500/20 p-1 mb-6 border border-champagne-500/30">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-white text-copper-700 shadow-sm'
                  : 'text-espresso-700 hover:text-espresso-950'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white text-copper-700 shadow-sm'
                  : 'text-espresso-700 hover:text-espresso-950'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* PRIMARY GOOGLE OAUTH CTA */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleGoogleOneClick()}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-sand-50 text-espresso-900 border-2 border-champagne-500/60 hover:border-copper-500/60 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 font-semibold text-xs sm:text-sm cursor-pointer group"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google (Gmail)</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-champagne-500/40" />
            </div>
            <span className="relative px-3 bg-[#FAF5EE] text-[10px] font-bold text-espresso-500 uppercase tracking-wider">
              Or with work/investor email
            </span>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmitCustom} className="space-y-3">
            {activeTab === 'signup' && (
              <div>
                <label className="text-[11px] font-bold text-espresso-800 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-espresso-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Vikramaditya Iyer"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/80 border border-champagne-500/50 text-espresso-950 focus:border-copper-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-espresso-800 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-espresso-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white/80 border border-champagne-500/50 text-espresso-950 focus:border-copper-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !customEmail}
              className="w-full py-2.5 px-4 rounded-xl bg-copper-500 hover:bg-copper-600 disabled:opacity-50 text-sand-50 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm mt-4"
            >
              <span>{isLoading ? 'Authenticating...' : (activeTab === 'signin' ? 'Sign In with Email' : 'Create WelNex Account')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Footer notice */}
          <div className="mt-5 pt-4 border-t border-champagne-500/30 text-center">
            <p className="text-[10px] text-espresso-500 leading-relaxed">
              By proceeding, you agree to WelNex's Terms of Service and Privacy Policy. All simulator data is stored in your private local or Clerk-backed user space.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
