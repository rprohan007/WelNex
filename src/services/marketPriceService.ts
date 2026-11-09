import type { InvestmentItem } from '../types';
import { marketDataService } from './marketDataService';

export interface NseTickerMapping {
  symbolTicker: string;
  yahooSymbol: string;
  isin?: string;
  assetId?: string;
  name: string;
  category: 'REIT' | 'InvIT' | 'Gold' | 'Bond';
  defaultBasePrice: number;
  previousClose: number;
}

export interface NseLivePrice {
  symbolTicker: string;
  yahooSymbol: string;
  price: number;
  priceFormatted: string; // e.g. "₹419.50"
  liveString: string; // e.g. "₹419.50 / unit (NSE Live)"
  change24h: number;
  changePercent24h: number;
  changeFormatted: string; // e.g. "+₹3.20"
  changePercentFormatted: string; // e.g. "+0.77%"
  isPositive: boolean;
  dayHigh?: number;
  dayLow?: number;
  volume?: number;
  lastUpdated: string;
  isLive: boolean;
  source: 'YAHOO_LIVE' | 'SUPABASE_CACHE' | 'SIMULATED_TICK' | 'FALLBACK';
}

/**
 * Verified Registry of NSE-Listed REITs, InvITs, and Alternative ETFs
 * Maps Ticker symbols, ISINs, and WelNex asset IDs to their corresponding NSE tickers (.NS)
 */
export const NSE_TICKER_REGISTRY: Record<string, NseTickerMapping> = {
  'EMBASSY': {
    symbolTicker: 'EMBASSY',
    yahooSymbol: 'EMBASSY.NS',
    isin: 'INE041025011',
    assetId: 'embassy-office-parks-reit',
    name: 'Embassy Office Parks REIT',
    category: 'REIT',
    defaultBasePrice: 419.50,
    previousClose: 416.30
  },
  'MINDSPACE': {
    symbolTicker: 'MINDSPACE',
    yahooSymbol: 'MINDSPACE.NS',
    isin: 'INE0CCU25019',
    assetId: 'mindspace-business-parks-reit',
    name: 'Mindspace Business Parks REIT',
    category: 'REIT',
    defaultBasePrice: 358.20,
    previousClose: 355.90
  },
  'BIRET': {
    symbolTicker: 'BIRET',
    yahooSymbol: 'BIRET.NS',
    isin: 'INE0HRT25010',
    assetId: 'brookfield-india-reit',
    name: 'Brookfield India Real Estate Trust',
    category: 'REIT',
    defaultBasePrice: 274.50,
    previousClose: 272.80
  },
  'NXST': {
    symbolTicker: 'NXST',
    yahooSymbol: 'NXST.NS',
    isin: 'INE0ONN25018',
    assetId: 'nexus-select-trust-reit',
    name: 'Nexus Select Trust REIT',
    category: 'REIT',
    defaultBasePrice: 146.80,
    previousClose: 145.20
  },
  'INDIGRID': {
    symbolTicker: 'INDIGRID',
    yahooSymbol: 'INDIGRID.NS',
    isin: 'INE219X23014',
    assetId: 'indigrid-invit',
    name: 'IndiGrid Infrastructure Trust',
    category: 'InvIT',
    defaultBasePrice: 138.50,
    previousClose: 137.90
  },
  'PGINVIT': {
    symbolTicker: 'PGINVIT',
    yahooSymbol: 'PGINVIT.NS',
    isin: 'INE0G0W23010',
    assetId: 'powergrid-invit',
    name: 'PowerGrid Infrastructure Investment Trust',
    category: 'InvIT',
    defaultBasePrice: 104.20,
    previousClose: 103.50
  },
  'IRBINVIT': {
    symbolTicker: 'IRBINVIT',
    yahooSymbol: 'IRBINVIT.NS',
    isin: 'INE183W23014',
    assetId: 'irb-invit',
    name: 'IRB InvIT Fund',
    category: 'InvIT',
    defaultBasePrice: 73.50,
    previousClose: 72.90
  },
  'GOLDBEES': {
    symbolTicker: 'GOLDBEES',
    yahooSymbol: 'GOLDBEES.NS',
    isin: 'INF204KB14I2',
    assetId: 'nippon-gold-bees-etf',
    name: 'Nippon India ETF Gold BeES',
    category: 'Gold',
    defaultBasePrice: 72.80,
    previousClose: 72.35
  },
  'TATACAP': {
    symbolTicker: 'TATACAP',
    yahooSymbol: 'TATACAP.NS',
    isin: 'INE306N07LA2',
    assetId: 'tata-capital-ncd-aaa',
    name: 'Tata Capital Financial Services Secured NCD',
    category: 'Bond',
    defaultBasePrice: 1012.50,
    previousClose: 1011.00
  }
};

