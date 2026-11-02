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

interface HowItWorksHorizontalScrollProps {
  onOpenWaitlist?: () => void;
  onOpenExplore?: () => void;
  onOpenAcademy?: () => void;
  onOpenSimulator?: () => void;
}

export const HowItWorksHorizontalScroll: React.FC<HowItWorksHorizontalScrollProps> = ({
  onOpenWaitlist,
  onOpenExplore,
  onOpenAcademy,
  onOpenSimulator
}) => {
  // Micro-preview expanded state for each card
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
      previewTitle: 'Academy Masterclass Preview',
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
      previewTitle: 'Virtual Portfolio Sandbox',
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
      previewTitle: 'Institutional Disclosure Card',
      bullets: [
        'Compare loan-to-value (LTV) ratios, tenant quality, and WALE across 100% of Indian alternatives',
        'Access unbiased, institutional-grade analytics with zero sales commissions',
        'Seamlessly connect with vetted, SEBI-registered brokers and custodians for execution'
      ]
    }
  ];

  return (
    <section 
      id="how-it-works" 
      className="relative w-full bg-sand scroll-mt-20 py-16 md:py-24 overflow-visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full overflow-visible">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <Badge variant="copper" size="sm" withDot>
              The Three-Step Journey
            </Badge>
            <span className="text-xs font-semibold text-espresso-600">
              Educational Discovery to Execution
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-espresso-950 tracking-tight mb-4 break-words">
            How WelNex Works: The 3-Step Journey
          </h2>
          <p className="text-sm sm:text-base text-espresso-700 leading-relaxed max-w-2xl mx-auto break-words">
            Follow the structured sequence from financial foundations to risk-free sandbox and curated market access.
          </p>
        </div>

        {/* Responsive 3-Card Grid: Stacks vertically on mobile, 3-columns on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch overflow-visible">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isPreviewVisible = previewOpen[idx];

            return (
              <GlassCard
                key={step.stepNumber}
                variant="elevated"
                className="p-6 sm:p-7 rounded-3xl border border-champagne-500/50 hover:border-copper-500/60 transition-all duration-300 bg-white/85 shadow-glass-md hover:shadow-glass-lg flex flex-col justify-between h-full text-left overflow-visible"
              >
                <div className="space-y-4">
                  {/* Step Badge & Number */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="copper" size="sm">
                      {step.badge}
                    </Badge>
                    <span className="font-mono text-xs font-bold text-copper-700 bg-copper-500/10 px-2 py-0.5 rounded-lg border border-copper-500/20">
                      Step {step.stepNumber}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-espresso-950 flex items-center gap-2.5 break-words">
                    <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-copper-500/10 border border-copper-500/25 flex items-center justify-center text-copper-600 shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>
                    <span className="break-words">{step.title}</span>
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs sm:text-sm text-espresso-800 font-medium leading-relaxed break-words min-h-[36px]">
                    {step.subtitle}
                  </p>

                  {/* Bullets */}
                  <div className="space-y-2 pt-1 break-words">
                    {step.bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-espresso-800">
                        <div className="w-4 h-4 rounded-full bg-copper-500/15 text-copper-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="break-words leading-relaxed">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Micro-Preview Box */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-espresso-700">Interactive Preview</span>
                      <button
                        type="button"
                        onClick={() => togglePreview(idx)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-copper-700 hover:text-copper-800 cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-copper-600" />
                        <span>{isPreviewVisible ? 'Hide' : 'Show'}</span>
                      </button>
                    </div>

                    {isPreviewVisible && (
                      <div className="rounded-2xl border border-champagne-500/50 bg-sand-50/90 p-3.5 shadow-xs space-y-2.5 break-words w-full min-w-0">
                        <div className="flex items-center justify-between border-b border-champagne-500/25 pb-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Sparkles className="w-3.5 h-3.5 text-copper-600 shrink-0" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-900 truncate">
                              {step.previewTitle}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-copper-500/10 text-copper-700 shrink-0">
                            Live Preview
                          </span>
                        </div>

                        {/* PREVIEW 0: EDUCATE */}
                        {idx === 0 && (
                          <div className="space-y-2 text-left">
                            <div className="p-2.5 rounded-xl bg-white border border-champagne-500/40">
                              <span className="text-[9px] uppercase font-bold text-copper-700 block mb-0.5">
                                Module 03 • Commercial REITs
                              </span>
                              <h4 className="text-xs font-bold text-espresso-950 break-words">
                                Rental Yields & 90% NDCF Distribution
                              </h4>
                              <p className="text-[11px] text-espresso-600 mt-0.5 break-words">
                                Deconstruct lease covenants, WALE, and SPV pass-throughs.
                              </p>
                            </div>

                            <div className="p-2 rounded-xl bg-copper-500/10 border border-copper-500/20 text-xs space-y-1">
                              <div className="flex justify-between font-semibold text-espresso-900 text-[10px]">
                                <span>Module Progress</span>
                                <span className="text-copper-700 font-mono">3 / 8 Lessons (38%)</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-sand-300 overflow-hidden">
                                <div className="h-full bg-copper-500 rounded-full" style={{ width: '38%' }} />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PREVIEW 1: SIMULATE */}
                        {idx === 1 && (
                          <div className="space-y-2 text-left">
                            <div className="p-2.5 rounded-xl bg-white border border-champagne-500/40">
                              <div className="flex justify-between items-start mb-1">
                                <div>
                                  <span className="text-[9px] uppercase font-bold text-espresso-500 block">
                                    Virtual Portfolio
                                  </span>
                                  <div className="text-lg font-mono font-extrabold text-espresso-950">
                                    ₹5,00,000
                                  </div>
                                </div>
                                <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
                                  Active
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-champagne-500/20 text-xs">
                                <div>
                                  <span className="text-[9px] text-espresso-500 block">Quarterly Cash</span>
                                  <span className="font-mono font-bold text-copper-600 text-xs">+₹14,250 / Qtr</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-espresso-500 block">Net Yield</span>
                                  <span className="font-mono font-bold text-emerald-700 text-xs">11.40% p.a.</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-2 rounded-xl bg-white/90 border border-champagne-500/30 text-xs space-y-1">
                              <div className="flex justify-between text-[10px] font-semibold text-espresso-800">
                                <span>Allocation</span>
                                <span>REIT (40%) • InvIT (35%) • Debt (25%)</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-sand-300 overflow-hidden flex">
                                <div className="h-full bg-copper-500" style={{ width: '40%' }} />
                                <div className="h-full bg-amber-500" style={{ width: '35%' }} />
                                <div className="h-full bg-emerald-600" style={{ width: '25%' }} />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PREVIEW 2: DISCOVER */}
                        {idx === 2 && (
                          <div className="space-y-2 text-left">
                            <div className="p-2.5 rounded-xl bg-white border border-champagne-500/40">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-display font-bold text-espresso-950 truncate">
                                  Mindspace REIT
                                </span>
                                <span className="font-mono text-[10px] font-bold text-copper-600 bg-copper-500/10 px-1.5 py-0.5 rounded shrink-0">
                                  7.20% Yield
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-1 text-[10px] text-espresso-700 pt-1 border-t border-champagne-500/20">
                                <div>
                                  <span className="block text-espresso-500 text-[9px]">Price</span>
                                  <span className="font-mono font-bold text-espresso-900">₹342.90</span>
                                </div>
                                <div>
                                  <span className="block text-espresso-500 text-[9px]">Occupancy</span>
                                  <span className="font-bold text-espresso-900">88.5%</span>
                                </div>
                                <div>
                                  <span className="block text-espresso-500 text-[9px]">WALE</span>
                                  <span className="font-bold text-espresso-900">6.8 Yrs</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-1.5 text-[11px] text-emerald-900">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                              <div>
                                <strong className="block font-semibold">SEBI-Governed Custody</strong>
                                <span className="text-[10px] text-emerald-800 leading-tight block">Execution exclusively through certified SEBI-regulated brokers.</span>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                </div>

                {/* Card CTA Action Button */}
                <div className="pt-5 mt-4 border-t border-champagne-500/25">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (idx === 0 && onOpenAcademy) {
                        onOpenAcademy();
                      } else if (idx === 1 && onOpenSimulator) {
                        onOpenSimulator();
                      } else if (idx === 2 && onOpenExplore) {
                        onOpenExplore();
                      } else if (onOpenWaitlist) {
                        onOpenWaitlist();
                      }
                    }}
                    icon={<ArrowRight className="w-4 h-4" />}
                    className="w-full justify-center shadow-sm shadow-copper-500/20 text-xs font-semibold cursor-pointer"
                  >
                    {step.actionText}
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};
