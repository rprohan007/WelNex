import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import type { InvestmentItem } from '../../types';
import { useAssetLivePrice } from '../../hooks/useMarketData';
import { isNseListedAsset, formatInrCurrency } from '../../services/marketPriceService';
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
  Clock, 
  AlertTriangle,
  Building,
  Zap,
  Calendar
} from 'lucide-react';

export interface AssetCardProps {
  investment: InvestmentItem;
  onViewDetails: (id: string) => void;
  onToggleCompare: (id: string) => void;
  isComparing: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  investment,
  onViewDetails,
  onToggleCompare,
  isComparing
}) => {
  const priceData = useAssetLivePrice(investment);
  
  // Conditional check for listed NSE instruments with exchange ticker
  const isListedAsset = Boolean(investment.symbolTicker && isNseListedAsset(investment));

  // Dynamic CURRENT PRICE: reflects custom Admin CMS price for unlisted assets
  const displayPriceText = typeof investment.currentPrice === 'number'
    ? formatInrCurrency(investment.currentPrice)
    : priceData.displayPrice;

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

  return (
    <GlassCard
      variant="interactive"
      className={`p-5 sm:p-6 rounded-3xl border border-champagne-500/40 bg-white/80 hover:bg-white/95 shadow-glass-md hover:shadow-glass-lg transition-all duration-300 flex flex-col justify-between group text-left relative overflow-hidden ${
        !isListedAsset && priceData.isPulsing 
          ? priceData.isPositive ? 'ring-2 ring-emerald-500/40' : 'ring-2 ring-rose-500/40'
          : ''
      }`}
    >
      {/* Top Ambient Glow Accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-copper-500/10 via-champagne-500/10 to-transparent rounded-bl-full pointer-events-none" />

      <div>
        {/* Row 1: Badges & Live Market Timestamp Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-copper-500/10 border border-copper-500/25 text-copper-700">
              {getCategoryIcon(investment.category)}
              <span>{investment.category} • {investment.subCategory}</span>
            </span>
          </div>

          {/* DUAL-MODE PRICING BADGE */}
          {isListedAsset ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider text-emerald-800 bg-emerald-500/15 border border-emerald-500/30 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              NSE Listed • {investment.symbolTicker || investment.symbol}
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

        {/* DYNAMIC ASSET PRICE ENGINE BOX / NSE REDIRECT PIVOT */}
        {isListedAsset ? (
          /* 1. Listed Asset Pivot: Replace stagnant CURRENT PRICE with direct NSE quote button */
          <div className="p-3 rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-500/5 via-sand-100 to-copper-500/5 mb-3.5 transition-all duration-300">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[9.5px] uppercase font-bold text-espresso-500 tracking-wider block">
                  MARKET PRICE (NSE)
                </span>
                <span className="text-xs font-bold text-espresso-800 mt-0.5 block">
                  NSE: {investment.symbolTicker}
                </span>
              </div>

              <a
                href={`https://www.nseindia.com/get-quotes/equity?symbol=${investment.symbolTicker}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-200 group/link shadow-sm shrink-0 cursor-pointer"
                aria-label={`View live price for ${investment.name} (${investment.symbolTicker}) on official NSE website`}
              >
                <span>View Live Price on NSE ↗</span>
              </a>
            </div>
          </div>
        ) : (
          /* 3. Unlisted / Private Assets: Preserve fixed currentPrice and custom amounts from Admin CMS */
          <div className="p-3 rounded-2xl border mb-3.5 transition-all duration-300 bg-sand-100/90 border-champagne-500/35">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[9.5px] uppercase font-bold text-espresso-500 tracking-wider block">
                  Assessed NAV / Base Unit
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-base sm:text-lg font-mono font-black text-espresso-950">
                    {displayPriceText}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[9.5px] font-bold text-copper-700 block">
                  {priceData.lastUpdatedText}
                </span>
                <span className="text-[9px] text-espresso-500 block">
                  Target Yield: {investment.indicativeYield}
                </span>
              </div>
            </div>
          </div>
        )}

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

          {/* MIN. INVESTMENT: 1 Unit (Market Price) for Listed, or Custom Admin CMS Ticket for Unlisted */}
          <div>
            <span className="text-[10px] uppercase font-bold text-espresso-600 flex items-center gap-1">
              <Coins className="w-3 h-3 text-espresso-500" />
              <span>MIN. INVESTMENT</span>
            </span>
            <div className="text-sm sm:text-base font-mono font-bold text-espresso-950 mt-0.5 truncate flex items-center gap-1.5">
              {isListedAsset ? (
                <span>1 Unit (Market Price)</span>
              ) : (
                /* Reliable Admin Fallback: Preserves custom price configured in Admin CMS Portal */
                <span>{investment.minInvestment}</span>
              )}
            </div>
            <span className="text-[9px] text-espresso-500 block truncate">
              {isListedAsset 
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

export default AssetCard;
export { AssetCard as InvestmentCard };
export type { AssetCardProps as InvestmentCardProps };
