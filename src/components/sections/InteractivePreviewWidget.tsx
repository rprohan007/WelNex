import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  ArrowRight, 
  Building2, 
  TowerControl, 
  ShieldCheck, 
  Coins, 
  CheckCircle2, 
  Search, 
  BarChart2, 
  BookOpen, 
  Cpu 
} from 'lucide-react';

interface InteractivePreviewWidgetProps {
  onOpenCompare?: () => void;
  onOpenSimulator?: () => void;
  onOpenExplore?: () => void;
  onOpenAcademy?: () => void;
}

export const InteractivePreviewWidget: React.FC<InteractivePreviewWidgetProps> = ({
  onOpenCompare,
  onOpenSimulator,
  onOpenExplore,
  onOpenAcademy
}) => {
  const [allocationAmount, setAllocationAmount] = useState<number>(500000);

  // Simulated cash flow calculations
  const projectedQuarterlyCash = Math.round((allocationAmount * 0.114) / 4);

  const featurePillars = [
    {
      step: '01',
      title: 'Multi-Asset Discovery',
      tagline: 'Discovery',
      description: 'Explore 15+ alternative asset classes beyond public equity markets with verified institutional metrics.',
      icon: Search,
      action: onOpenExplore,
      actionLabel: 'Explore Assets'
    },
    {
      step: '02',
      title: 'Side-by-Side Benchmark',
      tagline: 'Benchmark',
      description: 'Compare risk profiles, liquidity, minimum tickets, and distribution models objectively side-by-side.',
      icon: BarChart2,
      action: onOpenCompare,
      actionLabel: 'Compare Matrix'
    },
    {
      step: '03',
      title: 'Practical Financial Education',
      tagline: 'Education',
      description: 'Learn complex structures through step-by-step calculations and real-world case studies in WelNex Academy.',
      icon: BookOpen,
      action: onOpenAcademy,
      actionLabel: 'Open Academy'
    },
    {
      step: '04',
      title: 'Risk-Free Virtual Simulation',
      tagline: 'Simulation',
      description: 'Test strategies with real market datasets before committing real capital in our interactive virtual sandbox.',
      icon: Cpu,
      action: onOpenSimulator,
      actionLabel: 'Run Simulation'
    }
  ];

  return (
    <section id="terminal-preview" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand scroll-mt-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Badge variant="copper" size="sm" className="mb-3" withDot={true}>
          Interactive Discovery Terminal
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-espresso-950 mb-3">
          Benchmark Yields & Simulate Cash Flows
        </h2>
        <p className="text-sm sm:text-base text-espresso-700 leading-relaxed">
          Test asset allocations and preview risk-adjusted yield spreads over the Indian sovereign 10Y G-Sec before committing real capital.
        </p>
      </div>

      {/* Main Terminal Window Card */}
      <div className="w-full max-w-5xl mx-auto rounded-3xl bg-white/85 backdrop-blur-md border border-champagne-500/50 shadow-glass-xl overflow-hidden mb-16">
        
        {/* Terminal Window Header Bar */}
        <div className="px-6 py-4 border-b border-champagne-500/35 flex items-center justify-between bg-sand-100/90">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="ml-2 font-mono text-xs font-bold text-espresso-800">
              WelNex Terminal • Real-Time Yield Discovery & Simulation Sandbox
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-espresso-600">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-semibold">Indicative Market Feeds</span>
          </div>
        </div>

        {/* Terminal Workspace Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left Panel: Macro Yield Benchmarking Radar */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-copper-700 block">
                  Macro Yield Benchmarking
                </span>
                <h3 className="text-xl font-display font-extrabold text-espresso-950">
                  Spread Over 10Y India G-Sec
                </h3>
              </div>
              <Badge variant="champagne" size="xs">
                RBI Base: 7.05%
              </Badge>
            </div>

            <p className="text-xs text-espresso-700 leading-relaxed">
              Compare how alternative assets generate superior quarterly risk-adjusted spreads over the risk-free Indian government bond rate.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="p-3 rounded-xl bg-sand-50/80 border border-champagne-500/35 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-copper-500/10 text-copper-600 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-espresso-900 block">Commercial REITs</span>
                    <span className="text-[10px] text-espresso-600">Embassy, Mindspace, Nexus</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-sm text-copper-600">7.85% p.a.</span>
                  <span className="text-[10px] font-semibold text-emerald-700 block">+80 bps spread</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sand-50/80 border border-champagne-500/35 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-copper-500/10 text-copper-600 flex items-center justify-center">
                    <TowerControl className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-espresso-900 block">Infrastructure InvITs</span>
                    <span className="text-[10px] text-espresso-600">IndiGrid, PowerGrid, IRB</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-sm text-copper-600">11.20% p.a.</span>
                  <span className="text-[10px] font-semibold text-emerald-700 block">+415 bps spread</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sand-50/80 border border-champagne-500/35 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-copper-500/10 text-copper-600 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-espresso-900 block">Senior Secured SDIs</span>
                    <span className="text-[10px] text-espresso-600">EV Fleets & Equipment Leases</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-sm text-copper-600">12.50% p.a.</span>
                  <span className="text-[10px] font-semibold text-emerald-700 block">+545 bps spread</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sand-50/80 border border-champagne-500/35 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-copper-500/10 text-copper-600 flex items-center justify-center">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-espresso-900 block">Sovereign Gold Bonds</span>
                    <span className="text-[10px] text-espresso-600">RBI Guaranteed + Bullion Growth</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-sm text-copper-600">2.50% + Bullion</span>
                  <span className="text-[10px] font-semibold text-emerald-700 block">Tax-Free Maturity</span>
                </div>
              </div>
            </div>

            {onOpenCompare && (
              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onOpenCompare}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="w-full text-xs font-semibold"
                >
                  Open Full Comparison Matrix
                </Button>
              </div>
            )}
          </div>

          {/* Right Panel: Interactive Allocation Slider & Projected Payouts */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-copper-700 block">
                  Interactive Yield Sandbox
                </span>
                <h3 className="text-xl font-display font-extrabold text-espresso-950">
                  Quarterly Cash Flow Simulator
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-copper-600 bg-copper-500/10 px-2.5 py-1 rounded-lg">
                ₹{allocationAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-xs text-espresso-700 leading-relaxed">
              Slide test allocations to simulate cash distributions deposited directly into your bank every 90 days.
            </p>

            {/* Range Slider Container */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-espresso-600 mb-1.5 font-medium">
                <span>Allocation: ₹1,00,000</span>
                <span>₹25,00,000</span>
              </div>
              <input
                type="range"
                min={100000}
                max={2500000}
                step={50000}
                value={allocationAmount}
                onChange={(e) => setAllocationAmount(Number(e.target.value))}
                className="w-full accent-copper-500 cursor-pointer h-2 bg-sand-300 rounded-lg"
                aria-label="Simulation allocation slider"
              />

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 mt-3">
                {[100000, 500000, 1000000, 2000000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAllocationAmount(preset)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-mono font-semibold transition-colors cursor-pointer ${
                      allocationAmount === preset
                        ? 'bg-copper-500 text-sand-50 shadow-sm'
                        : 'bg-sand-200 text-espresso-700 hover:bg-copper-500/15'
                    }`}
                  >
                    ₹{(preset / 100000).toFixed(0)}L
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Simulation Result Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sand-100 via-sand-50 to-champagne-500/10 border border-champagne-500/40">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-semibold text-espresso-700">Blended Model Portfolio</span>
                <span className="text-[11px] font-mono text-copper-700 bg-copper-500/15 px-2 py-0.5 rounded">
                  40% REITs • 35% InvITs • 25% Debt
                </span>
              </div>

              {/* Dynamic Payout Feedback Box */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white border border-champagne-500/40 shadow-sm mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-espresso-500 block">
                    Projected Quarterly Cash
                  </span>
                  <div className="text-xl sm:text-2xl font-mono font-extrabold text-copper-600">
                    +₹{projectedQuarterlyCash.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-espresso-600 block mt-0.5">
                    Every 90 days directly to bank
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-espresso-500 block">
                    Blended Net Yield
                  </span>
                  <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-700">
                    11.40%
                  </div>
                  <span className="text-[10px] text-espresso-600 block mt-0.5">
                    Tax-optimized distribution
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-espresso-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-copper-600" />
                  <span>Interactive sandbox simulation</span>
                </span>
                {onOpenSimulator && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onOpenSimulator}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="text-xs font-semibold shadow-sm shadow-copper-500/20"
                  >
                    Launch Full Simulator
                  </Button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* REQUIREMENT 5: 4 CALIBRATED FEATURE BOXES */}
      <div className="mt-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge variant="champagne" size="xs" className="mb-2 uppercase tracking-wider font-semibold">
            Institutional Clarity
          </Badge>
          <h3 className="text-2xl font-display font-extrabold text-espresso-950">
            Engineered for Modern Alternative Discovery
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featurePillars.map((pillar) => {
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
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-copper-500/10 border border-copper-500/25 flex items-center justify-center text-copper-600 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-xl font-black text-champagne-600/70">
                      {pillar.step}
                    </span>
                  </div>

                  <Badge variant="champagne" size="xs" className="mb-2 uppercase tracking-wider font-semibold">
                    {pillar.tagline}
                  </Badge>

                  <h4 className="text-base font-display font-bold text-espresso-950 mb-2 group-hover:text-copper-700 transition-colors">
                    {pillar.title}
                  </h4>

                  <p className="text-xs text-espresso-700 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 mt-5 border-t border-champagne-500/25 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-copper-700 group-hover:text-copper-800">
                    {pillar.actionLabel}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-copper-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

    </section>
  );
};
