import type { MarketQuote } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const STORAGE_CACHE_KEY = 'welnex_market_quotes_cache';

export interface TickerConfig {
  symbolTicker: string;
  name: string;
  yahooSymbol: string;
  basePrice: number;
  previousClose: number;
  category: 'REIT' | 'InvIT' | 'Gold' | 'Bond';
  tickSize: number; // e.g. 0.05 for NSE equities
}

export const LISTED_TICKERS: Record<string, TickerConfig> = {
  'EMBASSY': {
    symbolTicker: 'EMBASSY',
    name: 'Embassy Office Parks REIT',
    yahooSymbol: 'EMBASSY.NS',
    basePrice: 420.00,
    previousClose: 421.84,
    category: 'REIT',
    tickSize: 0.05
  },
  'MINDSPACE': {
    symbolTicker: 'MINDSPACE',
    name: 'Mindspace Business Parks REIT',
    yahooSymbol: 'MINDSPACE.NS',
    basePrice: 499.37,
    previousClose: 497.10,
    category: 'REIT',
    tickSize: 0.05
  },
  'BIRET': {
    symbolTicker: 'BIRET',
    name: 'Brookfield India Real Estate Trust',
    yahooSymbol: 'BIRET.NS',
    basePrice: 318.30,
    previousClose: 316.50,
    category: 'REIT',
    tickSize: 0.05
  },
  'NXST': {
    symbolTicker: 'NXST',
    name: 'Nexus Select Trust REIT',
    yahooSymbol: 'NXST.NS',
    basePrice: 146.80,
    previousClose: 145.20,
    category: 'REIT',
    tickSize: 0.05
  },
  'INDIGRID': {
    symbolTicker: 'INDIGRID',
    name: 'IndiGrid InvIT Fund',
    yahooSymbol: 'INDIGRID.NS',
    basePrice: 138.50,
    previousClose: 137.90,
    category: 'InvIT',
    tickSize: 0.05
  },
  'PGINVIT': {
    symbolTicker: 'PGINVIT',
    name: 'PowerGrid InvIT',
    yahooSymbol: 'PGINVIT.NS',
    basePrice: 104.20,
    previousClose: 103.50,
    category: 'InvIT',
    tickSize: 0.05
  },
  'GOLDBEES': {
    symbolTicker: 'GOLDBEES',
    name: 'Nippon India Gold ETF',
    yahooSymbol: 'GOLDBEES.NS',
    basePrice: 6310.00,
    previousClose: 6283.50,
    category: 'Gold',
    tickSize: 0.50
  },
  'TATACAP': {
    symbolTicker: 'TATACAP',
    name: 'Tata Capital Secured NCD',
    yahooSymbol: 'TATACAP.NS',
    basePrice: 1012.50,
    previousClose: 1011.00,
    category: 'Bond',
    tickSize: 0.25
  },
  'IRBINVIT': {
    symbolTicker: 'IRBINVIT',
    name: 'IRB InvIT Fund',
    yahooSymbol: 'IRBINVIT.NS',
    basePrice: 71.30,
    previousClose: 70.70,
    category: 'InvIT',
    tickSize: 0.05
  }
};

/**
 * Calculates current Indian Market Status (09:15 to 15:30 IST, Monday-Friday)
 */
export function getIndianMarketStatus(): {
  isOpen: boolean;
  state: 'OPEN' | 'CLOSED';
  statusText: string;
  currentTimeIST: string;
  nextSessionText: string;
} {
  const now = new Date();
  // Get time in UTC milliseconds and add 5h 30m offset for IST
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istDate = new Date(utcMs + (3600000 * 5.5));

  const dayOfWeek = istDate.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const marketOpenMinutes = 9 * 60 + 15;  // 09:15 IST
  const marketCloseMinutes = 15 * 60 + 30; // 15:30 IST

  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const isOpen = isWeekday && timeInMinutes >= marketOpenMinutes && timeInMinutes <= marketCloseMinutes;

  const istTimeString = istDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  let statusText = '';
  let nextSessionText = '';

  if (isOpen) {
    statusText = 'NSE/BSE Live Market Open';
    nextSessionText = 'Closes at 03:30 PM IST';
  } else if (!isWeekday) {
    statusText = 'Market Closed (Weekend)';
    nextSessionText = 'Opens Monday 09:15 AM IST';
  } else if (timeInMinutes < marketOpenMinutes) {
    statusText = 'Pre-Market (Closed)';
    nextSessionText = 'Opens today at 09:15 AM IST';
  } else {
    statusText = 'Market Closed (Post-Session)';
    nextSessionText = 'Opens next business day 09:15 AM IST';
  }

  return {
    isOpen,
    state: isOpen ? 'OPEN' : 'CLOSED',
    statusText,
    currentTimeIST: `${istTimeString} IST`,
    nextSessionText
  };
}

class MarketDataService {
  private quotes: Record<string, MarketQuote> = {};
  private listeners: Set<(quotes: Record<string, MarketQuote>, changedTicker?: string) => void> = new Set();
  private pollingIntervalId: any = null;
  private simulationIntervalId: any = null;
  private isSimulationActive: boolean = true;
  private isPollingActive: boolean = false;