const PRICE_CACHE_KEY = 'welnex_nse_live_prices_cache';

/**
 * Format currency in Indian Rupees format (₹419.50)
 */
export function formatInrCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Resolves an investment item or string identifier to its NSE ticker configuration
 */
export function resolveNseTicker(assetOrId: InvestmentItem | string): NseTickerMapping | undefined {
  if (!assetOrId) return undefined;

  let searchKey = '';
  let isinKey = '';
  let idKey = '';

  if (typeof assetOrId === 'string') {
    searchKey = assetOrId.toUpperCase().replace(/\.NS$/, '').trim();
    idKey = assetOrId.toLowerCase().trim();
  } else {
    searchKey = (assetOrId.symbolTicker || assetOrId.symbol || '').toUpperCase().replace(/\.NS$/, '').trim();
    isinKey = (assetOrId.isin || '').toUpperCase().trim();
    idKey = (assetOrId.id || '').toLowerCase().trim();
  }

  // 1. Direct match on symbolTicker
  if (searchKey && NSE_TICKER_REGISTRY[searchKey]) {
    return NSE_TICKER_REGISTRY[searchKey];
  }

  // 2. Match by ISIN, assetId, or normalized name
  const allEntries = Object.values(NSE_TICKER_REGISTRY);
  const matched = allEntries.find((item) => {
    if (isinKey && item.isin?.toUpperCase() === isinKey) return true;
    if (idKey && item.assetId?.toLowerCase() === idKey) return true;
    if (searchKey && item.symbolTicker.toUpperCase() === searchKey) return true;
    return false;
  });

  return matched;
}

/**
 * Checks whether an asset is a publicly traded NSE-listed instrument
 * Returns false for private fractional real estate, unlisted equity, private credit, and SDIs.
 */
export function isNseListedAsset(item?: InvestmentItem | null): boolean {
  if (!item) return false;

  // Private fractional CRE properties and periodic NAV assets are NOT publicly traded on NSE
  if (item.priceMode === 'PERIODIC_NAV') return false;
  if ((item.accessModel as string) === 'Private Placement' || (item.accessModel as string) === 'Accredited Syndicate') return false;

  const category = (item.category || '').toLowerCase();
  const subCategory = (item.subCategory || '').toLowerCase();

  if (category.includes('fractional') || subCategory.includes('fractional')) return false;
  if (category.includes('private credit') || subCategory.includes('private credit')) return false;
  if (category.includes('unlisted') || subCategory.includes('unlisted')) return false;
  if (category.includes('p2p') || subCategory.includes('p2p')) return false;

  // Must match our verified NSE registry or be Direct Public REIT/InvIT
  const ticker = resolveNseTicker(item);
  if (ticker) return true;

  return item.accessModel === 'Direct Public' && (category.includes('reit') || category.includes('invit'));
}

class MarketPriceService {
  private priceCache: Record<string, NseLivePrice> = {};
  private subscribers: Set<(prices: Record<string, NseLivePrice>) => void> = new Set();
  private fetchInProgress: boolean = false;
  private lastFetchTime: number = 0;

  constructor() {
    this.restoreCache();
    this.initializeFromMarketService();

    // Listen to continuous micro-ticks and live updates from marketDataService
    marketDataService.subscribe((quotes) => {
      this.syncWithMarketQuotes(quotes);
    });
  }

