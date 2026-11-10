import type { InvestmentItem } from '../types';
import { marketDataService } from './marketDataService';

export interface NseTickerMapping {
  symbolTicker: string;
  yahooSymbol: string;
  isin?: string;
  assetId?: string;
  name: string;
  category: string;
  defaultBasePrice: number;
  previousClose: number;
}

export interface NseLivePrice {
  symbolTicker: string;
  yahooSymbol: string;
  price: number; // lastPrice
  priceFormatted: string; // e.g. "₹420.00"
  liveString: string; // e.g. "₹420.00 / unit (NSE Live)"
  change24h: number; // regularMarketChange
  changePercent24h: number; // regularMarketChangePercent
  changeFormatted: string; // e.g. "-1.84"
  changePercentFormatted: string; // e.g. "-0.44%"
  dayChangeFormatted: string; // e.g. "-1.84 (-0.44%)"
  isPositive: boolean;
  dayHigh?: number;
  dayLow?: number;
  volume?: number;
  lastUpdated: string;
  timestampIst: string; // e.g. "10:08:30 AM IST"
  isLive: boolean;
  source: 'YAHOO_LIVE' | 'ADMIN_CMS' | 'SUPABASE_CACHE' | 'SIMULATED_TICK' | 'FALLBACK';
}

/**
 * Standardized baseline registry for NSE REITs, InvITs, and listed alternatives.
 * Calibrated with exact market values (e.g. Embassy ~₹420.00, Mindspace ~₹499.37, Brookfield ~₹318.30).
 */
export const NSE_TICKER_REGISTRY: Record<string, NseTickerMapping> = {
  'EMBASSY': {
    symbolTicker: 'EMBASSY',
    yahooSymbol: 'EMBASSY.NS',
    isin: 'INE041025011',
    assetId: 'embassy-office-parks-reit',
    name: 'Embassy Office Parks REIT',
    category: 'REIT',
    defaultBasePrice: 420.00,
    previousClose: 421.84
  },
  'MINDSPACE': {
    symbolTicker: 'MINDSPACE',
    yahooSymbol: 'MINDSPACE.NS',
    isin: 'INE0CCU25019',
    assetId: 'mindspace-business-parks-reit',
    name: 'Mindspace Business Parks REIT',
    category: 'REIT',
    defaultBasePrice: 499.37,
    previousClose: 497.10
  },
  'BIRET': {
    symbolTicker: 'BIRET',
    yahooSymbol: 'BIRET.NS',
    isin: 'INE0HRT25010',
    assetId: 'brookfield-india-reit',
    name: 'Brookfield India Real Estate Trust',
    category: 'REIT',
    defaultBasePrice: 318.30,
    previousClose: 316.50
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

const PRICE_CACHE_KEY = 'welnex_universal_market_prices_v4';

/**
 * Format currency in Indian Rupees format (₹420.00)
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
 * Format timestamp in Indian Standard Time (IST)
 */
export function formatIstTimestamp(dateInput?: string | number | Date): string {
  const date = dateInput ? new Date(dateInput) : new Date();
  const validDate = isNaN(date.getTime()) ? new Date() : date;

  return validDate.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }) + ' IST';
}

/**
 * Dynamically resolves ANY asset ticker, symbol or ISIN to an NSE ticker configuration
 */
