import React from 'react';
import type { PriorityTier, RiskLevel, AccessModel, MinInvestmentFilter, PriceMode } from '../../types';
import { Search, X, SlidersHorizontal, RotateCcw, ShieldCheck, Flame } from 'lucide-react';

interface InvestmentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPriority: PriorityTier;
  onPriorityChange: (tier: PriorityTier) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedRisk: 'All' | RiskLevel;
  onRiskChange: (risk: 'All' | RiskLevel) => void;
  selectedMinInvestment: MinInvestmentFilter;
  onMinInvestmentChange: (filter: MinInvestmentFilter) => void;
  selectedAccessModel: 'All' | AccessModel;
  onAccessModelChange: (model: 'All' | AccessModel) => void;
  selectedPriceMode?: 'All' | PriceMode;
  onPriceModeChange?: (mode: 'All' | PriceMode) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
}

export const InvestmentFilters: React.FC<InvestmentFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityChange,
  selectedCategory,
  onCategoryChange,
  selectedRisk,
  onRiskChange,
  selectedMinInvestment,
  onMinInvestmentChange,
  selectedAccessModel,
  onAccessModelChange,
  selectedPriceMode = 'All',
  onPriceModeChange,
  onResetFilters,
  totalCount,
  filteredCount
}) => {
  const isAnyFilterActive =
    searchQuery.trim() !== '' ||
    selectedPriority !== 'All' ||
    selectedCategory !== 'All' ||
    selectedRisk !== 'All' ||
    selectedMinInvestment !== 'All' ||
    selectedAccessModel !== 'All' ||
    selectedPriceMode !== 'All';

  // Sub-categories depending on Priority selection
  const priority1Categories = ['All', 'REIT', 'SM REIT', 'InvIT', 'Corporate Bond', 'Precious Metals'];
  const priority2Categories = ['All', 'Private Credit', 'Fractional CRE', 'Pre-IPO Shares', 'P2P Lending', 'Renewable Energy', 'Startup Equity', 'AIF'];

  const availableCategories =
    selectedPriority === 'Priority 1'
      ? priority1Categories
      : selectedPriority === 'Priority 2'
      ? priority2Categories
      : ['All', 'REIT', 'InvIT', 'Corporate Bond', 'Precious Metals', 'Private Credit', 'Fractional CRE', 'Pre-IPO Shares', 'P2P Lending', 'Renewable Energy'];

  return (
    <div className="w-full space-y-4 mb-8">
      
      {/* Top Search & Category Tabs Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Priority Tabs */}
        <div className="inline-flex items-center p-1.5 rounded-2xl bg-sand-200/90 border border-champagne-500/40 shadow-sm overflow-x-auto max-w-full">
          <button
            onClick={() => {
              onPriorityChange('All');
              onCategoryChange('All');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedPriority === 'All'
                ? 'bg-copper-500 text-sand-50 shadow-sm'
                : 'text-espresso-700 hover:text-copper-700'
            }`}
          >
            All Categories ({totalCount})
          </button>

          <button
            onClick={() => {
              onPriorityChange('Priority 1');
              onCategoryChange('All');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedPriority === 'Priority 1'
                ? 'bg-copper-500 text-sand-50 shadow-sm'
                : 'text-espresso-700 hover:text-copper-700'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Priority 1 (Launch First)</span>
          </button>

          <button
            onClick={() => {
              onPriorityChange('Priority 2');
              onCategoryChange('All');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedPriority === 'Priority 2'
                ? 'bg-copper-500 text-sand-50 shadow-sm'
                : 'text-espresso-700 hover:text-copper-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Priority 2 (Verified Partners)</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 lg:max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by investment name, sponsor, or location..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-2xl bg-white border border-champagne-500/40 focus:outline-none focus:border-copper-500 text-espresso-950 placeholder:text-espresso-400 shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-700 p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Sub-Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
        <span className="text-[11px] font-bold text-espresso-500 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3 text-copper-600" />
          Asset Type:
        </span>
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-copper-500/20 text-copper-700 border border-copper-500/40 font-bold'
                : 'bg-white/80 text-espresso-700 border border-champagne-500/30 hover:border-copper-500/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dropdown Filters Row */}
      <div className="p-3.5 rounded-2xl bg-sand-100/70 border border-champagne-500/30 flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-espresso-800">
            <span className="text-[11px] text-espresso-600 font-bold">Risk:</span>
            <select
              value={selectedRisk}
              onChange={(e) => onRiskChange(e.target.value as 'All' | RiskLevel)}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-champagne-500/40 text-xs font-semibold text-espresso-900 focus:outline-none focus:border-copper-500 cursor-pointer shadow-sm"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="High">High Risk</option>
              <option value="Very High">Very High Risk</option>
            </select>
          </div>

          {/* Min. Investment Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-espresso-800">
            <span className="text-[11px] text-espresso-600 font-bold">Min Investment:</span>
            <select
              value={selectedMinInvestment}
              onChange={(e) => onMinInvestmentChange(e.target.value as MinInvestmentFilter)}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-champagne-500/40 text-xs font-semibold text-espresso-900 focus:outline-none focus:border-copper-500 cursor-pointer shadow-sm"
            >
              <option value="All">All Ticket Sizes</option>
              <option value="under_10k">&lt; ₹10,000 (Retail Accessible)</option>
              <option value="10k_to_1L">₹10,000 – ₹1,00,000</option>
              <option value="above_1L">&gt; ₹1,00,000 (HNI / SPV)</option>
            </select>
          </div>

          {/* Access Model Filter */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-espresso-800">
            <span className="text-[11px] text-espresso-600 font-bold">Access Model:</span>
            <select
              value={selectedAccessModel}
              onChange={(e) => onAccessModelChange(e.target.value as 'All' | AccessModel)}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-champagne-500/40 text-xs font-semibold text-espresso-900 focus:outline-none focus:border-copper-500 cursor-pointer shadow-sm"
            >
              <option value="All">All Access Models</option>
              <option value="Direct Public">Direct Public (Exchange Traded)</option>
              <option value="Verified Partner">Verified Partner Access</option>
            </select>
          </div>

          {/* Pricing Architecture Mode Filter */}
          {onPriceModeChange && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-espresso-800">
              <span className="text-[11px] text-espresso-600 font-bold">Pricing Mode:</span>
              <select
                value={selectedPriceMode}
                onChange={(e) => onPriceModeChange(e.target.value as 'All' | PriceMode)}
                className="px-2.5 py-1.5 rounded-xl bg-white border border-champagne-500/40 text-xs font-semibold text-espresso-900 focus:outline-none focus:border-copper-500 cursor-pointer shadow-sm"
              >
                <option value="All">All Pricing Modes</option>
                <option value="LIVE_MARKET">Live Market (NSE/BSE Listed)</option>
                <option value="PERIODIC_NAV">Periodic NAV (Private/Unlisted)</option>
              </select>
            </div>
          )}

        </div>

        {/* Results Counter & Reset Action */}
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs font-mono font-semibold text-espresso-700">
            Showing <strong className="text-copper-700">{filteredCount}</strong> of {totalCount} assets
          </span>

          {isAnyFilterActive && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-copper-700 bg-copper-500/10 hover:bg-copper-500/20 border border-copper-500/20 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
