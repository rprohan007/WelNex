import React, { useState, useMemo } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  TrendingUp,
  Percent,
  Calendar,
  Coins,
  ChevronDown,
  ChevronUp,
  ArrowUpRight
} from 'lucide-react';

interface TotalReturnCompoundingCalculatorProps {
  onOpenWaitlist?: () => void;
}

export const TotalReturnCompoundingCalculator: React.FC<TotalReturnCompoundingCalculatorProps> = ({
  onOpenWaitlist
}) => {

  // Inputs
  const [initialInvestment, setInitialInvestment] = useState<number>(1000000); // ₹10,00,000
  const [annualYield, setAnnualYield] = useState<number>(8.0); // 8% Cash distribution
  const [capitalAppreciation, setCapitalAppreciation] = useState<number>(4.5); // 4.5% asset growth
  const [horizonYears, setHorizonYears] = useState<number>(7); // 7 years
  const [reinvestYield, setReinvestYield] = useState<boolean>(true); // Compound vs Cash
  const [showScheduleTable, setShowScheduleTable] = useState<boolean>(false);

  // Calculations
  const projection = useMemo(() => {
    let currentCapital = initialInvestment;
    let cumulativeYield = 0;
    const yearlyBreakdown: {
      year: number;
      openingCapital: number;
      yieldEarned: number;
      capitalAppreciationEarned: number;
      closingWealth: number;
      cumulativeCashYield: number;
    }[] = [];

    for (let yr = 1; yr <= horizonYears; yr++) {
      const opening = currentCapital;
      const yieldEarned = currentCapital * (annualYield / 100);
      const appEarned = currentCapital * (capitalAppreciation / 100);

      if (reinvestYield) {
        // Both yield and appreciation compound into asset base
        currentCapital = opening + yieldEarned + appEarned;
        cumulativeYield += yieldEarned;
      } else {
        // Appreciation increases asset base, yield is paid out as liquid cash
        currentCapital = opening + appEarned;
        cumulativeYield += yieldEarned;
      }

      yearlyBreakdown.push({
        year: yr,
        openingCapital: opening,
        yieldEarned,
        capitalAppreciationEarned: appEarned,
        closingWealth: reinvestYield ? currentCapital : currentCapital + cumulativeYield,
        cumulativeCashYield: cumulativeYield
      });
    }

    const finalAssetValue = currentCapital;
    const finalTotalWealth = reinvestYield ? currentCapital : currentCapital + cumulativeYield;
    const totalGain = finalTotalWealth - initialInvestment;
    const capitalGrowthComponent = finalAssetValue - initialInvestment;
    const wealthMultiple = finalTotalWealth / initialInvestment;

    // CAGR = (Final / Initial)^(1/Years) - 1
    const cagr = (Math.pow(wealthMultiple, 1 / horizonYears) - 1) * 100;

    return {
      finalTotalWealth,
      totalGain,
      capitalGrowthComponent,
      cumulativeYield,
      wealthMultiple,
      cagr,
      yearlyBreakdown
    };
  }, [initialInvestment, annualYield, capitalAppreciation, horizonYears, reinvestYield]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: Controls */}
      <div className="lg:col-span-6 space-y-6">
        <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-champagne-500/30">
            <div>
              <span className="text-xs font-bold text-copper-700 uppercase tracking-wider block">
                Educational Modeling Tool
              </span>
              <h3 className="text-xl font-display font-extrabold text-espresso-950">
                Wealth Growth & Compounding
              </h3>
            </div>
            <Badge variant="copper" size="sm">
              Tool B
            </Badge>
          </div>

          {/* INPUT 1: Initial Investment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-espresso-800 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-copper-600" />
                <span>Initial Investment (₹)</span>
              </label>
              <span className="font-mono font-black text-espresso-950 text-base">
                ₹{initialInvestment.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={50000}
              max={10000000}
              step={50000}
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-sand-300 accent-copper-500 cursor-pointer"
            />
            <div className="flex gap-1.5 pt-0.5">
              {[500000, 1000000, 2500000, 5000000].map((val) => (
                <button
                  key={val}
                  onClick={() => setInitialInvestment(val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    initialInvestment === val
                      ? 'bg-copper-500 text-white font-bold'
                      : 'bg-sand-100 text-espresso-700 border border-champagne-500/30 hover:border-copper-500/40'
                  }`}
                >
                  ₹{(val / 100000).toFixed(0)}L
                </button>
              ))}
            </div>
          </div>

          {/* INPUT 2: Annual Yield (%) */}
          <div className="space-y-2 pt-3 border-t border-champagne-500/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-espresso-800 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-copper-600" />
                <span>Annual Cash Yield (% p.a.)</span>
              </label>
              <span className="font-mono font-black text-copper-600 text-base">
                {annualYield.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={4.0}
              max={16.0}
              step={0.5}
              value={annualYield}
              onChange={(e) => setAnnualYield(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-sand-300 accent-copper-500 cursor-pointer"
            />
            <span className="text-[10px] text-espresso-500 block">
              Contractual quarterly rental / interest distribution
            </span>
          </div>

          {/* INPUT 3: Expected Capital Appreciation (%) */}
          <div className="space-y-2 pt-3 border-t border-champagne-500/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-espresso-800 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-copper-600" />
                <span>Expected Capital Appreciation (% p.a.)</span>
              </label>
              <span className="font-mono font-black text-amber-700 text-base">
                {capitalAppreciation.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={0.0}
              max={12.0}
              step={0.5}
              value={capitalAppreciation}
              onChange={(e) => setCapitalAppreciation(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-sand-300 accent-copper-500 cursor-pointer"
            />
            <span className="text-[10px] text-espresso-500 block">
              Underlying property/asset valuation appreciation and lease rent escalations
            </span>
          </div>

          {/* INPUT 4: Investment Horizon (Years) */}
          <div className="space-y-2 pt-3 border-t border-champagne-500/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-espresso-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-copper-600" />
                <span>Holding Horizon (Years)</span>
              </label>
              <span className="font-mono font-black text-espresso-950 text-base">
                {horizonYears} Years
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={horizonYears}
              onChange={(e) => setHorizonYears(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-sand-300 accent-copper-500 cursor-pointer"
            />
          </div>

          {/* TOGGLE: Reinvest Yield vs Cash Payout */}
          <div className="pt-3 border-t border-champagne-500/20">
            <div className="p-3.5 rounded-2xl bg-white/80 border border-champagne-500/30 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-espresso-900 block">
                  Distribution Reinvestment Strategy
                </span>
                <span className="text-[11px] text-espresso-600 block">
                  {reinvestYield
                    ? 'Reinvesting yield accelerates compounding of asset units'
                    : 'Taking periodic liquid cash payouts reduces reinvestment risk'}
                </span>
              </div>
              <button
                onClick={() => setReinvestYield(!reinvestYield)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  reinvestYield ? 'bg-copper-500' : 'bg-espresso-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    reinvestYield ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

        </GlassCard>
      </div>

      {/* RIGHT COLUMN: Output Wealth Projections & Charts */}
      <div className="lg:col-span-6 space-y-6">
        <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6 border-champagne-500/60 shadow-glass-md">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-600 uppercase tracking-wider">
              Combined Total Wealth Projection
            </span>
            <Badge variant="champagne" size="xs">
              {horizonYears}-Year Multi-Asset Horizon
            </Badge>
          </div>

          {/* Hero Combined Wealth Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-copper-500/20 via-champagne-500/20 to-transparent border border-copper-500/40">
            <span className="text-xs font-semibold text-espresso-700 block mb-1">
              Projected Total Portfolio Wealth after {horizonYears} Years:
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-black text-espresso-950 tracking-tight">
              ₹{Math.round(projection.finalTotalWealth).toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="font-semibold text-copper-700">
                Wealth Multiple: <strong className="font-mono text-sm">{projection.wealthMultiple.toFixed(2)}x</strong>
              </span>
              <span className="text-espresso-400">•</span>
              <span className="font-semibold text-emerald-800">
                Effective CAGR: <strong className="font-mono text-sm">{projection.cagr.toFixed(2)}%</strong>
              </span>
            </div>
          </div>

          {/* Breakdown Split: Yield Distributions vs Capital Growth */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-espresso-800 block">
              Combined Total Wealth Split:
            </span>

            <div className="grid grid-cols-2 gap-3">
              {/* Box 1: Yield Component */}
              <div className="p-4 rounded-xl bg-copper-500/10 border border-copper-500/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-copper-700 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-copper-500" />
                  <span>Yield Distributions</span>
                </div>
                <div className="text-xl font-mono font-black text-copper-600">
                  ₹{Math.round(projection.cumulativeYield).toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-espresso-600 block mt-1">
                  {reinvestYield ? 'Compounded in portfolio' : 'Liquid cash payouts received'}
                </span>
              </div>

              {/* Box 2: Capital Appreciation Component */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Capital Growth</span>
                </div>
                <div className="text-xl font-mono font-black text-amber-700">
                  ₹{Math.round(projection.capitalGrowthComponent).toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-espresso-600 block mt-1">
                  Underlying asset NAV appreciation
                </span>
              </div>
            </div>
          </div>

          {/* Multi-Year Stacked SVG Progression Visualizer */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-espresso-800">
              <span>Year-by-Year Wealth Progression</span>
              <div className="flex items-center gap-3 text-[10px] font-medium text-espresso-600">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-sand-400" /> Principal
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-amber-500" /> Growth
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-copper-500" /> Yield
                </span>
              </div>
            </div>

            {/* Stacked Growth Bars */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-sand-200/50 border border-champagne-500/30">
              {projection.yearlyBreakdown.map((item) => {
                const maxVal = projection.finalTotalWealth;
                const totalPct = (item.closingWealth / maxVal) * 100;
                return (
                  <div key={item.year} className="flex items-center gap-2 text-xs">
                    <span className="w-8 font-mono text-[10px] text-espresso-600 font-bold">
                      Yr {item.year}
                    </span>
                    <div className="flex-1 h-3.5 bg-sand-300 rounded-full overflow-hidden flex">
                      {/* Initial Capital segment */}
                      <div
                        className="h-full bg-sand-400/90"
                        style={{ width: `${(initialInvestment / item.closingWealth) * totalPct}%` }}
                        title={`Initial: ₹${initialInvestment.toLocaleString('en-IN')}`}
                      />
                      {/* Capital App segment */}
                      <div
                        className="h-full bg-amber-500"
                        style={{
                          width: `${
                            ((item.closingWealth - initialInvestment - item.cumulativeCashYield) /
                              item.closingWealth) *
                            totalPct
                          }%`
                        }}
                        title="Capital Appreciation"
                      />
                      {/* Yield segment */}
                      <div
                        className="h-full bg-copper-500"
                        style={{
                          width: `${(item.cumulativeCashYield / item.closingWealth) * totalPct}%`
                        }}
                        title={`Cumulative Yield: ₹${Math.round(item.cumulativeCashYield).toLocaleString('en-IN')}`}
                      />
                    </div>
                    <span className="w-20 text-right font-mono text-[10px] font-bold text-espresso-900">
                      ₹{(item.closingWealth / 100000).toFixed(1)}L
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Toggle Schedule Breakdown Table */}
          <div className="pt-2">
            <button
              onClick={() => setShowScheduleTable(!showScheduleTable)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-copper-700 bg-copper-500/10 hover:bg-copper-500/15 border border-copper-500/20 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>{showScheduleTable ? 'Hide' : 'View'} Annual Schedule Table</span>
              {showScheduleTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showScheduleTable && (
              <div className="mt-3 overflow-x-auto max-h-56 rounded-xl border border-champagne-500/30">
                <table className="w-full text-[11px] text-left border-collapse bg-white/90">
                  <thead>
                    <tr className="bg-sand-100 text-espresso-700 border-b border-champagne-500/30 font-bold">
                      <th className="p-2">Year</th>
                      <th className="p-2">Opening</th>
                      <th className="p-2">Yield Earned</th>
                      <th className="p-2">Appreciation</th>
                      <th className="p-2">Ending Wealth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-champagne-500/20 font-mono">
                    {projection.yearlyBreakdown.map((row) => (
                      <tr key={row.year} className="hover:bg-sand-50">
                        <td className="p-2 font-bold text-espresso-900">Yr {row.year}</td>
                        <td className="p-2 text-espresso-700">₹{Math.round(row.openingCapital).toLocaleString('en-IN')}</td>
                        <td className="p-2 text-copper-600 font-bold">+₹{Math.round(row.yieldEarned).toLocaleString('en-IN')}</td>
                        <td className="p-2 text-amber-700">+₹{Math.round(row.capitalAppreciationEarned).toLocaleString('en-IN')}</td>
                        <td className="p-2 font-black text-espresso-950">₹{Math.round(row.closingWealth).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {onOpenWaitlist && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenWaitlist}
              icon={<ArrowUpRight className="w-3.5 h-3.5" />}
              className="w-full text-xs font-semibold mt-3"
            >
              Simulate in WelNex Sandbox
            </Button>
          )}

        </GlassCard>
      </div>


    </div>
  );
};
