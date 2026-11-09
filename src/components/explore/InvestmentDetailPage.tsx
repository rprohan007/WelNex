import React, { useState } from 'react';
import type { InvestmentItem } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useAssetLivePrice, useMarketData } from '../../hooks/useMarketData';
import { isNseListedAsset } from '../../services/marketPriceService';
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown,
  Coins, 
  Clock, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Users, 
  FileText, 
  Plus, 
  Check, 
  Calculator, 
  Info,
  Calendar,
  Share2,
  Scale,
  Image as ImageIcon,
  Zap,
  RefreshCw
} from 'lucide-react';

interface InvestmentDetailPageProps {
  investment: InvestmentItem;
  onBackToCatalogue: () => void;
  onToggleCompare: (id: string) => void;
  isComparing: boolean;
  onOpenWaitlist?: () => void;
  onNavigateToCompare?: (id: string) => void;
  onNavigateToCalculators?: () => void;
}

export const InvestmentDetailPage: React.FC<InvestmentDetailPageProps> = ({
  investment,
  onBackToCatalogue,
  onToggleCompare,
  isComparing,
  onOpenWaitlist,
  onNavigateToCompare,
  onNavigateToCalculators
}) => {
  const priceData = useAssetLivePrice(investment);
  const isNseLive = isNseListedAsset(investment) && (investment.isNseLive ?? priceData.isLiveMode);
  const { marketStatus, triggerTick, refreshMarketData } = useMarketData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Interactive mini simulation amount on this specific asset
  const [simAmount, setSimAmount] = useState<number>(100000);
  const [activePropertyTab, setActivePropertyTab] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshMarketData();
    setTimeout(() => setIsRefreshing(false), 600);
  };


  // Parse numerical yield for simulation calculator
  const yieldNumeric = parseFloat(investment.indicativeYield) || 8.0;
  const projectedAnnualIncome = Math.round((simAmount * yieldNumeric) / 100);
  const projectedQuarterlyIncome = Math.round(projectedAnnualIncome / 4);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="w-full bg-sand min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fadeIn text-left">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-champagne-500/30 pb-4">
        <button
          onClick={onBackToCatalogue}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-copper-700 hover:text-copper-800 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Explore Investments</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Compare Toggle */}
          <button
            onClick={() => onToggleCompare(investment.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isComparing
                ? 'bg-copper-500 text-sand-50 border-copper-600 shadow-sm'
                : 'bg-white/90 text-espresso-800 border-champagne-500/40 hover:border-copper-500/50 hover:text-copper-700'
            }`}
          >
            {isComparing ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Compare</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Compare</span>
              </>
            )}
          </button>

          {onNavigateToCompare && (
            <button
              onClick={() => onNavigateToCompare(investment.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-sand-200/90 text-espresso-800 border border-champagne-500/40 hover:border-copper-500/50 hover:text-copper-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Compare side-by-side with other alternatives"
            >
              <Scale className="w-3.5 h-3.5 text-copper-600" />
              <span>Compare Matrix</span>
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-white/90 border border-champagne-500/40 text-espresso-700 hover:text-copper-700 hover:bg-copper-500/10 transition-colors cursor-pointer"
            aria-label="Share investment"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {copiedLink && (
            <span className="text-[11px] font-semibold text-copper-700 animate-fadeIn">
              Link Copied!
            </span>
          )}
        </div>
      </div>


      {/* 1. HERO BANNER */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-white/85 border-2 border-champagne-500/50 shadow-glass-lg overflow-hidden mb-10">
        
        {/* Background Ambient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-copper-500/15 via-champagne-500/15 to-transparent rounded-bl-full pointer-events-none -z-10" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          
          {/* Left Hero Details */}
          <div className="max-w-3xl space-y-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-copper-500/15 text-copper-700 border border-copper-500/30">
                {investment.category} • {investment.subCategory}
              </span>

              {/* DUAL-MODE PRICING STATUS BADGE */}
              {isNseLive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black tracking-wider text-emerald-800 bg-emerald-500/15 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Live NSE Tick
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-copper-800 bg-champagne-500/25 border border-champagne-500/40">
                  <Calendar className="w-3 h-3 text-copper-700" />
                  {investment.yieldPayoutFrequency || 'Quarterly'} NAV Valuation
                </span>
              )}

              <Badge variant="copper" size="sm">
                {investment.regulatoryBadge}
              </Badge>

              {investment.accessModel === 'Direct Public' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-500/15 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  Direct Public (NSE/BSE)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-copper-800 bg-copper-500/15 border border-copper-500/30">
                  <ExternalLink className="w-3 h-3 text-copper-700" />
                  Verified Partner Access ({investment.partnerName})
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-espresso-950 tracking-tight">
                  {investment.name}
                </h1>
                {(investment.symbolTicker || investment.symbol) && (
                  <span className="font-mono text-xs sm:text-sm font-extrabold px-2.5 py-1 rounded-lg bg-sand-200 border border-champagne-500/40 text-espresso-800">
                    {investment.symbolTicker || investment.symbol}
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base font-semibold text-espresso-700">
                Sponsored & Managed by <strong className="text-espresso-950">{investment.sponsor}</strong>
              </p>
            </div>

            <p className="text-sm sm:text-base text-espresso-800 leading-relaxed max-w-2xl">
              {investment.tagline}
            </p>

            {/* DEDICATED REAL-TIME DUAL-MODE PRICING ENGINE WIDGET */}
            <div className={`p-4 rounded-2xl border transition-all duration-300 ${
              isNseLive 
                ? 'bg-gradient-to-r from-emerald-500/10 via-sand-50 to-copper-500/10 border-emerald-500/30' 
                : 'bg-sand-50/90 border-champagne-500/40'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Left Price Display */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-600">
                      {isNseLive ? 'Live NSE Market Price' : 'Assessed NAV Valuation'}
                    </span>
                    {isNseLive ? (
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-mono text-emerald-800 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded font-extrabold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live NSE Tick
                      </span>
                    ) : (
                      <span className="text-[9.5px] font-bold text-copper-800 bg-champagne-500/25 px-1.5 py-0.5 rounded">
                        Audited Periodic NAV
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-3 mt-1">
                    <span className={`text-2xl sm:text-3xl font-mono font-black price-tick-transition ${
                      priceData.isPulsing 
                        ? priceData.isPositive ? 'text-emerald-700' : 'text-rose-700'
                        : 'text-espresso-950'
                    }`}>
                      {isNseLive ? (investment.liveNsePriceFormatted || priceData.displayPrice) : priceData.displayPrice}
                    </span>

                    {/* 24h Dynamic Shift for Listed Assets */}
                    {isNseLive && (
                      <div className={`inline-flex items-center gap-1 text-sm font-mono font-bold price-tick-transition ${
                        priceData.isPositive ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {priceData.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span>{priceData.change24h}</span>
                        <span>({priceData.changePercent24h})</span>
                      </div>
                    )}

                    {!isNseLive && (
                      <span className="text-xs font-semibold text-copper-700">
                        Last Valued: {investment.lastValuationPeriod || 'Q3 2026'}
                      </span>
                    )}
                  </div>

                  {/* Live price string */}
                  {isNseLive && (
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-mono text-emerald-800 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{investment.nseLivePriceString || `${investment.liveNsePriceFormatted || priceData.displayPrice} / unit (NSE Live)`}</span>
                    </div>
                  )}

                  {/* High/Low Range bar for listed assets */}
                  {isNseLive && priceData.dayHigh && priceData.dayLow && (
                    <div className="mt-2 text-xs text-espresso-600 flex items-center gap-2 max-w-sm">
                      <span className="text-[10px] font-mono">L: ₹{priceData.dayLow.toFixed(2)}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-sand-300 overflow-hidden relative">
                        <div className="h-full bg-copper-500 rounded-full w-2/3" />
                      </div>
                      <span className="text-[10px] font-mono">H: ₹{priceData.dayHigh.toFixed(2)}</span>
                    </div>
                  )}

                  <span className="text-[10px] text-espresso-500 block mt-1">
                    {priceData.lastUpdatedText} • {priceData.source === 'LIVE_API' ? 'Direct Market API' : 'Market Sync Feed'}
                  </span>
                </div>

                {/* Right Interactive Controls */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-champagne-500/20">
                  {priceData.isLiveMode ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => triggerTick(investment.symbolTicker || investment.symbol)}
                          title="Simulate live tick fluctuation"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-copper-500/10 hover:bg-copper-500/20 text-copper-700 border border-copper-500/30 text-xs font-bold transition-all cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-copper-600" />
                          <span>Simulate Tick</span>
                        </button>

                        <button
                          onClick={handleManualRefresh}
                          disabled={isRefreshing}
                          title="Refresh live quote"
                          className="p-1.5 rounded-xl bg-white/90 hover:bg-sand-200 border border-champagne-500/40 text-espresso-700 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-copper-600' : ''}`} />
                        </button>
                      </div>
                      <span className="text-[10px] text-espresso-500 font-medium">
                        {marketStatus.statusText}
                      </span>
                    </>
                  ) : (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-copper-700 block">
                        Periodic Appraisal
                      </span>
                      <span className="text-xs text-espresso-700 font-semibold block mt-0.5">
                        Target Yield: {investment.indicativeYield}
                      </span>
                      <span className="text-[10px] text-espresso-500 block">
                        Independent Big 4 / SEBI Valuer
                      </span>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* Right Action Box: Partner/Execution CTA & Official Links */}
          <div className="lg:min-w-[280px] p-5 rounded-2xl bg-sand-100/90 border border-champagne-500/40 space-y-3.5 shadow-sm">
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-600 block">
              Execution Pathway
            </span>

            {investment.accessModel === 'Direct Public' ? (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-white border border-champagne-500/30 text-xs text-espresso-800">
                  <span className="font-bold block text-copper-700 mb-0.5">Trade 1 Unit on Exchange</span>
                  <span>Accessible via any SEBI-registered broker (Zerodha, Groww, AngelOne, ICICI Direct).</span>
                </div>
                {investment.officialLinks.exchangeUrl && (
                  <a
                    href={investment.officialLinks.exchangeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-copper-500 hover:bg-copper-600 text-sand-50 text-xs font-bold transition-colors shadow-sm shadow-copper-500/20"
                  >
                    <span>View Official Exchange Quote</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-white border border-champagne-500/30 text-xs text-espresso-800">
                  <span className="font-bold block text-copper-700 mb-0.5">Partner Syndication Access</span>
                  <span>Facilitated through verified partner custodian <strong>{investment.partnerName}</strong>.</span>
                </div>
                {investment.officialLinks.partnerUrl && (
                  <a
                    href={investment.officialLinks.partnerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-copper-500 hover:bg-copper-600 text-sand-50 text-xs font-bold transition-colors shadow-sm shadow-copper-500/20"
                  >
                    <span>Access Through Partner Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenWaitlist}
              className="w-full text-xs font-semibold"
            >
              Simulate in WelNex Sandbox
            </Button>
          </div>

        </div>

        {/* Primary Metrics Callout Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-8 mt-8 border-t border-champagne-500/30">
          
          {/* Metric 1: Current Price / NAV */}
          <div className="p-3 rounded-2xl bg-sand-50/80 border border-champagne-500/30">
            <span className="text-[10px] uppercase font-bold text-copper-700 flex items-center gap-1">
              <Coins className="w-3 h-3 text-copper-600" />
              <span>{priceData.isLiveMode ? 'Live Trading Price' : 'Assessed NAV'}</span>
            </span>
            <div className="text-base sm:text-lg font-mono font-black text-espresso-950 mt-1 truncate">
              {priceData.displayPrice}
            </div>
            <span className={`text-[9px] block truncate font-mono font-bold ${
              priceData.isLiveMode 
                ? priceData.isPositive ? 'text-emerald-700' : 'text-rose-700'
                : 'text-espresso-500'
            }`}>
              {priceData.isLiveMode ? `${priceData.change24h} (${priceData.changePercent24h})` : `Valued ${investment.lastValuationPeriod || 'Q3 2026'}`}
            </span>
          </div>

          {/* Metric 2: Indicative Yield */}
          <div className="p-3 rounded-2xl bg-sand-50/80 border border-champagne-500/30">
            <span className="text-[10px] uppercase font-bold text-copper-700 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-copper-600" />
              <span>Indicative Yield</span>
            </span>
            <div className="text-lg sm:text-xl font-mono font-black text-espresso-950 mt-1">
              {investment.indicativeYield}
            </div>
            <span className="text-[9px] text-espresso-500 block truncate">
              {investment.yieldType}
            </span>
          </div>

          {/* Metric 3: Minimum Investment */}
          <div className="p-3 rounded-2xl bg-sand-50/80 border border-champagne-500/30">
            <span className="text-[10px] uppercase font-bold text-espresso-600 flex items-center gap-1">
              <Coins className="w-3 h-3 text-espresso-500" />
              <span>Min. Investment</span>
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-espresso-950 mt-1 truncate flex items-center gap-1.5">
              {isNseLive ? (
                <>
                  <span>{investment.liveNsePriceFormatted || priceData.displayPrice}</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </>
              ) : (
                /* Admin Override Fallback: Preserves Admin CMS edited minimum ticket price for private fractional CRE */
                <span>{investment.minInvestment}</span>
              )}
            </div>
            <span className="text-[9px] text-espresso-500 block truncate">
              {isNseLive 
                ? '1 Unit on NSE/BSE' 
                : (investment.accessModel === 'Direct Public' ? '1 Unit Lot' : 'Curated Ticket')}
            </span>
          </div>

          {/* Metric 4: Tenure / Liquidity */}
          <div className="p-3 rounded-2xl bg-sand-50/80 border border-champagne-500/30">
            <span className="text-[10px] uppercase font-bold text-espresso-600 flex items-center gap-1">
              <Clock className="w-3 h-3 text-espresso-500" />
              <span>Tenure / Liquidity</span>
            </span>
            <div className="text-sm font-bold text-espresso-900 mt-1 truncate">
              {investment.tenure}
            </div>
            <span className="text-[9px] text-espresso-500 block truncate">
              {investment.accessModel === 'Direct Public' ? 'Daily T+1 Trading' : 'Holding Horizon'}
            </span>
          </div>

          {/* Metric 5: Payout Frequency */}
          <div className="p-3 rounded-2xl bg-sand-50/80 border border-champagne-500/30">
            <span className="text-[10px] uppercase font-bold text-espresso-600 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-espresso-500" />
              <span>Payout Frequency</span>
            </span>
            <div className="text-sm font-bold text-espresso-900 mt-1 truncate">
              {investment.yieldPayoutFrequency || investment.distributionFrequency || 'Quarterly'}
            </div>
            <span className="text-[9px] text-espresso-500 block truncate">
              Cash Flow Calendar
            </span>
          </div>

          {/* Metric 6: Risk Profile */}
          <div className="p-3 rounded-2xl bg-sand-50/80 border border-champagne-500/30">
            <span className="text-[10px] uppercase font-bold text-espresso-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-espresso-500" />
              <span>Risk Profile</span>
            </span>
            <div className="text-sm font-bold text-espresso-900 mt-1">
              {investment.riskLevel} Risk
            </div>
            <span className="text-[9px] text-espresso-500 block truncate">
              {investment.sebiRegulated ? 'SEBI Oversight' : 'Partner SPV'}
            </span>
          </div>

        </div>

      </div>

      {/* TWO COLUMN WORKSPACE: Overview & Interactive Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        
        {/* 2. OVERVIEW & STRATEGY */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard variant="elevated" className="p-6 sm:p-8 rounded-3xl border border-champagne-500/40 bg-white/80">
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-espresso-950 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-copper-600" />
              <span>Overview & Operational Narrative</span>
            </h2>
            <p className="text-sm text-espresso-800 leading-relaxed mb-6 font-medium">
              {investment.overview}
            </p>

            <h3 className="text-base font-display font-bold text-espresso-950 mb-2">
              Core Investment & Allocation Strategy
            </h3>
            <p className="text-xs sm:text-sm text-espresso-700 leading-relaxed mb-6">
              {investment.strategy}
            </p>

            {/* Strategic Metrics Callout */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-champagne-500/30">
              <div className="p-3 rounded-xl bg-sand-100/70 border border-champagne-500/30">
                <span className="text-[10px] uppercase font-bold text-espresso-500 block">Total Portfolio Scale</span>
                <span className="text-sm font-bold text-espresso-900">{investment.portfolioScale}</span>
              </div>
              <div className="p-3 rounded-xl bg-sand-100/70 border border-champagne-500/30">
                <span className="text-[10px] uppercase font-bold text-espresso-500 block">Reported Occupancy / Utilization</span>
                <span className="text-sm font-bold text-emerald-800">{investment.occupancy || '100%'}</span>
              </div>
            </div>

            {/* DYNAMIC CUSTOM FIELDS (Phase 6 Enhancement) */}
            {investment.customFields && investment.customFields.length > 0 && (
              <div className="pt-5 border-t border-champagne-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="copper" size="xs">
                    Custom Underwriting Metrics
                  </Badge>
                  <span className="text-xs font-bold text-espresso-900">
                    Sponsor Verified Specifications
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {investment.customFields.map((field, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-3 rounded-xl bg-sand-100/90 border border-champagne-500/40 shadow-xs"
                    >
                      <span className="text-[10px] uppercase font-bold text-espresso-600 block truncate">
                        {field.label}
                      </span>
                      <span className="text-sm font-mono font-extrabold text-copper-700 block mt-0.5 truncate">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Interactive Yield Calculator Widget */}
        <div className="lg:col-span-5">
          <GlassCard variant="elevated" className="p-6 sm:p-8 rounded-3xl border border-copper-500/40 bg-sand-50/90 shadow-copper-glow/10 space-y-5">
            <div className="flex items-center justify-between border-b border-champagne-500/30 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-copper-600" />
                <h3 className="font-display font-extrabold text-base text-espresso-950">
                  Simulate Cash Flow
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-copper-700 bg-copper-500/15 px-2 py-0.5 rounded">
                Indicative {investment.indicativeYield}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-espresso-800">
                <span>Simulated Capital Allocation:</span>
                <span className="font-mono text-sm font-extrabold text-copper-700">
                  ₹{simAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={25000}
                max={2500000}
                step={25000}
                value={simAmount}
                onChange={(e) => setSimAmount(Number(e.target.value))}
                className="w-full accent-copper-500 cursor-pointer h-2 bg-sand-300 rounded-lg"
              />

              <div className="flex justify-between text-[10px] text-espresso-500 font-mono">
                <span>₹25,000</span>
                <span>₹10,00,000</span>
                <span>₹25,00,000</span>
              </div>
            </div>

            {/* Projected Output Card */}
            <div className="p-4 rounded-2xl bg-white border border-champagne-500/40 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-left">
                <div>
                  <span className="text-[10px] uppercase font-bold text-espresso-500 block">
                    Quarterly Cash Flow
                  </span>
                  <div className="text-lg font-mono font-black text-copper-600">
                    +₹{projectedQuarterlyIncome.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[9px] text-espresso-500">Per Quarter</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-espresso-500 block">
                    Annual Cash Flow
                  </span>
                  <div className="text-lg font-mono font-black text-espresso-950">
                    +₹{projectedAnnualIncome.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[9px] text-espresso-500">Per Annum</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-copper-500/10 border border-copper-500/20 text-[10px] text-espresso-700 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-copper-700 shrink-0 mt-0.5" />
                <span>Cash flows are indicative distributions derived from historical sponsor payouts; actual future payouts vary based on operational performance.</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenWaitlist}
                className="w-full text-xs font-semibold py-2.5"
              >
                Add to Virtual Portfolio Sandbox
              </Button>

              {onNavigateToCalculators && (
                <button
                  onClick={onNavigateToCalculators}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-copper-700 bg-copper-500/10 hover:bg-copper-500/20 border border-copper-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Open Full Calculators Suite</span>
                </button>
              )}
            </div>
          </GlassCard>
        </div>


      </div>

      {/* 3. UNDERLYING ASSETS & PROPERTY MEDIA SHOWCASE */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="copper" size="xs">
                Tangible Physical Footprint
              </Badge>
              <span className="text-xs text-espresso-600 font-semibold">
                {investment.underlyingAssets?.length || 0} Key Asset Showcase
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-espresso-950">
              Underlying Physical Assets & Property Media
            </h2>
          </div>
          <span className="text-xs text-espresso-600 max-w-sm">
            Institutional alternatives derive cash flows from tangible real estate campuses, highways, solar panels, and commercial lease covenants.
          </span>
        </div>

        {/* Property Showcase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investment.underlyingAssets?.map((asset, idx) => (
            <GlassCard
              key={asset.id}
              variant="interactive"
              className={`p-5 rounded-3xl border-2 transition-all duration-200 bg-white/85 text-left flex flex-col justify-between ${
                activePropertyTab === idx
                  ? 'border-copper-500/70 shadow-copper-glow/20'
                  : 'border-champagne-500/40'
              }`}
              onClick={() => setActivePropertyTab(idx)}
            >
              <div>
                {/* Visual Media Header / Architecture Representation */}
                <div className={`w-full h-40 rounded-2xl bg-gradient-to-tr ${asset.imageAccent || 'from-copper-600/30 to-amber-700/20'} p-4 flex flex-col justify-between border border-champagne-500/30 relative overflow-hidden mb-4 shadow-inner`}>
                  
                  {/* Subtle Grid Watermark */}
                  <div className="absolute inset-0 bg-[radial-gradient(#4A2B1D_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/85 text-espresso-950 border border-champagne-500/40">
                      Asset 0{idx + 1}
                    </span>
                    {asset.valuationShare && (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-copper-500 text-sand-50 shadow-sm">
                        {asset.valuationShare}
                      </span>
                    )}
                  </div>

                  <div className="relative z-10">
                    <div className="w-8 h-8 rounded-xl bg-white/90 border border-champagne-500/40 flex items-center justify-center text-copper-600 mb-1.5 shadow-sm">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold text-espresso-950 drop-shadow-sm block">
                      {asset.type}
                    </span>
                  </div>
                </div>

                {/* Asset Title & Location */}
                <h3 className="text-base font-display font-extrabold text-espresso-950 mb-1 line-clamp-1">
                  {asset.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-espresso-600 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-copper-600 shrink-0" />
                  <span className="truncate">{asset.location}</span>
                </div>

                {/* Scale & Details */}
                <div className="space-y-2 text-xs pt-2 border-t border-champagne-500/25">
                  <div className="flex justify-between items-center">
                    <span className="text-espresso-500 font-medium">Physical Scale:</span>
                    <span className="font-bold text-espresso-900">{asset.areaOrScale}</span>
                  </div>

                  <div>
                    <span className="text-espresso-500 font-medium block text-[10px] uppercase">Anchor Covenants:</span>
                    <span className="text-xs font-semibold text-espresso-800 line-clamp-2 mt-0.5">
                      {asset.tenantsOrDetails}
                    </span>
                  </div>
                </div>

              </div>

              <div className="pt-3 mt-3 border-t border-champagne-500/20 text-right">
                <span className="text-[10px] font-bold text-copper-700">
                  Verified In Audit Filing →
                </span>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* PROPERTY PHOTO GALLERY (Phase 6 Enhancement) */}
        {investment.galleryImages && investment.galleryImages.length > 0 && (
          <div className="mt-8 pt-6 border-t border-champagne-500/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-copper-600" />
                <h3 className="text-lg font-display font-extrabold text-espresso-950">
                  Asset Photo Gallery
                </h3>
              </div>
              <span className="text-xs text-copper-700 font-bold px-2 py-0.5 rounded bg-copper-500/10 border border-copper-500/20">
                {investment.galleryImages.length} High-Res {investment.galleryImages.length === 1 ? 'Photo' : 'Photos'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {investment.galleryImages.map((imgUrl, imgIdx) => (
                <div
                  key={imgIdx}
                  className="group relative rounded-2xl overflow-hidden border border-champagne-500/40 bg-sand-100 shadow-sm aspect-video cursor-pointer"
                  onClick={() => window.open(imgUrl, '_blank')}
                >
                  <img
                    src={imgUrl}
                    alt={`${investment.name} photo ${imgIdx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                    <span className="text-[10px] text-white font-semibold">
                      Click to View Full Resolution
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. SPONSOR BACKGROUND & GOVERNANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        <div className="lg:col-span-6 space-y-4">
          <GlassCard variant="elevated" className="p-6 sm:p-8 rounded-3xl border border-champagne-500/40 bg-white/80 h-full">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-copper-600" />
              <h2 className="text-xl font-display font-extrabold text-espresso-950">
                Sponsor Background & Pedigree
              </h2>
            </div>
            
            <div className="p-3 rounded-2xl bg-sand-100/70 border border-champagne-500/30 mb-4">
              <span className="text-[10px] uppercase font-bold text-copper-700 block">Sponsor Group</span>
              <h3 className="text-lg font-display font-extrabold text-espresso-950">
                {investment.sponsorProfile.name}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-espresso-800 leading-relaxed mb-4">
              {investment.sponsorProfile.background}
            </p>

            <div className="p-3 rounded-xl bg-champagne-500/10 border border-champagne-500/30 text-xs text-espresso-900 font-semibold mb-4">
              <strong>Track Record:</strong> {investment.sponsorProfile.trackRecord}
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-espresso-500 block mb-2">
                Institutional Investors & Unit-Holders
              </span>
              <div className="flex flex-wrap gap-2">
                {investment.sponsorProfile.institutionalBackers.map((backer, bIdx) => (
                  <span
                    key={bIdx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-champagne-500/40 text-espresso-800 shadow-sm"
                  >
                    {backer}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 5. KEY RISK FACTORS & LIQUIDITY */}
        <div className="lg:col-span-6 space-y-4">
          <GlassCard variant="elevated" className="p-6 sm:p-8 rounded-3xl border border-champagne-500/40 bg-white/80 h-full">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-copper-600" />
              <h2 className="text-xl font-display font-extrabold text-espresso-950">
                Key Risk Factors & Liquidity Profile
              </h2>
            </div>

            <p className="text-xs text-espresso-600 mb-4">
              Alternative investments are subject to commercial operational risks. WelNex highlights primary risk considerations:
            </p>

            {/* Risk items */}
            <div className="space-y-3 mb-5">
              {investment.riskFactors.map((risk, rIdx) => (
                <div key={rIdx} className="p-3 rounded-2xl bg-sand-50 border border-champagne-500/30">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-espresso-950">
                      {risk.title}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      risk.severity === 'High'
                        ? 'bg-rose-500/15 text-rose-800 border border-rose-500/25'
                        : 'bg-amber-500/15 text-amber-800 border border-amber-500/25'
                    }`}>
                      {risk.severity} Severity
                    </span>
                  </div>
                  <p className="text-[11px] text-espresso-700 leading-relaxed">
                    {risk.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Liquidity & Tax info */}
            <div className="space-y-2 pt-3 border-t border-champagne-500/30 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-champagne-500/30">
                <span className="font-bold block text-espresso-900 text-[11px] mb-0.5">Liquidity Profile:</span>
                <span className="text-[11px] text-espresso-700">{investment.liquidityProfile}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-champagne-500/30">
                <span className="font-bold block text-espresso-900 text-[11px] mb-0.5">Tax Efficiency:</span>
                <span className="text-[11px] text-espresso-700">{investment.taxImplications}</span>
              </div>
            </div>

          </GlassCard>
        </div>

      </div>

      {/* 6. RELEVANT DISCLOSURES & REGULATORY BOUNDARY */}
      <div className="p-6 sm:p-8 rounded-3xl bg-sand-100/90 border-2 border-champagne-500/50 shadow-sm text-left mb-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-copper-500/15 border border-copper-500/30 flex items-center justify-center text-copper-700 shrink-0 mt-1">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-display font-extrabold text-espresso-950">
              WelNex Regulatory & Educational Disclosure
            </h3>
            <p className="text-xs sm:text-sm text-espresso-700 leading-relaxed">
              WelNex is strictly an educational discovery, comparison, and simulation platform in India. WelNex is <strong>NOT</strong> a broker, dealer, fund manager, portfolio manager, or registered investment advisor (RIA) under SEBI. WelNex does not collect investor funds, pool capital, guarantee yields, or execute trades.
            </p>
            <p className="text-[11px] text-espresso-600 leading-relaxed">
              All quotes, NAVs, and yield metrics are sourced from publicly available stock exchange filings (NSE/BSE), SEBI disclosures, or partner-provided documentation for educational benchmarking. Unit-holders must conduct independent due diligence before committing capital.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-champagne-500/30">
        <Button
          variant="secondary"
          size="sm"
          onClick={onBackToCatalogue}
          icon={<ArrowLeft className="w-4 h-4" />}
          iconPosition="left"
        >
          Back to Catalogue
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleCompare(investment.id)}
            icon={isComparing ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5" />}
            iconPosition="left"
          >
            {isComparing ? 'Comparing' : 'Compare with Another Asset'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenWaitlist}
            icon={<ExternalLink className="w-4 h-4" />}
          >
            Join WelNex Sandbox Early Access
          </Button>
        </div>
      </div>

    </div>
  );
};
