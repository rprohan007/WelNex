import type { LaunchAssetCategory } from '../types';

export const LAUNCH_ASSETS: LaunchAssetCategory[] = [
  {
    id: 'reits',
    name: 'REITs (Real Estate Investment Trusts)',
    shortName: 'REITs',
    tagline: 'Grade-A Commercial Offices & Malls',
    type: 'REIT',
    indicativeYield: '6.8% – 8.5% p.a.',
    minInvestment: '₹300 – ₹400',
    riskLevel: 'Moderate',
    liquidity: 'High (NSE/BSE Exchange Traded)',
    distributionFrequency: 'Quarterly',
    sebiRegulated: true,
    description: 'SEBI-regulated instruments holding completed, revenue-generating commercial office parks and premier retail malls with Fortune 500 tech & BFSI tenants.',
    keyHighlights: [
      'Mandatory 90%+ Net Distributable Cash Flow payout by SEBI law',
      'Weighted Average Lease Expiry (WALE) typically 6 to 9 years',
      'Partial tax exemption on Return of Capital (RoC) and dividends'
    ],
    sampleEntities: [
      'Embassy Office Parks REIT',
      'Mindspace Business Parks REIT',
      'Brookfield India Real Estate Trust',
      'Nexus Select Trust REIT'
    ],
    badgeText: 'Exchange Traded (1 Unit)',
    iconName: 'Building2'
  },
  {
    id: 'sm-reits',
    name: 'SM REITs (Small & Medium REITs)',
    shortName: 'SM REITs',
    tagline: 'Regulated Fractional Real Estate',
    type: 'SM_REIT',
    indicativeYield: '8.5% – 10.5% p.a.',
    minInvestment: '₹10,00,000',
    riskLevel: 'Moderate',
    liquidity: 'Medium (Exchange Listed Scheme)',
    distributionFrequency: 'Quarterly',
    sebiRegulated: true,
    description: 'SEBI\'s formal framework introduced in 2024 to regulate fractional ownership of commercial properties, industrial parks, and data centers valued between ₹50 Cr and ₹500 Cr.',
    keyHighlights: [
      'Direct asset ring-fencing with dedicated Special Purpose Vehicles (SPVs)',
      '95% completed & rent-yielding asset requirement',
      'Institutional oversight replacing unregulated fractional platforms'
    ],
    sampleEntities: [
      'Commercial Grade-B+ Tech Parks',
      'Grade-A Logistics & Warehousing Hubs',
      'High-Street Retail Assets'
    ],
    badgeText: 'SEBI Framework 2024',
    iconName: 'Building'
  },
  {
    id: 'invits',
    name: 'InvITs (Infrastructure Investment Trusts)',
    shortName: 'InvITs',
    tagline: 'Highways, Power & Clean Energy',
    type: 'InvIT',
    indicativeYield: '9.5% – 13.0% p.a.',
    minInvestment: '₹100 – ₹140',
    riskLevel: 'Moderate',
    liquidity: 'High (NSE/BSE Exchange Traded)',
    distributionFrequency: 'Quarterly',
    sebiRegulated: true,
    description: 'Pooled vehicles owning critical, sovereign-linked utility infrastructure like interstate power transmission grids, national highway toll plazas, and clean solar corridors.',
    keyHighlights: [
      'Long-term concession agreements spanning 25 to 35 years',
      'Predictable inflation-indexed annuity and tariff cash flows',
      'High distribution yields exceeding 10Y Indian Government G-Sec'
    ],
    sampleEntities: [
      'IndiGrid InvIT (Power Transmission)',
      'PowerGrid InvIT (Sovereign Backed)',
      'IRB InvIT Fund (Toll Highways)',
      'National Highways Infra Trust (NHAI)'
    ],
    badgeText: 'Utility Infrastructure',
    iconName: 'TowerControl'
  },
  {
    id: 'corporate-debt',
    name: 'Corporate Bonds & Debt',
    shortName: 'Bonds & SDIs',
    tagline: 'Senior Secured NCDs & Credit',
    type: 'Debt',
    indicativeYield: '9.0% – 13.5% p.a.',
    minInvestment: '₹10,000 – ₹1,00,000',
    riskLevel: 'Low-Moderate',
    liquidity: 'Medium (Secondary Market & RFQ)',
    distributionFrequency: 'Monthly / Annual',
    sebiRegulated: true,
    description: 'Direct fixed-income debentures and Securitized Debt Instruments (SDIs) issued by AAA/AA-rated NBFCs, conglomerates, or backed by isolated corporate equipment leases.',
    keyHighlights: [
      'Senior charge over corporate assets and receivables held by Trustees',
      'Fixed coupon contractual payouts with fixed maturity tenors (1 to 5 yrs)',
      'SEBI-regulated RFQ and Online Bond Platform Provider (OBPP) access'
    ],
    sampleEntities: [
      'Tata Capital Secured NCDs (CRISIL AAA)',
      'L&T Finance Infrastructure Bonds',
      'Securitized Debt Instruments (EV Fleet Leases)',
      'Piramal Capital Listed Debentures'
    ],
    badgeText: 'Senior Secured',
    iconName: 'ShieldCheck'
  },
  {
    id: 'precious-metals',
    name: 'Precious Metals (Gold & Silver)',
    shortName: 'Gold & Silver',
    tagline: 'SGBs & Physical Vault ETFs',
    type: 'Precious_Metals',
    indicativeYield: '2.5% p.a. + Bullion Growth',
    minInvestment: '₹6,000 – ₹7,500',
    riskLevel: 'Low-Moderate',
    liquidity: 'High (Exchange Traded & RBI Tranches)',
    distributionFrequency: 'Semi-Annual (SGB Interest)',
    sebiRegulated: true,
    description: 'Sovereign Gold Bonds (SGB) backed by the Reserve Bank of India with guaranteed 2.50% annual coupon payouts plus zero-default physical bullion ETFs stored in insured vaults.',
    keyHighlights: [
      '100% Capital Gains Tax exemption on SGB redemption at 8-year maturity',
      'Zero storage fees, zero making charges, zero purity concerns',
      'Proven portfolio hedge during macroeconomic volatility and inflation'
    ],
    sampleEntities: [
      'RBI Sovereign Gold Bond (SGB) Tranches',
      'Nippon India Gold ETF (Gold BeES)',
      'ICICI Prudential Silver ETF',
      'HDFC Gold ETF'
    ],
    badgeText: 'Sovereign / Bullion',
    iconName: 'Coins'
  }
];
