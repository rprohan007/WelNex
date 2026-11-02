import React, { useState } from 'react';
import { LAUNCH_ASSETS } from '../../data/launchAssetsData';
import type { LaunchAssetCategory } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  Building2, 
  Building, 
  TowerControl, 
  ShieldCheck, 
  Coins, 
  ArrowUpRight, 
  X, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface LaunchAssetsGridProps {
  onOpenWaitlist?: () => void;
  onOpenExplore?: () => void;
}

export const LaunchAssetsGrid: React.FC<LaunchAssetsGridProps> = ({
  onOpenWaitlist,
  onOpenExplore
}) => {
  const [selectedAsset, setSelectedAsset] = useState<LaunchAssetCategory | null>(null);

  const getAssetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5 text-copper-600" />;
      case 'Building':
        return <Building className="w-5 h-5 text-amber-700" />;
      case 'TowerControl':
        return <TowerControl className="w-5 h-5 text-copper-700" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-700" />;
      case 'Coins':
        return <Coins className="w-5 h-5 text-yellow-700" />;
      default:
        return <Layers className="w-5 h-5 text-copper-600" />;
    }
  };

  return (
    <section id="launch-assets" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Badge variant="copper" size="sm" className="mb-3" withDot={true}>
          Priority 1 Launch Portfolio
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-espresso-950 mb-3">
          Core Alternative Asset Classes
        </h2>
        <p className="text-sm sm:text-base text-espresso-700 leading-relaxed">
          Five institutional-grade alternative investments empowering Indian investors to build resilient, yield-producing wealth.
        </p>
      </div>

      {/* Sleek 5-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {LAUNCH_ASSETS.map((asset, index) => (
          <GlassCard
            key={asset.id}
            variant="interactive"
            glowEffect="copper"
            onClick={() => setSelectedAsset(asset)}
            className="p-5 flex flex-col justify-between rounded-2xl bg-white/75 border border-champagne-500/40 hover:border-copper-500/60 shadow-glass-sm hover:shadow-glass-md transition-all duration-300 group text-left cursor-pointer relative"
          >
            {/* Top Bar with Number & Badge */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-copper-500/10 border border-copper-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {getAssetIcon(asset.iconName)}
                </div>
                <span className="font-mono text-xs font-bold text-copper-700 bg-copper-500/10 px-2 py-0.5 rounded-full border border-copper-500/20">
                  0{index + 1}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-500 block">
                  {asset.badgeText}
                </span>
                <h3 className="text-base font-display font-bold text-espresso-950 group-hover:text-copper-700 transition-colors leading-snug">
                  {asset.shortName}
                </h3>
              </div>

              <p className="text-xs text-espresso-600 line-clamp-2 mb-4 leading-relaxed">
                {asset.tagline}
              </p>
            </div>

            {/* Bottom Key Metric Pills */}
            <div className="pt-3 border-t border-champagne-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-espresso-500">
                  Indicative Yield
                </span>
                <span className="text-xs font-mono font-extrabold text-copper-600">
                  {asset.indicativeYield.split(' – ')[0]}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-espresso-500">
                  Min. Ticket
                </span>
                <span className="text-xs font-mono font-semibold text-espresso-800">
                  {asset.minInvestment}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-copper-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                <span>View Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Sliding Preview Modal for Asset Details */}
      {selectedAsset && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-espresso-950/45 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedAsset(null)}
        >
          <div 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-sand border-2 border-champagne-500/50 shadow-2xl p-6 sm:p-8 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedAsset(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-espresso-700/10 text-espresso-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="copper" size="sm">
                {selectedAsset.badgeText}
              </Badge>
              {selectedAsset.sebiRegulated && (
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  <span>SEBI Regulated Framework</span>
                </div>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-espresso-950 mb-1">
              {selectedAsset.name}
            </h3>
            <p className="text-xs sm:text-sm text-espresso-700 mb-6">
              {selectedAsset.tagline}
            </p>

            {/* 3 Key Metrics Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-copper-500/10 border border-copper-500/25">
                <span className="text-[10px] uppercase font-bold tracking-wider text-copper-700 block mb-0.5">
                  Indicative Yield
                </span>
                <span className="text-lg font-bold font-mono text-copper-600">
                  {selectedAsset.indicativeYield}
                </span>
                <span className="text-[10px] text-espresso-600 block mt-0.5">
                  Pre-tax distribution estimate
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 border border-champagne-500/40">
                <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-600 block mb-0.5">
                  Min. Investment
                </span>
                <span className="text-lg font-bold font-mono text-espresso-950">
                  {selectedAsset.minInvestment}
                </span>
                <span className="text-[10px] text-espresso-600 block mt-0.5">
                  Standard lot size
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 border border-champagne-500/40">
                <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-600 block mb-0.5">
                  Risk Level
                </span>
                <span className="text-lg font-bold text-espresso-950">
                  {selectedAsset.riskLevel}
                </span>
                <span className="text-[10px] text-espresso-600 block mt-0.5">
                  {selectedAsset.liquidity}
                </span>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-espresso-900 mb-2">
                Overview & Mechanics:
              </h4>
              <p className="text-xs sm:text-sm text-espresso-700 leading-relaxed bg-white/60 p-4 rounded-xl border border-champagne-500/30">
                {selectedAsset.description}
              </p>
            </div>

            {/* Key Highlights */}
            <div className="mb-6 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-espresso-900 mb-2">
                Key Institutional Disclosures:
              </h4>
              {selectedAsset.keyHighlights.map((hl, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-espresso-800">
                  <Sparkles className="w-3.5 h-3.5 text-copper-600 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>

            {/* Sample Indian Entities */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-espresso-900 mb-2">
                Sample Public Entities & Benchmark Instruments:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedAsset.sampleEntities.map((ent, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-lg bg-sand-200/90 border border-champagne-500/40 text-espresso-800 font-medium"
                  >
                    {ent}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-champagne-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-espresso-600">
                <AlertCircle className="w-3.5 h-3.5 text-copper-600 shrink-0" />
                <span>Indicative educational data. WelNex does not broker or execute transactions.</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setSelectedAsset(null);
                    if (onOpenExplore) onOpenExplore();
                  }}
                  className="w-full sm:w-auto text-xs shadow-md shadow-copper-500/20"
                >
                  Explore Category
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => {
                    setSelectedAsset(null);
                    if (onOpenWaitlist) onOpenWaitlist();
                  }}
                  className="w-full sm:w-auto text-xs"
                >
                  Simulate Yield
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
