import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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
  Eye,
  ChevronLeft,
  ChevronRight
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
  const outerTrackRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [displayPercent, setDisplayPercent] = useState<number>(0);
  const [maxTranslateX, setMaxTranslateX] = useState<number>(1200);

  // Micro-preview expanded state for each card
  const [previewOpen, setPreviewOpen] = useState<{ [key: number]: boolean }>({
    0: true,
    1: true,
    2: true
  });

  const togglePreview = (index: number) => {
    setPreviewOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Measure max horizontal travel
  useEffect(() => {
    const updateDimensions = () => {
      if (cardsWrapperRef.current) {
        const scrollWidth = cardsWrapperRef.current.scrollWidth;
        const clientWidth = window.innerWidth;
        // Travel distance so Card 03 comfortably finishes inside viewport with right margin
        const endMargin = window.innerWidth < 640 ? 24 : 96;
        const maxScroll = Math.max(scrollWidth - clientWidth + endMargin, 0);
        setMaxTranslateX(maxScroll);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const observer = new ResizeObserver(() => updateDimensions());
    if (cardsWrapperRef.current) {
      observer.observe(cardsWrapperRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      observer.disconnect();
    };
  }, []);

  // Native scroll progress tracking from outer container
  const { scrollYProgress } = useScroll({
    target: outerTrackRef,
    offset: ["start start", "end end"]
  });

  // Framer Motion spring physics with requested damping: 25, stiffness: 120
  const smoothProgress = useSpring(scrollYProgress, {
    damping: 25,
    stiffness: 120,
    mass: 0.2
  });

  // Smooth horizontal translation transform
  const x = useTransform(smoothProgress, (val) => -val * maxTranslateX);

  // Smooth progress bar scaleX transform (GPU accelerated without layout thrashing)
  const progressScaleX = useTransform(smoothProgress, [0, 1], [0.06, 1]);

  // Synchronize active step indicator and display percentage without triggering continuous re-renders
  useEffect(() => {
    let lastRounded = -1;
    const unsubscribe = smoothProgress.on('change', (latest) => {
      const rounded = Math.min(Math.max(Math.round(latest * 100), 0), 100);
      if (rounded !== lastRounded) {
        lastRounded = rounded;
        setDisplayPercent(rounded);
      }

      // Smooth step index switching with hysteresis to eliminate boundary flickering
      const newIndex = latest < 0.38 ? 0 : latest < 0.72 ? 1 : 2;
      setActiveIndex(prev => (prev !== newIndex ? newIndex : prev));
    });

    return () => unsubscribe();
  }, [smoothProgress]);

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

  // Helper for manual prev/next button scrolling
  const scrollToStep = (index: number) => {
    if (!outerTrackRef.current) return;
    const rect = outerTrackRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const stepTargetY = scrollTop + (index / 2) * (rect.height - window.innerHeight);
    window.scrollTo({ top: stepTargetY, behavior: 'smooth' });
  };

  return (
    <section 
      id="how-it-works" 
      ref={outerTrackRef}
      className="relative w-full bg-sand scroll-mt-20"
      style={{ height: '300vh' }}
    >
      {/* EFFECT 3: Pinned Sticky Viewport Container with GPU acceleration */}
      <div className="sticky top-[80px] h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col justify-between py-6 sm:py-8 bg-sand will-change-transform [transform:translateZ(0)] touch-pan-y">
        
        {/* Sticky Header Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-champagne-500/30 pb-4">
            
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="copper" size="sm">
                  The Three-Step Journey
                </Badge>
                <span className="text-xs font-semibold text-espresso-600">
                  Educational Discovery to Execution
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-espresso-950">
                How WelNex Works: The 3-Step Journey
              </h2>
            </div>

            {/* Quick Step Indicators & Jump Controls */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 mr-2">
                {steps.map((s, idx) => (
                  <button
                    key={s.stepNumber}
                    onClick={() => scrollToStep(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeIndex === idx
                        ? 'bg-copper-500 text-sand-50 shadow-sm'
                        : 'bg-white/80 text-espresso-700 border border-champagne-500/40 hover:border-copper-500/50'
                    }`}
                  >
                    {s.stepNumber}. {s.title}
                  </button>
                ))}
              </div>

              <button
                onClick={() => scrollToStep(Math.max(activeIndex - 1, 0))}
                disabled={activeIndex === 0}
                className="p-2 rounded-xl bg-white/80 border border-champagne-500/40 text-espresso-800 disabled:opacity-40 hover:bg-copper-500/10 transition-colors cursor-pointer"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToStep(Math.min(activeIndex + 1, 2))}
                disabled={activeIndex === 2}
                className="p-2 rounded-xl bg-white/80 border border-champagne-500/40 text-espresso-800 disabled:opacity-40 hover:bg-copper-500/10 transition-colors cursor-pointer"
                aria-label="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Horizontal Moving Cards Track wrapped in an inner container with overflow: hidden */}
        <div className="w-full flex-1 flex items-center overflow-hidden my-auto py-2">
          <motion.div 
            ref={cardsWrapperRef}
            style={{ x, z: 0 }}
            className="flex items-center gap-8 pl-4 sm:pl-16 pr-12 will-change-transform [transform:translateZ(0)]"
          >
            {steps.map((step, idx) => {
              const isCardActive = activeIndex === idx;
              const isPreviewVisible = previewOpen[idx];
              const Icon = step.icon;

              return (
                <div 
                  key={step.stepNumber}
                  className="w-[86vw] sm:w-[680px] lg:w-[760px] shrink-0 will-change-transform [transform:translateZ(0)]"
                >
                  <GlassCard
                    variant="elevated"
                    className={`p-6 sm:p-8 rounded-3xl border-2 transition-colors duration-200 bg-white/85 shadow-glass-lg ${
                      isCardActive
                        ? 'border-copper-500/70 shadow-copper-glow/20'
                        : 'border-champagne-500/40 opacity-90'
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
                      
                      {/* Left Column: Info & Action */}
                      <div className="md:col-span-6 space-y-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-copper-700 bg-copper-500/15 px-2.5 py-1 rounded-lg border border-copper-500/25">
                            Card {step.stepNumber}
                          </span>
                          <Badge variant="copper" size="sm">
                            {step.badge}
                          </Badge>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-espresso-950 flex items-center gap-2.5">
                          <span className="w-9 h-9 rounded-xl bg-copper-500/10 border border-copper-500/25 flex items-center justify-center text-copper-600 shrink-0">
                            <Icon className="w-4 h-4" />
                          </span>
                          <span>{step.title}</span>
                        </h3>

                        <p className="text-xs sm:text-sm text-espresso-800 font-medium leading-relaxed">
                          {step.subtitle}
                        </p>

                        <div className="space-y-2 pt-1">
                          {step.bullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2 text-xs text-espresso-800">
                              <div className="w-4 h-4 rounded-full bg-copper-500/15 text-copper-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 flex flex-wrap items-center gap-2.5">
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
                            className="shadow-sm shadow-copper-500/20 text-xs font-semibold cursor-pointer"
                          >
                            {step.actionText}
                          </Button>

                          <button
                            type="button"
                            onClick={() => togglePreview(idx)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-champagne-500/40 text-xs font-medium text-espresso-800 hover:text-copper-600 bg-white/80 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-copper-600" />
                            <span>{isPreviewVisible ? 'Hide Preview' : 'Show Preview'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Right Column: Interactive Micro-Preview */}
                      <div className="md:col-span-6 w-full">
                        {isPreviewVisible ? (
                          <div className="rounded-2xl border border-champagne-500/50 bg-sand-50/90 p-4 shadow-sm space-y-3">
                            <div className="flex items-center justify-between border-b border-champagne-500/25 pb-2">
                              <div className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-copper-600" />
                                <span className="text-[11px] font-bold uppercase tracking-wider text-espresso-900">
                                  {step.previewTitle}
                                </span>
                              </div>
                              <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-copper-500/10 text-copper-700">
                                Interactive
                              </span>
                            </div>

                            {/* MICRO-PREVIEW 1: EDUCATE */}
                            {idx === 0 && (
                              <div className="space-y-2.5">
                                <div className="p-3 rounded-xl bg-white border border-champagne-500/40">
                                  <span className="text-[9px] uppercase font-bold text-copper-700 block mb-0.5">
                                    Module 03 • Commercial REITs
                                  </span>
                                  <h4 className="text-xs font-bold text-espresso-950">
                                    How Rental Yields & 90% NDCF Payouts Function
                                  </h4>
                                  <p className="text-[11px] text-espresso-600 mt-0.5">
                                    Deconstruct lease covenants, WALE, and SPV pass-throughs.
                                  </p>
                                </div>

                                <div className="p-2.5 rounded-xl bg-copper-500/10 border border-copper-500/20 text-xs space-y-1">
                                  <div className="flex justify-between font-semibold text-espresso-900 text-[10px]">
                                    <span>Module Progress</span>
                                    <span className="text-copper-700 font-mono">3 / 8 Lessons (38%)</span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full bg-sand-300 overflow-hidden">
                                    <div className="h-full bg-copper-500 rounded-full" style={{ width: '38%' }} />
                                  </div>
                                </div>

                                <div className="p-2 rounded-lg bg-champagne-500/15 border border-champagne-500/30 text-[10px] text-espresso-800">
                                  <strong>Real-World Case:</strong> Embassy Office Parks REIT vs 10Y Indian G-Sec spread history.
                                </div>
                              </div>
                            )}

                            {/* MICRO-PREVIEW 2: SIMULATE */}
                            {idx === 1 && (
                              <div className="space-y-2.5">
                                <div className="p-3 rounded-xl bg-white border border-champagne-500/40">
                                  <div className="flex justify-between items-start mb-1">
                                    <div>
                                      <span className="text-[9px] uppercase font-bold text-espresso-500 block">
                                        Virtual Sandbox Balance
                                      </span>
                                      <div className="text-xl font-mono font-extrabold text-espresso-950">
                                        ₹5,00,000
                                      </div>
                                    </div>
                                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
                                      Simulated Active
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-champagne-500/20 text-xs">
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

                                <div className="p-2.5 rounded-xl bg-white/90 border border-champagne-500/30 text-xs space-y-1">
                                  <div className="flex justify-between text-[10px] font-semibold text-espresso-800">
                                    <span>Simulated Allocation</span>
                                    <span>REITs (40%) • InvITs (35%) • Debt (25%)</span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full bg-sand-300 overflow-hidden flex">
                                    <div className="h-full bg-copper-500" style={{ width: '40%' }} />
                                    <div className="h-full bg-amber-500" style={{ width: '35%' }} />
                                    <div className="h-full bg-emerald-600" style={{ width: '25%' }} />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* MICRO-PREVIEW 3: DISCOVER */}
                            {idx === 2 && (
                              <div className="space-y-2.5">
                                <div className="p-3 rounded-xl bg-white border border-champagne-500/40">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-display font-bold text-espresso-950">
                                      Mindspace Business Parks REIT
                                    </span>
                                    <span className="font-mono text-[10px] font-bold text-copper-600 bg-copper-500/10 px-1.5 py-0.5 rounded">
                                      Yield: 7.20%
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-1.5 text-[10px] text-espresso-700 pt-1.5 border-t border-champagne-500/20">
                                    <div>
                                      <span className="block text-espresso-500 text-[9px]">Indicative Unit</span>
                                      <span className="font-mono font-bold text-espresso-900">₹342.90</span>
                                    </div>
                                    <div>
                                      <span className="block text-espresso-500 text-[9px]">Occupancy</span>
                                      <span className="font-bold text-espresso-900">88.5% Grade-A</span>
                                    </div>
                                    <div>
                                      <span className="block text-espresso-500 text-[9px]">WALE</span>
                                      <span className="font-bold text-espresso-900">6.8 Years</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-1.5 text-[11px] text-emerald-900">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="block font-semibold">Trusted SEBI-Registered Partners</strong>
                                    <span>Execution and unit custody are handled exclusively through certified SEBI-regulated market participants.</span>
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>
                        ) : (
                          <div className="p-6 rounded-2xl border border-dashed border-champagne-500/50 bg-white/40 flex flex-col items-center justify-center text-center">
                            <Icon className="w-6 h-6 text-copper-600/70 mb-1.5" />
                            <span className="text-xs font-semibold text-espresso-800">
                              Micro-Preview Collapsed
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePreview(idx)}
                              className="mt-1 text-xs text-copper-700 hover:underline font-bold"
                            >
                              Expand Preview →
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Sleek Horizontal Progress Bar with Step Milestones */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full shrink-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-espresso-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-copper-500 animate-pulse" />
                <span>Scroll Shift Progress</span>
              </span>
              <span className="font-mono text-copper-700 font-bold">
                {displayPercent}% Traveled
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2 rounded-full bg-sand-300 overflow-hidden relative shadow-inner">
              <motion.div 
                className="h-full w-full bg-gradient-to-r from-copper-500 to-copper-600 rounded-full origin-left will-change-transform"
                style={{ scaleX: progressScaleX, transformOrigin: '0% 50%', z: 0 }}
              />
            </div>

            {/* Milestones */}
            <div className="grid grid-cols-3 text-[10px] sm:text-xs font-bold text-espresso-600 pt-0.5">
              <span className={`text-left ${activeIndex === 0 ? 'text-copper-700' : ''}`}>
                01. Educate
              </span>
              <span className={`text-center ${activeIndex === 1 ? 'text-copper-700' : ''}`}>
                02. Simulate and Explore
              </span>
              <span className={`text-right ${activeIndex === 2 ? 'text-copper-700' : ''}`}>
                03. Discover and Access
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
