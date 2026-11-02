import React, { useState } from 'react';
import { TICKER_ITEMS } from '../../data/tickerData';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { X, Search, ShieldCheck } from 'lucide-react';
import type { AssetCategory } from '../../types';

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (category: string) => void;
  onOpenWaitlist?: () => void;
}

export const ExploreModal: React.FC<ExploreModalProps> = ({
  isOpen,
  onClose,
  onOpenWaitlist
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | AssetCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredTicker = TICKER_ITEMS.filter((item) => {
    const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-espresso-950/40 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-sand border border-champagne-500/50 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-champagne-500/30 flex items-center justify-between bg-sand-100/90">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="copper" size="xs">
                Educational Discovery Catalog
              </Badge>
              <span className="text-xs text-espresso-600 font-medium">
                Live Indicative Quotes
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-espresso-950">
              Explore Alternative Yield Opportunities
            </h2>
            <p className="text-xs text-espresso-600">
              Screen and compare real estate investment trusts, infrastructure funds, and yield instruments in India.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-espresso-700/10 text-espresso-700"
            aria-label="Close Explore Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar & Search */}
        <div className="px-6 py-4 border-b border-champagne-500/20 bg-sand-50/70 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['All', 'REIT', 'InvIT', 'Gold', 'SDI', 'Bond'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-copper-500 text-sand-50 shadow-sm'
                    : 'bg-white/80 text-espresso-800 border border-champagne-500/30 hover:border-copper-500/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-espresso-400" />
            <input
              type="text"
              placeholder="Search by name, symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-champagne-500/40 focus:outline-none focus:border-copper-500 text-espresso-950 placeholder:text-espresso-400"
            />
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5 bg-sand">
          {filteredTicker.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-espresso-600">
                No matching alternative instruments found. Try another search query.
              </p>
            </div>
          ) : (
            filteredTicker.map((item) => (
              <GlassCard
                key={item.id}
                variant="interactive"
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-copper-500/10 border border-copper-500/30 flex items-center justify-center shrink-0 font-bold text-copper-600 text-sm">
                    {item.category.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-espresso-950">
                        {item.name}
                      </span>
                      <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-sand-200 border border-champagne-500/30 text-espresso-800">
                        {item.symbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-espresso-600">
                      <span>Payout: <strong className="text-espresso-800">{item.payoutFrequency || 'Quarterly'}</strong></span>
                      <span>•</span>
                      <span>Focus: <strong className="text-copper-700">{item.highlightTag}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-champagne-500/20">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-espresso-500 block">
                      Indicative Price
                    </span>
                    <span className="font-mono font-bold text-sm text-espresso-950">
                      {item.price}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-copper-600 block">
                      Indicative Yield
                    </span>
                    <span className="font-mono font-extrabold text-base text-copper-600">
                      {item.distributionYield}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClose();
                      if (onOpenWaitlist) onOpenWaitlist();
                    }}
                    className="text-xs shrink-0"
                  >
                    Simulate
                  </Button>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        {/* Footer Disclaimer */}
        <div className="p-4 bg-sand-100 border-t border-champagne-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-espresso-700">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-copper-600 shrink-0" />
            <span>WelNex provides public educational data. We do not broker investments or solicit capital.</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              if (onOpenWaitlist) onOpenWaitlist();
            }}
            className="text-xs shrink-0"
          >
            Join Early Access
          </Button>
        </div>
      </div>
    </div>
  );
};
