import React, { useState } from 'react';
import { X, Lock, Mail, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { WelNexLogo } from '../common/WelNexLogo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('admin@welnex.in');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsLoggedIn(true);
    }, 1000);
  };

  const handleReset = () => {
    setIsLoggedIn(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/40 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-3xl bg-sand border border-champagne-500/50 shadow-2xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-espresso-700/10 text-espresso-700"
          aria-label="Close Admin Login Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex justify-center mb-3">
            <WelNexLogo size="md" showTagline={false} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-copper-500/15 text-copper-700 border border-copper-500/30 text-xs font-semibold mb-2">
            <Lock className="w-3 h-3 text-copper-600" />
            <span>Platform Admin Portal</span>
          </div>
          <h3 className="text-xl font-display font-bold text-espresso-950">
            Administrative Access
          </h3>
          <p className="text-xs text-espresso-600 mt-1">
            Sign in to manage catalog datasets, radar feeds, and waitlist allocations.
          </p>
        </div>

        {isLoggedIn ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-espresso-950">
                Authentication Successful
              </h4>
              <p className="text-xs text-espresso-600 mt-1">
                Welcome back, WelNex Platform Administrator (Role: Super Admin).
              </p>
            </div>
            <div className="p-3 rounded-xl bg-champagne-500/20 border border-champagne-500/40 text-xs text-espresso-800 text-left">
              <span className="font-semibold block mb-1">Session Info:</span>
              <span>Permissions: Catalog CRUD, Ticker Train Feed, Waitlist CSV Export.</span>
            </div>
            <Button variant="primary" size="md" onClick={handleReset} className="w-full">
              Continue to Dashboard
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-espresso-800 mb-1.5">
                Admin Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-espresso-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-champagne-500/40 focus:outline-none focus:border-copper-500 text-espresso-950"
                  placeholder="admin@welnex.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso-800 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-espresso-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-xs rounded-xl bg-white border border-champagne-500/40 focus:outline-none focus:border-copper-500 text-espresso-950 font-mono"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-copper-500/10 border border-copper-500/20 text-[11px] text-copper-700 flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Demo Admin Mode enabled. Pre-filled credentials will authenticate immediately.</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="w-full font-semibold shadow-md shadow-copper-500/20"
            >
              {isSubmitting ? 'Verifying Security Token...' : 'Sign In to WelNex Admin'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
