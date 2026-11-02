import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import type { AssetCategory, InvestorProfile, WaitlistSubmission } from '../../types';
import { submitWaitlistLeadToSupabase } from '../../services/waitlistService';
import { CheckCircle2, Copy, Sparkles, User, Mail, Briefcase, Share2, ArrowRight, Building2, TowerControl, Layers, ShieldCheck, Coins } from 'lucide-react';

export const WaitlistCard: React.FC = () => {
  const [formData, setFormData] = useState<WaitlistSubmission>({
    fullName: '',
    email: '',
    investorProfile: 'Retail Stock/MF Investor',
    interests: ['REIT', 'InvIT']
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);

  const availableCategories: AssetCategory[] = ['REIT', 'InvIT', 'SDI', 'Bond', 'Gold'];

  const investorProfiles: InvestorProfile[] = [
    'Curious Beginner',
    'Retail Stock/MF Investor',
    'HNW / Accredited Investor',
    'Finance Professional / CA',
    'NRI Investor'
  ];

  const handleInterestToggle = (cat: AssetCategory) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(cat);
      if (exists) {
        if (prev.interests.length === 1) return prev; // keep at least 1
        return { ...prev, interests: prev.interests.filter(c => c !== cat) };
      } else {
        return { ...prev, interests: [...prev.interests, cat] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    setIsSubmitting(true);
    
    // Save to Supabase waitlist table (with automatic local fallback)
    try {
      await submitWaitlistLeadToSupabase({
        fullName: formData.fullName,
        email: formData.email,
        investorProfile: formData.investorProfile,
        interests: formData.interests,
        status: 'Verified'
      });
    } catch (err) {
      console.error('Failed to save waitlist lead to Supabase:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText('https://welnex.in/join?ref=EARLY-ACCESS');
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  return (
    <section id="waitlist" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand">
      <div className="max-w-3xl mx-auto">
        <GlassCard variant="elevated" glowEffect="champagne" className="p-6 sm:p-10 relative overflow-hidden bg-white/75">
          
          {/* Subtle Ambient Copper Halo */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-copper-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {isSubmitted ? (
            /* Submission Confirmation Feedback State */
            <div className="text-center py-6 sm:py-8 space-y-6 animate-fadeIn">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <Badge variant="copper" size="sm" className="mb-2">
                  Founder's Circle VIP Access
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-espresso-950">
                  You're on the WelNex Priority List!
                </h3>
                <p className="text-sm text-espresso-700 mt-2 max-w-md mx-auto">
                  Thank you, <span className="font-semibold text-espresso-900">{formData.fullName}</span>. We've reserved your early access spot for the WelNex Virtual Simulator and Radar release.
                </p>
              </div>

              {/* Queue Position Box */}
              <div className="p-5 rounded-2xl bg-white/90 border border-champagne-500/40 max-w-sm mx-auto shadow-sm">
                <div className="text-xs uppercase font-bold tracking-widest text-espresso-600">
                  Your Queue Number
                </div>
                <div className="text-4xl font-display font-extrabold text-copper-600 font-mono my-1">
                  #1,842
                </div>
                <div className="text-xs text-emerald-700 font-medium">
                  Allocated Priority Tier: Phase 1 Beta Invite
                </div>
              </div>

              {/* Referral Share Box */}
              <div className="p-4 rounded-2xl bg-champagne-500/20 border border-champagne-500/40 max-w-md mx-auto text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-espresso-950 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-copper-600" />
                    Skip Ahead in the Queue
                  </span>
                  <span className="text-[11px] text-copper-700 font-medium">
                    +50 Spots per Invite
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://welnex.in/join?ref=EARLY-ACCESS"
                    className="flex-1 text-xs px-3 py-2 rounded-xl bg-white border border-champagne-500/40 text-espresso-800 font-mono focus:outline-none"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={copyReferralCode}
                    icon={copiedReferral ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    className="text-xs shrink-0 shadow-sm shadow-copper-500/20"
                  >
                    {copiedReferral ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-espresso-600 hover:text-copper-600 underline font-medium cursor-pointer"
                >
                  Submit another response
                </button>
              </div>
            </div>
          ) : (
            /* Input Form State */
            <div>
              <div className="text-center max-w-lg mx-auto mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-copper-500/15 text-copper-700 border border-copper-500/30 text-xs font-semibold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-copper-600 animate-pulse" />
                  <span>Early Access Allocation</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-espresso-950">
                  Request Access to WelNex
                </h3>
                <p className="text-xs sm:text-sm text-espresso-700 mt-2">
                  Be the first to access interactive distribution yield simulators, REIT tenant breakdowns, and live indicative radars.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-espresso-800 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-espresso-400" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Rohan Sharma"
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-white/90 border border-champagne-500/40 focus:outline-none focus:border-copper-500 text-espresso-950 placeholder:text-espresso-400 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-espresso-800 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-espresso-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rohan@example.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl bg-white/90 border border-champagne-500/40 focus:outline-none focus:border-copper-500 text-espresso-950 placeholder:text-espresso-400 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Investor Profile Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 mb-1.5">
                    Investor Profile
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-espresso-400 pointer-events-none" />
                    <select
                      value={formData.investorProfile}
                      onChange={(e) => setFormData({ ...formData, investorProfile: e.target.value as InvestorProfile })}
                      className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl bg-white/90 border border-champagne-500/40 focus:outline-none focus:border-copper-500 text-espresso-950 shadow-sm appearance-none cursor-pointer"
                    >
                      {investorProfiles.map((p) => (
                        <option key={p} value={p} className="bg-sand text-espresso-900">
                          {p}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-espresso-500 text-xs">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Asset Interests Pill Selection */}
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 mb-2">
                    Assets of Primary Interest:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((cat) => {
                      const isSelected = formData.interests.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleInterestToggle(cat)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-copper-500 text-sand-50 border-copper-600 shadow-sm'
                              : 'bg-white/80 text-espresso-800 border-champagne-500/30 hover:border-copper-500/40'
                          }`}
                        >
                          {cat === 'REIT' && (
                            <>
                              <Building2 className="w-3.5 h-3.5 shrink-0" />
                              <span>REITs (Real Estate)</span>
                            </>
                          )}
                          {cat === 'InvIT' && (
                            <>
                              <TowerControl className="w-3.5 h-3.5 shrink-0" />
                              <span>InvITs (Infrastructure)</span>
                            </>
                          )}
                          {cat === 'SDI' && (
                            <>
                              <Layers className="w-3.5 h-3.5 shrink-0" />
                              <span>Securitized Debt (SDI)</span>
                            </>
                          )}
                          {cat === 'Bond' && (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                              <span>Corporate Bonds / NCDs</span>
                            </>
                          )}
                          {cat === 'Gold' && (
                            <>
                              <Coins className="w-3.5 h-3.5 shrink-0" />
                              <span>Sovereign Gold Bonds</span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting}
                    icon={<ArrowRight className="w-5 h-5" />}
                    className="w-full font-semibold shadow-lg shadow-copper-500/25"
                  >
                    {isSubmitting ? 'Securing Your Priority Spot...' : 'Join Waitlist — Free Early Access'}
                  </Button>
                </div>

                <p className="text-[11px] text-center text-espresso-600">
                  Strictly zero spam. WelNex will notify you exclusively upon simulator beta launch.
                </p>
              </form>
            </div>
          )}

        </GlassCard>
      </div>
    </section>
  );
};
