import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import type { InvestmentItem } from '../../types';
import { useAssetLivePrice } from '../../hooks/useMarketData';
import { isNseListedAsset } from '../../services/marketPriceService';
import { 
  Building2, 
  TowerControl, 
  ShieldCheck, 
  Coins, 
  ArrowUpRight, 
  Check, 
  Plus, 
  Layers, 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  AlertTriangle,
  Building,
  Zap,
  Calendar
} from 'lucide-react';

export interface InvestmentCardProps {
  investment: InvestmentItem;
  onViewDetails: (id: string) => void;
  onToggleCompare: (id: string) => void;
  isComparing: boolean;
}

export const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment,
  onViewDetails,
  onToggleCompare,
  isComparing
}) => {
  const priceData = useAssetLivePrice(investment);
  const isNseLive = isNseListedAsset(investment) && (investment.isNseLive ?? priceData.isLiveMode);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'REIT':
        return <Building2 className="w-3.5 h-3.5 text-copper-600" />;
      case 'SM REIT':
        return <Building className="w-3.5 h-3.5 text-amber-700" />;
      case 'InvIT':
        return <TowerControl className="w-3.5 h-3.5 text-copper-700" />;
      case 'Corporate Bond':
      case 'Bond':
      case 'Debt':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />;
      case 'Precious Metals':
      case 'Gold':
        return <Coins className="w-3.5 h-3.5 text-yellow-700" />;
      case 'Renewable Energy':
        return <Zap className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-copper-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-emerald-700 bg-emerald-500/10 border-emerald-500/25';
      case 'Moderate':
        return 'text-amber-800 bg-amber-500/15 border-amber-500/30';
      case 'High':
        return 'text-orange-800 bg-orange-500/15 border-orange-500/30';
      case 'Very High':
        return 'text-rose-800 bg-rose-500/15 border-rose-500/30';
      default:
        return 'text-espresso-800 bg-sand-200 border-champagne-500/40';
    }
  };

  const displayPriceText = isNseLive
    ? investment.liveNsePriceFormatted || priceData.displayPrice
    : priceData.displayPrice;

  const livePriceString = isNseLive
    ? investment.nseLivePriceString || `${displayPriceText} / unit (NSE Live)`
    : investment.minInvestment;

  return (
    <GlassCard
      variant="interactive"
      className={`p-5 sm:p-6 rounded-3xl border border-champagne-500/40 bg-white/80 hover:bg-white/95 shadow-glass-md hover:shadow-glass-lg transition-all duration-300 flex flex-col justify-between group text-left relative overflow-hidden ${
        priceData.isPulsing 
          ? priceData.isPositive ? 'ring-2 ring-emerald-500/40' : 'ring-2 ring-rose-500/40'
          : ''
      }`}
    >
      {/* Top Ambient Glow Accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-copper-500/10 via-champagne-500/10 to-transparent rounded-bl-full pointer-events-none" />

      <div>
        {/* Row 1: Badges & Pricing Mode Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-copper-500/10 border border-copper-500/25 text-copper-700">
              {getCategoryIcon(investment.category)}
              <span>{investment.category} • {investment.subCategory}</span>
            </span>
          </div>

          {/* DUAL-MODE PRICING BADGE */}
          {isNseLive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider text-emerald-800 bg-emerald-500/15 border border-emerald-500/30 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              LIVE • NSE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-copper-800 bg-champagne-500/20 border border-champagne-500/40 shrink-0">
              <Calendar className="w-2.5 h-2.5 text-copper-700" />
              {investment.yieldPayoutFrequency || 'Quarterly'} NAV
            </span>
          )}
        </div>

        {/* Row 2: Investment Title & Sponsor */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-display font-bold text-espresso-950 group-hover:text-copper-700 transition-colors line-clamp-1">
              {investment.name}
            </h3>
            {(investment.symbolTicker || investment.symbol) && (
              <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-sand-200 border border-champagne-500/30 text-espresso-800 shrink-0">
                {investment.symbolTicker || investment.symbol}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-espresso-600 mt-0.5 flex items-center gap-1">
            <span>By</span>
            <span className="text-espresso-900 font-bold">{investment.sponsor}</span>
            {investment.accessModel === 'Direct Public' && (
              <span className="text-[10px] font-normal text-emerald-700 ml-1.5">• Exchange Demat</span>
            )}
          </p>
        </div>

        {/* Tagline / Brief Description */}
        <p className="text-xs text-espresso-700 font-normal leading-relaxed mb-3.5 line-clamp-2">
          {investment.tagline || investment.overview}
        </p>

        {/* DYNAMIC ASSET PRICE ENGINE BOX */}
        <div className={`p-3 rounded-2xl border mb-3.5 transition-all duration-300 ${
          isNseLive 
            ? 'bg-gradient-to-r from-emerald-500/5 via-sand-100 to-copper-500/5 border-emerald-500/25' 
            : 'bg-sand-100/90 border-champagne-500/35'
        }`}>
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9.5px] uppercase font-bold text-espresso-500 tracking-wider block">
                  {isNseLive ? 'Live Trading Price' : 'Assessed NAV / Base Unit'}
                </span>
                {/* Live NSE Tick badge with green dot */}
                {isNseLive && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-500/15 border border-emerald-500/30 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live NSE Tick
                  </span>
                )}
              </div>
              
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className={`text-base sm:text-lg font-mono font-black price-tick-transition ${
                  priceData.isPulsing 
                    ? priceData.isPositive ? 'text-emerald-700' : 'text-rose-700'
                    : 'text-espresso-950'
                }`}>
                  {displayPriceText}
                </span>

                {/* 24h Shift for Listed Assets */}
                {isNseLive && (
                  <span className={`inline-flex items-center gap-0.5 text-xs font-mono font-bold price-tick-transition ${
                    priceData.isPositive ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {priceData.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{priceData.change24h} ({priceData.changePercent24h})</span>
                  </span>
                )}
              </div>

              {/* Live price string preview */}
              {isNseLive && (
                <div className="flex items-center gap-1 mt-0.5 text-[10px] font-mono text-emerald-800 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{livePriceString}</span>
                </div>
              )}
            </div>

            {/* Right Sub-text / Valuation Label */}
            <div className="text-right shrink-0">
              {isNseLive ? (
                <div className="text-right">
                  <span className="text-[9px] font-mono text-espresso-500 block">
                    {priceData.lastUpdatedText}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-700 font-bold block">
                    NSE: {investment.symbolTicker || investment.symbol || 'LIVE'}
                  </span>
                </div>
              ) : (
                <div className="text-right">
                  <span className="text-[9.5px] font-bold text-copper-700 block">
                    {priceData.lastUpdatedText}
                  </span>
                  <span className="text-[9px] text-espresso-500 block">
                    Target Yield: {investment.indicativeYield}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-sand-100/80 border border-champagne-500/30 mb-4">
          
          {/* Indicative Yield */}
          <div>
            <span className="text-[10px] uppercase font-bold text-copper-700 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-copper-600" />
              <span>Indicative Yield</span>
            </span>
            <div className="text-sm sm:text-base font-mono font-black text-espresso-950 mt-0.5">
              {investment.indicativeYield}
            </div>
            <span className="text-[9px] text-espresso-500 block truncate">
              {investment.yieldType}
            </span>
          </div>

          {/* Min Investment (Live Price for Listed, or Admin CMS ticket for Private Fractional CRE) */}
          <div>
            <span className="text-[10px] uppercase font-bold text-espresso-600 flex items-center gap-1">
              <Coins className="w-3 h-3 text-espresso-500" />
              <span>Min. Investment</span>
            </span>
            <div className="text-sm sm:text-base font-mono font-bold text-espresso-950 mt-0.5 truncate flex items-center gap-1.5">
              {isNseLive ? (
                <>
                  <span>{displayPriceText}</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </>
              ) : (
                /* Admin Override Fallback: Preserves Admin CMS edited minimum ticket price */
                <span>{investment.minInvestment}</span>
              )}
            </div>
            <span className="text-[9px] text-espresso-500 block truncate">
              {isNseLive 
                ? '1 Unit on NSE/BSE' 
                : (investment.accessModel === 'Direct Public' ? '1 Unit Exchange Lot' : 'Curated Partner Access')}
            </span>
          </div>

          {/* Tenure */}
          <div className="border-t border-champagne-500/20 pt-2">
            <span className="text-[10px] uppercase font-bold text-espresso-600 flex items-center gap-1">
              <Clock className="w-3 h-3 text-espresso-500" />
              <span>Tenure / Liquidity</span>
            </span>
            <div className="text-xs font-bold text-espresso-900 mt-0.5 truncate">
              {investment.tenure}
            </div>
          </div>

          {/* Risk Level */}
          <div className="border-t border-champagne-500/20 pt-2">
            <span className="text-[10px] uppercase font-bold text-espresso-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-espresso-500" />
              <span>Risk Level</span>
            </span>
            <div className="mt-0.5">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getRiskColor(investment.riskLevel)}`}>
                {investment.riskLevel}
              </span>
            </div>
          </div>

        </div>

        {/* Location & Portfolio Scale Snippet */}
        {investment.underlyingAssets && investment.underlyingAssets.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-espresso-700 mb-4 px-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-copper-600 shrink-0" />
            <span className="truncate">
              <strong>{investment.underlyingAssets[0].name}</strong> ({investment.underlyingAssets[0].location})
            </span>
          </div>
        )}
      </div>

      {/* Row 4: Action Buttons (View Details & Compare) */}
      <div className="pt-3 border-t border-champagne-500/25 flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onViewDetails(investment.id)}
          icon={<ArrowUpRight className="w-3.5 h-3.5" />}
          className="flex-1 text-xs font-semibold py-2"
        >
          View Details
        </Button>

        <button
          type="button"
          onClick={() => onToggleCompare(investment.id)}
          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
            isComparing
              ? 'bg-copper-500 text-sand-50 border-copper-600 shadow-sm'
              : 'bg-white/90 text-espresso-800 border-champagne-500/40 hover:border-copper-500/50 hover:text-copper-700'
          }`}
          aria-label={isComparing ? `Remove ${investment.name} from comparison` : `Add ${investment.name} to comparison`}
        >
          {isComparing ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Comparing</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Compare</span>
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
};

export default InvestmentCard;
