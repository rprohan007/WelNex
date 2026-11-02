import React, { useState, useMemo } from 'react';
import { useInvestmentsData } from '../../hooks/useInvestmentsData';
import { Badge } from '../common/Badge';
import { Search, X, Plus, Check, Sparkles, Building2, TowerControl, Layers, Landmark, Shield, AlertCircle } from 'lucide-react';


interface AssetSelectionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  onSelectInvestment: (id: string) => void;
  onRemoveInvestment: (id: string) => void;
  onApplyPreset: (ids: string[]) => void;
}

export const AssetSelectionDrawer: React.FC<AssetSelectionDrawerProps> = ({
  isOpen,
  onClose,
  selectedIds,
  onSelectInvestment,
  onRemoveInvestment,
  onApplyPreset
}) => {
  const { investments } = useInvestmentsData();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Categories list
  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(investments.map((item) => item.category)))];
    return cats;
  }, [investments]);

  // Filtered investments
  const filteredInvestments = useMemo(() => {
    return investments.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSymbol = item.symbol?.toLowerCase().includes(q) || false;
        const matchesSponsor = item.sponsor.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesSub = item.subCategory.toLowerCase().includes(q);
        if (!matchesName && !matchesSymbol && !matchesSponsor && !matchesCat && !matchesSub) {
          return false;
        }
      }
      return true;
    });
  }, [investments, categoryFilter, searchQuery]);

  // Preset bundles
  const presets = [
    {
      name: 'Top Listed Yielders',
      desc: 'Embassy REIT, IndiGrid InvIT, Tata Capital, Nippon Gold',
      ids: ['embassy-office-parks-reit', 'indigrid-invit', 'tata-capital-ncd-aaa', 'nippon-gold-bees-etf']
    },
    {
      name: 'Real Estate vs Infra',
      desc: 'Commercial REITs compared against Power InvITs',
      ids: ['embassy-office-parks-reit', 'mindspace-business-parks-reit', 'indigrid-invit', 'powergrid-invit']
    },
    {
      name: 'Fixed Income & Credit',
      desc: 'Corporate Bond, Securitized SDI, Private Credit & P2P',
      ids: ['tata-capital-ncd-aaa', 'grip-ev-lease-sdi', 'vivriti-private-credit-aif-cat2', 'faircent-prime-p2p-credit']
    },
    {
      name: 'Retail Low-Ticket (< ₹5,000)',
      desc: '1-unit exchange traded opportunities accessible immediately',
      ids: ['nexus-select-trust-reit', 'powergrid-invit', 'nippon-gold-bees-etf', 'mindspace-business-parks-reit']
    }
  ];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'REIT':
        return <Building2 className="w-3.5 h-3.5 text-copper-600" />;
      case 'InvIT':
        return <TowerControl className="w-3.5 h-3.5 text-amber-600" />;
      case 'SDI':
        return <Layers className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Bond':
      case 'Gold':
        return <Landmark className="w-3.5 h-3.5 text-espresso-600" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-copper-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-espresso-950/60 backdrop-blur-sm transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-sand-100 h-full flex flex-col shadow-2xl border-l border-champagne-500/40 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-champagne-500/30 bg-sand-200/90 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="copper" size="xs">
                Asset Picker Drawer
              </Badge>
              <span className="text-xs font-semibold text-espresso-700">
                {selectedIds.length}/4 Selected
              </span>
            </div>
            <h3 className="text-xl font-display font-bold text-espresso-950">
              Add Investment to Compare
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-espresso-700/10 text-espresso-700 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Presets Section */}
        <div className="p-5 border-b border-champagne-500/25 bg-sand-50/70 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by asset name, ticker, sponsor, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border border-champagne-500/40 text-xs sm:text-sm text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-copper-500/30 focus:border-copper-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-700 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-copper-500 text-white shadow-sm'
                      : 'bg-white/80 text-espresso-700 border border-champagne-500/30 hover:border-copper-500/40'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Quick Presets Carousel */}
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-copper-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Or Choose a 1-Click Comparison Preset:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    onApplyPreset(preset.ids);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl text-left bg-white/70 border border-champagne-500/30 hover:border-copper-500/50 hover:bg-copper-500/5 transition-all text-xs group cursor-pointer"
                >
                  <span className="font-bold text-espresso-950 group-hover:text-copper-700 block truncate">
                    {preset.name}
                  </span>
                  <span className="text-[10px] text-espresso-600 block line-clamp-1 mt-0.5">
                    {preset.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Investment Options List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
          {filteredInvestments.length === 0 ? (
            <div className="text-center py-12 text-espresso-600 text-xs">
              <AlertCircle className="w-6 h-6 mx-auto mb-2 text-espresso-400" />
              No investment matches your search. Try adjusting keywords or category filters.
            </div>
          ) : (
            filteredInvestments.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const isAtCapacity = selectedIds.length >= 4 && !isSelected;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-copper-500/10 border-copper-500/40 shadow-sm'
                      : 'bg-white/80 border-champagne-500/30 hover:border-champagne-500 hover:bg-white'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      {getCategoryIcon(item.category)}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-600">
                        {item.category} • {item.subCategory}
                      </span>
                      {item.symbol && (
                        <span className="text-[10px] font-mono font-bold text-copper-700 bg-copper-500/10 px-1.5 py-0.2 rounded">
                          {item.symbol}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-espresso-950 truncate">
                      {item.name}
                    </h4>

                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <div>
                        <span className="text-[10px] text-espresso-500">Yield: </span>
                        <span className="font-mono font-bold text-copper-600">
                          {item.indicativeYield}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-espresso-500">Min: </span>
                        <span className="font-mono font-semibold text-espresso-800">
                          {item.minInvestment.split(' ')[0]}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-espresso-500">Risk: </span>
                        <span className="font-semibold text-espresso-700">
                          {item.riskLevel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0">
                    {isSelected ? (
                      <button
                        onClick={() => onRemoveInvestment(item.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-copper-500 text-white flex items-center gap-1.5 hover:bg-rose-600 transition-colors cursor-pointer group"
                        title="Click to remove from comparison"
                      >
                        <Check className="w-3.5 h-3.5 group-hover:hidden" />
                        <X className="w-3.5 h-3.5 hidden group-hover:inline-block" />
                        <span className="group-hover:hidden">Added</span>
                        <span className="hidden group-hover:inline-block">Remove</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (!isAtCapacity) {
                            onSelectInvestment(item.id);
                          }
                        }}
                        disabled={isAtCapacity}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          isAtCapacity
                            ? 'bg-espresso-100 text-espresso-400 border border-champagne-500/20 cursor-not-allowed'
                            : 'bg-white text-copper-700 border border-copper-500/40 hover:bg-copper-500 hover:text-white cursor-pointer shadow-sm'
                        }`}
                        title={isAtCapacity ? 'Max 4 investments selected' : 'Add to comparison'}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Compare</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-sand-200/90 border-t border-champagne-500/30 flex items-center justify-between text-xs">
          <span className="text-espresso-600">
            {selectedIds.length === 4
              ? 'Maximum 4 asset slots reached'
              : `Select ${4 - selectedIds.length} more investment${4 - selectedIds.length > 1 ? 's' : ''} to fill matrix`}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-copper-500 text-white font-bold hover:bg-copper-600 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
