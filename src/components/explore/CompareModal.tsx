import React from 'react';
import type { InvestmentItem } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useMarketData } from '../../hooks/useMarketData';
import { X, ArrowUpRight, Trash2, Calendar, Coins, ShieldCheck } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  investments: InvestmentItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onViewDetails: (id: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  investments,
  onRemoveItem,
  onClearAll,
  onViewDetails
}) => {
  const { quotes, lastChangedTicker } = useMarketData();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-espresso-950/50 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-sand border border-champagne-500/50 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 sm:p-6 border-b border-champagne-500/30 flex items-center justify-between bg-sand-100/95 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="copper" size="xs">
                Alternative Investment Comparator
              </Badge>
              <span className="text-xs text-espresso-600 font-medium">
                Side-by-Side Institutional Metric Matrix
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-espresso-950">
              Comparing {investments.length} Alternative Investments
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-800 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-espresso-700/10 text-espresso-700 cursor-pointer"
              aria-label="Close comparison modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Comparison Grid Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6 bg-sand">
          {investments.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-espresso-700 mb-3">
                No investments selected for comparison.
              </p>
              <Button variant="primary" size="sm" onClick={onClose}>
                Browse Catalogue
              </Button>
            </div>
          ) : (
            <div className="min-w-[700px] grid grid-cols-4 gap-4">
              
              {/* Column 0: Metric Headers */}
              <div className="space-y-4 text-xs font-bold text-espresso-600 pt-32">
                <div className="h-10 flex items-center border-b border-champagne-500/20">Category & Sub-Type</div>
                <div className="h-10 flex items-center border-b border-champagne-500/20">Access Model & Regulatory</div>
                <div className="h-14 flex items-center border-b border-champagne-500/20 text-copper-700">Indicative Yield & Type</div>
                <div className="h-12 flex items-center border-b border-champagne-500/20">Min. Investment Required</div>
                <div className="h-10 flex items-center border-b border-champagne-500/20">Tenure & Liquidity</div>
                <div className="h-10 flex items-center border-b border-champagne-500/20">Risk Profile</div>
                <div className="h-10 flex items-center border-b border-champagne-500/20">Payout Frequency</div>
                <div className="h-14 flex items-center border-b border-champagne-500/20">Portfolio Scale & Capacity</div>
                <div className="h-20 flex items-center border-b border-champagne-500/20">Tax Implications</div>
                <div className="h-20 flex items-center">Key Physical Asset(s)</div>
              </div>

              {/* Columns 1..N: Selected Investments */}
              {investments.map((inv) => {
                const isLive = inv.priceMode === 'LIVE_MARKET' || (!inv.priceMode && ['REIT', 'InvIT'].includes(inv.category));
                const ticker = (inv.symbolTicker || inv.symbol || '').toUpperCase();
                const quote = quotes[ticker];
                const isPulsing = lastChangedTicker === ticker;
                const livePrice = quote ? quote.price : (inv.currentPrice || inv.minInvestmentNumeric || 0);
                const changeVal = quote ? quote.priceChange24h : (inv.priceChange24h ?? 0);
                const changePct = quote ? quote.priceChangePercent24h : (inv.priceChangePercent24h ?? 0);
                const isPos = changeVal >= 0;

                return (
                  <div key={inv.id} className="rounded-2xl p-4 bg-white/80 border border-champagne-500/40 shadow-sm flex flex-col justify-between">
                    
                    {/* Top Asset Card Card Info */}
                    <div className="h-32 flex flex-col justify-between border-b border-champagne-500/30 pb-3">
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
                          <span className="font-mono text-[9px] font-bold text-copper-700 bg-copper-500/10 px-1.5 py-0.5 rounded">
                            {inv.category}
                          </span>
                        </div>

                        <button
                          onClick={() => onRemoveItem(inv.id)}
                          className="text-espresso-400 hover:text-rose-600 p-1 cursor-pointer"
                          aria-label={`Remove ${inv.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <h4 className="font-display font-extrabold text-sm text-espresso-950 line-clamp-1">
                          {inv.name}
                        </h4>
                        <div className="flex items-center justify-between gap-1 mt-0.5">
                          <span className="text-[11px] font-medium text-espresso-600 truncate">
                            By {inv.sponsor}
                          </span>
                          <div className="text-right">
                            <span className={`font-mono text-xs font-black block price-tick-transition ${
                              isPulsing ? isPos ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold' : 'text-espresso-950'
                            }`}>
                              ₹{livePrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </span>
                            {isLive && (
                              <span className={`text-[10px] font-mono font-bold ${isPos ? 'text-emerald-700' : 'text-rose-700'}`}>
                                {isPos ? '+' : ''}{changePct.toFixed(2)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                  {/* Metric Rows */}
                  <div className="space-y-4 text-xs pt-4">
                    
                    {/* Category */}
                    <div className="h-10 flex items-center border-b border-champagne-500/20 font-semibold text-espresso-900 truncate">
                      {inv.category} • {inv.subCategory}
                    </div>

                    {/* Access Model */}
                    <div className="h-10 flex items-center border-b border-champagne-500/20">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sand-200 border border-champagne-500/30 text-espresso-800">
                        {inv.accessModel}
                      </span>
                    </div>

                    {/* Yield */}
                    <div className="h-14 flex flex-col justify-center border-b border-champagne-500/20">
                      <div className="font-mono text-base font-extrabold text-copper-600">
                        {inv.indicativeYield}
                      </div>
                      <span className="text-[10px] text-espresso-500 truncate">{inv.yieldType}</span>
                    </div>

                    {/* Min Investment */}
                    <div className="h-12 flex flex-col justify-center border-b border-champagne-500/20">
                      <div className="font-mono font-bold text-espresso-900">{inv.minInvestment}</div>
                    </div>

                    {/* Tenure */}
                    <div className="h-10 flex items-center border-b border-champagne-500/20 text-espresso-800 truncate">
                      {inv.tenure}
                    </div>

                    {/* Risk */}
                    <div className="h-10 flex items-center border-b border-champagne-500/20 font-bold text-espresso-900">
                      {inv.riskLevel} Risk
                    </div>

                    {/* Payout */}
                    <div className="h-10 flex items-center border-b border-champagne-500/20 text-espresso-800">
                      {inv.distributionFrequency}
                    </div>

                    {/* Portfolio Scale */}
                    <div className="h-14 flex items-center border-b border-champagne-500/20 text-espresso-800 text-[11px]">
                      {inv.portfolioScale}
                    </div>

                    {/* Tax Implications */}
                    <div className="h-20 flex items-center border-b border-champagne-500/20 text-espresso-700 text-[11px] line-clamp-3">
                      {inv.taxImplications}
                    </div>

                    {/* Key Underlying Assets */}
                    <div className="h-20 flex items-center text-espresso-800 text-[11px] line-clamp-3">
                      {inv.underlyingAssets?.[0]?.name || 'Diversified Basket'}
                    </div>

                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 mt-2 border-t border-champagne-500/30">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onClose();
                        onViewDetails(inv.id);
                      }}
                      icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                      className="w-full text-xs font-semibold py-2"
                    >
                      View Deep Dive
                    </Button>
                  </div>
                </div>
              );
            })}

              {/* Slot Placeholder if < 3 items */}
              {investments.length < 3 && (
                <div className="rounded-2xl p-6 border-2 border-dashed border-champagne-500/40 bg-sand-100/50 flex flex-col items-center justify-center text-center">
                  <Coins className="w-8 h-8 text-copper-600/40 mb-2" />
                  <p className="text-xs font-semibold text-espresso-600 mb-2">
                    Add another asset to compare up to 3 opportunities side by side.
                  </p>
                  <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                    + Add More
                  </Button>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer Regulatory Reassurance */}
        <div className="p-4 bg-sand-100 border-t border-champagne-500/30 flex items-center justify-between text-[11px] text-espresso-700">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-copper-600 shrink-0" />
            <span>WelNex comparison metrics are compiled from public regulatory filings and verified partner disclosures for educational evaluation only.</span>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>

      </div>
    </div>
  );
};
