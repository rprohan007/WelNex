import React, { useState, useMemo } from 'react';
import { useInvestmentsData } from '../../hooks/useInvestmentsData';
import { useMarketData } from '../../hooks/useMarketData';
import type { InvestmentItem } from '../../types';
import { AssetSelectionDrawer } from './AssetSelectionDrawer';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Plus,
  X,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Layers,
  Building2,
  Landmark,
  Scale,
  Award,
  Clock,
  Coins,
  Percent,
  CheckCircle2,
  FileText,
  Calendar,
  Radio
} from 'lucide-react';


interface SideBySideComparisonMatrixProps {
  initialSelectedIds?: string[];
  onViewInvestmentDetail?: (id: string) => void;
  onOpenWaitlist?: () => void;
  isStandalonePage?: boolean;
}

export const SideBySideComparisonMatrix: React.FC<SideBySideComparisonMatrixProps> = ({
  initialSelectedIds = [
    'embassy-office-parks-reit',
    'indigrid-invit',
    'tata-capital-ncd-aaa',
    'grip-ev-lease-sdi'
  ],
  onViewInvestmentDetail,
  onOpenWaitlist,
  isStandalonePage = false
}) => {
  const { investments } = useInvestmentsData();
  const { quotes, lastChangedTicker } = useMarketData();

  // Selected Investment IDs (Max 4)
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  // Selected Investments Objects
  const selectedInvestments = useMemo(() => {
    return selectedIds
      .map((id) => investments.find((item) => item.id === id))
      .filter((item): item is InvestmentItem => item !== undefined);
  }, [selectedIds, investments]);

  // Remove single item
  const handleRemoveItem = (id: string) => {
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  // Add single item
  const handleAddItem = (id: string) => {
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  // Clear All
  const handleClearAll = () => {
    setSelectedIds([]);
  };

  // Apply Preset
  const handleApplyPreset = (presetIds: string[]) => {
    setSelectedIds(presetIds.slice(0, 4));
  };

  // Helper to extract numerical yield for comparison
  const parseYieldValue = (yieldStr: string): number => {
    const match = yieldStr.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Metric standout analysis for highlighting differences
  const metricHighlights = useMemo(() => {
    if (selectedInvestments.length <= 1) return { highestYieldId: null, lowestMinEntryId: null, mostLiquidId: null };

    let highestYield = -1;
    let highestYieldId: string | null = null;

    let lowestMin = Infinity;
    let lowestMinEntryId: string | null = null;

    let mostLiquidId: string | null = null;

    selectedInvestments.forEach((inv) => {
      const yVal = parseYieldValue(inv.indicativeYield);
      if (yVal > highestYield) {
        highestYield = yVal;
        highestYieldId = inv.id;
      }

      if (inv.minInvestmentNumeric < lowestMin) {
        lowestMin = inv.minInvestmentNumeric;
        lowestMinEntryId = inv.id;
      }

      if (inv.tenure.toLowerCase().includes('perpetual') || inv.liquidityProfile.toLowerCase().includes('high')) {
        if (!mostLiquidId) mostLiquidId = inv.id;
      }
    });

    return { highestYieldId, lowestMinEntryId, mostLiquidId };
  }, [selectedInvestments]);

  // Empty slots calculation
  const emptySlotCount = Math.max(0, 4 - selectedInvestments.length);

  return (
    <section id="compare" className={`w-full ${isStandalonePage ? 'pt-28 pb-20' : 'py-20'} bg-sand text-espresso-950`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-champagne-500/30">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="copper" size="sm" withDot>
                Phase 4 Benchmark Suite
              </Badge>
              <span className="text-xs font-semibold text-espresso-700">
                Institutional Metric Matrix
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-espresso-950 tracking-tight">
              Compare Alternative Investments
            </h2>
            <p className="text-sm sm:text-base text-espresso-700 mt-2.5 max-w-2xl leading-relaxed">
              Evaluate real commercial REITs, infrastructure InvITs, senior secured debt, and alternative credit side-by-side across yields, tenures, lock-ins, fee models, and regulatory protection.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Highlight Differences Toggle */}
            <button
              onClick={() => setHighlightDifferences(!highlightDifferences)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                highlightDifferences
                  ? 'bg-champagne-500/30 text-espresso-950 border-champagne-500 shadow-sm'
                  : 'bg-white/70 text-espresso-600 border-champagne-500/30 hover:border-champagne-500'
              }`}
              title="Highlight key metric differences across selected columns in warm champagne (#E2C8A2)"
            >
              <Sparkles className="w-3.5 h-3.5 text-copper-600" />
              <span>Highlight Differences</span>
              <span
                className={`ml-1 w-2 h-2 rounded-full ${
                  highlightDifferences ? 'bg-copper-600' : 'bg-espresso-300'
                }`}
              />
            </button>

            {/* Add Asset Trigger */}
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              iconPosition="left"
              onClick={() => setIsDrawerOpen(true)}
              className="text-xs font-bold"
            >
              Add Investment ({selectedInvestments.length}/4)
            </Button>

            {/* Clear All */}
            {selectedInvestments.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* REGULATORY DISCLAIMER BOUNDARY (Explicit Requirement) */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md flex items-start gap-3.5 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-[13px] text-espresso-800 leading-relaxed">
            <strong className="font-bold text-amber-900 block mb-0.5">
              WelNex Objective Educational Boundary & Non-Advisory Notice:
            </strong>
            WelNex operates strictly as an objective financial data and analytics interface. We do{' '}
            <strong className="underline">not</strong> guarantee future returns, endorse any sponsor, present any instrument as universally superior, or offer personalized investment advice. All comparisons are derived from statutory public disclosures and indicative market metrics. Always conduct independent diligence and consult a SEBI-registered Investment Advisor (RIA) prior to committing capital.
          </div>
        </div>

        {/* COMPARISON MATRIX CONTAINER */}
        {selectedInvestments.length === 0 ? (
          /* Empty Matrix State */
          <div className="p-12 sm:p-16 rounded-3xl bg-white/70 border border-dashed border-champagne-500/50 text-center space-y-4 max-w-xl mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-copper-500/10 text-copper-600 flex items-center justify-center mx-auto">
              <Scale className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-display font-bold text-espresso-950">
                No Investments Selected for Comparison
              </h3>
              <p className="text-xs sm:text-sm text-espresso-600">
                Pick up to 4 alternative investments to compare metrics side-by-side or choose a curated institutional preset.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsDrawerOpen(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Open Selection Drawer
              </Button>
            </div>
          </div>
        ) : (
          /* Multi-column Comparison Table */
          <div className="relative rounded-3xl overflow-hidden border border-champagne-500/40 bg-white/60 backdrop-blur-xl shadow-glass-md">
            
            <div className="overflow-x-auto pb-4">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  {/* Row 1: Header / Asset Cards */}
                  <tr className="border-b border-champagne-500/30 bg-sand-100/90">
                    {/* Metric Label Column Header */}
                    <th className="w-[200px] min-w-[200px] p-5 align-top text-xs font-bold text-espresso-600 uppercase tracking-wider">
                      <div className="flex items-center gap-1.5 text-copper-700">
                        <Scale className="w-4 h-4" />
                        <span>Core Metric</span>
                      </div>
                      <span className="text-[11px] font-normal text-espresso-500 normal-case block mt-1">
                        Comparing {selectedInvestments.length} of 4 slots
                      </span>
                    </th>

                    {/* Active Columns */}
                    {selectedInvestments.map((inv) => {
                      const isLive = inv.priceMode === 'LIVE_MARKET' || (!inv.priceMode && ['REIT', 'InvIT'].includes(inv.category));
                      const ticker = (inv.symbolTicker || inv.symbol || '').toUpperCase();
                      const quote = quotes[ticker];
                      const isPulsing = lastChangedTicker === ticker;
                      const livePrice = quote ? quote.price : (inv.currentPrice || inv.minInvestmentNumeric || 0);
                      const changePct = quote ? quote.priceChangePercent24h : (inv.priceChangePercent24h ?? 0);
                      const isPos = changePct >= 0;

                      return (
                        <th
                          key={inv.id}
                          className="w-[260px] min-w-[240px] max-w-[280px] p-4 sm:p-5 align-top border-l border-champagne-500/25 relative"
                        >
                          <div className="flex flex-col justify-between h-full space-y-3">
                            {/* Top Row: Dual-Mode Badge + Close X */}
                            <div className="flex items-start justify-between gap-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {isLive ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black text-emerald-800 bg-emerald-500/15 border border-emerald-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-beacon" />
                                    LIVE • NSE
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-copper-800 bg-champagne-500/25 border border-champagne-500/40">
                                    <Calendar className="w-2.5 h-2.5 text-copper-700" />
                                    {inv.yieldPayoutFrequency || 'Quarterly'} NAV
                                  </span>
                                )}
                                <span className="font-mono text-[9px] font-bold text-copper-700 bg-copper-500/10 px-1.5 py-0.5 rounded border border-copper-500/20">
                                  {inv.category}
                                </span>
                              </div>

                              <button
                                onClick={() => handleRemoveItem(inv.id)}
                                className="p-1 rounded-lg text-espresso-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                title={`Remove ${inv.name} from comparison`}
                                aria-label={`Remove ${inv.name}`}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Asset Name & Sponsor */}
                            <div>
                              <h4 className="font-display font-extrabold text-base text-espresso-950 leading-tight">
                                {inv.name}
                              </h4>
                              <p className="text-xs text-espresso-600 font-medium mt-1">
                                Sponsor: <span className="text-espresso-800 font-semibold">{inv.sponsor}</span>
                              </p>
                            </div>

                            {/* Dual-Mode Pricing & Yield Banner */}
                            <div className="pt-2 border-t border-champagne-500/20 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-espresso-500 block uppercase font-bold">
                                  {isLive ? 'Unit Price' : 'NAV Valuation'}
                                </span>
                                <span className={`font-mono font-black text-sm price-tick-transition ${
                                  isPulsing 
                                    ? isPos ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold' 
                                    : 'text-espresso-950'
                                }`}>
                                  ₹{livePrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-espresso-500 block uppercase font-bold">Yield</span>
                                <span className="font-mono font-black text-sm text-copper-600">
                                  {inv.indicativeYield}
                                </span>
                              </div>
                            </div>
                          </div>
                        </th>
                      );
                    })}

                    {/* Vacant Slot Columns */}
                    {Array.from({ length: emptySlotCount }).map((_, index) => (
                      <th
                        key={`empty-${index}`}
                        className="w-[240px] min-w-[220px] p-5 align-middle border-l border-champagne-500/25 text-center bg-sand-50/50"
                      >
                        <button
                          onClick={() => setIsDrawerOpen(true)}
                          className="w-full h-36 rounded-2xl border-2 border-dashed border-champagne-500/50 hover:border-copper-500 hover:bg-copper-500/5 flex flex-col items-center justify-center p-4 transition-all group cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-full bg-champagne-500/20 group-hover:bg-copper-500 group-hover:text-white text-copper-700 flex items-center justify-center transition-all mb-2">
                            <Plus className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-espresso-800 group-hover:text-copper-700">
                            Add Investment Slot {selectedInvestments.length + index + 1}
                          </span>
                          <span className="text-[10px] text-espresso-500 mt-0.5">
                            Auto-suggest search
                          </span>
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-champagne-500/20 text-xs sm:text-[13px]">
                  
                  {/* METRIC 0: Pricing Mode & Architecture */}
                  <tr className="hover:bg-copper-500/5 transition-colors bg-sand-50/40">
                    <td className="p-4 sm:p-5 font-bold text-espresso-900 bg-sand-50/70">
                      <div className="flex items-center gap-1.5 text-copper-700">
                        <Radio className="w-3.5 h-3.5 text-copper-600" />
                        <span>Pricing Mode & Feed</span>
                      </div>
                    </td>
                    {selectedInvestments.map((inv) => {
                      const isLive = inv.priceMode === 'LIVE_MARKET' || (!inv.priceMode && ['REIT', 'InvIT'].includes(inv.category));
                      return (
                        <td key={inv.id} className="p-4 sm:p-5 border-l border-champagne-500/20">
                          {isLive ? (
                            <div>
                              <span className="font-bold text-emerald-800 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-beacon" />
                                LIVE_MARKET (NSE/BSE Listed)
                              </span>
                              <span className="text-[11px] text-espresso-600 block mt-0.5">
                                Real-time tick feed • Daily exchange liquidity
                              </span>
                            </div>
                          ) : (
                            <div>
                              <span className="font-bold text-copper-800 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-copper-700" />
                                PERIODIC_NAV (Unlisted Vehicle)
                              </span>
                              <span className="text-[11px] text-espresso-600 block mt-0.5">
                                Quarterly independent audited valuation
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                    {Array.from({ length: emptySlotCount }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-champagne-500/20 bg-sand-50/30" />
                    ))}
                  </tr>

                  {/* METRIC 0B: Real-time Price Shift & Valuation Date */}
                  <tr className="hover:bg-copper-500/5 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-espresso-900 bg-sand-50/70">
                      <div className="flex items-center gap-1.5 text-espresso-800">
                        <TrendingUp className="w-3.5 h-3.5 text-copper-600" />
                        <span>Price Shift / Valuation Cycle</span>
                      </div>
                    </td>
                    {selectedInvestments.map((inv) => {
                      const isLive = inv.priceMode === 'LIVE_MARKET' || (!inv.priceMode && ['REIT', 'InvIT'].includes(inv.category));
                      const ticker = (inv.symbolTicker || inv.symbol || '').toUpperCase();
                      const quote = quotes[ticker];
                      const changeVal = quote ? quote.priceChange24h : (inv.priceChange24h ?? 0);
                      const changePct = quote ? quote.priceChangePercent24h : (inv.priceChangePercent24h ?? 0);
                      const isPos = changeVal >= 0;

                      return (
                        <td key={inv.id} className="p-4 sm:p-5 border-l border-champagne-500/20">
                          {isLive ? (
                            <div className={`font-mono font-bold flex items-center gap-1 ${
                              isPos ? 'text-emerald-700' : 'text-rose-700'
                            }`}>
                              {isPos ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                              <span>{isPos ? '+' : ''}₹{Math.abs(changeVal).toFixed(2)} ({isPos ? '+' : ''}{changePct.toFixed(2)}%)</span>
                            </div>
                          ) : (
                            <div>
                              <span className="font-semibold text-espresso-950 font-mono">
                                Valued: {inv.lastValuationPeriod || 'Q3 2026'}
                              </span>
                              <span className="text-[11px] text-copper-700 block mt-0.5">
                                Target Yield: {inv.indicativeYield}
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                    {Array.from({ length: emptySlotCount }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-champagne-500/20 bg-sand-50/30" />
                    ))}
                  </tr>
                  
                  {/* METRIC 1: Asset Category & Sub-category */}
                  <tr className="hover:bg-copper-500/5 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-espresso-900 bg-sand-50/70">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-copper-600" />
                        <span>Category & Sub-category</span>
                      </div>
                    </td>
                    {selectedInvestments.map((inv) => (
                      <td key={inv.id} className="p-4 sm:p-5 border-l border-champagne-500/20">
                        <span className="font-semibold text-espresso-950 block">
                          {inv.category}
                        </span>
                        <span className="text-xs text-espresso-600 block mt-0.5">
                          {inv.subCategory}
                        </span>
                      </td>
                    ))}
                    {Array.from({ length: emptySlotCount }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-champagne-500/20 bg-sand-50/30" />
                    ))}
                  </tr>

                  {/* METRIC 2: Provider / Sponsor */}
                  <tr className="hover:bg-copper-500/5 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-espresso-900 bg-sand-50/70">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-copper-600" />
                        <span>Provider / Sponsor</span>
                      </div>
                    </td>
                    {selectedInvestments.map((inv) => (
                      <td key={inv.id} className="p-4 sm:p-5 border-l border-champagne-500/20">
                        <span className="font-bold text-espresso-950 block">
                          {inv.sponsor}
                        </span>
                        <span className="text-[11px] text-espresso-600 line-clamp-2 mt-0.5">
                          {inv.sponsorProfile?.trackRecord || 'Institutional Sponsor'}
                        </span>
                      </td>
                    ))}
                    {Array.from({ length: emptySlotCount }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-champagne-500/20 bg-sand-50/30" />
                    ))}
                  </tr>

                  {/* METRIC 3: Minimum Investment Ticket Size */}
                  <tr className="hover:bg-copper-500/5 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-espresso-900 bg-sand-50/70">
                      <div className="flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-copper-600" />
                        <span>Min. Ticket Size</span>
                      </div>
                    </td>
                    {selectedInvestments.map((inv) => {
                      const isLowest = highlightDifferences && inv.id === metricHighlights.lowestMinEntryId;
                      return (
                        <td
                          key={inv.id}
                          className={`p-4 sm:p-5 border-l border-champagne-500/20 transition-all ${
                            isLowest ? 'bg-[#E2C8A2]/25 border-t border-b border-[#E2C8A2]' : ''
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-espresso-950 text-sm">
                              {inv.minInvestment}
                            </span>
                            {isLowest && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-copper-600 text-white">
                                Lowest Entry
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-espresso-600 block mt-0.5">
                            Numeric: ₹{inv.minInvestmentNumeric.toLocaleString('en-IN')}
                          </span>
                        </td>
                      );
                    })}
                    {Array.from({ length: emptySlotCount }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-champagne-500/20 bg-sand-50/30" />
                    ))}
                  </tr>

                  {/* METRIC 4: Indicative Distribution Yield / Return (%) */}
                  <tr className="hover:bg-copper-500/5 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-espresso-900 bg-sand-50/70">
                      <div className="flex items-center gap-1.5 text-copper-700">
                        <TrendingUp className="w-3.5 h-3.5 text-copper-600" />
                        <span>Indicative Yield / Return</span>
                      </div>
                    </td>
                    {selectedInvestments.map((inv) => {
                      const isHighest = highlightDifferences && inv.id === metricHighlights.highestYieldId;
                      return (
                        <td
                          key={inv.id}
                          className={`p-4 sm:p-5 border-l border-champagne-500/20 transition-all ${
                            isHighest ? 'bg-[#E2C8A2]/30 border-t border-b border-[#E2C8A2]' : ''
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-copper-600 text-base">
                              {inv.indicativeYield}
                            </span>
                            {isHighest && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#C16226] text-white">
                                Highest Yield
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-espresso-600 font-medium block mt-0.5">
                            {inv.yieldType} • {inv.distributionFrequency}
                          </span>
                        </td>
                      );
                    })}
                    {Array.from({ length: emptySlotCount }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-champagne-500/20 bg-sand-50/30" />
                    ))}
                  </tr>

                  {/* METRIC 5: Risk Rating (Low, Moderate, High, Very High) */}
                  <tr className="hover:bg-copper-500/5 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-espresso-900 bg-sand-50/70">
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-copper-600" />
                        <span>Risk Rating</span>
                      </div>
                    </td>
                    {selectedInvestments.map((inv) => (
                      <td key={inv.id} className="p-4 sm:p-5 border-l border-champagne-500/20">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                            inv.riskLevel === 'Low'
                              ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/30'
                              : inv.riskLevel === 'Moderate'
                              ? 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-800 border border-rose-500/30'
                          }`}
                        >
                          {inv.riskLevel} Risk
                        </span>
                        <span className="text-[11px] text-espresso-600 block mt-1 line-clamp-2">
                          {inv.riskFactors?.[0]?.title || 'Market & liquidity sensitivity'}
                        </span>
                      </td>
                    ))}
                    {Array.from({ length: emptySlotCount }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-champagne-500/20 bg-sand-50/30" />
                    ))}
                  </tr>


                  {/* METRIC 6: Investment Tenure & Lock-in Period */}
                  <tr className="hover:bg-copper-500/5 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-espresso-900 bg-sand-50/70">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-copper-600" />
                        <span>Tenure & Lock-in Period</span>
                      </div>
                    </td>
                    {selectedInvestments.map((inv) => (
                      <td key={inv.id} className="p-4 sm:p-5 border-l border-champagne-500/20">
                        <span className="font-semibold text-espresso-950 block">
                          Tenure: {inv.tenure}
                        </span>
                        <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-copper-700 bg-copper-500/10 px-2 py-0.5 rounded w-fit">
                          <span>Lock-in:</span>
                          <span className="font-bold">{inv.lockInPeriod || 'None'}</span>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: emptySlotCount }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-champagne-500/20 bg-sand-50/30" />
                    ))}
                  </tr>

                  {/* METRIC 7: Liquidity Profile (Listed/Exchange Traded vs Lock-in) */}
                  <tr className="hover:bg-copper-500/5 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-espresso-900 bg-sand-50/70">
                      <div className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-copper-600" />
                        <span>Liquidity Profile</span>
                      </div>
                    </td>
                    {selectedInvestments.map((inv) => {
                      const isMostLiquid = highlightDifferences && inv.id === metricHighlights.mostLiquidId;
                      return (
                        <td
                          key={inv.id}
                          className={`p-4 sm:p-5 border-l border-champagne-500/20 ${
                            isMostLiquid ? 'bg-[#E2C8A2]/15' : ''
                          }`}
                        >
                          <div className="font-medium text-espresso-800 text-xs leading-relaxed">
                            {inv.liquidityProfile}
                          </div>
                        </td>
                      );
                    })}
                    {Array.from({ length: emptySlotCount }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-champagne-500/20 bg-sand-50/30" />
                    ))}
                  </tr>

                  {/* METRIC 8: Fee Structures (Management Fee, Performance Fee/Carry) */}
                  <tr className="hover:bg-copper-500/5 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-espresso-900 bg-sand-50/70">
                      <div className="flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5 text-copper-600" />
                        <span>Fee Structure & Carry</span>
                      </div>
                    </td>
                    {selectedInvestments.map((inv) => (
                      <td key={inv.id} className="p-4 sm:p-5 border-l border-champagne-500/20">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-espresso-900">
                            {inv.feeStructure?.managementFee || '1.00% AMC Fee'}
                          </div>
                          {inv.feeStructure?.performanceFee && (
                            <div className="text-[11px] text-espresso-700">
                              Carry / Promote:{' '}
                              <strong className="text-copper-700 font-semibold">
                                {inv.feeStructure.performanceFee}
                              </strong>
                            </div>
                          )}
                          <div className="text-[10px] text-espresso-500 italic">
                            {inv.feeStructure?.summary}
                          </div>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: emptySlotCount }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-champagne-500/20 bg-sand-50/30" />
                    ))}
                  </tr>

                  {/* METRIC 9: Tax Considerations & Regulatory Oversight Body (SEBI / RBI) */}
                  <tr className="hover:bg-copper-500/5 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-espresso-900 bg-sand-50/70">
                      <div className="flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-copper-600" />
                        <span>Regulatory Body & Tax</span>
                      </div>
                    </td>
                    {selectedInvestments.map((inv) => (
                      <td key={inv.id} className="p-4 sm:p-5 border-l border-champagne-500/20">
                        {/* Regulatory Body Badge */}
                        <div className="mb-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand-200 border border-champagne-500/40 text-[11px] font-bold text-espresso-900">
                            <CheckCircle2 className="w-3 h-3 text-copper-600" />
                            {inv.regulatoryBody || (inv.sebiRegulated ? 'SEBI Regulated' : 'RBI / Sovereign')}
                          </span>
                        </div>
                        {/* Tax Considerations Summary */}
                        <p className="text-xs text-espresso-700 leading-relaxed">
                          {inv.taxImplications}
                        </p>
                      </td>
                    ))}
                    {Array.from({ length: emptySlotCount }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-champagne-500/20 bg-sand-50/30" />
                    ))}
                  </tr>

                  {/* ROW 10: Deep-Dive Action CTAs */}
                  <tr className="bg-sand-100/60">
                    <td className="p-4 sm:p-5 font-bold text-espresso-600 text-xs">
                      Detailed Prospectus
                    </td>
                    {selectedInvestments.map((inv) => (
                      <td key={inv.id} className="p-4 sm:p-5 border-l border-champagne-500/20">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                          onClick={() => onViewInvestmentDetail?.(inv.id)}
                          className="w-full text-xs font-bold py-2 shadow-sm"
                        >
                          View Deep Dive
                        </Button>
                      </td>
                    ))}
                    {Array.from({ length: emptySlotCount }).map((_, i) => (
                      <td key={i} className="p-4 border-l border-champagne-500/20 text-center">
                        <button
                          onClick={() => setIsDrawerOpen(true)}
                          className="text-xs font-semibold text-copper-700 hover:text-copper-900 underline"
                        >
                          + Add asset here
                        </button>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Table Footer Reassurance Note */}
            <div className="p-4 sm:p-5 bg-sand-100/95 border-t border-champagne-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-espresso-700">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-copper-600 shrink-0" />
                <span>
                  Metric differences highlighted in warm champagne (<code className="font-mono text-copper-800">#E2C8A2</code>). Derived directly from statutory offer memorandums and SEBI filings.
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="font-bold text-copper-700 hover:text-copper-900 cursor-pointer text-xs"
                >
                  Change Assets ({selectedInvestments.length}/4)
                </button>
                {onOpenWaitlist && (
                  <Button variant="outline" size="sm" onClick={onOpenWaitlist} className="text-xs font-bold">
                    Join Waitlist
                  </Button>
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Asset Selection Drawer */}
      <AssetSelectionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedIds={selectedIds}
        onSelectInvestment={handleAddItem}
        onRemoveInvestment={handleRemoveItem}
        onApplyPreset={handleApplyPreset}
      />
    </section>
  );
};
