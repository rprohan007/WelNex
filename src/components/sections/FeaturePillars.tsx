import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Search, BarChart2, BookOpen, Cpu, ArrowRight } from 'lucide-react';

interface FeaturePillarsProps {
  onOpenExplore?: () => void;
  onOpenCompare?: () => void;
  onOpenAcademy?: () => void;
  onOpenSimulator?: () => void;
}

export const FeaturePillars: React.FC<FeaturePillarsProps> = ({
  onOpenExplore,
  onOpenCompare,
  onOpenAcademy,
  onOpenSimulator
}) => {
  const pillars = [
    {
      step: '01',
      title: 'Multi-Asset Discovery',
      tagline: 'Discovery',
      description: 'Explore 15+ alternative asset classes beyond public equity markets with verified institutional metrics.',
      icon: Search,
      highlight: '15+ Asset Classes',
      action: onOpenExplore
    },
    {
      step: '02',
      title: 'Side-by-Side Benchmark',
      tagline: 'Benchmark',
      description: 'Compare risk profiles, liquidity, minimum tickets, and distribution models objectively side-by-side.',
      icon: BarChart2,
      highlight: 'Objective Comparison',
      action: onOpenCompare
    },
    {
      step: '03',
      title: 'Practical Financial Education',
      tagline: 'Education',
      description: 'Learn complex structures through step-by-step calculations and real-world case studies.',
      icon: BookOpen,
      highlight: 'Interactive Academy',
      action: onOpenAcademy
    },
    {
      step: '04',
      title: 'Risk-Free Virtual Simulation',
      tagline: 'Simulation',
      description: 'Test strategies with real market datasets before committing real capital.',
      icon: Cpu,
      highlight: 'Zero Capital Risk',
      action: onOpenSimulator
    }
  ];

  return (
    <section id="pillars" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand scroll-mt-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="copper" size="sm" className="mb-3">
          The WelNex Platform Architecture
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-espresso-950 mb-4">
          Discover. Understand. Explore.
        </h2>
        <p className="text-sm sm:text-base text-espresso-700 leading-relaxed">
          Built specifically for the Indian alternative wealth ecosystem—combining institutional analytics with educational clarity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <GlassCard
              key={pillar.step}
              variant="interactive"
              glowEffect="copper"
              onClick={pillar.action}
              className="p-6 sm:p-7 flex flex-col justify-between bg-white/75 border border-champagne-500/40 hover:border-copper-500/60 transition-all duration-300 group cursor-pointer text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-copper-500/10 border border-copper-500/30 flex items-center justify-center text-copper-600 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-2xl font-black text-champagne-500/70">
                    {pillar.step}
                  </span>
                </div>

                <Badge variant="champagne" size="xs" className="mb-2 uppercase tracking-wider font-semibold">
                  {pillar.tagline}
                </Badge>

                <h3 className="text-lg font-display font-bold text-espresso-950 mb-2.5 group-hover:text-copper-700 transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-espresso-700 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-5 mt-6 border-t border-champagne-500/20 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-copper-600">
                  {pillar.highlight}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-copper-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
};