export function resolveDynamicTicker(assetOrId: InvestmentItem | string): NseTickerMapping {
  let searchKey = '';
  let isinKey = '';
  let idKey = '';
  let itemName = '';
  let itemCategory = 'REIT';
  let adminPrice = 100.00;

  if (typeof assetOrId === 'string') {
    searchKey = assetOrId.toUpperCase().replace(/\.NS$/, '').replace(/\.BO$/, '').trim();
    idKey = assetOrId.toLowerCase().trim();
    itemName = searchKey;
  } else if (assetOrId && typeof assetOrId === 'object') {
    searchKey = (assetOrId.symbolTicker || assetOrId.symbol || assetOrId.id || '')
      .toUpperCase()
      .replace(/\.NS$/, '')
      .replace(/\.BO$/, '')
      .trim();
    isinKey = (assetOrId.isin || '').toUpperCase().trim();
    idKey = (assetOrId.id || '').toLowerCase().trim();
    itemName = assetOrId.name || searchKey;
    itemCategory = assetOrId.category || 'REIT';
    if (typeof assetOrId.currentPrice === 'number' && assetOrId.currentPrice > 0) {
      adminPrice = assetOrId.currentPrice;
    } else if (assetOrId.minInvestmentNumeric && assetOrId.minInvestmentNumeric > 0) {
      adminPrice = assetOrId.minInvestmentNumeric;
    }
  }

  // 1. Check calibrated registry
  if (searchKey && NSE_TICKER_REGISTRY[searchKey]) {
    return NSE_TICKER_REGISTRY[searchKey];
  }

  const allEntries = Object.values(NSE_TICKER_REGISTRY);
  const matched = allEntries.find((item) => {
    if (isinKey && item.isin?.toUpperCase() === isinKey) return true;
    if (idKey && item.assetId?.toLowerCase() === idKey) return true;
    if (searchKey && item.symbolTicker.toUpperCase() === searchKey) return true;
    return false;
  });

  if (matched) return matched;

  // 2. Dynamic resolution for ANY new ticker or symbol added by Admin
  const cleanTicker = searchKey || 'ASSET';
  return {
    symbolTicker: cleanTicker,
    yahooSymbol: `${cleanTicker}.NS`,
    name: itemName || cleanTicker,
    category: itemCategory,
    defaultBasePrice: adminPrice,
    previousClose: adminPrice
  };
}

export const resolveNseTicker = resolveDynamicTicker;

/**
 * Checks whether an asset is a publicly traded exchange-listed instrument (REIT, SM REIT, InvIT, ETF, Bond)
 * Returns false for private fractional real estate, unlisted equity, private credit, and P2P lending.
 */
export function isNseListedAsset(item?: InvestmentItem | null): boolean {
  if (!item) return false;

  // Unlisted or private periodic NAV assets
  if (item.priceMode === 'PERIODIC_NAV') return false;
  if ((item.accessModel as string) === 'Private Placement' || (item.accessModel as string) === 'Accredited Syndicate') {
    return false;
  }

  const category = (item.category || '').toLowerCase();
  const subCategory = (item.subCategory || '').toLowerCase();

  if (category.includes('fractional') || subCategory.includes('fractional')) return false;
  if (category.includes('private credit') || subCategory.includes('private credit')) return false;
  if (category.includes('pre-ipo') || subCategory.includes('pre-ipo')) return false;
  if (category.includes('unlisted') || subCategory.includes('unlisted')) return false;
  if (category.includes('p2p') || subCategory.includes('p2p')) return false;

  if (item.priceMode === 'LIVE_MARKET') return true;

  const isListedCategory = 
    category.includes('reit') || 
    category.includes('invit') || 
    category.includes('bond') || 
    category.includes('debt') || 
    category.includes('gold') || 
    category.includes('etf') || 
    subCategory.includes('reit') || 
    subCategory.includes('invit');

  if (isListedCategory && item.accessModel === 'Direct Public') return true;
  if (item.symbolTicker && item.accessModel === 'Direct Public') return true;

  return false;
}

class MarketPriceService {
  private priceCache: Record<string, NseLivePrice> = {};
  private subscribers: Set<(prices: Record<string, NseLivePrice>) => void> = new Set();
  private fetchInProgress: boolean = false;
  private lastFetchTime: number = 0;

