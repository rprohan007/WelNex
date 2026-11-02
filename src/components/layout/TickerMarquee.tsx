import React, { useState, useMemo } from 'react';
import { TICKER_ITEMS } from '../../data/tickerData';
import type { TickerItem } from '../../types';
import { useMarketData } from '../../hooks/useMarketData';
import { 
  TrendingUp, 
  TrendingDown, 
  Radio, 
  Sparkles, 
  X, 
  Info, 
  Clock,
  Zap
} from 'lucide-react';

interface TickerMarqueeProps {
  onSelectItem?: (item: TickerItem) => void;
}

export const TickerMarquee: React.FC<TickerMarqueeProps> = ({ onSelectItem }) => {
  const [selectedAsset, setSelectedAsset] = useState<TickerItem | null>(null);
  const { quotes, lastChangedTicker, marketStatus, triggerTick, isSimulationActive, toggleSimulation } = useMarketData();

  // Dynamically merge live market quotes into ticker items
  const dynamicTickerItems = useMemo(() => {
    return TICKER_ITEMS.map((item) => {
      const quote = quotes[item.symbol];
      if (quote) {
        const isPos = quote.priceChange24h >= 0;
        const changeStr = `${isPos ? '+' : ''}${quote.priceChangePercent24h.toFixed(2)}%`;
        const formattedPrice = `₹${quote.price.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;

        return {
          ...item,
          price: formattedPrice,
          change: changeStr,
          isPositive: isPos,
          isLiveMarket: true,
          liveQuote: quote
        };
      }
      return {
        ...item,
        isLiveMarket: false,
        liveQuote: undefined
      };
    });
  }, [quotes]);

  const handleAssetClick = (item: TickerItem) => {
    setSelectedAsset(item);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  // Duplicate items for seamless continuous looping marquee
  const marqueeItems = useMemo(() => [...dynamicTickerItems, ...dynamicTickerItems], [dynamicTickerItems]);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'REIT':
        return 'text-copper-700 border-copper-500/30 bg-copper-500/10';
      case 'InvIT':
        return 'text-amber-800 border-amber-500/30 bg-amber-500/10';
      case 'Gold':
        return 'text-yellow-800 border-yellow-500/30 bg-yellow-500/10';
      case 'SDI':
        return 'text-emerald-800 border-emerald-500/30 bg-emerald-500/10';
      default:
        return 'text-espresso-700 border-espresso-500/30 bg-espresso-500/10';
    }
  };

  return (
    <>
      {/* Fixed top marquee container */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 h-10 w-full glass-ticker border-b border-champagne-500/30 overflow-hidden flex items-center select-none"
        role="region"
        aria-label="WelNex Real-Time Market Feed Marquee"
      >
        {/* Left Sticky Badge / Header */}
        <div className="z-20 shrink-0 h-full flex items-center gap-2 pl-3 pr-4 bg-sand/95 border-r border-champagne-500/30 backdrop-blur-md">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-copper-500/15 text-copper-700 border border-copper-500/30 text-[10px] font-bold tracking-wider uppercase">
            <Radio className="w-2.5 h-2.5 text-copper-600 animate-beacon" />
            <span>Market Feed</span>
          </div>

          {/* Market Open/Closed Badge */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-semibold">
            {marketStatus.isOpen ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-emerald-800 bg-emerald-500/15 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                <span>NSE OPEN</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-espresso-700 bg-espresso-500/10 border border-champagne-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                <span>NSE CLOSED</span>
              </span>
            )}
          </div>

          {/* Quick Demo Live Tick Button */}
          <button
            onClick={() => triggerTick()}
            title="Trigger a real-time market tick on an active instrument"
            className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded bg-sand-200 hover:bg-copper-500/10 border border-champagne-500/40 text-[9px] font-bold text-copper-700 transition-colors cursor-pointer"
          >
            <Zap className="w-2.5 h-2.5 text-copper-600" />
            <span>Sim Tick</span>
          </button>
        </div>

        {/* Continuous Auto-scrolling Train Track */}
        <div className="relative flex-1 overflow-hidden h-full flex items-center group">
          <div className="flex items-center whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused] will-change-transform">
            {marqueeItems.map((item, idx) => {
              const isTickingNow = lastChangedTicker === item.symbol;
              const hasLiveQuote = Boolean((item as any).isLiveMarket);

              return (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => handleAssetClick(item)}
                  type="button"
                  className={`inline-flex items-center gap-2.5 px-3.5 py-1 mx-1.5 rounded-lg text-xs transition-all duration-300 hover:bg-copper-500/10 cursor-pointer text-left ${
                    isTickingNow 
                      ? item.isPositive 
                        ? 'animate-tick-up ring-1 ring-emerald-500/30' 
                        : 'animate-tick-down ring-1 ring-rose-500/30' 
                      : ''
                  }`}
                >
                  {/* Category Pill */}
                  <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded border ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>

                  {/* Mode Badge: LIVE • NSE vs NAV */}
                  {hasLiveQuote ? (
                    <span className="inline-flex items-center gap-1 text-[8.5px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-500/15 border border-emerald-500/30 px-1 py-0.2 rounded">
                      <span className="w-1 h-1 rounded-full bg-emerald-600 animate-ping" />
                      LIVE
                    </span>
                  ) : (
                    <span className="text-[8.5px] font-bold uppercase tracking-wider text-espresso-700 bg-sand-200 border border-champagne-500/40 px-1 py-0.2 rounded">
                      NAV
                    </span>
                  )}

                  {/* Symbol & Name */}
                  <span className="font-semibold text-espresso-900 font-sans tracking-tight">
                    {item.symbol}
                  </span>

                  {/* Price with smooth transition */}
                  <span className={`font-mono font-medium price-tick-transition ${
                    isTickingNow 
                      ? item.isPositive ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold' 
                      : 'text-espresso-800'
                  }`}>
                    {item.price}
                  </span>

                  {/* Yield Accent Pill */}
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-copper-500/15 text-copper-700 font-medium">
                    <span className="text-[9px] uppercase font-bold text-copper-600">Yield:</span>
                    <span className="font-semibold font-mono text-[11px]">{item.distributionYield}</span>
                  </div>

                  {/* Change indicator */}
                  <span className={`inline-flex items-center gap-0.5 font-bold text-[11px] font-mono price-tick-transition ${
                    item.isPositive 
                      ? 'text-emerald-700' 
                      : item.change === 'Fixed' 
                      ? 'text-copper-700' 
                      : 'text-rose-700'
                  }`}>
                    {item.isPositive && item.change !== 'Fixed' && <TrendingUp className="w-3 h-3" />}
                    {!item.isPositive && <TrendingDown className="w-3 h-3" />}
                    {item.change}
                  </span>

                  {/* Separator icon */}
                  <span className="text-champagne-400/80 ml-1 text-xs font-bold">•</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Subtle Action / Legend */}
        <div className="hidden lg:flex shrink-0 h-full items-center gap-2.5 pr-3 pl-3 bg-sand/95 border-l border-champagne-500/30 text-[10px] text-espresso-600">
          <button
            onClick={toggleSimulation}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-sand-200 hover:bg-champagne-500/20 text-espresso-700 font-medium transition-colors cursor-pointer"
            title="Toggle simulated exchange live ticks"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isSimulationActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            <span>Feed: {isSimulationActive ? 'Active' : 'Paused'}</span>
          </button>
          <span className="italic text-espresso-500">Hover to pause</span>
        </div>
      </div>

      {/* Quick Asset Snapshot Modal from Ticker Click */}
      {selectedAsset && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/40 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedAsset(null)}
        >
          <div 
            className="w-full max-w-md p-6 rounded-3xl bg-sand border border-champagne-500/50 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAsset(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-espresso-700/10 text-espresso-600 cursor-pointer"
              aria-label="Close Asset Details"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getCategoryColor(selectedAsset.category)}`}>
                {selectedAsset.category}
              </span>

              {quotes[selectedAsset.symbol] ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-800 bg-emerald-500/15 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  LIVE • NSE LISTED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-copper-800 bg-copper-500/15 border border-copper-500/30">
                  PERIODIC NAV VALUATION
                </span>
              )}

              <span className="text-xs text-copper-600 font-medium flex items-center gap-1 ml-auto">
                <Sparkles className="w-3 h-3" />
                {selectedAsset.highlightTag || 'Discovery Focus'}
              </span>
            </div>

            <h3 className="text-xl font-display font-bold text-espresso-950">
              {selectedAsset.name}
            </h3>
            <p className="text-xs text-espresso-600 mb-5">
              Ticker Symbol: <span className="font-mono font-bold text-espresso-900">{selectedAsset.symbol}</span>
              {quotes[selectedAsset.symbol] ? ' (NSE / BSE Real-Time)' : ' (Private / Unlisted Vehicle)'}
            </p>

            {/* Price Callout Cards */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-white/80 border border-champagne-500/40">
                <span className="text-[10px] uppercase tracking-wider text-espresso-600 block mb-0.5 font-semibold">
                  {quotes[selectedAsset.symbol] ? 'Real-Time Unit Price' : 'Assessed Unit NAV'}
                </span>
                <span className="text-xl font-bold font-mono text-espresso-950">
                  {quotes[selectedAsset.symbol] ? `₹${quotes[selectedAsset.symbol].price.toFixed(2)}` : selectedAsset.price}
                </span>
                {quotes[selectedAsset.symbol] && (
                  <span className={`text-[11px] font-mono font-bold block mt-0.5 ${
                    quotes[selectedAsset.symbol].priceChange24h >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {quotes[selectedAsset.symbol].priceChange24h >= 0 ? '+' : ''}
                    ₹{quotes[selectedAsset.symbol].priceChange24h.toFixed(2)} ({quotes[selectedAsset.symbol].priceChangePercent24h.toFixed(2)}%)
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-copper-500/10 border border-copper-500/30">
                <span className="text-[10px] uppercase tracking-wider text-copper-700 block mb-0.5 font-semibold">
                  Distribution Yield
                </span>
                <span className="text-xl font-bold font-mono text-copper-600">
                  {selectedAsset.distributionYield}
                </span>
                <span className="text-[10px] text-copper-700/80 block mt-0.5 font-medium">
                  {selectedAsset.payoutFrequency || 'Quarterly Payout'}
                </span>
              </div>
            </div>

            {/* Detailed Price Shift Stats for Listed Assets */}
            {quotes[selectedAsset.symbol] ? (
              <div className="p-3 rounded-xl bg-sand-100/90 border border-champagne-500/30 space-y-2 text-xs mb-4">
                <div className="flex justify-between items-center text-espresso-700">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-espresso-500" />
                    Market Session
                  </span>
                  <span className="font-semibold text-espresso-900">{marketStatus.statusText}</span>
                </div>
                <div className="flex justify-between items-center text-espresso-700">
                  <span>Day Range (High / Low)</span>
                  <span className="font-mono font-bold text-espresso-900">
                    ₹{quotes[selectedAsset.symbol].dayLow.toFixed(2)} – ₹{quotes[selectedAsset.symbol].dayHigh.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-espresso-700">
                  <span>Feed Source</span>
                  <span className="font-semibold text-copper-700">
                    {quotes[selectedAsset.symbol].source === 'LIVE_API' ? 'NSE Real-Time API' : 'NSE Live Feed (Delayed)'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-sand-100/90 border border-champagne-500/30 space-y-2 text-xs mb-4">
                <div className="flex justify-between items-center text-espresso-700">
                  <span>Valuation Frequency</span>
                  <span className="font-semibold text-espresso-900">Quarterly Audited NAV</span>
                </div>
                <div className="flex justify-between items-center text-espresso-700">
                  <span>Last Valuation Cycle</span>
                  <span className="font-semibold text-copper-700">Q3 2026 Audit Complete</span>
                </div>
                <div className="flex justify-between items-center text-espresso-700">
                  <span>Pricing Nature</span>
                  <span className="font-medium text-espresso-800">Unlisted / Fixed Asset Backed</span>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-champagne-500/15 border border-champagne-500/30 flex items-start gap-2 text-[11px] text-espresso-800">
              <Info className="w-4 h-4 shrink-0 text-copper-600 mt-0.5" />
              <span>
                WelNex provides indicative public data and educational analysis. WelNex does not broker or execute transactions.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