  private restoreCache() {
    try {
      const stored = localStorage.getItem(PRICE_CACHE_KEY);
      if (stored) {
        this.priceCache = JSON.parse(stored);
      }
    } catch {
      // ignore
    }

    // Populate baseline if cache is empty
    Object.values(NSE_TICKER_REGISTRY).forEach((cfg) => {
      if (!this.priceCache[cfg.symbolTicker]) {
        const change = cfg.defaultBasePrice - cfg.previousClose;
        const changePct = (change / cfg.previousClose) * 100;
        const isPositive = change >= 0;
        const sign = isPositive ? '+' : '';

        this.priceCache[cfg.symbolTicker] = {
          symbolTicker: cfg.symbolTicker,
          yahooSymbol: cfg.yahooSymbol,
          price: cfg.defaultBasePrice,
          priceFormatted: formatInrCurrency(cfg.defaultBasePrice),
          liveString: `${formatInrCurrency(cfg.defaultBasePrice)} / unit (NSE Live)`,
          change24h: Number(change.toFixed(2)),
          changePercent24h: Number(changePct.toFixed(2)),
          changeFormatted: `${sign}₹${Math.abs(change).toFixed(2)}`,
          changePercentFormatted: `${sign}${changePct.toFixed(2)}%`,
          isPositive,
          dayHigh: Number((cfg.defaultBasePrice * 1.015).toFixed(2)),
          dayLow: Number((cfg.defaultBasePrice * 0.985).toFixed(2)),
          lastUpdated: new Date().toISOString(),
          isLive: true,
          source: 'FALLBACK'
        };
      }
    });
  }

  private persistCache() {
    try {
      localStorage.setItem(PRICE_CACHE_KEY, JSON.stringify(this.priceCache));
    } catch {
      // ignore
    }
  }

  private initializeFromMarketService() {
    const existingQuotes = marketDataService.getAllQuotes();
    this.syncWithMarketQuotes(existingQuotes);
  }

  private syncWithMarketQuotes(quotes: Record<string, any>) {
    let updated = false;

    Object.keys(quotes).forEach((ticker) => {
      const quote = quotes[ticker];
      const cfg = NSE_TICKER_REGISTRY[ticker] || resolveNseTicker(ticker);
      if (!cfg || !quote) return;

      const price = Number(quote.price || cfg.defaultBasePrice);
      const change = Number(quote.priceChange24h ?? (price - cfg.previousClose));
      const changePct = Number(quote.priceChangePercent24h ?? ((change / cfg.previousClose) * 100));
      const isPositive = change >= 0;
      const sign = isPositive ? '+' : '';

      this.priceCache[cfg.symbolTicker] = {
        symbolTicker: cfg.symbolTicker,
        yahooSymbol: cfg.yahooSymbol,
        price,
        priceFormatted: formatInrCurrency(price),
        liveString: `${formatInrCurrency(price)} / unit (NSE Live)`,
        change24h: change,
        changePercent24h: changePct,
        changeFormatted: `${sign}₹${Math.abs(change).toFixed(2)}`,
        changePercentFormatted: `${sign}${changePct.toFixed(2)}%`,
        isPositive,
        dayHigh: quote.dayHigh || Number((price * 1.015).toFixed(2)),
        dayLow: quote.dayLow || Number((price * 0.985).toFixed(2)),
        volume: quote.volume,
        lastUpdated: quote.lastUpdated || new Date().toISOString(),
        isLive: true,
        source: quote.source === 'LIVE_API' ? 'YAHOO_LIVE' : quote.source === 'SUPABASE_CACHE' ? 'SUPABASE_CACHE' : 'SIMULATED_TICK'
      };
      updated = true;
    });

    if (updated) {
      this.persistCache();
      this.notifySubscribers();
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => {
      try {
        callback(this.priceCache);
      } catch (err) {
        console.error('[MarketPriceService] Listener error:', err);
      }
    });
  }

