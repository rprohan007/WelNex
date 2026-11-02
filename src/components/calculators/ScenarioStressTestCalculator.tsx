import React, { useState, useMemo } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Sliders,
  ShieldCheck,
  TrendingDown,
  Percent,
  Coins,
  ArrowUpRight
} from 'lucide-react';

interface ScenarioStressTestCalculatorProps {
  onOpenWaitlist?: () => void;
}

export const ScenarioStressTestCalculator: React.FC<ScenarioStressTestCalculatorProps> = ({
  onOpenWaitlist
}) => {

  // Inputs
  const [baseInvestment, setBaseInvestment] = useState<number>(1000000); // ₹10,00,000
  const [baseYield, setBaseYield] = useState<number>(9.5); // 9.5% p.a.
  const [interestRateShift, setInterestRateShift] = useState<number>(1.5); // +1.5% (+150 bps)
  const [occupancyDrop, setOccupancyDrop] = useState<number>(10); // -10% vacancy / yield drop

  // Benchmark: 10Y Indian Government Bond
  const GSEC_BENCHMARK = 7.05;

  // Stress Modeling Calculations
  const scenarioResults = useMemo(() => {
    // 1. Base Case
    const baseAnnualCashFlow = (baseInvestment * baseYield) / 100;
    const baseSpreadBps = Math.round((baseYield - GSEC_BENCHMARK) * 100);

    // 2. Stressed Case:
    // Interest Rate Shift: Every 1% (+100 bps) repo rate hike increases SPV borrowing costs.
    // In typical Indian REITs/InvITs with ~25-35% LTV, a 1% rate hike reduces net distributable cash flow by ~0.35% - 0.45% yield.
    const rateHikeYieldImpact = interestRateShift * 0.40;

    // Occupancy Drop: A 10% drop in leasable occupancy or tariff collection directly dampens top-line rental NOI.
    // Given fixed property operating expenses, a 10% drop in occupancy reduces net yield by ~1.1x proportionally.
    const occupancyYieldImpact = (baseYield * (occupancyDrop / 100)) * 0.85;

    const totalYieldDrop = rateHikeYieldImpact + occupancyYieldImpact;
    const stressedYield = Math.max(1.5, baseYield - totalYieldDrop);
    const stressedAnnualCashFlow = (baseInvestment * stressedYield) / 100;
    const annualCashFlowDelta = stressedAnnualCashFlow - baseAnnualCashFlow;
    const stressedSpreadBps = Math.round((stressedYield - GSEC_BENCHMARK) * 100);
    const yieldDropBps = Math.round(totalYieldDrop * 100);

    // 3. Severe Downside Macro Stress (+3.0% Rate Hike & -20% Occupancy Shock)
    const severeRateImpact = 3.0 * 0.40;
    const severeOccImpact = (baseYield * 0.20) * 0.85;
    const severeYield = Math.max(1.0, baseYield - (severeRateImpact + severeOccImpact));
    const severeAnnualCashFlow = (baseInvestment * severeYield) / 100;

    // Resilience Assessment
    let resilienceRating: 'High Cushion' | 'Moderate Resilience' | 'High Sensitivity' = 'High Cushion';
    let resilienceColor = 'text-emerald-700 bg-emerald-500/15 border-emerald-500/30';
    if (stressedYield < GSEC_BENCHMARK) {
      resilienceRating = 'High Sensitivity';
      resilienceColor = 'text-rose-700 bg-rose-500/15 border-rose-500/30';
    } else if (stressedYield < GSEC_BENCHMARK + 1.0) {
      resilienceRating = 'Moderate Resilience';
      resilienceColor = 'text-amber-700 bg-amber-500/15 border-amber-500/30';
    }

    return {
      baseAnnualCashFlow,
      baseSpreadBps,
      stressedYield,
      stressedAnnualCashFlow,
      annualCashFlowDelta,
      stressedSpreadBps,
      yieldDropBps,
      severeYield,
      severeAnnualCashFlow,
      resilienceRating,
      resilienceColor
    };
  }, [baseInvestment, baseYield, interestRateShift, occupancyDrop]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: Stress Controls */}
      <div className="lg:col-span-6 space-y-6">
        <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-champagne-500/30">
            <div>
              <span className="text-xs font-bold text-copper-700 uppercase tracking-wider block">
                Macroeconomic Risk Stress-Testing
              </span>
              <h3 className="text-xl font-display font-extrabold text-espresso-950">
                Sensitivity & Shock Simulator
              </h3>
            </div>
            <Badge variant="copper" size="sm">
              Tool C
            </Badge>
          </div>

          {/* INPUT 1: Base Case Investment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-espresso-800 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-copper-600" />
                <span>Base Portfolio Capital (₹)</span>
              </label>
              <span className="font-mono font-black text-espresso-950 text-base">
                ₹{baseInvestment.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={10000000}
              step={100000}
              value={baseInvestment}
              onChange={(e) => setBaseInvestment(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-sand-300 accent-copper-500 cursor-pointer"
            />
          </div>

          {/* INPUT 2: Base Target Yield */}
          <div className="space-y-2 pt-3 border-t border-champagne-500/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-espresso-800 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-copper-600" />
                <span>Normal Target Yield (% p.a.)</span>
              </label>
              <span className="font-mono font-black text-copper-600 text-base">
                {baseYield.toFixed(2)}%
              </span>
            </div>
            <input
              type="range"
              min={6.0}
              max={15.0}
              step={0.25}
              value={baseYield}
              onChange={(e) => setBaseYield(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-sand-300 accent-copper-500 cursor-pointer"
            />
            <span className="text-[10px] text-espresso-500 block">
              Contractual baseline under normal 100% full occupancy conditions
            </span>
          </div>

          {/* STRESS SLIDER 1: Interest Rate Shift (+/- 1% to 3%) */}
          <div className="space-y-2.5 pt-4 border-t border-champagne-500/20 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/25">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-espresso-900 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-700" />
                <span>RBI Repo / Interest Rate Shift</span>
              </label>
              <span className="font-mono font-bold text-amber-800 text-sm">
                {interestRateShift > 0 ? `+${interestRateShift.toFixed(1)}% (+${Math.round(interestRateShift * 100)} bps)` : `${interestRateShift.toFixed(1)}%`}
              </span>
            </div>

            <input
              type="range"
              min={-1.0}
              max={3.0}
              step={0.5}
              value={interestRateShift}
              onChange={(e) => setInterestRateShift(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-sand-300 accent-amber-600 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-espresso-600">
              <span>-1.0% Rate Cut</span>
              <span>0% Flat</span>
              <span>+1.5% Moderate</span>
              <span>+3.0% Severe Spike</span>
            </div>
            <p className="text-[11px] text-espresso-600 leading-snug">
              Rising policy rates increase refinancing debt costs on SPV debt, narrowing distributable yield margins.
            </p>
          </div>

          {/* STRESS SLIDER 2: Occupancy / Yield Drop (-5% to -20%) */}
          <div className="space-y-2.5 pt-2 bg-rose-500/5 p-4 rounded-2xl border border-rose-500/25">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-espresso-900 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-rose-700" />
                <span>Occupancy / Yield Revenue Shock</span>
              </label>
              <span className="font-mono font-bold text-rose-800 text-sm">
                -{occupancyDrop}% Drop
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={25}
              step={2.5}
              value={occupancyDrop}
              onChange={(e) => setOccupancyDrop(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-sand-300 accent-rose-600 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-espresso-600">
              <span>0% Full</span>
              <span>-5% Mild</span>
              <span>-10% Typical</span>
              <span>-20% Stress</span>
              <span>-25% Crash</span>
            </div>
            <p className="text-[11px] text-espresso-600 leading-snug">
              Simulates corporate lease non-renewals, power transmission outages, or tenant rent renegotiations.
            </p>
          </div>

        </GlassCard>
      </div>

      {/* RIGHT COLUMN: Dynamic Graph & Sensitivity Matrix */}
      <div className="lg:col-span-6 space-y-6">
        <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6 border-champagne-500/60 shadow-glass-md">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-600 uppercase tracking-wider">
              Stress-Testing Sensitivity Graph
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${scenarioResults.resilienceColor}`}>
              {scenarioResults.resilienceRating}
            </span>
          </div>

          {/* DYNAMIC VISUAL BAR / GRAPH: Base Case vs Conservative Downside */}
          <div className="p-5 rounded-2xl bg-white/80 border border-champagne-500/40 space-y-4">
            
            {/* Visualizer Bar 1: Base Case */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-espresso-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-copper-500" />
                  Base Case Yield
                </span>
                <span className="font-mono text-copper-700 text-sm">
                  {baseYield.toFixed(2)}% p.a.
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-sand-300 overflow-hidden">
                <div
                  className="h-full bg-copper-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (baseYield / 16) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-espresso-600 mt-1">
                <span>Annual Cashflow: ₹{Math.round(scenarioResults.baseAnnualCashFlow).toLocaleString('en-IN')}</span>
                <span className="font-mono text-copper-600">+{scenarioResults.baseSpreadBps} bps vs G-Sec</span>
              </div>
            </div>

            {/* Visualizer Bar 2: Stressed Conservative Case */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-amber-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  Stressed / Conservative Yield
                </span>
                <span className="font-mono text-amber-800 text-sm">
                  {scenarioResults.stressedYield.toFixed(2)}% p.a.
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-sand-300 overflow-hidden">
                <div
                  className="h-full bg-amber-600 transition-all duration-300"
                  style={{ width: `${Math.min(100, (scenarioResults.stressedYield / 16) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-espresso-600 mt-1">
                <span>Stressed Cashflow: ₹{Math.round(scenarioResults.stressedAnnualCashFlow).toLocaleString('en-IN')}</span>
                <span className="font-mono text-rose-700">-{scenarioResults.yieldDropBps} bps shock</span>
              </div>
            </div>

            {/* Visualizer Bar 3: Risk-Free 10Y Indian Government Benchmark */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5 text-espresso-600">
                <span>10Y India G-Sec (Risk-free Floor)</span>
                <span className="font-mono">{GSEC_BENCHMARK}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-sand-300 overflow-hidden">
                <div
                  className="h-full bg-espresso-400"
                  style={{ width: `${(GSEC_BENCHMARK / 16) * 100}%` }}
                />
              </div>
            </div>

          </div>

          {/* 3-SCENARIO SIDE-BY-SIDE MATRIX */}
          <div className="grid grid-cols-3 gap-2.5">
            
            {/* Scenario 1: Base Case */}
            <div className="p-3.5 rounded-xl bg-copper-500/10 border border-copper-500/30 text-center">
              <span className="text-[10px] font-bold text-copper-700 uppercase tracking-wider block mb-1">
                Base Case
              </span>
              <div className="text-lg font-mono font-black text-copper-700">
                {baseYield.toFixed(2)}%
              </div>
              <span className="text-[11px] font-semibold text-espresso-900 block mt-1">
                ₹{Math.round(scenarioResults.baseAnnualCashFlow).toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] text-espresso-500 block mt-0.5">
                Normal operations
              </span>
            </div>

            {/* Scenario 2: Stressed Case */}
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-center">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                Stressed Case
              </span>
              <div className="text-lg font-mono font-black text-amber-800">
                {scenarioResults.stressedYield.toFixed(2)}%
              </div>
              <span className="text-[11px] font-semibold text-espresso-900 block mt-1">
                ₹{Math.round(scenarioResults.stressedAnnualCashFlow).toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] text-rose-700 font-bold block mt-0.5">
                Δ ₹{Math.round(scenarioResults.annualCashFlowDelta).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Scenario 3: Severe Macro Stress */}
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block mb-1">
                Severe Shock
              </span>
              <div className="text-lg font-mono font-black text-rose-700">
                {scenarioResults.severeYield.toFixed(2)}%
              </div>
              <span className="text-[11px] font-semibold text-espresso-900 block mt-1">
                ₹{Math.round(scenarioResults.severeAnnualCashFlow).toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] text-espresso-500 block mt-0.5">
                Worst case shock
              </span>
            </div>

          </div>

          {/* Institutional Safeguards Explainer */}
          <div className="p-4 rounded-xl bg-champagne-500/20 border border-champagne-500/40 text-xs text-espresso-800 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-espresso-950">
              <ShieldCheck className="w-4 h-4 text-copper-600" />
              <span>Institutional Downside Mitigants in India:</span>
            </div>
            <ul className="space-y-1 text-[11px] text-espresso-700 list-disc pl-4">
              <li>
                <strong>Long-Term WALE (6-9 Years):</strong> Tenants cannot abruptly vacate without contractual lease lock-in penalties and forfeited security deposits.
              </li>
              <li>
                <strong>SEBI NDCF 90% Mandate:</strong> REITs and InvITs must distribute at least 90% of net cash flow, preventing sponsors from siphoning cash flow into risky acquisitions.
              </li>
              <li>
                <strong>LTV Cap:</strong> Statutory leverage is capped at 49% by SEBI, preventing the excessive balance sheet overleveraging seen in traditional private developers.
              </li>
            </ul>
          </div>

          {onOpenWaitlist && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenWaitlist}
              icon={<ArrowUpRight className="w-3.5 h-3.5" />}
              className="w-full text-xs font-semibold"
            >
              Simulate in WelNex Sandbox
            </Button>
          )}

        </GlassCard>

      </div>

    </div>
  );
};