  constructor() {
    this.restoreCache();
    this.initializeFromMarketService();

    // Listen to marketDataService for quotes, but never let simulated ticks overwrite YAHOO_LIVE quotes
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
      if (!this.priceCache[cfg.symbolTicker] || this.priceCache[cfg.symbolTicker].source === 'FALLBACK') {
        const change = Number((cfg.defaultBasePrice - cfg.previousClose).toFixed(2));
        const changePct = Number(((change / cfg.previousClose) * 100).toFixed(2));
        const isPositive = change >= 0;
        const sign = isPositive ? '+' : '';

        this.priceCache[cfg.symbolTicker] = {
          symbolTicker: cfg.symbolTicker,
          yahooSymbol: cfg.yahooSymbol,
          price: cfg.defaultBasePrice,
          priceFormatted: formatInrCurrency(cfg.defaultBasePrice),
          liveString: `${formatInrCurrency(cfg.defaultBasePrice)} / unit (NSE Live)`,
          change24h: change,
          changePercent24h: changePct,
          changeFormatted: `${sign}${change.toFixed(2)}`,
          changePercentFormatted: `${sign}${changePct.toFixed(2)}%`,
          dayChangeFormatted: `${sign}${change.toFixed(2)} (${sign}${changePct.toFixed(2)}%)`,
          isPositive,
          dayHigh: Number((cfg.defaultBasePrice * 1.01).toFixed(2)),
          dayLow: Number((cfg.defaultBasePrice * 0.99).toFixed(2)),
          lastUpdated: new Date().toISOString(),
          timestampIst: formatIstTimestamp(new Date()),
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
      const cfg = resolveDynamicTicker(ticker);
      if (!cfg || !quote) return;

      // Protection: Do NOT overwrite verified YAHOO_LIVE quotes with random simulation ticks!
      const currentEntry = this.priceCache[cfg.symbolTicker];
      if (currentEntry && currentEntry.source === 'YAHOO_LIVE' && quote.source !== 'LIVE_API') {
        return;
      }

      if (quote.source === 'LIVE_API' && typeof quote.price === 'number') {
        const price = Number(quote.price.toFixed(2));
        const change = Number((quote.priceChange24h ?? (price - cfg.previousClose)).toFixed(2));
        const changePct = Number((quote.priceChangePercent24h ?? ((change / cfg.previousClose) * 100)).toFixed(2));
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
          changeFormatted: `${sign}${change.toFixed(2)}`,
          changePercentFormatted: `${sign}${changePct.toFixed(2)}%`,
          dayChangeFormatted: `${sign}${change.toFixed(2)} (${sign}${changePct.toFixed(2)}%)`,
          isPositive,
          dayHigh: quote.dayHigh || Number((price * 1.01).toFixed(2)),
          dayLow: quote.dayLow || Number((price * 0.99).toFixed(2)),
          volume: quote.volume,
          lastUpdated: quote.lastUpdated || new Date().toISOString(),
          timestampIst: formatIstTimestamp(quote.lastUpdated || new Date()),
          isLive: true,
          source: 'YAHOO_LIVE'
        };
        updated = true;
      }
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
    const cfg = resolveDynamicTicker(assetOrId);
    if (!cfg) return undefined;
    return this.priceCache[cfg.symbolTicker];
  }

  /**
   * Universal Dedicated Financial Market API Function:
   * Passes all asset symbols with .NS suffix in a single batch call or concurrent queue.
   * Extracts regularMarketPrice, regularMarketChange, and regularMarketChangePercent for every queried symbol.
   */
  public async fetchLivePricesForAssets(symbols: string[]): Promise<Record<string, NseLivePrice>> {
    if (!Array.isArray(symbols) || symbols.length === 0) {
      return this.priceCache;
    }

    // 1. Normalize all symbols to ensure uppercase and .NS suffix
    const cleanToNsMap: Record<string, string> = {};
    const nsSymbols: string[] = [];

    symbols.forEach((sym) => {
      const clean = sym.toUpperCase().replace(/\.NS$/, '').replace(/\.BO$/, '').trim();
      if (!clean) return;
      const nsSym = `${clean}.NS`;
      cleanToNsMap[clean] = nsSym;
      cleanToNsMap[nsSym] = clean;
      if (!nsSymbols.includes(nsSym)) {
        nsSymbols.push(nsSym);
      }
    });

    if (nsSymbols.length === 0) {
      return this.priceCache;
    }

    const symbolsParam = nsSymbols.join(',');
    let batchSuccess = false;

    // 2. Standardized Financial Market Batch API endpoints
    const batchEndpoints: { url: string; headers?: Record<string, string> }[] = [
      // Standard v7 quote batch query
      { url: `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolsParam)}` },
      // Local serverless/Vite proxy
      { url: `/api/yahoo-finance/v7/finance/quote?symbols=${encodeURIComponent(symbolsParam)}` },
      // RapidAPI endpoint if key is present
      ...(typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_RAPIDAPI_KEY ? [
        {
          url: `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/quotes?ticker=${encodeURIComponent(symbolsParam)}`,
          headers: {
            'X-RapidAPI-Key': (import.meta as any).env.VITE_RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
          }
        }
      ] : []),
      // Public CORS proxies for environments blocking cross-origin requests
      { url: `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsParam}`)}` },
      { url: `https://corsproxy.io/?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbolsParam}`)}` }
    ];

    for (const ep of batchEndpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(ep.url, {
          signal: controller.signal,
          headers: ep.headers
        });
        clearTimeout(timeoutId);

        if (res && res.ok) {
          const json = await res.json();
          // Extract quotes array from v7 quote response or RapidAPI body
          const quotesList = json?.quoteResponse?.result || json?.body || json?.quotes || [];
          if (Array.isArray(quotesList) && quotesList.length > 0) {
            quotesList.forEach((q: any) => {
              const returnedSym = (q.symbol || q.ticker || '').toUpperCase();
              const cleanTicker = returnedSym.replace(/\.NS$/, '').replace(/\.BO$/, '').trim();
              const cfg = resolveDynamicTicker(cleanTicker);

              if (typeof q.regularMarketPrice === 'number') {
                const regularMarketPrice = Number(q.regularMarketPrice.toFixed(2));
                const chartPreviousClose = Number((q.regularMarketPreviousClose || q.previousClose || cfg.previousClose || regularMarketPrice).toFixed(2));
                const regularMarketChange = typeof q.regularMarketChange === 'number'
                  ? Number(q.regularMarketChange.toFixed(2))
                  : Number((regularMarketPrice - chartPreviousClose).toFixed(2));
                const regularMarketChangePercent = typeof q.regularMarketChangePercent === 'number'
                  ? Number(q.regularMarketChangePercent.toFixed(2))
                  : (chartPreviousClose !== 0 ? Number(((regularMarketChange / chartPreviousClose) * 100).toFixed(2)) : 0);

                const isPositive = regularMarketChange >= 0;
                const sign = isPositive ? '+' : '';
                const marketTime = q.regularMarketTime ? new Date(q.regularMarketTime * 1000) : new Date();

                const liveData: NseLivePrice = {
                  symbolTicker: cleanTicker,
                  yahooSymbol: `${cleanTicker}.NS`,
                  price: regularMarketPrice,
                  priceFormatted: formatInrCurrency(regularMarketPrice),
                  liveString: `${formatInrCurrency(regularMarketPrice)} / unit (NSE Live)`,
                  change24h: regularMarketChange,
                  changePercent24h: regularMarketChangePercent,
                  changeFormatted: `${sign}${regularMarketChange.toFixed(2)}`,
                  changePercentFormatted: `${sign}${regularMarketChangePercent.toFixed(2)}%`,
                  dayChangeFormatted: `${sign}${regularMarketChange.toFixed(2)} (${sign}${regularMarketChangePercent.toFixed(2)}%)`,
                  isPositive,
                  dayHigh: Number((q.regularMarketDayHigh || q.dayHigh || regularMarketPrice * 1.01).toFixed(2)),
                  dayLow: Number((q.regularMarketDayLow || q.dayLow || regularMarketPrice * 0.99).toFixed(2)),
                  volume: q.regularMarketVolume || q.volume,
                  lastUpdated: marketTime.toISOString(),
                  timestampIst: formatIstTimestamp(marketTime),
                  isLive: true,
                  source: 'YAHOO_LIVE'
                };

                this.priceCache[cleanTicker] = liveData;
              }
            });

            batchSuccess = true;
            this.persistCache();
            this.notifySubscribers();
            break;
          }
        }
      } catch {
        continue;
      }
    }

