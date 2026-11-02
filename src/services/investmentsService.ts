import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { InvestmentItem } from '../types';
import { getAllInvestments } from '../data/investmentsData';

const LOCAL_STORAGE_KEY = 'welnex_custom_investments';

/**
 * Transforms a Supabase DB row (snake_case) into an application InvestmentItem (camelCase)
 */
export function mapDbRowToInvestment(row: any): InvestmentItem {
  return {
    id: row.id,
    name: row.name,
    symbol: row.symbol || undefined,
    symbolTicker: row.symbol_ticker || row.symbol || undefined,
    priceMode: (row.price_mode as 'LIVE_MARKET' | 'PERIODIC_NAV') || (['REIT', 'InvIT', 'Gold'].includes(row.category) && row.symbol ? 'LIVE_MARKET' : 'PERIODIC_NAV'),
    currentPrice: typeof row.current_price === 'number' ? row.current_price : Number(row.current_price) || 0,
    priceChange24h: typeof row.price_change_24h === 'number' ? row.price_change_24h : Number(row.price_change_24h) || 0,
    priceChangePercent24h: typeof row.price_change_percent_24h === 'number' ? row.price_change_percent_24h : Number(row.price_change_percent_24h) || 0,
    lastPriceUpdate: row.last_price_update || row.updated_at || new Date().toISOString(),
    yieldPayoutFrequency: row.yield_payout_frequency || row.distribution_frequency || 'Quarterly',
    dayHigh: typeof row.day_high === 'number' ? row.day_high : Number(row.day_high) || undefined,
    dayLow: typeof row.day_low === 'number' ? row.day_low : Number(row.day_low) || undefined,
    lastValuationPeriod: row.last_valuation_period || undefined,
    sponsor: row.sponsor || 'Institutional Sponsor',
    priorityTier: (row.priority_tier as 'Priority 1' | 'Priority 2') || 'Priority 1',
    category: row.category,
    subCategory: row.sub_category || row.category,
    accessModel: (row.access_model as 'Direct Public' | 'Verified Partner') || 'Direct Public',
    partnerName: row.partner_name || undefined,
    sebiRegulated: Boolean(row.sebi_regulated),
    regulatoryBadge: row.regulatory_badge || (row.sebi_regulated ? 'SEBI Regulated' : 'RBI Regulated'),
    regulatoryBody: row.regulatory_body || 'SEBI',
    indicativeYield: row.indicative_yield,
    yieldType: row.yield_type || 'Pre-Tax Indicative Distribution',
    minInvestment: row.min_investment,
    minInvestmentNumeric: Number(row.min_investment_numeric) || 1000,
    tenure: row.tenure || '3-5 Years',
    lockInPeriod: row.lock_in_period || row.tenure,
    riskLevel: row.risk_level || 'Moderate',
    distributionFrequency: row.distribution_frequency || 'Quarterly',
    portfolioScale: row.portfolio_scale || 'Institutional Grade',
    occupancy: row.occupancy || undefined,
    tagline: row.tagline || row.sub_category || row.name,
    overview: row.overview || '',
    strategy: row.strategy || '',
    underlyingAssets: Array.isArray(row.underlying_assets) ? row.underlying_assets : [],
    sponsorProfile: row.sponsor_profile || {
      name: row.sponsor || 'Asset Manager',
      background: 'Institutional sponsor with track record',
      trackRecord: '10+ Years in Market',
      institutionalBackers: []
    },
    riskFactors: Array.isArray(row.risk_factors) ? row.risk_factors : [],
    liquidityProfile: row.liquidity_profile || 'Moderate',
    feeStructure: row.fee_structure || {
      managementFee: '1.00% p.a.',
      performanceFee: '0%',
      summary: 'Standard Management Fee'
    },
    taxImplications: row.tax_implications || 'Distributions subject to applicable Income Tax slab / STCG / LTCG.',
    officialLinks: row.official_links || {},
    tags: Array.isArray(row.tags) ? row.tags : [row.category],
    customFields: Array.isArray(row.custom_fields) ? row.custom_fields : [],
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : []
  };
}

/**
 * Transforms an application InvestmentItem (camelCase) into a Supabase DB row (snake_case)
 */
