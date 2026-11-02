import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Layers, Check, Sparkles, ArrowRight, BookOpen, Cpu, Compass } from 'lucide-react';

interface StackedScrollPlaceholderProps {
  onOpenWaitlist?: () => void;
}

export const StackedScrollPlaceholder: React.FC<StackedScrollPlaceholderProps> = ({ onOpenWaitlist }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'step-1',
      stepNumber: '01',
      badge: 'Step 01 • Educate',
      title: '01. Educate',
      subtitle: 'Learn alternative asset classes through structured, practical modules and real-world case studies.',
      icon: BookOpen,
      metricTitle: 'Structured Modules',
      metricVal: '24+ Guides',
      metricSub: 'REITs, InvITs, SDIs & Bonds',
      previewDetails: [
        'Learn alternative asset classes through structured, zero-jargon modules',
        'Analyze real-world case studies of Indian commercial office parks and toll corridors',
        'Master distribution mechanics: Return of Capital (RoC), Dividends, and Interest taxation'
      ]
    },
    {
      id: 'step-2',
      stepNumber: '02',
      badge: 'Step 02 • Simulate and Explore',
      title: '02. Simulate and Explore',
      subtitle: 'Practice investing risk-free with virtual portfolios using real market data.',
      icon: Cpu,
      metricTitle: 'Simulated Cash Flow',
      metricVal: '₹14,250 / Qtr',
      metricSub: 'Projected on ₹5 Lakh virtual allocation',
      previewDetails: [
        'Practice investing risk-free with virtual portfolios using real market data',
        'Model quarterly payout calendar timelines and dividend reinvestment compounding',
        'Stress-test paper portfolio yields against inflation and interest rate cycles'
      ]
    },
    {
      id: 'step-3',
      stepNumber: '03',
      badge: 'Step 03 • Discover and Access',
      title: '03. Discover and Access',
      subtitle: 'Browse curated listings, compare metrics, and connect with trusted SEBI-registered partners.',
      icon: Compass,
      metricTitle: 'Curated Assets',
      metricVal: '100% Regulated',
      metricSub: 'SEBI-Registered Entities',
      previewDetails: [
        'Browse curated listings with institutional-grade metric disclosures',
        'Compare yields, loan-to-value (LTV) ratios, occupancy rates, and tenant quality',
        'Connect directly with trusted SEBI-registered partners when ready to invest'
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge variant="copper" size="sm" className="mb-3">
          The WelNex Journey
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-espresso-950 mb-3">
          How WelNex Works
        </h2>
        <p className="text-sm sm:text-base text-espresso-700">
          A seamless 3-step sequence designed to take Indian investors from curious learners to confident, informed participants.
        </p>
      </div>

      {/* Step Selector Tabs */}
      <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2">
        {steps.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setActiveStep(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
              activeStep === idx
                ? 'bg-copper-500 text-sand-50 shadow-md shadow-copper-500/30'
                : 'bg-white/70 text-espresso-800 border border-champagne-500/30 hover:border-copper-500/40 hover:bg-white'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Stacked Card Presentation Shell (Prepared for scroll stack animations) */}
      <div className="relative max-w-4xl mx-auto">
        <div className="relative">
          {steps.map((step, idx) => {
            const isCurrent = activeStep === idx;
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`transition-all duration-500 ${
                  isCurrent
                    ? 'block opacity-100 scale-100'
                    : 'hidden opacity-0 scale-95'
                }`}
              >
                <GlassCard
                  variant="elevated"
                  glowEffect="champagne"
                  className="p-6 sm:p-10 border-2 border-champagne-500/50 shadow-glass-lg relative overflow-hidden bg-white/75"
                >
                  {/* Decorative background step number */}
                  <div className="absolute -bottom-8 -right-4 font-display font-black text-8xl text-champagne-500/15 select-none pointer-events-none">
                    {step.stepNumber}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-copper-500/15 text-copper-600 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <Badge variant="copper" size="sm">
                          {step.badge}
                        </Badge>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-display font-bold text-espresso-950">
                        {step.title}
                      </h3>

                      <p className="text-sm sm:text-base text-espresso-800 font-medium leading-relaxed">
                        {step.subtitle}
                      </p>

                      <div className="space-y-2.5 pt-2">
                        {step.previewDetails.map((detail, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-espresso-800">
                            <div className="w-5 h-5 rounded-full bg-copper-500/15 text-copper-600 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3" />
                            </div>
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4">
                        <Button
                          variant="primary"
                          size="md"
                          onClick={onOpenWaitlist}
                          icon={<ArrowRight className="w-4 h-4" />}
                          className="shadow-md shadow-copper-500/20"
                        >
                          Join Early Access
                        </Button>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="p-6 rounded-2xl bg-white/85 border border-champagne-500/40 text-center shadow-sm">
                        <span className="text-xs uppercase tracking-wider font-bold text-espresso-600 block mb-1">
                          {step.metricTitle}
                        </span>
                        <div className="text-4xl font-display font-extrabold text-copper-600 font-mono my-2">
                          {step.metricVal}
                        </div>
                        <span className="text-xs text-espresso-700 block">
                          {step.metricSub}
                        </span>

                        <div className="mt-4 pt-4 border-t border-champagne-500/25 flex items-center justify-center gap-2 text-xs text-copper-600 font-medium">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Phase 1 Discovery Foundation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            );
          })}
        </div>

        {/* Footer indication for stacked animation readiness */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-espresso-600">
          <Layers className="w-4 h-4 text-copper-600" />
          <span>Interactive 3-stage flow: 01. Educate → 02. Simulate and Explore → 03. Discover and Access</span>
        </div>
      </div>
    </section>
  );
};