  constructor() {
    this.initializeQuotes();
    this.startEngine();
  }

  /**
   * Initialize memory cache from LocalStorage or baseline defaults
   */
  private initializeQuotes() {
    let saved: Record<string, MarketQuote> | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_CACHE_KEY);
      if (raw) {
        saved = JSON.parse(raw);
      }
    } catch {
      // ignore
    }

    const { state } = getIndianMarketStatus();

    Object.keys(LISTED_TICKERS).forEach((symbol) => {
      const cfg = LISTED_TICKERS[symbol];
      if (saved && saved[symbol]) {
        this.quotes[symbol] = {
          ...saved[symbol],
          marketState: state
        };
      } else {
        const change = cfg.basePrice - cfg.previousClose;
        const changePct = (change / cfg.previousClose) * 100;
        this.quotes[symbol] = {
          symbolTicker: symbol,
          name: cfg.name,
          price: cfg.basePrice,
          priceChange24h: Number(change.toFixed(2)),
          priceChangePercent24h: Number(changePct.toFixed(2)),
          dayHigh: Number((cfg.basePrice * 1.012).toFixed(2)),
          dayLow: Number((cfg.basePrice * 0.988).toFixed(2)),
          volume: Math.floor(Math.random() * 50000) + 12000,
          lastUpdated: new Date().toISOString(),
          marketState: state,
          source: 'STATIC_FALLBACK'
        };
      }
    });

    this.persistQuotes();
  }

  private persistQuotes() {
    try {
      localStorage.setItem(STORAGE_CACHE_KEY, JSON.stringify(this.quotes));
    } catch {
      // ignore
    }
  }

  /**
   * Starts periodic polling and tick updates
   */
  public startEngine() {
    if (this.isPollingActive) return;
    this.isPollingActive = true;

    // 1. Initial live fetch
    this.fetchLiveMarketQuotes();

    // 2. Poll every 25 seconds for real live API or Supabase sync
    this.pollingIntervalId = setInterval(() => {
      this.fetchLiveMarketQuotes();
    }, 25000);

    // 3. Realistic Micro-Tick Simulation (every 10-18 seconds, subtle continuous ticks)
    this.simulationIntervalId = setInterval(() => {
      if (this.isSimulationActive) {
        this.executeRandomMicroTick();
      }
    }, 12000);
  }

  public stopEngine() {
    if (this.pollingIntervalId) clearInterval(this.pollingIntervalId);
    if (this.simulationIntervalId) clearInterval(this.simulationIntervalId);
    this.isPollingActive = false;
  }

  /**
   * Fetches real live quote from Yahoo Finance API via Vite proxy or CORS proxies,
   * with seamless fallback to Supabase cached table data.
   */
  public async fetchLiveMarketQuotes(): Promise<void> {
    const symbols = Object.keys(LISTED_TICKERS);
    let anyLiveSuccess = false;

    for (const symbol of symbols) {
      const cfg = LISTED_TICKERS[symbol];
      try {
        // Attempt Vite proxy endpoint: /api/yahoo-finance/v8/finance/chart/{symbol}.NS
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const response = await fetch(`/api/yahoo-finance/v8/finance/chart/${cfg.yahooSymbol}?interval=1d&range=2d`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const json = await response.json();
          const result = json?.chart?.result?.[0];
          const meta = result?.meta;

          if (meta && typeof meta.regularMarketPrice === 'number') {
            const price = Number(meta.regularMarketPrice.toFixed(2));
            const prevClose = Number((meta.chartPreviousClose || meta.previousClose || cfg.previousClose).toFixed(2));
            const change = Number((price - prevClose).toFixed(2));
            const changePct = Number(((change / prevClose) * 100).toFixed(2));
            const dayHigh = Number((meta.regularMarketDayHigh || meta.dayHigh || Math.max(price, cfg.basePrice)).toFixed(2));
            const dayLow = Number((meta.regularMarketDayLow || meta.dayLow || Math.min(price, cfg.basePrice)).toFixed(2));

            this.quotes[symbol] = {
              symbolTicker: symbol,
              name: cfg.name,
              price,
              priceChange24h: change,
              priceChangePercent24h: changePct,
              dayHigh,
              dayLow,
              volume: meta.regularMarketVolume || this.quotes[symbol]?.volume,
              lastUpdated: new Date().toISOString(),
              marketState: getIndianMarketStatus().state,
              source: 'LIVE_API'
            };

            anyLiveSuccess = true;
          }
        }
      } catch {
        // Live API failed or timed out, will fall back to Supabase/Cache
      }
    }

    if (anyLiveSuccess) {
      this.persistQuotes();
      this.notifyListeners();
    } else {
      // Fallback: Check Supabase investments table for latest cached current_price
      await this.syncWithSupabaseCache();
    }
  }

  /**
   * Fallback: Sync latest pricing from Supabase investments table if live API unavailable
   */
  public async syncWithSupabaseCache(): Promise<void> {
    if (!isSupabaseConfigured) {
      this.notifyListeners();
      return;
    }

    try {
      const { data, error } = await supabase
        .from('investments')
        .select('symbol_ticker, symbol, current_price, price_change_24h, price_change_percent_24h, day_high, day_low, updated_at');

      if (!error && data && data.length > 0) {
        let updatedCount = 0;
        data.forEach((row: any) => {
          const ticker = (row.symbol_ticker || row.symbol || '').toUpperCase();
          if (ticker && this.quotes[ticker]) {
            const current = this.quotes[ticker];
            if (row.current_price && row.current_price > 0) {
              this.quotes[ticker] = {
                ...current,
                price: Number(row.current_price),
                priceChange24h: Number(row.price_change_24h || current.priceChange24h),
                priceChangePercent24h: Number(row.price_change_percent_24h || current.priceChangePercent24h),
                dayHigh: Number(row.day_high || current.dayHigh),
                dayLow: Number(row.day_low || current.dayLow),
                lastUpdated: row.updated_at || current.lastUpdated,
                source: 'SUPABASE_CACHE'
              };
              updatedCount++;
            }
          }
        });

        if (updatedCount > 0) {
          this.persistQuotes();
          this.notifyListeners();
        }
      }
    } catch {
      // keep existing quotes
    }
  }

  /**
   * Executes a calibrated micro-tick on a randomly chosen listed asset.
   * Simulates real-time market action with NSE standard tick sizes (₹0.05).
   */
  public executeRandomMicroTick(targetSymbol?: string) {
    const symbols = Object.keys(LISTED_TICKERS);
    const symbol = targetSymbol || symbols[Math.floor(Math.random() * symbols.length)];
    const currentQuote = this.quotes[symbol];
    const cfg = LISTED_TICKERS[symbol];

    if (!currentQuote || !cfg) return;

    // Small realistic price shift: 1 to 3 ticks
    const numTicks = Math.floor(Math.random() * 3) + 1;
    const direction = Math.random() > 0.45 ? 1 : -1; // slight positive upward bias
    const priceShift = Number((direction * numTicks * cfg.tickSize).toFixed(2));

    let newPrice = Number((currentQuote.price + priceShift).toFixed(2));
    if (newPrice <= 0) newPrice = cfg.basePrice;

    const newChange24h = Number((currentQuote.priceChange24h + priceShift).toFixed(2));
    const newChangePct = Number(((newChange24h / cfg.previousClose) * 100).toFixed(2));
    const newHigh = Math.max(currentQuote.dayHigh, newPrice);
    const newLow = Math.min(currentQuote.dayLow, newPrice);

    this.quotes[symbol] = {
      ...currentQuote,
      price: newPrice,
      priceChange24h: newChange24h,
      priceChangePercent24h: newChangePct,
      dayHigh: newHigh,
      dayLow: newLow,
      lastUpdated: new Date().toISOString(),
      source: 'SIMULATED_TICK'
    };

    this.persistQuotes();
    this.notifyListeners(symbol);
  }

  /**
   * Force manually trigger a tick (e.g. for testing or UI refresh)
   */
  public triggerManualTick(symbol?: string) {
    this.executeRandomMicroTick(symbol);
  }

  /**
   * Manual override price (e.g. from Admin CMS)
   */
  public updateAssetPriceOverride(
    symbol: string,
    price: number,
    change24h?: number,
    changePct?: number
  ) {
    const current = this.quotes[symbol] || {
      symbolTicker: symbol,
      name: symbol,
      price,
      priceChange24h: 0,
      priceChangePercent24h: 0,
      dayHigh: price,
      dayLow: price,
      lastUpdated: new Date().toISOString(),
      marketState: getIndianMarketStatus().state,
      source: 'SUPABASE_CACHE'
    };

    const c24 = change24h !== undefined ? change24h : current.priceChange24h;
    const cPct = changePct !== undefined ? changePct : current.priceChangePercent24h;

    this.quotes[symbol] = {
      ...current,
      price,
      priceChange24h: c24,
      priceChangePercent24h: cPct,
      dayHigh: Math.max(current.dayHigh, price),
      dayLow: Math.min(current.dayLow, price),
      lastUpdated: new Date().toISOString(),
      source: 'SUPABASE_CACHE'
    };

    this.persistQuotes();
    this.notifyListeners(symbol);
  }

  public getQuote(symbolTicker: string): MarketQuote | undefined {
    return this.quotes[symbolTicker.toUpperCase()];
  }

  public getAllQuotes(): Record<string, MarketQuote> {
    return { ...this.quotes };
  }

  public getMarketStatus() {
    return getIndianMarketStatus();
  }

  public setSimulationActive(active: boolean) {
    this.isSimulationActive = active;
  }

  public isSimulationRunning(): boolean {
    return this.isSimulationActive;
  }

  public subscribe(listener: (quotes: Record<string, MarketQuote>, changedTicker?: string) => void): () => void {
    this.listeners.add(listener);
    // Send immediate snapshot
    listener(this.getAllQuotes());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(changedTicker?: string) {
    const snapshot = this.getAllQuotes();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot, changedTicker);
      } catch {
        // ignore subscriber errors
      }
    });
  }
}

// Global Singleton Instance
export const marketDataService = new MarketDataService();
