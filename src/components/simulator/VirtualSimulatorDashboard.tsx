import React, { useState } from 'react';
import {
  Sliders,
  DollarSign,
  TrendingUp,
  Layers,
  History,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  Calendar,
  Wallet,
  Building2,
  PieChart
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface VirtualSimulatorDashboardProps {
  userId?: string;
  userEmail?: string;
  onOpenAuthModal?: () => void;
  onBackToHome?: () => void;
  onOpenExplore?: () => void;
}

interface SimulatedTransaction {
  id: string;
  assetName: string;
  category: string;
  amount: number;
  yieldRate: number;
  timestamp: string;
  type: 'BUY' | 'REALLOCATE';
}

const INITIAL_TRANSACTIONS: SimulatedTransaction[] = [
  {
    id: 'tx-01',
    assetName: 'Embassy Office Parks REIT',
    category: 'Commercial REIT',
    amount: 300000,
    yieldRate: 8.2,
    timestamp: '24 Oct 2026, 14:30',
    type: 'BUY'
  },
  {
    id: 'tx-02',
    assetName: 'India Grid Trust (IndiGrid) InvIT',
    category: 'Infrastructure InvIT',
    amount: 250000,
    yieldRate: 10.4,
    timestamp: '24 Oct 2026, 11:15',
    type: 'BUY'
  },
  {
    id: 'tx-03',
    assetName: 'Tata Capital NCD (AAA Listed)',
    category: 'Corporate Bonds',
    amount: 100000,
    yieldRate: 8.85,
    timestamp: '23 Oct 2026, 16:45',
    type: 'BUY'
  }
];

export const VirtualSimulatorDashboard: React.FC<VirtualSimulatorDashboardProps> = ({
  userId,
  userEmail,
  onOpenAuthModal,
  onBackToHome,
  onOpenExplore
}) => {
  // Sandbox Capital state (Default ₹10,00,000)
  const initialCapital = 1000000;
  const [transactions, setTransactions] = useState<SimulatedTransaction[]>(INITIAL_TRANSACTIONS);

  // Playground order input state
  const [selectedAsset, setSelectedAsset] = useState('Mindspace Business Parks REIT');
  const [selectedCategory, setSelectedCategory] = useState('REIT');
  const [simulatedYield, setSimulatedYield] = useState(7.8);
  const [orderAmount, setOrderAmount] = useState(150000);
  const [executionFeedback, setExecutionFeedback] = useState<string | null>(null);

  // Computed Portfolio Metrics
  const totalAllocated = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const remainingCash = Math.max(0, initialCapital - totalAllocated);
  const weightedAnnualYield = transactions.length > 0
    ? transactions.reduce((acc, tx) => acc + (tx.amount * tx.yieldRate), 0) / (totalAllocated || 1)
    : 0;
  const projectedAnnualIncome = (totalAllocated * weightedAnnualYield) / 100;
  const projectedMonthlyIncome = projectedAnnualIncome / 12;

  // Simulator Engine Buy Action
  const handleExecuteSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderAmount <= 0) return;

    if (orderAmount > remainingCash) {
      alert(`Simulation capital exceeded. You have ₹${remainingCash.toLocaleString('en-IN')} unallocated sandbox capital remaining.`);
      return;
    }

    const newTx: SimulatedTransaction = {
      id: `tx-${Date.now().toString(36)}`,
      assetName: selectedAsset,
      category: selectedCategory,
      amount: orderAmount,
      yieldRate: simulatedYield,
      timestamp: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      type: 'BUY'
    };

    setTransactions([newTx, ...transactions]);
    setExecutionFeedback(`Allocated ₹${orderAmount.toLocaleString('en-IN')} into ${selectedAsset} at ${simulatedYield}% target yield.`);
    setTimeout(() => setExecutionFeedback(null), 4000);
  };

  const handleResetSandbox = () => {
    if (confirm('Reset your sandbox virtual portfolio back to default ₹10,00,000 initial balance?')) {
      setTransactions(INITIAL_TRANSACTIONS);
    }
  };

  return (
    <div className="w-full bg-sand min-h-screen pt-28 pb-20 text-espresso-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Breadcrumb & User Session Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-espresso-600">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                onBackToHome?.();
              }}
              className="hover:text-copper-600 cursor-pointer transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <span className="text-copper-700">Virtual Portfolio Simulator</span>
          </div>

          {/* User Auth Context Pill */}
          <div className="flex items-center gap-2">
            {userId ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-champagne-500/50 shadow-xs text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-espresso-950 truncate max-w-[160px] sm:max-w-none">
                  {userEmail || 'Authenticated User'}
                </span>
                <span className="text-[10px] text-copper-700 font-mono bg-copper-500/15 px-1.5 py-0.5 rounded">
                  {userId.substring(0, 10)}...
                </span>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-copper-500/10 hover:bg-copper-500/20 border border-copper-500/30 text-xs font-bold text-copper-800 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sign in with Google to Sync Virtual Portfolio</span>
              </button>
            )}
          </div>
        </div>

        {/* Header Hero Banner */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-espresso-900 via-espresso-950 to-espresso-900 text-sand shadow-glass-lg border border-champagne-500/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-copper-500/20 border border-copper-500/40 text-copper-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Sliders className="w-3.5 h-3.5 text-copper-400" />
                <span>Phase 7 Simulator Engine Mount Slot</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                WelNex Virtual Portfolio Simulator
              </h1>
              <p className="text-xs sm:text-sm text-sand-300 mt-2 leading-relaxed">
                Test asset allocation strategies, model risk-adjusted cashflows, and simulate quarterly distribution yields across Indian REITs, InvITs, and Alternative Credit with zero financial risk.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-sand-400">
                Sandbox Capital Base
              </span>
              <div className="text-3xl sm:text-4xl font-display font-extrabold text-copper-400">
                ₹{initialCapital.toLocaleString('en-IN')}
              </div>
              <button
                onClick={handleResetSandbox}
                className="inline-flex items-center gap-1.5 text-xs text-sand-300 hover:text-white transition-colors cursor-pointer mt-1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-copper-400" />
                <span>Reset Sandbox Capital</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. REAL-TIME PORTFOLIO BALANCE SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Card 1: Total Allocated */}
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-champagne-500/50 shadow-glass-sm">
            <div className="flex items-center justify-between text-espresso-600 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Active Assets</span>
              <Layers className="w-4 h-4 text-copper-600" />
            </div>
            <div className="text-2xl font-display font-extrabold text-espresso-950">
              ₹{totalAllocated.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between text-[11px] text-espresso-600 mt-2 pt-2 border-t border-champagne-500/30">
              <span>{transactions.length} Holdings</span>
              <span className="text-emerald-700 font-bold">
                {((totalAllocated / initialCapital) * 100).toFixed(0)}% Deployed
              </span>
            </div>
          </div>

          {/* Card 2: Liquid Unallocated Cash */}
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-champagne-500/50 shadow-glass-sm">
            <div className="flex items-center justify-between text-espresso-600 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Liquid Reserves</span>
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-display font-extrabold text-espresso-950">
              ₹{remainingCash.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between text-[11px] text-espresso-600 mt-2 pt-2 border-t border-champagne-500/30">
              <span>Available to Simulate</span>
              <span className="text-copper-700 font-bold">
                {((remainingCash / initialCapital) * 100).toFixed(0)}% Liquid
              </span>
            </div>
          </div>

          {/* Card 3: Weighted Annual Yield */}
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-champagne-500/50 shadow-glass-sm">
            <div className="flex items-center justify-between text-espresso-600 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Blended Yield (p.a.)</span>
              <TrendingUp className="w-4 h-4 text-copper-600" />
            </div>
            <div className="text-2xl font-display font-extrabold text-copper-600">
              {weightedAnnualYield.toFixed(2)}%
            </div>
            <div className="flex items-center justify-between text-[11px] text-espresso-600 mt-2 pt-2 border-t border-champagne-500/30">
              <span>SEBI-Regulated NDCF</span>
              <span className="text-emerald-700 font-bold">+2.4% vs FD</span>
            </div>
          </div>

          {/* Card 4: Projected Monthly Cashflow */}
          <div className="p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-champagne-500/50 shadow-glass-sm">
            <div className="flex items-center justify-between text-espresso-600 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider">Projected Cashflow</span>
              <DollarSign className="w-4 h-4 text-copper-600" />
            </div>
            <div className="text-2xl font-display font-extrabold text-espresso-950">
              ₹{Math.round(projectedMonthlyIncome).toLocaleString('en-IN')}
              <span className="text-xs font-normal text-espresso-600"> / mo</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-espresso-600 mt-2 pt-2 border-t border-champagne-500/30">
              <span>₹{Math.round(projectedAnnualIncome).toLocaleString('en-IN')} Annual</span>
              <span className="text-copper-700 font-bold">Quarterly Payouts</span>
            </div>
          </div>

        </div>

        {/* 2. MAIN EXECUTION PLAYGROUND & TRANSACTION HISTORY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: EXECUTION PLAYGROUND (Ready for Custom Simulator Engine) */}
          <div className="lg:col-span-5 bg-white/75 backdrop-blur-md border border-champagne-500/50 rounded-3xl p-6 sm:p-7 shadow-glass-md">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-champagne-500/30">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display text-espresso-950">
                  Simulation Execution Playground
                </h3>
                <p className="text-xs text-espresso-600">
                  Select an asset class to simulate capital allocation.
                </p>
              </div>
              <Play className="w-5 h-5 text-copper-600" />
            </div>

            {executionFeedback && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{executionFeedback}</span>
              </div>
            )}

            <form onSubmit={handleExecuteSimulation} className="space-y-4 text-xs">
              
              {/* Asset Class Selector */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-espresso-800 mb-1.5">
                  Asset Class
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'REITs', val: 'REIT', defaultYield: 7.8, defaultAsset: 'Mindspace Business Parks REIT' },
                    { label: 'InvITs', val: 'InvIT', defaultYield: 10.4, defaultAsset: 'PowerGrid Infrastructure InvIT' },
                    { label: 'Bonds / Debt', val: 'Debt', defaultYield: 9.25, defaultAsset: 'Shriram Finance Senior NCD' }
                  ].map((cat) => {
                    const isSelected = selectedCategory === cat.val;
                    return (
                      <button
                        type="button"
                        key={cat.val}
                        onClick={() => {
                          setSelectedCategory(cat.val);
                          setSimulatedYield(cat.defaultYield);
                          setSelectedAsset(cat.defaultAsset);
                        }}
                        className={`p-2.5 rounded-xl font-bold border transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-copper-500 text-white border-copper-600 shadow-xs'
                            : 'bg-white hover:bg-[#FAF5EE] text-espresso-800 border-champagne-500/40'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Alternative Asset */}
              <div>
                <label className="block font-bold uppercase tracking-wider text-espresso-800 mb-1.5">
                  Target Alternative Asset
                </label>
                <select
                  value={selectedAsset}
                  onChange={(e) => {
                    setSelectedAsset(e.target.value);
                    if (e.target.value.includes('Embassy')) setSimulatedYield(8.2);
                    else if (e.target.value.includes('Brookfield')) setSimulatedYield(8.4);
                    else if (e.target.value.includes('Nexus')) setSimulatedYield(9.8);
                    else if (e.target.value.includes('IndiGrid')) setSimulatedYield(10.4);
                    else if (e.target.value.includes('PowerGrid')) setSimulatedYield(9.6);
                    else setSimulatedYield(8.9);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-champagne-500/50 text-espresso-950 font-medium focus:outline-none focus:ring-2 focus:ring-copper-500/30"
                >
                  <option value="Mindspace Business Parks REIT">Mindspace Business Parks REIT (7.8% Yield)</option>
                  <option value="Brookfield India Real Estate Trust">Brookfield India REIT (8.4% Yield)</option>
                  <option value="Nexus Select Trust REIT">Nexus Select Trust Retail REIT (9.8% Yield)</option>
                  <option value="PowerGrid Infrastructure InvIT">PowerGrid InvIT (9.6% Yield)</option>
                  <option value="IndiGrid Transmission InvIT">IndiGrid Transmission Trust (10.4% Yield)</option>
                  <option value="Tata Capital Senior AAA NCD">Tata Capital AAA Secured NCD (8.85% Yield)</option>
                </select>
              </div>

              {/* Allocation Ticket Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold uppercase tracking-wider text-espresso-800">
                    Simulated Allocation Ticket
                  </label>
                  <span className="text-copper-700 font-extrabold font-mono text-sm">
                    ₹{orderAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max={Math.min(500000, remainingCash || 500000)}
                  step="25000"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(Number(e.target.value))}
                  disabled={remainingCash <= 0}
                  className="w-full accent-copper-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-espresso-500 mt-1">
                  <span>Min: ₹25,000</span>
                  <span>Max: ₹{Math.min(500000, remainingCash).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Instant Projected Output Preview */}
              <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-champagne-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-espresso-600">Simulated Target Yield:</span>
                  <span className="font-bold text-copper-700">{simulatedYield}% p.a.</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-espresso-600">Annual Return (Pre-tax):</span>
                  <span className="font-bold text-espresso-950 font-mono">
                    +₹{Math.round((orderAmount * simulatedYield) / 100).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-espresso-600">Estimated Monthly Cashflow:</span>
                  <span className="font-bold text-emerald-700 font-mono">
                    +₹{Math.round(((orderAmount * simulatedYield) / 100) / 12).toLocaleString('en-IN')} / mo
                  </span>
                </div>
              </div>

              {/* Submit / Allocate */}
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={remainingCash <= 0 || orderAmount <= 0}
                icon={<ArrowUpRight className="w-4 h-4" />}
                iconPosition="right"
                className="w-full font-bold uppercase tracking-wider py-3 shadow-md shadow-copper-500/20 cursor-pointer"
              >
                {remainingCash <= 0 ? 'Sandbox Fully Allocated' : 'Execute Simulated Allocation'}
              </Button>

            </form>
          </div>

          {/* RIGHT: TRANSACTION HISTORY CARD SLOTS & HOLDINGS LEDGER */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Transaction Ledger Card */}
            <div className="bg-white/75 backdrop-blur-md border border-champagne-500/50 rounded-3xl p-6 sm:p-7 shadow-glass-md">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-champagne-500/30">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-copper-600" />
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-display text-espresso-950">
                      Simulated Transaction History
                    </h3>
                    <p className="text-xs text-espresso-600">
                      Real-time ledger of simulated buys and NDCF distribution credits.
                    </p>
                  </div>
                </div>

                <Badge variant="outline" size="xs">
                  {transactions.length} Total Orders
                </Badge>
              </div>

              {/* Transaction Cards List */}
              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 rounded-2xl bg-white border border-champagne-500/40 hover:border-copper-500/50 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-copper-500/10 border border-copper-500/30 flex items-center justify-center text-copper-700 shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-espresso-950">
                            {tx.assetName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-champagne-500/20 text-copper-800 font-semibold">
                            {tx.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-espresso-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-copper-600" />
                            {tx.timestamp}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">
                            {tx.yieldRate}% Target Yield
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-champagne-500/30 sm:pl-4">
                      <span className="text-sm font-extrabold text-espresso-950 block font-mono">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mt-0.5">
                        Active Simulation
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Exploration Link */}
              <div className="mt-5 pt-4 border-t border-champagne-500/30 flex items-center justify-between text-xs">
                <span className="text-espresso-600">Want to test specific verified assets?</span>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    onOpenExplore?.();
                  }}
                  className="font-bold text-copper-700 hover:text-copper-800 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Browse Full Catalogue</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Asset Allocation Model Guide */}
            <div className="p-5 rounded-3xl bg-[#FAF5EE] border border-champagne-500/50 shadow-glass-sm flex items-start gap-3.5">
              <PieChart className="w-5 h-5 text-copper-600 shrink-0 mt-0.5" />
              <div className="text-xs text-espresso-700 leading-relaxed">
                <span className="font-bold text-espresso-950 block mb-1">
                  Institutional Allocation Methodology:
                </span>
                WelNex suggests a defensive barbell portfolio structure: 40% Commercial Office REITs (steady rental yields), 35% Regulated Infrastructure InvITs (utility-grade NDCF), and 25% Senior Performing Credit & Gold to preserve capital against equity volatility.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
