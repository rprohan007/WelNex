import React, { useState, useMemo } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Coins,
  Calendar,
  Percent,
  Info,
  ArrowUpRight
} from 'lucide-react';

interface DistributionYieldCalculatorProps {
  onOpenWaitlist?: () => void;
}

type PayoutFrequency = 'monthly' | 'quarterly' | 'annual';

export const DistributionYieldCalculator: React.FC<DistributionYieldCalculatorProps> = ({
  onOpenWaitlist
}) => {

  // Inputs
  const [investmentAmount, setInvestmentAmount] = useState<number>(500000); // ₹5,00,000
  const [expectedYield, setExpectedYield] = useState<number>(8.5); // 8.5%
  const [frequency, setFrequency] = useState<PayoutFrequency>('quarterly');

  // Amount Presets
  const amountPresets = [
    { label: '₹1 Lakh', val: 100000 },
    { label: '₹5 Lakhs', val: 500000 },
    { label: '₹10 Lakhs', val: 1000000 },
    { label: '₹25 Lakhs', val: 2500000 },
    { label: '₹50 Lakhs', val: 5000000 }
  ];

  // Yield Presets
  const yieldPresets = [
    { label: 'REITs (7.4%)', val: 7.4 },
    { label: 'NCD Bonds (8.65%)', val: 8.65 },
    { label: 'InvITs (11.2%)', val: 11.2 },
    { label: 'Securitized SDI (13.25%)', val: 13.25 }
  ];

  // Calculations
  const calculations = useMemo(() => {
    const annualDistribution = (investmentAmount * expectedYield) / 100;
    const periodsPerYear = frequency === 'monthly' ? 12 : frequency === 'quarterly' ? 4 : 1;
    const periodicCashFlow = annualDistribution / periodsPerYear;
    const monthlyEquivalent = annualDistribution / 12;
    const dailyEquivalent = annualDistribution / 365;

    // Projected 12-Month Schedule
    const monthlySchedule = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      let payout = 0;
      if (frequency === 'monthly') {
        payout = periodicCashFlow;
      } else if (frequency === 'quarterly') {
        payout = monthNum % 3 === 0 ? periodicCashFlow : 0;
      } else {
        payout = monthNum === 12 ? periodicCashFlow : 0;
      }
      return {
        month: `M${monthNum}`,
        payout
      };
    });

    return {
      annualDistribution,
      periodicCashFlow,
      periodsPerYear,
      monthlyEquivalent,
      dailyEquivalent,
      monthlySchedule
    };
  }, [investmentAmount, expectedYield, frequency]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: Input Controls */}
      <div className="lg:col-span-6 space-y-6">
        <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-champagne-500/30">
            <div>
              <span className="text-xs font-bold text-copper-700 uppercase tracking-wider block">
                Educational Modeling Tool
              </span>
              <h3 className="text-xl font-display font-extrabold text-espresso-950">
                Cash Flow & Yield Parameters
              </h3>
            </div>
            <Badge variant="copper" size="sm">
              Tool A
            </Badge>
          </div>

          {/* INPUT 1: Investment Capital */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-espresso-800 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-copper-600" />
                <span>Investment Capital (₹)</span>
              </label>
              <span className="font-mono font-black text-espresso-950 text-base">
                ₹{investmentAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min={25000}
              max={10000000}
              step={25000}
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-sand-300 accent-copper-500 cursor-pointer"
            />

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {amountPresets.map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => setInvestmentAmount(preset.val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    investmentAmount === preset.val
                      ? 'bg-copper-500 text-white shadow-sm'
                      : 'bg-sand-100 text-espresso-700 border border-champagne-500/30 hover:border-copper-500/40'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT 2: Expected Annual Yield */}
          <div className="space-y-2.5 pt-4 border-t border-champagne-500/20">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-espresso-800 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-copper-600" />
                <span>Expected Indicative Yield (% p.a.)</span>
              </label>
              <span className="font-mono font-black text-copper-600 text-lg">
                {expectedYield.toFixed(2)}%
              </span>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min={4.0}
              max={18.0}
              step={0.1}
              value={expectedYield}
              onChange={(e) => setExpectedYield(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-sand-300 accent-copper-500 cursor-pointer"
            />

            {/* Quick Benchmark Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {yieldPresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setExpectedYield(preset.val)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    expectedYield === preset.val
                      ? 'bg-copper-600 text-white font-bold'
                      : 'bg-sand-100 text-espresso-700 border border-champagne-500/30 hover:border-copper-500/40'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT 3: Payout Frequency */}
          <div className="space-y-2.5 pt-4 border-t border-champagne-500/20">
            <label className="text-xs font-bold text-espresso-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-copper-600" />
              <span>Distribution Payout Frequency</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'monthly', label: 'Monthly', desc: '12 distributions/yr' },
                  { id: 'quarterly', label: 'Quarterly', desc: '4 distributions/yr (Standard)' },
                  { id: 'annual', label: 'Annual', desc: '1 distribution/yr' }
                ] as const
              ).map((freq) => {
                const active = frequency === freq.id;
                return (
                  <button
                    key={freq.id}
                    onClick={() => setFrequency(freq.id)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      active
                        ? 'bg-copper-500/15 border-copper-500 text-espresso-950 font-bold shadow-sm'
                        : 'bg-white/70 border-champagne-500/30 text-espresso-700 hover:border-copper-500/40'
                    }`}
                  >
                    <span className="text-xs font-bold block">{freq.label}</span>
                    <span className="text-[10px] text-espresso-500 block mt-0.5">
                      {freq.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </GlassCard>
      </div>

      {/* RIGHT COLUMN: Output Displays & Visual Schedule */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Main Payout Display Hero Card */}
        <GlassCard variant="elevated" className="p-6 sm:p-8 space-y-6 border-champagne-500/60 shadow-glass-md">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-600 uppercase tracking-wider">
              Projected Cash Flow Output
            </span>
            <span className="text-[11px] font-semibold text-copper-700 bg-copper-500/10 px-2 py-0.5 rounded-full">
              {frequency.toUpperCase()} DISTRIBUTION
            </span>
          </div>

          {/* Primary Periodic Output */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-copper-500/15 via-champagne-500/20 to-transparent border border-copper-500/30">
            <span className="text-xs font-semibold text-espresso-700 block mb-1">
              Estimated Periodic Cash Payout ({frequency === 'monthly' ? 'Every Month' : frequency === 'quarterly' ? 'Every Quarter' : 'Every Year'}):
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-black text-copper-700 tracking-tight">
              ₹{Math.round(calculations.periodicCashFlow).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-espresso-600 block mt-1.5">
              Net of underlying SPV asset expenses, before applicable personal income taxes.
            </span>
          </div>

          {/* Annual & Monthly Metric Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white/80 border border-champagne-500/30">
              <span className="text-[10px] uppercase font-bold text-espresso-500 block mb-1">
                Annual Gross Distribution
              </span>
              <span className="text-xl font-mono font-extrabold text-espresso-950 block">
                ₹{Math.round(calculations.annualDistribution).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-espresso-600 mt-0.5 block">
                Across 12 calendar months
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-champagne-500/30">
              <span className="text-[10px] uppercase font-bold text-espresso-500 block mb-1">
                Effective Monthly Equivalent
              </span>
              <span className="text-xl font-mono font-extrabold text-copper-600 block">
                ₹{Math.round(calculations.monthlyEquivalent).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-espresso-600 mt-0.5 block">
                ~₹{Math.round(calculations.dailyEquivalent).toLocaleString('en-IN')}/day passive yield
              </span>
            </div>
          </div>

          {/* 12-Month Cash Flow Visualizer */}
          <div className="pt-4 border-t border-champagne-500/25 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-espresso-800">
              <span>12-Month Projected Distribution Timeline</span>
              <span className="font-mono text-copper-700">
                {frequency === 'quarterly' ? '4 Payout Windows' : frequency === 'monthly' ? '12 Payout Windows' : '1 Year-End Payout'}
              </span>
            </div>

            {/* Dynamic CSS Bar Timeline */}
            <div className="grid grid-cols-12 gap-1.5 h-20 items-end bg-sand-200/60 p-2.5 rounded-xl border border-champagne-500/30">
              {calculations.monthlySchedule.map((item, idx) => {
                const maxPayout = calculations.periodicCashFlow;
                const heightPercent = maxPayout > 0 ? (item.payout / maxPayout) * 100 : 0;
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-espresso-950 text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow whitespace-nowrap z-10">
                      {item.month}: ₹{Math.round(item.payout).toLocaleString('en-IN')}
                    </div>

                    <div
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        item.payout > 0
                          ? 'bg-copper-500 group-hover:bg-copper-600'
                          : 'bg-espresso-200/50'
                      }`}
                      style={{
                        height: item.payout > 0 ? `${Math.max(20, heightPercent)}%` : '6%'
                      }}
                    />
                    <span className="text-[9px] text-espresso-600 font-mono mt-1">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tax Consideration Pill */}
          <div className="p-3.5 rounded-xl bg-champagne-500/20 border border-champagne-500/40 text-xs text-espresso-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-espresso-950">
              <Info className="w-3.5 h-3.5 text-copper-600" />
              <span>Indian Tax Structure Note:</span>
            </div>
            <p className="text-[11px] text-espresso-700 leading-relaxed">
              Alternative asset payouts are typically classified into <strong>Dividend</strong> (often tax-exempt under Section 10(23FD)), <strong>Interest</strong> (taxed at slab rates), and <strong>Return of Capital</strong> (RoC - deferred capital gains until initial acquisition cost is amortized).
            </p>
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