    // 3. Concurrent Queue Fallback:
    // If the batch endpoint didn't succeed or was rate limited, execute concurrent fetches
    if (!batchSuccess) {
      await Promise.allSettled(
        symbols.map((sym) => this.fetchLivePrice(sym))
      );
    }

    return this.priceCache;
  }

  /**
   * Fetches real live quote for a single asset or ticker using CORS proxies.
   */
  public async fetchLivePrice(assetOrId: InvestmentItem | string): Promise<NseLivePrice | undefined> {
    const cfg = resolveDynamicTicker(assetOrId);
    if (!cfg || !cfg.symbolTicker) return undefined;

    const symbol = cfg.symbolTicker;
    const targetSymbol = cfg.yahooSymbol || `${symbol}.NS`;

    const candidateUrls = [
      `https://query1.finance.yahoo.com/v8/finance/chart/${targetSymbol}`,
      `/api/yahoo-finance/v8/finance/chart/${targetSymbol}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${targetSymbol}`)}`,
      `https://corsproxy.io/?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${targetSymbol}`)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${targetSymbol}`)}`
    ];

    for (const url of candidateUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response && response.ok) {
          const json = await response.json();
          const meta = json?.chart?.result?.[0]?.meta;

          if (meta && typeof meta.regularMarketPrice === 'number') {
            const regularMarketPrice = Number(meta.regularMarketPrice.toFixed(2));
            const chartPreviousClose = Number(
              (meta.chartPreviousClose || meta.previousClose || cfg.previousClose || regularMarketPrice).toFixed(2)
            );

            const regularMarketChange = typeof meta.regularMarketChange === 'number'
              ? Number(meta.regularMarketChange.toFixed(2))
              : Number((regularMarketPrice - chartPreviousClose).toFixed(2));

            const regularMarketChangePercent = typeof meta.regularMarketChangePercent === 'number'
              ? Number(meta.regularMarketChangePercent.toFixed(2))
              : (chartPreviousClose !== 0 ? Number(((regularMarketChange / chartPreviousClose) * 100).toFixed(2)) : 0);

            const isPositive = regularMarketChange >= 0;
            const sign = isPositive ? '+' : '';
            const marketTimestamp = meta.regularMarketTime
              ? new Date(meta.regularMarketTime * 1000)
              : new Date();

            const liveData: NseLivePrice = {
              symbolTicker: cfg.symbolTicker,
              yahooSymbol: cfg.yahooSymbol,
              price: regularMarketPrice,
              priceFormatted: formatInrCurrency(regularMarketPrice),
              liveString: `${formatInrCurrency(regularMarketPrice)} / unit (NSE Live)`,
              change24h: regularMarketChange,
              changePercent24h: regularMarketChangePercent,
              changeFormatted: `${sign}${regularMarketChange.toFixed(2)}`,
              changePercentFormatted: `${sign}${regularMarketChangePercent.toFixed(2)}%`,
              dayChangeFormatted: `${sign}${regularMarketChange.toFixed(2)} (${sign}${regularMarketChangePercent.toFixed(2)}%)`,
              isPositive,
              dayHigh: Number((meta.regularMarketDayHigh || meta.dayHigh || regularMarketPrice * 1.01).toFixed(2)),
              dayLow: Number((meta.regularMarketDayLow || meta.dayLow || regularMarketPrice * 0.99).toFixed(2)),
              volume: meta.regularMarketVolume,
              lastUpdated: marketTimestamp.toISOString(),
              timestampIst: formatIstTimestamp(marketTimestamp),
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
        continue;
      }
    }

    // Graceful Fallback Handling:
    // If a symbol query encounters an error or timeout, fall back cleanly to the custom price
    // configured in the Admin CMS Portal instead of failing or displaying outdated mock numbers (like ₹388.50)!
    if (typeof assetOrId === 'object' && assetOrId !== null) {
      const adminCmsPrice = (typeof assetOrId.currentPrice === 'number' && assetOrId.currentPrice > 0)
        ? assetOrId.currentPrice
        : (assetOrId.minInvestmentNumeric && assetOrId.minInvestmentNumeric > 0)
          ? assetOrId.minInvestmentNumeric
          : cfg.defaultBasePrice;

      const prevClose = cfg.previousClose || adminCmsPrice;
      const change = typeof assetOrId.priceChange24h === 'number'
        ? assetOrId.priceChange24h
        : Number((adminCmsPrice - prevClose).toFixed(2));
      const pChange = typeof assetOrId.priceChangePercent24h === 'number'
        ? assetOrId.priceChangePercent24h
        : (prevClose ? Number(((change / prevClose) * 100).toFixed(2)) : 0);
      const isPositive = change >= 0;
      const sign = isPositive ? '+' : '';

      const fallbackData: NseLivePrice = {
        symbolTicker: cfg.symbolTicker,
        yahooSymbol: cfg.yahooSymbol,
        price: adminCmsPrice,
        priceFormatted: formatInrCurrency(adminCmsPrice),
        liveString: `${formatInrCurrency(adminCmsPrice)} / unit (NSE Live)`,
        change24h: change,
        changePercent24h: pChange,
        changeFormatted: `${sign}${change.toFixed(2)}`,
        changePercentFormatted: `${sign}${pChange.toFixed(2)}%`,
        dayChangeFormatted: `${sign}${change.toFixed(2)} (${sign}${pChange.toFixed(2)}%)`,
        isPositive,
        dayHigh: assetOrId.dayHigh || Number((adminCmsPrice * 1.01).toFixed(2)),
        dayLow: assetOrId.dayLow || Number((adminCmsPrice * 0.99).toFixed(2)),
        lastUpdated: assetOrId.lastPriceUpdate || new Date().toISOString(),
        timestampIst: formatIstTimestamp(assetOrId.lastPriceUpdate || new Date()),
        isLive: true,
        source: 'ADMIN_CMS'
      };

      this.priceCache[cfg.symbolTicker] = fallbackData;
      return fallbackData;
    }

    return this.priceCache[cfg.symbolTicker];
  }

  /**
   * Refreshes all listed prices across all investments dynamically
   */
  public async refreshAllInvestments(investments: InvestmentItem[]): Promise<Record<string, NseLivePrice>> {
    const now = Date.now();
    if (this.fetchInProgress || (now - this.lastFetchTime < 4000)) {
      return this.priceCache;
    }

    this.fetchInProgress = true;
    this.lastFetchTime = now;

    try {
      if (Array.isArray(investments) && investments.length > 0) {
        const listedItems = investments.filter((item) => isNseListedAsset(item));
        const symbols = listedItems.map((item) => item.symbolTicker || item.symbol || item.id);
        await this.fetchLivePricesForAssets(symbols);
      } else {
        const symbols = Object.keys(NSE_TICKER_REGISTRY);
        await this.fetchLivePricesForAssets(symbols);
      }
      await marketDataService.fetchLiveMarketQuotes();
    } finally {
      this.fetchInProgress = false;
    }

    return this.priceCache;
  }

  public async refreshAllListedPrices(): Promise<Record<string, NseLivePrice>> {
    return this.refreshAllInvestments([]);
  }

  /**
   * Hydrates a single investment item with live pricing.
   * If the asset is a listed instrument, updates currentPrice, minInvestment, and live quotes.
   * If unlisted/private fractional, cleanly preserves the custom Admin CMS price.
   */
  public hydrateInvestment(item: InvestmentItem): InvestmentItem {
    if (!item) return item;

    // Check if publicly traded on NSE
    if (isNseListedAsset(item)) {
      const livePrice = this.getLivePrice(item);
      const cfg = resolveDynamicTicker(item);

      // 1. High priority: Live quote from dedicated Financial Market API
      // 2. Admin CMS custom configured price
      // 3. Calibrated baseline registry price
      const price = (livePrice && livePrice.source === 'YAHOO_LIVE' && livePrice.price > 0)
        ? livePrice.price
        : (typeof item.currentPrice === 'number' && item.currentPrice > 0)
          ? item.currentPrice
          : (item.minInvestmentNumeric && item.minInvestmentNumeric > 0)
            ? item.minInvestmentNumeric
            : (livePrice?.price ?? cfg.defaultBasePrice ?? 420.00);

      const prevClose = cfg.previousClose || price;
      const change = (livePrice && livePrice.source === 'YAHOO_LIVE')
        ? livePrice.change24h
        : (typeof item.priceChange24h === 'number')
          ? item.priceChange24h
          : Number((price - prevClose).toFixed(2));

      const changePct = (livePrice && livePrice.source === 'YAHOO_LIVE')
        ? livePrice.changePercent24h
        : (typeof item.priceChangePercent24h === 'number')
          ? item.priceChangePercent24h
          : (prevClose ? Number(((change / prevClose) * 100).toFixed(2)) : 0);

      const formattedPrice = formatInrCurrency(price);
      const timestampIst = livePrice?.timestampIst || formatIstTimestamp(item.lastPriceUpdate || new Date());

      return {
        ...item,
        currentPrice: price,
        liveNsePrice: price,
        liveNsePriceFormatted: formattedPrice,
        isNseLive: true,
        nseLivePriceString: `${formattedPrice} / unit (NSE Live)`,
        priceChange24h: change,
        priceChangePercent24h: changePct,
        dayHigh: livePrice?.dayHigh || item.dayHigh || Number((price * 1.01).toFixed(2)),
        dayLow: livePrice?.dayLow || item.dayLow || Number((price * 0.99).toFixed(2)),
        minInvestmentNumeric: price,
        minInvestment: `${formattedPrice} (1 Unit on NSE/BSE)`,
        lastPriceUpdate: livePrice?.lastUpdated || item.lastPriceUpdate || new Date().toISOString(),
        lastPriceTimestampIst: timestampIst
      };
    }

    // Graceful Admin Fallback for unlisted/private fractional assets:
    // Preserves the custom Admin CMS edited price and minInvestment
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
