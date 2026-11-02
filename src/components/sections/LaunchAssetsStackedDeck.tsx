import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  LayoutGrid,
  CreditCard
} from 'lucide-react';

interface LaunchAssetsStackedDeckProps {
  onOpenWaitlist?: () => void;
  onOpenExplore?: () => void;
}

export const LaunchAssetsStackedDeck: React.FC<LaunchAssetsStackedDeckProps> = ({
  onOpenWaitlist,
  onOpenExplore
}) => {
  const [selectedAsset, setSelectedAsset] = useState<LaunchAssetCategory | null>(null);
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');

  // Track scroll position of each card to apply subtle scale(0.96) and contrast dimming to underlying cards
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardScales, setCardScales] = useState<number[]>([1, 1, 1, 1, 1]);
  const [cardDimming, setCardDimming] = useState<number[]>([1, 1, 1, 1, 1]);

  useEffect(() => {
    if (viewMode !== 'deck') return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const newScales = [1, 1, 1, 1, 1];
          const newDimming = [1, 1, 1, 1, 1];

          cardRefs.current.forEach((cardEl, idx) => {
            if (!cardEl) return;
            const nextCardEl = cardRefs.current[idx + 1];
            if (nextCardEl) {
              const nextRect = nextCardEl.getBoundingClientRect();
              const stickyThreshold = 140; // Approx top sticky distance
              const windowHeight = window.innerHeight;

              if (nextRect.top < windowHeight && nextRect.top > stickyThreshold) {
                const progress = (windowHeight - nextRect.top) / (windowHeight - stickyThreshold);
                // Scale underlying card down to 0.96
                newScales[idx] = 1 - (progress * 0.04);
                // Subtle contrast dimming
                newDimming[idx] = 1 - (progress * 0.08);
              } else if (nextRect.top <= stickyThreshold) {
                newScales[idx] = 0.96;
                newDimming[idx] = 0.92;
              }
            }
          });

          setCardScales(newScales);
          setCardDimming(newDimming);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

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
    <section id="launch-assets" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand scroll-mt-24">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge variant="copper" size="sm" className="mb-3" withDot={true}>
          Priority Yield Instruments
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-espresso-950 mb-3">
          Priority 1 Alternative Asset Classes
        </h2>
        <p className="text-sm sm:text-base text-espresso-700 leading-relaxed">
          Five institutional-grade yield instruments in India. Scroll to see incoming category cards slide smoothly over like a playing card deck.
        </p>

        {/* View Mode Toggle Switch */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-sand-200/90 border border-champagne-500/40 mt-6 shadow-sm">
          <button
            onClick={() => setViewMode('deck')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'deck'
                ? 'bg-copper-500 text-sand-50 shadow-sm'
                : 'text-espresso-700 hover:text-copper-700'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Stacked Card Deck</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-copper-500 text-sand-50 shadow-sm'
                : 'text-espresso-700 hover:text-copper-700'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>5-Column Grid</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: EFFECT 4 STACKED DECK SCROLL MOTION */}
      {viewMode === 'deck' && (
        <div className="relative max-w-4xl mx-auto space-y-16 pb-24">
          {LAUNCH_ASSETS.map((asset, index) => {
            const scale = cardScales[index] || 1;
            const dimming = cardDimming[index] || 1;
            const stickyTop = 110 + index * 10; // Slightly staggered sticky offsets

            return (
              <div
                key={asset.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="sticky w-full will-change-transform [transform:translateZ(0)]"
                style={{
                  top: `${stickyTop}px`,
                  zIndex: 20 + index
                }}
              >
                <div 
                  style={{ 
                    transform: `scale(${scale}) translateZ(0)`, 
                    opacity: dimming,
                    filter: `brightness(${dimming})`
                  }}
                  className="origin-top will-change-transform [transform:translateZ(0)]"
                >
                  <GlassCard
                    variant="elevated"
                    className="p-6 sm:p-8 rounded-3xl border-2 border-champagne-500/50 bg-white/90 shadow-[0_15px_45px_rgba(74,43,29,0.10)] relative overflow-hidden text-left"
                  >
                    {/* Background Index Watermark */}
                    <div className="absolute top-2 right-6 font-mono text-7xl sm:text-8xl font-black text-champagne-500/15 pointer-events-none select-none">
                      0{index + 1}
                    </div>

                    <div className="relative z-10">
                      
                      {/* Top Row: Category Type, Badge, and Regulation Tag */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-copper-500/10 border border-copper-500/25 flex items-center justify-center shrink-0">
                            {getAssetIcon(asset.iconName)}
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-copper-700 block">
                              Category 0{index + 1} of 05
                            </span>
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-extrabold text-espresso-950 break-words">
                              {asset.name}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="copper" size="sm">
                            {asset.badgeText}
                          </Badge>
                          {asset.sebiRegulated && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>SEBI Governed</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-espresso-700 font-medium mb-6 leading-relaxed max-w-2xl break-words">
                        {asset.description}
                      </p>

                      {/* 3 Key Metrics Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                        <div className="p-3.5 rounded-xl bg-copper-500/10 border border-copper-500/25">
                          <span className="text-[10px] uppercase font-bold text-copper-700 block mb-0.5">
                            Indicative Yield
                          </span>
                          <span className="text-xl font-bold font-mono text-copper-600">
                            {asset.indicativeYield}
                          </span>
                          <span className="text-[10px] text-espresso-600 block mt-0.5">
                            Pre-tax annual distribution
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/80 border border-champagne-500/40">
                          <span className="text-[10px] uppercase font-bold text-espresso-600 block mb-0.5">
                            Min. Investment
                          </span>
                          <span className="text-xl font-bold font-mono text-espresso-950">
                            {asset.minInvestment}
                          </span>
                          <span className="text-[10px] text-espresso-600 block mt-0.5">
                            Retail accessible unit lot
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-white/80 border border-champagne-500/40">
                          <span className="text-[10px] uppercase font-bold text-espresso-600 block mb-0.5">
                            Risk & Liquidity
                          </span>
                          <span className="text-base font-bold text-espresso-950">
                            {asset.riskLevel}
                          </span>
                          <span className="text-[10px] text-espresso-600 block mt-0.5">
                            {asset.liquidity.split(' (')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Sample Entities Chips & Actions */}
                      <div className="pt-4 border-t border-champagne-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-espresso-500 block">
                            Sample Indian Benchmark Entities:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {asset.sampleEntities.slice(0, 3).map((ent, eIdx) => (
                              <span
                                key={eIdx}
                                className="text-[11px] px-2.5 py-0.5 rounded-lg bg-sand-200/90 border border-champagne-500/30 text-espresso-800 font-medium"
                              >
                                {ent}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedAsset(asset)}
                            className="text-xs font-semibold"
                          >
                            Quick Inspect
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={onOpenExplore}
                            icon={<ArrowUpRight className="w-3.5 h-3.5" />}
                            className="text-xs font-semibold shadow-sm shadow-copper-500/20"
                          >
                            Explore Asset
                          </Button>
                        </div>
                      </div>

                    </div>
                  </GlassCard>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: 5-COLUMN GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 animate-fadeIn">
          {LAUNCH_ASSETS.map((asset, index) => (
            <GlassCard
              key={asset.id}
              variant="interactive"
              glowEffect="copper"
              onClick={() => setSelectedAsset(asset)}
              className="p-5 flex flex-col justify-between rounded-2xl bg-white/80 border border-champagne-500/40 hover:border-copper-500/60 shadow-glass-sm hover:shadow-glass-md transition-all duration-300 group text-left cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-copper-500/10 border border-copper-500/25 flex items-center justify-center shrink-0">
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

                <div className="pt-2 flex items-center justify-between text-xs text-copper-700 font-semibold">
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Sliding Preview Modal for Detailed Asset Information */}
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
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-espresso-700/10 text-espresso-700 transition-colors cursor-pointer"
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
                  className="w-full sm:w-auto text-xs shadow-md shadow-copper-500/20 font-semibold"
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
                  className="w-full sm:w-auto text-xs font-semibold"
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