export function mapInvestmentToDbRow(item: InvestmentItem): any {
  return {
    id: item.id,
    name: item.name,
    symbol: item.symbol || null,
    symbol_ticker: item.symbolTicker || item.symbol || null,
    price_mode: item.priceMode || 'LIVE_MARKET',
    current_price: item.currentPrice ?? 0,
    price_change_24h: item.priceChange24h ?? 0,
    price_change_percent_24h: item.priceChangePercent24h ?? 0,
    last_price_update: item.lastPriceUpdate || new Date().toISOString(),
    yield_payout_frequency: item.yieldPayoutFrequency || item.distributionFrequency || 'Quarterly',
    day_high: item.dayHigh || null,
    day_low: item.dayLow || null,
    last_valuation_period: item.lastValuationPeriod || null,
    sponsor: item.sponsor,
    priority_tier: item.priorityTier,
    category: item.category,
    sub_category: item.subCategory,
    access_model: item.accessModel,
    partner_name: item.partnerName || null,
    sebi_regulated: item.sebiRegulated,
    regulatory_badge: item.regulatoryBadge,
    regulatory_body: item.regulatoryBody || 'SEBI',
    indicative_yield: item.indicativeYield,
    yield_type: item.yieldType,
    min_investment: item.minInvestment,
    min_investment_numeric: item.minInvestmentNumeric,
    tenure: item.tenure,
    lock_in_period: item.lockInPeriod || item.tenure,
    risk_level: item.riskLevel,
    distribution_frequency: item.distributionFrequency,
    portfolio_scale: item.portfolioScale,
    occupancy: item.occupancy || null,
    tagline: item.tagline,
    overview: item.overview,
    strategy: item.strategy,
    underlying_assets: item.underlyingAssets || [],
    sponsor_profile: item.sponsorProfile || {},
    risk_factors: item.riskFactors || [],
    liquidity_profile: item.liquidityProfile,
    fee_structure: item.feeStructure || {},
    tax_implications: item.taxImplications,
    official_links: item.officialLinks || {},
    tags: item.tags || [item.category],
    custom_fields: item.customFields || [],
    gallery_images: item.galleryImages || [],
    updated_at: new Date().toISOString()
  };
}

/**
 * Fetch all investments dynamically from Supabase.
 * Falls back seamlessly to local cache / default assets if offline or unconfigured.
 */
export async function fetchInvestmentsFromSupabase(): Promise<InvestmentItem[]> {
  if (!isSupabaseConfigured) {
    return getAllInvestments();
  }

  try {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[investmentsService] Supabase query returned an error, using local fallback:', error.message);
      return getAllInvestments();
    }

    if (data && data.length > 0) {
      const parsed = data.map(mapDbRowToInvestment);
      // Cache locally for instant loading
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
      } catch {
        // ignore
      }
      return parsed;
    }

    // If table exists but is empty, return local data
    return getAllInvestments();
  } catch (err) {
    console.error('[investmentsService] Network error fetching investments:', err);
    return getAllInvestments();
  }
}

/**
 * Fetch single investment by ID
 */
export async function fetchInvestmentByIdFromSupabase(id: string): Promise<InvestmentItem | undefined> {
  if (!isSupabaseConfigured) {
    return getAllInvestments().find((i) => i.id === id);
  }

  try {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return getAllInvestments().find((i) => i.id === id);
    }

    return mapDbRowToInvestment(data);
  } catch {
    return getAllInvestments().find((i) => i.id === id);
  }
}

/**
 * Upsert an investment listing directly into Supabase (Admin CMS action)
 */
export async function upsertInvestmentToSupabase(
  item: InvestmentItem
): Promise<{ success: boolean; data?: InvestmentItem; error?: string }> {
  const row = mapInvestmentToDbRow(item);

  // Sync to local cache immediately
  try {
    const current = getAllInvestments();
    const existingIndex = current.findIndex((i) => i.id === item.id);
    let updated: InvestmentItem[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = item;
    } else {
      updated = [item, ...current];
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  if (!isSupabaseConfigured) {
    return { success: true, data: item };
  }

  try {
    const { data, error } = await supabase
      .from('investments')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('[investmentsService] Error upserting to Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data ? mapDbRowToInvestment(data) : item };
  } catch (err: any) {
    console.error('[investmentsService] Network error upserting investment:', err);
    return { success: false, error: err.message || 'Unknown network error' };
  }
}

/**
 * Delete an investment listing from Supabase (Admin CMS action)
 */
export async function deleteInvestmentFromSupabase(
  id: string
): Promise<{ success: boolean; error?: string }> {
  // Update local cache
  try {
    const current = getAllInvestments();
    const filtered = current.filter((i) => i.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // ignore
  }

  if (!isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('investments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[investmentsService] Error deleting investment:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[investmentsService] Network error deleting investment:', err);
    return { success: false, error: err.message || 'Unknown network error' };
  }
}
