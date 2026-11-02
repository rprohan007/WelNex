import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  BookOpen, 
  Cpu, 
  Compass, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Eye
} from 'lucide-react';

interface HowItWorksDeckProps {
  onOpenWaitlist?: () => void;
  onOpenExplore?: () => void;
}

export const HowItWorksDeck: React.FC<HowItWorksDeckProps> = ({
  onOpenWaitlist,
  onOpenExplore
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [previewOpen, setPreviewOpen] = useState<{ [key: number]: boolean }>({
    0: true,
    1: true,
    2: true
  });

  const togglePreview = (index: number) => {
    setPreviewOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const steps = [
    {
      stepNumber: '01',
      badge: 'Step 01 • Foundation',
      title: 'Educate',
      subtitle: 'Learn alternative asset classes through structured, practical modules and real-world case studies.',
      icon: BookOpen,
      actionText: 'Explore Academy Modules',
      previewTitle: 'Academy Masterclass Micro-Preview',
      bullets: [
        'Structured, zero-jargon video and visual learning paths',
        'Real-world case studies analyzing Indian REIT portfolios & InvIT toll corridors',
        'Deep dive into distribution waterfalls: Return of Capital (RoC), Dividends & Interest'
      ]
    },
    {
      stepNumber: '02',
      badge: 'Step 02 • Risk-Free Sandboxing',
      title: 'Simulate and Explore',
      subtitle: 'Practice investing risk-free with virtual portfolios using real market data.',
      icon: Cpu,
      actionText: 'Launch Virtual Sandbox',
      previewTitle: 'Virtual Portfolio Sandbox Micro-Preview',
      bullets: [
        'Model multi-asset allocations across REITs, InvITs, and Senior Debt without financial risk',
        'Track projected quarterly payout calendars synchronized with actual NSE/BSE dates',
        'Stress-test yields against inflation scenarios and Indian interest rate shifts'
      ]
    },
    {
      stepNumber: '03',
      badge: 'Step 03 • Curated Market Access',
      title: 'Discover and Access',
      subtitle: 'Browse curated listings, compare metrics, and connect with trusted SEBI-registered partners.',
      icon: Compass,
      actionText: 'Browse Curated Listings',
      previewTitle: 'Institutional Disclosure Card Micro-Preview',
      bullets: [
        'Compare loan-to-value (LTV) ratios, tenant quality, and WALE across 100% of Indian alternatives',
        'Access unbiased, institutional-grade analytics with zero sales commissions',
        'Seamlessly connect with vetted, SEBI-registered brokers and custodians for execution'
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Badge variant="copper" size="sm" className="mb-3">
          Interactive 3-Step Deck
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-espresso-950 mb-3">
          How WelNex Works
        </h2>
        <p className="text-sm sm:text-base text-espresso-700 leading-relaxed">
          From first-time discovery to metric mastery and risk-free simulation: follow the structured WelNex sequence.
        </p>

        {/* Step Navigation Pill Switcher */}
        <div className="flex items-center justify-center gap-2 mt-8 overflow-x-auto pb-2">
          {steps.map((s, idx) => (
            <button
              key={s.stepNumber}
              onClick={() => setActiveStep(idx)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeStep === idx
                  ? 'bg-copper-500 text-sand-50 shadow-md shadow-copper-500/25'
                  : 'bg-white/80 text-espresso-800 border border-champagne-500/40 hover:border-copper-500/50 hover:bg-white'
              }`}
            >
              {s.stepNumber}. {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Step Cards Deck */}
      <div className="space-y-8 max-w-5xl mx-auto">
        {steps.map((step, idx) => {
          const isSelected = activeStep === idx;
          const isPreviewVisible = previewOpen[idx];
          const Icon = step.icon;

          return (
            <GlassCard
              key={step.stepNumber}
              variant="elevated"
              className={`p-6 sm:p-8 rounded-3xl border-2 transition-all duration-300 bg-white/75 ${
                isSelected
                  ? 'border-copper-500/60 shadow-glass-lg'
                  : 'border-champagne-500/45 hover:border-copper-500/40 shadow-glass-md'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Step Information */}
                <div className="lg:col-span-6 space-y-4 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-copper-700 bg-copper-500/15 px-2.5 py-1 rounded-lg border border-copper-500/25">
                      Card {step.stepNumber}
                    </span>
                    <Badge variant="copper" size="sm">
                      {step.badge}
                    </Badge>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-espresso-950 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-copper-500/10 border border-copper-500/25 flex items-center justify-center text-copper-600 shrink-0">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span>{step.title}</span>
                  </h3>

                  <p className="text-sm sm:text-base text-espresso-800 font-medium leading-relaxed">
                    {step.subtitle}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {step.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-espresso-800">
                        <div className="w-5 h-5 rounded-full bg-copper-500/15 text-copper-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={idx === 2 && onOpenExplore ? onOpenExplore : onOpenWaitlist}
                      icon={<ArrowRight className="w-4 h-4" />}
                      className="shadow-sm shadow-copper-500/20 text-xs font-semibold"
                    >
                      {step.actionText}
                    </Button>

                    <button
                      type="button"
                      onClick={() => togglePreview(idx)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-champagne-500/40 text-xs font-medium text-espresso-800 hover:text-copper-600 hover:border-copper-500/40 bg-white/70 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-copper-600" />
                      <span>{isPreviewVisible ? 'Hide Micro-Preview' : 'View Micro-Preview'}</span>
                    </button>
                  </div>
                </div>

                {/* Right Interactive Micro-Preview Container */}
                <div className="lg:col-span-6 w-full text-left">
                  {isPreviewVisible ? (
                    <div className="rounded-2xl border border-champagne-500/50 bg-sand/70 p-5 shadow-sm space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-champagne-500/20 pb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-copper-600" />
                          <span className="text-xs font-bold uppercase tracking-wider text-espresso-900">
                            {step.previewTitle}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-copper-500/10 text-copper-700">
                          Interactive Live Demo
                        </span>
                      </div>

                      {/* MICRO-PREVIEW 1: EDUCATE (Academy Module) */}
                      {idx === 0 && (
                        <div className="space-y-3">
                          <div className="p-3.5 rounded-xl bg-white/90 border border-champagne-500/40">
                            <span className="text-[10px] uppercase font-bold text-copper-700 block mb-1">
                              Module 03 • Commercial REIT Mechanics
                            </span>
                            <h4 className="text-sm font-bold text-espresso-950">
                              How Rental Yields & 90% NDCF Payouts Function
                            </h4>
                            <p className="text-xs text-espresso-600 mt-1">
                              Deconstruct lease covenants, weighted average lease expiry (WALE), and SPV dividend pass-throughs.
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-copper-500/10 border border-copper-500/20 text-xs space-y-1.5">
                            <div className="flex justify-between font-semibold text-espresso-900 text-[11px]">
                              <span>Module Progress</span>
                              <span className="text-copper-700 font-mono">3 / 8 Completed (38%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-sand-300 overflow-hidden">
                              <div className="h-full bg-copper-500 rounded-full" style={{ width: '38%' }} />
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-champagne-500/15 border border-champagne-500/30 text-[11px] text-espresso-800">
                            <strong>Real-World Case Study:</strong> Embassy Office Parks REIT vs Indian 10-Year G-Sec yield spread over the last 12 quarters.
                          </div>
                        </div>
                      )}

                      {/* MICRO-PREVIEW 2: SIMULATE (Virtual Sandbox Wallet) */}
                      {idx === 1 && (
                        <div className="space-y-3">
                          <div className="p-4 rounded-xl bg-white/90 border border-champagne-500/40">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-espresso-500 block">
                                  Virtual Paper Balance
                                </span>
                                <div className="text-2xl font-mono font-extrabold text-espresso-950">
                                  ₹5,00,000.00
                                </div>
                              </div>
                              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
                                Simulated Active
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-champagne-500/20 text-xs">
                              <div>
                                <span className="text-[10px] text-espresso-500 block">Projected Quarterly Cash</span>
                                <span className="font-mono font-bold text-copper-600 text-sm">₹14,250 / Qtr</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-espresso-500 block">Net Blended Yield</span>
                                <span className="font-mono font-bold text-emerald-700 text-sm">11.40% p.a.</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-white/80 border border-champagne-500/30 text-xs space-y-1.5">
                            <div className="flex justify-between text-[11px] font-semibold text-espresso-800">
                              <span>Simulated Allocation</span>
                              <span>REITs (40%) • InvITs (35%) • Debt (25%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-sand-300 overflow-hidden flex">
                              <div className="h-full bg-copper-500" style={{ width: '40%' }} />
                              <div className="h-full bg-amber-500" style={{ width: '35%' }} />
                              <div className="h-full bg-emerald-600" style={{ width: '25%' }} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* MICRO-PREVIEW 3: DISCOVER (Curated Listing & SEBI Partner) */}
                      {idx === 2 && (
                        <div className="space-y-3">
                          <div className="p-3.5 rounded-xl bg-white/90 border border-champagne-500/40">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-display font-bold text-espresso-950">
                                Mindspace Business Parks REIT
                              </span>
                              <span className="font-mono text-xs font-bold text-copper-600 bg-copper-500/10 px-2 py-0.5 rounded">
                                Yield: 7.20%
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-[11px] text-espresso-700 pt-2 border-t border-champagne-500/20">
                              <div>
                                <span className="block text-espresso-500 text-[10px]">Indicative Unit</span>
                                <span className="font-mono font-bold text-espresso-900">₹342.90</span>
                              </div>
                              <div>
                                <span className="block text-espresso-500 text-[10px]">Occupancy</span>
                                <span className="font-bold text-espresso-900">88.5% Grade-A</span>
                              </div>
                              <div>
                                <span className="block text-espresso-500 text-[10px]">WALE</span>
                                <span className="font-bold text-espresso-900">6.8 Years</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2 text-xs text-emerald-900">
                            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block font-semibold">Trusted SEBI-Registered Partners</strong>
                              <span>When ready, execution and unit custody are handled exclusively through certified SEBI-regulated market participants.</span>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl border border-dashed border-champagne-500/50 bg-white/40 flex flex-col items-center justify-center text-center">
                      <Icon className="w-8 h-8 text-copper-600/70 mb-2" />
                      <span className="text-xs font-semibold text-espresso-800">
                        Interactive Micro-Preview Hidden
                      </span>
                      <button
                        type="button"
                        onClick={() => togglePreview(idx)}
                        className="mt-2 text-xs text-copper-700 hover:underline font-bold"
                      >
                        Click to Reveal Preview →
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
};
