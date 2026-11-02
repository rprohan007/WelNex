import React, { useState, useMemo } from 'react';
import { useInvestmentsData } from '../../hooks/useInvestmentsData';
import { useMarketData } from '../../hooks/useMarketData';
import type { PriorityTier, RiskLevel, AccessModel, MinInvestmentFilter, PriceMode } from '../../types';
import { InvestmentCard } from './InvestmentCard';
import { InvestmentFilters } from './InvestmentFilters';
import { CompareModal } from './CompareModal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Scale, X, ArrowRight, RotateCcw, Compass, Calculator, Radio, Zap, RefreshCw, Clock } from 'lucide-react';

interface ExploreCatalogueProps {
  onSelectInvestment: (id: string) => void;
  onOpenWaitlist?: () => void;
  onBackToHome?: () => void;
  onNavigateToCompare?: (ids: string[]) => void;
  onNavigateToCalculators?: () => void;
}

export const ExploreCatalogue: React.FC<ExploreCatalogueProps> = ({
  onSelectInvestment,
  onOpenWaitlist,
  onBackToHome,
  onNavigateToCompare,
  onNavigateToCalculators
}) => {
  const { investments } = useInvestmentsData();
  const { marketStatus, triggerTick, refreshMarketData } = useMarketData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<PriorityTier>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<'All' | RiskLevel>('All');
  const [selectedMinInvestment, setSelectedMinInvestment] = useState<MinInvestmentFilter>('All');
  const [selectedAccessModel, setSelectedAccessModel] = useState<'All' | AccessModel>('All');
  const [selectedPriceMode, setSelectedPriceMode] = useState<'All' | PriceMode>('All');

  // Compare List State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Toggle Compare Handler (Supports up to 4 items)
  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 investments at a time in the Side-by-Side Matrix.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleRemoveCompareItem = (id: string) => {
    setCompareIds((prev) => prev.filter((item) => item !== id));
  };

  const handleClearCompare = () => {
    setCompareIds([]);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPriority('All');
    setSelectedCategory('All');
    setSelectedRisk('All');
    setSelectedMinInvestment('All');
    setSelectedAccessModel('All');
    setSelectedPriceMode('All');
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshMarketData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Filtered Investments
  const filteredInvestments = useMemo(() => {
    return investments.filter((inv) => {
      // 1. Priority Tier Filter
      if (selectedPriority !== 'All' && inv.priorityTier !== selectedPriority) {
        return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'All' && inv.category !== selectedCategory) {
        return false;
      }

      // 3. Risk Level Filter
      if (selectedRisk !== 'All' && inv.riskLevel !== selectedRisk) {
        return false;
      }

      // 4. Min Investment Filter
      if (selectedMinInvestment === 'under_10k' && inv.minInvestmentNumeric >= 10000) {
        return false;
      }
      if (
        selectedMinInvestment === '10k_to_1L' &&
        (inv.minInvestmentNumeric < 10000 || inv.minInvestmentNumeric > 100000)
      ) {
        return false;
      }
      if (selectedMinInvestment === 'above_1L' && inv.minInvestmentNumeric <= 100000) {
        return false;
      }

      // 5. Access Model Filter
      if (selectedAccessModel !== 'All' && inv.accessModel !== selectedAccessModel) {
        return false;
      }

      // 6. Pricing Architecture Mode Filter
      if (selectedPriceMode !== 'All') {
        const isLive = inv.priceMode === 'LIVE_MARKET' || (!inv.priceMode && ['REIT', 'InvIT'].includes(inv.category));
        if (selectedPriceMode === 'LIVE_MARKET' && !isLive) return false;
        if (selectedPriceMode === 'PERIODIC_NAV' && isLive) return false;
      }

      // 7. Search Query Filter (name, sponsor, symbol, or location)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = inv.name.toLowerCase().includes(q);
        const matchesSponsor = inv.sponsor.toLowerCase().includes(q);
        const matchesSymbol = (inv.symbolTicker || inv.symbol)?.toLowerCase().includes(q);
        const matchesCategory = inv.category.toLowerCase().includes(q);
        const matchesLocation = inv.underlyingAssets?.some((asset) =>
          asset.location.toLowerCase().includes(q) || asset.name.toLowerCase().includes(q)
        );

        if (!matchesName && !matchesSponsor && !matchesSymbol && !matchesCategory && !matchesLocation) {
          return false;
        }
      }

      return true;
    });
  }, [
    investments,
    searchQuery,
    selectedPriority,
    selectedCategory,
    selectedRisk,
    selectedMinInvestment,
    selectedAccessModel,
    selectedPriceMode
  ]);

  // Selected compare investment objects
  const comparedInvestments = useMemo(() => {
    return compareIds
      .map((id) => investments.find((item) => item.id === id))
      .filter((item): item is typeof investments[0] => item !== undefined);
  }, [compareIds, investments]);

  return (
    <div className="w-full bg-sand min-h-screen pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fadeIn text-left">
      
      {/* Catalogue Header */}
      <div className="mb-8 border-b border-champagne-500/30 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="copper" size="sm" withDot={true}>
                Explore Investments Catalogue
              </Badge>
              <span className="text-xs font-semibold text-espresso-600">
                Institutional Alternative Assets in India
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-espresso-950 tracking-tight">
              Explore Alternative Investments
            </h1>
            <p className="text-sm sm:text-base text-espresso-700 font-normal leading-relaxed max-w-3xl mt-2">
              Screen, benchmark, and simulate quarterly yield-generating alternatives across commercial REITs, infrastructure InvITs, senior corporate debt, and verified partner opportunities with zero advisor bias.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onNavigateToCalculators && (
              <button
                onClick={onNavigateToCalculators}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-copper-700 bg-copper-500/10 border border-copper-500/30 hover:bg-copper-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Financial Calculators</span>
              </button>
            )}
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-espresso-700 bg-white/80 border border-champagne-500/40 hover:bg-copper-500/10 transition-colors cursor-pointer"
              >
                ← Back to Home
              </button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenWaitlist}
              className="text-xs font-semibold"
            >
              Join Early Access
            </Button>
          </div>
        </div>
      </div>


      {/* REAL-TIME DUAL-MODE MARKET STATUS BANNER */}
      <div className="mb-6 p-4 rounded-2xl bg-white/75 border border-champagne-500/40 shadow-glass-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-copper-500/10 border border-copper-500/25 flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 text-copper-600 animate-beacon" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-sans text-espresso-950">
                Dual-Mode Pricing Architecture
              </span>
              {marketStatus.isOpen ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black text-emerald-800 bg-emerald-500/15 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  NSE LIVE • {marketStatus.currentTimeIST}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-espresso-700 bg-sand-200 border border-champagne-500/40">
                  <Clock className="w-2.5 h-2.5 text-amber-700" />
                  {marketStatus.statusText}
                </span>
              )}
            </div>
            <p className="text-[11px] text-espresso-600 mt-0.5">
              Live tick-by-tick pricing for listed REITs/InvITs & structured periodic audited NAV for private vehicles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={() => triggerTick()}
            title="Trigger real-time exchange tick simulation"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-copper-500/10 hover:bg-copper-500/20 text-copper-700 border border-copper-500/30 text-xs font-bold transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-copper-600" />
            <span>Simulate Tick</span>
          </button>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            title="Refresh market quotes from providers"
            className="p-1.5 rounded-xl bg-white/80 hover:bg-sand-200 border border-champagne-500/40 text-espresso-700 transition-all cursor-pointer disabled:opacity-50"
            aria-label="Refresh quotes"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-copper-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search and Filtering Controls */}
      <InvestmentFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedRisk={selectedRisk}
        onRiskChange={setSelectedRisk}
        selectedMinInvestment={selectedMinInvestment}
        onMinInvestmentChange={setSelectedMinInvestment}
        selectedAccessModel={selectedAccessModel}
        onAccessModelChange={setSelectedAccessModel}
        selectedPriceMode={selectedPriceMode}
        onPriceModeChange={setSelectedPriceMode}
        onResetFilters={handleResetFilters}
        totalCount={investments.length}
        filteredCount={filteredInvestments.length}
      />

      {/* Asset Listing Grid: Responsive 3-Column Glass Card Layout */}
      {filteredInvestments.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-white/70 border border-dashed border-champagne-500/50 text-center space-y-4 max-w-xl mx-auto my-12">
          <div className="w-12 h-12 rounded-2xl bg-copper-500/10 text-copper-600 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-display font-bold text-espresso-950">
              No Matching Investment Opportunities Found
            </h3>
            <p className="text-xs text-espresso-600">
              Try adjusting your search query, switching priority tabs, or resetting filters to view all available listings.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleResetFilters}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestments.map((inv) => (
            <InvestmentCard
              key={inv.id}
              investment={inv}
              onViewDetails={onSelectInvestment}
              onToggleCompare={handleToggleCompare}
              isComparing={compareIds.includes(inv.id)}
            />
          ))}
        </div>
      )}

      {/* FLOATING COMPARE BAR TRAY (When 1 to 4 items are selected) */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl p-3 sm:p-4 rounded-3xl bg-espresso-950/90 backdrop-blur-xl border border-champagne-500/40 shadow-2xl text-sand-50 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
          
          {/* Selected Chips */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full">
            <div className="flex items-center gap-1.5 mr-2 shrink-0">
              <Scale className="w-4 h-4 text-copper-400" />
              <span className="text-xs font-bold text-sand-100">
                Compare ({compareIds.length}/4):
              </span>
            </div>

            {comparedInvestments.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-xl bg-white/10 border border-white/15 text-xs text-sand-100 shrink-0"
              >
                <span className="font-semibold line-clamp-1 max-w-[140px]">
                  {item.name}
                </span>
                <button
                  onClick={() => handleRemoveCompareItem(item.id)}
                  className="p-0.5 rounded-full hover:bg-white/20 text-sand-300 hover:text-sand-50"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleClearCompare}
              className="text-xs text-sand-300 hover:text-sand-100 underline px-2 py-1 cursor-pointer"
            >
              Clear
            </button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (onNavigateToCompare) {
                  onNavigateToCompare(compareIds);
                } else {
                  setIsCompareModalOpen(true);
                }
              }}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              className="text-xs font-bold shadow-md shadow-copper-500/30 whitespace-nowrap"
            >
              Side-by-Side Matrix ({compareIds.length})
            </Button>
          </div>

        </div>
      )}


      {/* Compare Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        investments={comparedInvestments}
        onRemoveItem={handleRemoveCompareItem}
        onClearAll={handleClearCompare}
        onViewDetails={(id) => {
          setIsCompareModalOpen(false);
          onSelectInvestment(id);
        }}
      />

    </div>
  );
};
