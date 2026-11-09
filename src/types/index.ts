export type AssetCategory = 'REIT' | 'InvIT' | 'Gold' | 'SDI' | 'Bond';

export interface TickerItem {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  price: string;
  distributionYield: string;
  change: string;
  isPositive: boolean;
  payoutFrequency?: string;
  highlightTag?: string;
}

export interface AssetComparison {
  id: string;
  category: string;
  name: string;
  indicativeYield: string;
  liquidity: 'High (Exchange Traded)' | 'Medium' | 'Low (Fixed Tenor)';
  minInvestment: string;
  taxEfficiency: string;
  riskRating: 'Moderate' | 'Low-Moderate' | 'Moderate-High';
  instruments: string[];
  description: string;
}

export type InvestorProfile = 
  | 'Curious Beginner'
  | 'Retail Stock/MF Investor'
  | 'HNW / Accredited Investor'
  | 'Finance Professional / CA'
  | 'NRI Investor';

export interface WaitlistSubmission {
  fullName: string;
  email: string;
  investorProfile: InvestorProfile;
  interests: AssetCategory[];
}

export type LaunchAssetType = 'REIT' | 'SM_REIT' | 'InvIT' | 'Debt' | 'Precious_Metals';

export interface LaunchAssetCategory {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  type: LaunchAssetType;
  indicativeYield: string;
  minInvestment: string;
  riskLevel: 'Low-Moderate' | 'Moderate' | 'Moderate-High';
  liquidity: string;
  distributionFrequency: string;
  sebiRegulated: boolean;
  description: string;
  keyHighlights: string[];
  sampleEntities: string[];
  badgeText: string;
  iconName: string;
}

export interface HowItWorksStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  badge: string;
  metricTitle: string;
  metricVal: string;
  metricSub: string;
  details: string[];
  previewType: 'educate' | 'simulate' | 'discover';
}

// Phase 3: Catalogue & Deep-Dive Investment Types
export type PriorityTier = 'All' | 'Priority 1' | 'Priority 2';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High';

export type AccessModel = 'Direct Public' | 'Verified Partner';

export type MinInvestmentFilter = 'All' | 'under_10k' | '10k_to_1L' | 'above_1L';

export type PriceMode = 'LIVE_MARKET' | 'PERIODIC_NAV';

export type YieldPayoutFrequency = 'Quarterly' | 'Monthly' | 'Annual' | 'Maturity';

export interface MarketQuote {
  symbolTicker: string;
  name?: string;
  price: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  dayHigh: number;
  dayLow: number;
  volume?: number;
  lastUpdated: string;
  marketState: 'OPEN' | 'CLOSED';
  source: 'LIVE_API' | 'SIMULATED_TICK' | 'SUPABASE_CACHE' | 'STATIC_FALLBACK';
}

export interface UnderlyingAsset {
  id: string;
  name: string;
  location: string;
  type: string;
  areaOrScale: string;
  tenantsOrDetails: string;
  valuationShare?: string;
  imageUrl?: string;
  imageAccent?: string;
}

export interface SponsorProfile {
  name: string;
  background: string;
  trackRecord: string;
  institutionalBackers: string[];
}

export interface RiskFactor {
  title: string;
  description: string;
  severity: 'Low' | 'Moderate' | 'High';
}

export interface InvestmentFeeStructure {
  managementFee: string;
  performanceFee?: string;
  exitLoadOrLockInFee?: string;
  summary: string;
}

export interface InvestmentItem {
  id: string;
  name: string;
  symbol?: string;
  symbolTicker?: string; // NSE/BSE ticker symbol (e.g., "EMBASSY", "INDIGRID", "GOLDBEES")
  priceMode?: PriceMode; // "LIVE_MARKET" vs "PERIODIC_NAV"
  currentPrice?: number; // Numeric price in ₹
  liveNsePrice?: number; // Live tick price from NSE
  liveNsePriceFormatted?: string; // e.g. "₹419.50"
  isNseLive?: boolean; // Whether live NSE data successfully hydrated
  nseLivePriceString?: string; // e.g. "₹419.50 / unit (NSE Live)"
  isin?: string; // ISIN code (e.g. "INE041025011")
  priceChange24h?: number; // Numeric shift in ₹
  priceChangePercent24h?: number; // Numeric % shift
  lastPriceUpdate?: string; // Timestamp
  yieldPayoutFrequency?: YieldPayoutFrequency | string; // "Quarterly", "Monthly", "Annual", or "Maturity"
  dayHigh?: number;
  dayLow?: number;
  lastValuationPeriod?: string; // e.g. "Q3 2026" for unlisted periodic NAV
  sponsor: string;
  priorityTier: 'Priority 1' | 'Priority 2';
  category: string;
  subCategory: string;
  accessModel: AccessModel;
  partnerName?: string;
  sebiRegulated: boolean;
  regulatoryBadge: string;
  regulatoryBody?: string;
  indicativeYield: string;
  yieldType: string;
  minInvestment: string;
  minInvestmentNumeric: number;
  tenure: string;
  lockInPeriod?: string;
  riskLevel: RiskLevel;
  distributionFrequency: string;
  portfolioScale: string;
  occupancy?: string;
  tagline: string;
  overview: string;
  strategy: string;
  underlyingAssets: UnderlyingAsset[];
  sponsorProfile: SponsorProfile;
  riskFactors: RiskFactor[];
  liquidityProfile: string;
  feeStructure?: InvestmentFeeStructure;
  taxImplications: string;
  officialLinks: {
    sebiFilingUrl?: string;
    exchangeUrl?: string;
    partnerUrl?: string;
  };
  tags: string[];
  customFields?: { label: string; value: string }[];
  galleryImages?: string[];
}

export interface WaitlistLead {
  id: string;
  fullName: string;
  email: string;
  investorProfile: string;
  interests?: string[];
  signupDate: string;
  status: 'Verified' | 'Pending Review' | 'VIP Invited';
}

export * from './academy';
export * from './radar';