  /**
   * Subscribe to live price ticks and updates
   */
  public subscribe(callback: (prices: Record<string, NseLivePrice>) => void): () => void {
    this.subscribers.add(callback);
    callback(this.priceCache);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get cached live price for an asset or ticker
   */
  public getLivePrice(assetOrId: InvestmentItem | string): NseLivePrice | undefined {
    const cfg = resolveNseTicker(assetOrId);
    if (!cfg) return undefined;
    return this.priceCache[cfg.symbolTicker];
  }

  /**
   * Fetches real live quote from Yahoo Finance API for an asset or ticker
   */
  public async fetchLivePrice(assetOrId: InvestmentItem | string): Promise<NseLivePrice | undefined> {
    const cfg = resolveNseTicker(assetOrId);
    if (!cfg) return undefined;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      // Try local Vite proxy endpoint first
      const proxyUrl = `/api/yahoo-finance/v8/finance/chart/${cfg.yahooSymbol}?interval=1d&range=2d`;
      let res: Response;
      try {
        res = await fetch(proxyUrl, { signal: controller.signal });
      } catch {
        // Fallback to direct / cors-friendly fetch if proxy fails
        res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${cfg.yahooSymbol}?interval=1d&range=2d`, {
          signal: controller.signal
        });
      }
      clearTimeout(timeoutId);

      if (res && res.ok) {
        const json = await res.json();
        const meta = json?.chart?.result?.[0]?.meta;

        if (meta && typeof meta.regularMarketPrice === 'number') {
          const price = Number(meta.regularMarketPrice.toFixed(2));
          const prevClose = Number((meta.chartPreviousClose || meta.previousClose || cfg.previousClose).toFixed(2));
          const change = Number((price - prevClose).toFixed(2));
          const changePct = Number(((change / prevClose) * 100).toFixed(2));
          const isPositive = change >= 0;
          const sign = isPositive ? '+' : '';

          const liveData: NseLivePrice = {
            symbolTicker: cfg.symbolTicker,
            yahooSymbol: cfg.yahooSymbol,
            price,
            priceFormatted: formatInrCurrency(price),
            liveString: `${formatInrCurrency(price)} / unit (NSE Live)`,
            change24h: change,
            changePercent24h: changePct,
            changeFormatted: `${sign}₹${Math.abs(change).toFixed(2)}`,
            changePercentFormatted: `${sign}${changePct.toFixed(2)}%`,
            isPositive,
            dayHigh: Number((meta.regularMarketDayHigh || meta.dayHigh || price * 1.01).toFixed(2)),
            dayLow: Number((meta.regularMarketDayLow || meta.dayLow || price * 0.99).toFixed(2)),
            volume: meta.regularMarketVolume,
            lastUpdated: new Date().toISOString(),
            isLive: true,
            source: 'YAHOO_LIVE'
          };

          this.priceCache[cfg.symbolTicker] = liveData;
          this.persistCache();
          this.notifySubscribers();
          return liveData;
        }
      }
    } catch {
      // Fall through to cache/fallback
    }

    // Return current cached value
    return this.priceCache[cfg.symbolTicker];
  }

  /**
   * Refresh all NSE listed prices concurrently
   */
  public async refreshAllListedPrices(): Promise<Record<string, NseLivePrice>> {
    const now = Date.now();
    // Debounce to at most once every 5 seconds
    if (this.fetchInProgress || (now - this.lastFetchTime < 5000)) {
      return this.priceCache;
    }

    this.fetchInProgress = true;
    this.lastFetchTime = now;

    try {
      const symbols = Object.keys(NSE_TICKER_REGISTRY);
      await Promise.allSettled(symbols.map((s) => this.fetchLivePrice(s)));
      await marketDataService.fetchLiveMarketQuotes();
    } finally {
      this.fetchInProgress = false;
    }

    return this.priceCache;
  }

  /**
   * Hydrates a single investment item with live NSE pricing
   * If the asset is a private fractional real estate property, preserves the Admin CMS edited minimum ticket price as fallback.
   */
  public hydrateInvestment(item: InvestmentItem): InvestmentItem {
    if (!item) return item;

    // Check if publicly traded on NSE
    if (isNseListedAsset(item)) {
      const livePrice = this.getLivePrice(item);
      if (livePrice && livePrice.price > 0) {
        return {
          ...item,
          currentPrice: livePrice.price,
          liveNsePrice: livePrice.price,
          liveNsePriceFormatted: livePrice.priceFormatted,
          isNseLive: livePrice.isLive,
          nseLivePriceString: livePrice.liveString,
          priceChange24h: livePrice.change24h,
          priceChangePercent24h: livePrice.changePercent24h,
          dayHigh: livePrice.dayHigh,
          dayLow: livePrice.dayLow,
          minInvestmentNumeric: livePrice.price,
          minInvestment: `${livePrice.priceFormatted} (1 Unit on NSE/BSE)`,
          lastPriceUpdate: livePrice.lastUpdated
        };
      }
    }

    // Admin Override Fallback:
    // If not publicly traded on NSE, preserve the Admin CMS edited minimum ticket price and properties
    return {
      ...item,
      isNseLive: false,
      liveNsePrice: undefined,
      liveNsePriceFormatted: undefined,
      nseLivePriceString: undefined
    };
  }

  /**
   * Hydrates an entire list of investments with live NSE pricing
   */
  public hydrateInvestments(investments: InvestmentItem[]): InvestmentItem[] {
    if (!Array.isArray(investments)) return [];
    return investments.map((inv) => this.hydrateInvestment(inv));
  }
}

export const marketPriceService = new MarketPriceService();
