import { useState, useEffect, useCallback, useMemo } from 'react';
import { marketDataService, getIndianMarketStatus } from '../services/marketDataService';
import type { MarketQuote, InvestmentItem } from '../types';

export function useMarketData() {
  const [quotes, setQuotes] = useState<Record<string, MarketQuote>>(() => marketDataService.getAllQuotes());
  const [lastChangedTicker, setLastChangedTicker] = useState<string | null>(null);
  const [marketStatus, setMarketStatus] = useState(() => getIndianMarketStatus());
  const [isSimulationActive, setIsSimulationActive] = useState<boolean>(() => marketDataService.isSimulationRunning());

  useEffect(() => {
    // 1. Subscribe to market data updates
    const unsubscribe = marketDataService.subscribe((updatedQuotes, changed) => {
      setQuotes(updatedQuotes);
      if (changed) {
        setLastChangedTicker(changed);
        // Clear highlight pulse after 1.5s
        const timer = setTimeout(() => {
          setLastChangedTicker((prev) => (prev === changed ? null : prev));
        }, 1500);
        return () => clearTimeout(timer);
      }
    });

    // 2. Refresh market status every minute
    const statusInterval = setInterval(() => {
      setMarketStatus(getIndianMarketStatus());
    }, 60000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
    };
  }, []);

  const getQuote = useCallback(
    (symbolTicker?: string): MarketQuote | undefined => {
      if (!symbolTicker) return undefined;
      return quotes[symbolTicker.toUpperCase()];
    },
    [quotes]
  );

  const toggleSimulation = useCallback(() => {
    const next = !isSimulationActive;
    marketDataService.setSimulationActive(next);
    setIsSimulationActive(next);
  }, [isSimulationActive]);

  const triggerTick = useCallback((symbol?: string) => {
    marketDataService.triggerManualTick(symbol);
  }, []);

  const refreshMarketData = useCallback(async () => {
    await marketDataService.fetchLiveMarketQuotes();
    setMarketStatus(getIndianMarketStatus());
  }, []);

  return {
    quotes,
    getQuote,
    marketStatus,
    lastChangedTicker,
    isSimulationActive,
    toggleSimulation,
    triggerTick,
    refreshMarketData
  };
}

/**
 * Hook to get resolved live market or periodic NAV data for an investment
 */
export function useAssetLivePrice(item?: InvestmentItem | null) {
  const { getQuote, lastChangedTicker } = useMarketData();

  return useMemo(() => {
    if (!item) {
      return {
        isLiveMode: false,
        displayPrice: '₹0.00',
        numericPrice: 0,
        change24h: '0.00',
        changePercent24h: '0.00%',
        isPositive: true,
        lastUpdatedText: 'Unknown',
        badgeText: 'Periodic NAV',
        isPulsing: false,
        dayHigh: undefined,
        dayLow: undefined,
        source: 'STATIC_FALLBACK' as const
      };
    }

    const symbolKey = (item.symbolTicker || item.symbol || '').toUpperCase();
    const isLiveMode = item.priceMode === 'LIVE_MARKET' || (!item.priceMode && ['REIT', 'InvIT'].includes(item.category));
    const liveQuote = symbolKey ? getQuote(symbolKey) : undefined;

    if (isLiveMode) {
      // Prioritize liveNsePrice from marketPriceService, then item.currentPrice from Admin CMS, then liveQuote
      const price = (typeof item.liveNsePrice === 'number' && item.liveNsePrice > 0)
        ? item.liveNsePrice
        : (typeof item.currentPrice === 'number' && item.currentPrice > 0)
          ? item.currentPrice
          : (liveQuote?.price ?? (item.minInvestmentNumeric || 0));

      const change = typeof item.priceChange24h === 'number'
        ? item.priceChange24h
        : (liveQuote?.priceChange24h ?? 0);

      const changePct = typeof item.priceChangePercent24h === 'number'
        ? item.priceChangePercent24h
        : (liveQuote?.priceChangePercent24h ?? 0);

      const isPositive = change >= 0;

      const formatPrice = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2
        }).format(val);
      };

      const sign = isPositive ? '+' : '';
      const changeText = `${sign}${change.toFixed(2)}`;
      const changePctText = `${sign}${changePct.toFixed(2)}%`;

      const lastUpdatedDate = liveQuote?.lastUpdated ? new Date(liveQuote.lastUpdated) : new Date();
      const lastUpdatedText = lastUpdatedDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });

      const isPulsing = lastChangedTicker === symbolKey;

      return {
        isLiveMode: true,
        displayPrice: formatPrice(price),
        numericPrice: price,
        change24h: changeText,
        changePercent24h: changePctText,
        numericChange: change,
        numericChangePct: changePct,
        isPositive,
        lastUpdatedText: `As of ${lastUpdatedText} IST`,
        badgeText: 'LIVE • NSE',
        isPulsing,
        dayHigh: liveQuote?.dayHigh || item.dayHigh || (price * 1.01),
        dayLow: liveQuote?.dayLow || item.dayLow || (price * 0.99),
        source: liveQuote?.source || 'STATIC_FALLBACK'
      };
    } else {
      // Unlisted / Periodic NAV mode
      const valuation = item.currentPrice || item.minInvestmentNumeric || 10000;
      const formatPrice = (val: number) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(val);
      };

      const valuationPeriod = item.lastValuationPeriod || 'Q3 2026';
      const yieldFreq = item.yieldPayoutFrequency || item.distributionFrequency || 'Quarterly';

      return {
        isLiveMode: false,
        displayPrice: formatPrice(valuation),
        numericPrice: valuation,
        change24h: 'Fixed',
        changePercent24h: 'Valued ' + valuationPeriod,
        numericChange: 0,
        numericChangePct: 0,
        isPositive: true,
        lastUpdatedText: `Last Valued: ${valuationPeriod}`,
        badgeText: `${yieldFreq} NAV`,
        isPulsing: false,
        dayHigh: undefined,
        dayLow: undefined,
        source: 'SUPABASE_CACHE' as const,
        valuationPeriod,
        targetYield: item.indicativeYield
      };
    }
  }, [item, getQuote, lastChangedTicker]);
}
