import React, { useState } from 'react';
import { ASSET_COMPARISONS } from '../../data/assetData';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Building2, TowerControl, Layers, Landmark, CircleDollarSign, ArrowUpRight } from 'lucide-react';

interface AssetComparisonPreviewProps {
  onOpenWaitlist?: () => void;
}

export const AssetComparisonPreview: React.FC<AssetComparisonPreviewProps> = ({ onOpenWaitlist }) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(ASSET_COMPARISONS[0].id);

  const selectedAsset = ASSET_COMPARISONS.find(a => a.id === selectedAssetId) || ASSET_COMPARISONS[0];

  const getAssetIcon = (id: string) => {
    switch (id) {
      case 'reits':
        return <Building2 className="w-5 h-5" />;
      case 'invits':
        return <TowerControl className="w-5 h-5" />;
      case 'sdi':
        return <Layers className="w-5 h-5" />;
      case 'bonds':
        return <Landmark className="w-5 h-5" />;
      default:
        return <CircleDollarSign className="w-5 h-5" />;
    }
  };

  return (
    <section id="compare" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Badge variant="champagne" size="sm" className="mb-3">
          Asset Matrix & Benchmarking
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-espresso-950 mb-4">
          Compare Alternative Asset Classes in India
        </h2>
        <p className="text-sm sm:text-base text-espresso-700">
          Understand how commercial real estate, utility infrastructure, and securitized credit differ in yield, risk, and liquidity.
        </p>
      </div>

      {/* Category Selection Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8">
        {ASSET_COMPARISONS.map((asset) => {
          const isSelected = asset.id === selectedAssetId;
          return (
            <button
              key={asset.id}
              onClick={() => setSelectedAssetId(asset.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-copper-500 text-sand-50 shadow-md shadow-copper-500/30'
                  : 'bg-white/70 text-espresso-800 border border-champagne-500/30 hover:border-copper-500/50 hover:bg-white'
              }`}
            >
              <span className={isSelected ? 'text-sand-50' : 'text-copper-600'}>
                {getAssetIcon(asset.id)}
              </span>
              <span>{asset.name.split(' (')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Comparison Glass Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Asset Detail Card */}
        <div className="lg:col-span-7">
          <GlassCard variant="elevated" className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <Badge variant="copper" size="sm">
                {selectedAsset.category}
              </Badge>
              <div className="flex items-center gap-2 text-xs text-espresso-600">
                <span>Risk Profile:</span>
                <strong className="text-copper-600 font-semibold">{selectedAsset.riskRating}</strong>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-bold text-espresso-950 mb-3">
              {selectedAsset.name}
            </h3>

            <p className="text-sm text-espresso-700 leading-relaxed mb-6">
              {selectedAsset.description}
            </p>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-copper-500/10 border border-copper-500/25">
                <span className="text-[11px] uppercase tracking-wider text-copper-700 font-bold block mb-1">
                  Target Indicative Yield
                </span>
                <span className="text-2xl font-bold font-mono text-copper-600">
                  {selectedAsset.indicativeYield}
                </span>
                <span className="text-[10px] text-espresso-600 block mt-1">
                  Net of SPV asset level taxes
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/80 border border-champagne-500/30">
                <span className="text-[11px] uppercase tracking-wider text-espresso-600 font-bold block mb-1">
                  Market Liquidity
                </span>
                <span className="text-base font-bold text-espresso-900">
                  {selectedAsset.liquidity}
                </span>
                <span className="text-[10px] text-espresso-600 block mt-1">
                  NSE & BSE trading settlement
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/80 border border-champagne-500/30">
                <span className="text-[11px] uppercase tracking-wider text-espresso-600 font-bold block mb-1">
                  Min Investment Lot
                </span>
                <span className="text-base font-bold font-mono text-espresso-900">
                  {selectedAsset.minInvestment}
                </span>
                <span className="text-[10px] text-espresso-600 block mt-1">
                  Accessible to retail investors
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white/80 border border-champagne-500/30">
                <span className="text-[11px] uppercase tracking-wider text-espresso-600 font-bold block mb-1">
                  Tax Treatment
                </span>
                <span className="text-xs font-semibold text-espresso-800 line-clamp-2">
                  {selectedAsset.taxEfficiency}
                </span>
              </div>
            </div>

            {/* Example Listed Instruments */}
            <div className="pt-4 border-t border-champagne-500/25">
              <span className="text-xs font-bold uppercase tracking-wider text-espresso-600 block mb-2.5">
                Representative Public Instruments in India:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedAsset.instruments.map((inst, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-lg bg-sand-200/90 border border-champagne-500/40 text-espresso-800 font-medium"
                  >
                    {inst}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Comparative Quick Matrix & Simulation Card */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard variant="default" className="p-6">
            <h4 className="text-lg font-display font-bold text-espresso-900 mb-2 flex items-center gap-2">
              <span>Interactive Yield Benchmark</span>
              <Badge variant="subtle" size="xs">Live Spread</Badge>
            </h4>
            <p className="text-xs text-espresso-600 mb-5">
              Compare alternative yields against the risk-free Indian 10-Year Government Bond (G-Sec ~7.05%).
            </p>

            {/* Yield Visualizer Bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-espresso-800">10Y India G-Sec (Risk-free benchmark)</span>
                  <span className="font-mono text-espresso-700">7.05%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-sand-300 overflow-hidden">
                  <div className="h-full bg-espresso-400 rounded-full" style={{ width: '50%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-espresso-800">Commercial REITs</span>
                  <span className="font-mono text-copper-600">7.85% (+80 bps spread)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-sand-300 overflow-hidden">
                  <div className="h-full bg-copper-500 rounded-full" style={{ width: '58%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-espresso-800">Infrastructure InvITs</span>
                  <span className="font-mono text-amber-700">11.80% (+475 bps spread)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-sand-300 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-espresso-800">Securitized Debt (SDI)</span>
                  <span className="font-mono text-emerald-700">13.25% (+620 bps spread)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-sand-300 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '96%' }} />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-champagne-500/25">
              <Button
                variant="primary"
                size="md"
                onClick={onOpenWaitlist}
                icon={<ArrowUpRight className="w-4 h-4" />}
                className="w-full shadow-md shadow-copper-500/20"
              >
                Model In Virtual Simulator
              </Button>
            </div>
          </GlassCard>

          {/* Quick Explainer Pill */}
          <div className="p-4 rounded-2xl bg-champagne-500/20 border border-champagne-500/40 text-xs text-espresso-800">
            <span className="font-bold block mb-1">Did You Know?</span>
            SEBI mandates that REITs and InvITs hold at least 80% of their asset value in completed and revenue-generating properties. Under-construction speculation is strictly capped at 20%.
          </div>
        </div>

      </div>
    </section>
  );
};
