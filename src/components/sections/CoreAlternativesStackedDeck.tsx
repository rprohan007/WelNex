import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  Building2, 
  TowerControl, 
  ShieldCheck, 
  Coins, 
  Layers, 
  Landmark, 
  Zap, 
  Trees, 
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldAlert,
  CreditCard,
  LayoutGrid,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export interface CoreAlternativeCategory {
  id: string;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  indicativeYield: string;
  minInvestment: string;
  riskRating: 'Low-Moderate' | 'Moderate' | 'High' | 'Very High';
  liquidity: string;
  payoutModel: string;
  description: string;
  keyHighlights: string[];
  sampleEntities: string[];
  icon: React.ElementType;
  badgeText: string;
  regulatoryBody: string;
}

export const CORE_ALTERNATIVES: CoreAlternativeCategory[] = [
  {
    id: 'reits-sm-reits',
    name: 'REITs & Small & Medium REITs',
    shortName: 'REITs & SM REITs',
    category: 'Commercial Real Estate',
    tagline: 'Grade-A Commercial Offices, Malls & Tech Campuses',
    indicativeYield: '7.0% – 10.5% p.a.',
    minInvestment: '₹350 (Exchange Traded) / ₹10L (SM REIT)',
    riskRating: 'Moderate',
    liquidity: 'High (NSE/BSE Listed T+1)',
    payoutModel: 'Quarterly (Mandatory 90% NDCF)',
    description: 'SEBI-regulated trusts holding income-generating commercial office parks and premier retail malls with Fortune 500 tech and BFSI tenants, plus the new 2024 SEBI SM REIT fractional asset framework.',
    keyHighlights: [
      'Mandatory 90%+ Net Distributable Cash Flow (NDCF) payout by law',
      'Weighted Average Lease Expiry (WALE) typically 6 to 9 years',
      'Partial tax exemption on Return of Capital (RoC) and dividends'
    ],
    sampleEntities: [
      'Embassy Office Parks REIT',
      'Mindspace Business Parks REIT',
      'Nexus Select Trust REIT',
      'Brookfield India Real Estate Trust'
    ],
    icon: Building2,
    badgeText: 'Exchange Traded + SM REITs',
    regulatoryBody: 'SEBI (REIT Regulations 2014 & SM REIT 2024)'
  },
  {
    id: 'invits',
    name: 'Infrastructure Investment Trusts (InvITs)',
    shortName: 'Infrastructure InvITs',
    category: 'Infrastructure',
    tagline: 'Highways, Power Grids & Pipeline Corridors',
    indicativeYield: '9.5% – 13.0% p.a.',
    minInvestment: '₹100 – ₹140 (1 Unit on NSE/BSE)',
    riskRating: 'Moderate',
    liquidity: 'High (Exchange Traded T+1)',
    payoutModel: 'Quarterly Cash Distributions',
    description: 'Pooled vehicles owning critical, sovereign-linked utility infrastructure like interstate transmission lines, national highway toll plazas, and clean energy pipeline concessions.',
    keyHighlights: [
      'Long-term concession agreements spanning 25 to 35 years',
      'Predictable inflation-indexed annuity and tariff cash flows',
      'Substantial distribution yield spread over 10Y Indian Government G-Sec'
    ],
    sampleEntities: [
      'IndiGrid InvIT (Power Transmission)',
      'PowerGrid InvIT (Sovereign Backed)',
      'National Highways Infra Trust (NHAI)',
      'IRB InvIT Fund (Toll Corridors)'
    ],
    icon: TowerControl,
    badgeText: 'Utility Infrastructure',
    regulatoryBody: 'SEBI (InvIT Regulations 2014)'
  },
  {
    id: 'corporate-bonds',
    name: 'Corporate Bonds & Listed Debt',
    shortName: 'Corporate Bonds & Listed Debt',
    category: 'Fixed Income',
    tagline: 'Senior Secured Debentures & Corporate NCDs',
    indicativeYield: '9.0% – 12.5% p.a.',
    minInvestment: '₹10,000 – ₹1,00,000',
    riskRating: 'Low-Moderate',
    liquidity: 'Medium (Secondary Market & RFQ)',
    payoutModel: 'Monthly / Quarterly / Annual Fixed Coupon',
    description: 'Fixed-income debentures and Non-Convertible Debentures (NCDs) issued by AAA/AA-rated NBFCs and conglomerates with senior charge over underlying corporate balance sheets.',
    keyHighlights: [
      'Senior legal charge over company assets held by SEBI-registered Debenture Trustees',
      'Fixed contractual coupon dates with defined capital maturity tenors (1 to 5 yrs)',
      'Listed on SEBI-regulated Online Bond Platform Providers (OBPP) and BSE/NSE'
    ],
    sampleEntities: [
      'Tata Capital Financial Services NCDs (CRISIL AAA)',
      'L&T Finance Infrastructure Bonds',
      'Mahindra Finance Listed Debentures',
      'Piramal Capital Secured NCDs'
    ],
    icon: ShieldCheck,
    badgeText: 'Senior Secured AAA/AA',
    regulatoryBody: 'SEBI & RBI OBPP Framework'
  },
  {
    id: 'precious-metals',
    name: 'Precious Metals (Gold & Silver)',
    shortName: 'Precious Metals & Gold',
    category: 'Precious Metals',
    tagline: 'Sovereign Gold Bonds & Insured Vault Bullion',
    indicativeYield: '2.50% Coupon + Bullion Growth',
    minInvestment: '₹6,500 – ₹7,500 (1 Gram Unit)',
    riskRating: 'Low-Moderate',
    liquidity: 'High (Exchange Traded & RBI Tranches)',
    payoutModel: 'Semi-Annual Cash Coupon',
    description: 'Reserve Bank of India issued Sovereign Gold Bonds (SGB) offering a guaranteed 2.50% annual coupon payout and 100% tax exemption at maturity, plus physically vault-stored Gold ETFs.',
    keyHighlights: [
      '100% Capital Gains Tax exemption on SGB redemption at 8-year maturity',
      'Zero storage fees, zero making charges, zero purity dilution concerns',
      'Proven macroeconomic portfolio hedge during volatility and currency inflation'
    ],
    sampleEntities: [
      'RBI Sovereign Gold Bond (SGB) Series',
      'Nippon India Gold ETF (Gold BeES)',
      'ICICI Prudential Silver ETF',
      'HDFC Gold ETF'
    ],
    icon: Coins,
    badgeText: 'RBI Sovereign + Physical Vault',
    regulatoryBody: 'Reserve Bank of India (RBI) & SEBI'
  },
  {
    id: 'aifs',
    name: 'Alternative Investment Funds (AIFs)',
    shortName: 'Alternative Investment Funds (AIFs)',
    category: 'Private Equity & Venture',
    tagline: 'Category I, II & III Private Capital Pools',
    indicativeYield: '14.0% – 18.0% p.a. (Target IRR)',
    minInvestment: '₹1,00,00,000 (SEBI Accredited)',
    riskRating: 'High',
    liquidity: 'Low (3 to 7 Year Tenor Lock-in)',
    payoutModel: 'Milestone Distributions & Capital Returns',
    description: 'Privately pooled institutional investment vehicles targeting high-growth private tech businesses, mezzanine debt, real estate construction financing, and pre-IPO special situations.',
    keyHighlights: [
      'Institutional co-investment opportunities alongside premier global venture funds',
      'Direct board oversight, governance controls, and strategic value creation',
      'Tax pass-through status for Category I and Category II AIF vehicles'
    ],
    sampleEntities: [
      'Kotak Alternate Assets Fund',
      'ChrysCapital Private Equity Funds',
      'Multiples Private Equity',
      'Edelweiss Special Opportunities Fund'
    ],
    icon: Layers,
    badgeText: 'SEBI Cat I/II/III',
    regulatoryBody: 'SEBI (AIF Regulations 2012)'
  },
  {
    id: 'private-credit',
    name: 'Private Credit & Securitized Debt',
    shortName: 'Private Credit & SDIs',
    category: 'Private Credit',
    tagline: 'Senior Secured Structured Loans & Equipment Receivables',
    indicativeYield: '11.5% – 14.5% p.a.',
    minInvestment: '₹1,00,000 – ₹10,00,000',
    riskRating: 'Moderate',
    liquidity: 'Medium (Secondary Bilateral & Obpp)',
    payoutModel: 'Monthly / Quarterly Cash Flow Waterfall',
    description: 'Securitized Debt Instruments (SDIs) backed by dedicated Special Purpose Vehicles (SPVs) holding isolated equipment leases, corporate invoice pools, and secured revenue share assets.',
    keyHighlights: [
      'Bankruptcy-remote SPV structuring isolating assets from corporate sponsor risk',
      'Over-collateralization covenants and First-Loss Default Guarantees (FLDG)',
      'Direct operating cash flow pass-through certificates listed on NSE/BSE'
    ],
    sampleEntities: [
      'Grip EV Fleet Lease SDIs',
      'Northern Arc Credit Pools',
      'Vivriti Capital Structured Debt',
      'KredX Invoice Discounting Pools'
    ],
    icon: Landmark,
    badgeText: 'Bankruptcy-Remote SPVs',
    regulatoryBody: 'SEBI (SDI Regulations) & RBI'
  },
  {
    id: 'renewables-solar',
    name: 'Renewables & Clean Energy Corridors',
    shortName: 'Renewables & Solar',
    category: 'Clean Infrastructure',
    tagline: 'Utility-Scale Solar Parks & Green Energy Corridors',
    indicativeYield: '10.0% – 12.5% p.a.',
    minInvestment: '₹25,000 – ₹2,00,000',
    riskRating: 'Moderate',
    liquidity: 'Medium',
    payoutModel: 'Quarterly Power Purchase Agreement Yields',
    description: 'Green power infrastructure generating predictable recurring cash yields via 25-year sovereign-backed Power Purchase Agreements (PPAs) with SECI and state electricity utilities.',
    keyHighlights: [
      'Long-term guaranteed tariff off-take contracts with sovereign off-takers',
      'Direct ESG and sustainability impact supporting India\'s 500GW clean goal',
      'Accelerated depreciation benefits and predictable solar irradiation data'
    ],
    sampleEntities: [
      'Tata Power Solar Parks',
      'ReNew Power Corridors',
      'Azure Clean Energy SPVs',
      'Mahindra Susten Green Assets'
    ],
    icon: Zap,
    badgeText: '25-Year Sovereign PPAs',
    regulatoryBody: 'SEBI & Ministry of New and Renewable Energy (MNRE)'
  },
  {
    id: 'farmland',
    name: 'Farmland & Managed Agro Assets',
    shortName: 'Farmland & Agro Assets',
    category: 'Managed Real Assets',
    tagline: 'Commercial Orchards, Timber & Regenerative Estates',
    indicativeYield: '8.0% – 12.0% p.a. + Land Growth',
    minInvestment: '₹5,00,000 – ₹15,00,000',
    riskRating: 'Moderate',
    liquidity: 'Low (Long-Term Capital Asset)',
    payoutModel: 'Annual Harvest Payouts + Land Equity',
    description: 'Managed agricultural estates cultivated with commercial high-value crops (Hass Avocado, Sandalwood, Mahogany) combining annual harvest cash yields with underlying rural land appreciation.',
    keyHighlights: [
      '100% Tax-Free Agricultural Income in India under Section 10(1) of the IT Act',
      'Professional agronomist stewardship, drip irrigation, and gated security',
      'Direct clear-title land deed ownership registered in investor\'s name'
    ],
    sampleEntities: [
      'Hosachiguru Managed Farmlands (Karnataka)',
      'Beforest Regenerative Farming Collectives',
      'Bigwoods Agroforestry Estates',
      'Bhoomi Farms Commercial Orchards'
    ],
    icon: Trees,
    badgeText: 'Section 10(1) Tax-Free',
    regulatoryBody: 'State Revenue & Agricultural Department'
  }
];

interface CoreAlternativesStackedDeckProps {
  onOpenExplore: () => void;
  onOpenCompare?: () => void;
}

export const CoreAlternativesStackedDeck: React.FC<CoreAlternativesStackedDeckProps> = ({
  onOpenExplore,
  onOpenCompare
}) => {
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cardScales, setCardScales] = useState<number[]>(new Array(CORE_ALTERNATIVES.length).fill(1));
  const [cardDimming, setCardDimming] = useState<number[]>(new Array(CORE_ALTERNATIVES.length).fill(1));

  useEffect(() => {
    if (viewMode !== 'deck') return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const newScales = new Array(CORE_ALTERNATIVES.length).fill(1);
          const newDimming = new Array(CORE_ALTERNATIVES.length).fill(1);
          const stickyThreshold = 120; // top sticky offset
          const windowHeight = window.innerHeight;

          cardRefs.current.forEach((cardEl, idx) => {
            if (!cardEl) return;
            const nextCardEl = cardRefs.current[idx + 1];
            if (nextCardEl) {
              const nextRect = nextCardEl.getBoundingClientRect();

              if (nextRect.top < windowHeight && nextRect.top > stickyThreshold) {
                const progress = (windowHeight - nextRect.top) / (windowHeight - stickyThreshold);
                // Underlying card subtly scales down to 0.96
                newScales[idx] = Math.max(1 - (progress * 0.04), 0.96);
                // Subtle contrast dimming to 0.92
                newDimming[idx] = Math.max(1 - (progress * 0.08), 0.92);
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

  return (
    <section id="launch-assets" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand scroll-mt-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge variant="copper" size="sm" className="mb-3" withDot={true}>
          Core Alternative Asset Classes
        </Badge>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-espresso-950 mb-4 tracking-tight">
          Discover India's Core Alternatives
        </h2>
        <p className="text-sm sm:text-base text-espresso-700 leading-relaxed max-w-2xl mx-auto">
          Explore high-yield asset classes, structured debt, and emerging real asset opportunities beyond traditional public markets.
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
            <span>Grid Overview</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: STACKED CARD DECK (SILKY SMOOTH SCROLL) */}
      {viewMode === 'deck' && (
        <div className="relative max-w-4xl mx-auto space-y-16 pb-20">
          {CORE_ALTERNATIVES.map((asset, index) => {
            const Icon = asset.icon;
            const scale = cardScales[index] || 1;
            const dimming = cardDimming[index] || 1;
            // Sticky top: 120px with subtle index stagger
            const stickyTop = 110 + index * 6;

            return (
              <div
                key={asset.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="sticky w-full will-change-transform [transform:translateZ(0)]"
                style={{
                  top: `${stickyTop}px`,
                  zIndex: 10 + index
                }}
              >
                <div 
                  style={{ 
                    transform: `scale(${scale}) translateZ(0)`, 
                    opacity: dimming,
                    filter: `brightness(${dimming})`
                  }}
                  className="origin-top will-change-transform [transform:translateZ(0)] transition-transform duration-100 ease-out"
                >
                  <GlassCard
                    variant="elevated"
                    className="p-6 sm:p-9 rounded-3xl border border-champagne-500/50 bg-white/95 backdrop-blur-xl shadow-[0_15px_45px_rgba(74,43,29,0.08)] hover:border-copper-500/60 transition-colors relative overflow-hidden text-left"
                  >
                    {/* Background Index Watermark */}
                    <div className="absolute top-2 right-6 font-mono text-7xl sm:text-8xl font-black text-champagne-500/15 pointer-events-none select-none">
                      0{index + 1}
                    </div>

                    <div className="relative z-10">
                      
                      {/* Top Meta Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-copper-500/10 border border-copper-500/25 flex items-center justify-center text-copper-600 shadow-inner">
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-copper-700 block">
                              {asset.category}
                            </span>
                            <span className="text-xs text-espresso-600 font-mono">
                              Category {index + 1} of 8
                            </span>
                          </div>
                        </div>

                        <Badge variant="copper" size="sm" withDot={true}>
                          {asset.badgeText}
                        </Badge>
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-espresso-950 mb-1.5 break-words">
                        {asset.name}
                      </h3>
                      <p className="text-sm font-semibold text-copper-700 mb-4 break-words">
                        {asset.tagline}
                      </p>

                      <p className="text-xs sm:text-sm text-espresso-800 leading-relaxed mb-6 max-w-2xl break-words">
                        {asset.description}
                      </p>

                      {/* 4-Metric Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-sand-100/90 border border-champagne-500/35 mb-6">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-600 block">
                            Target Yield
                          </span>
                          <span className="font-mono text-base font-extrabold text-copper-600 flex items-center gap-1 mt-0.5">
                            <TrendingUp className="w-3.5 h-3.5 text-copper-600" />
                            <span>{asset.indicativeYield}</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-600 block">
                            Min Ticket
                          </span>
                          <span className="font-mono text-xs font-bold text-espresso-950 block mt-0.5 truncate">
                            {asset.minInvestment}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-600 block">
                            Risk Rating
                          </span>
                          <span className="text-xs font-bold text-espresso-900 flex items-center gap-1 mt-0.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{asset.riskRating}</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-600 block">
                            Liquidity
                          </span>
                          <span className="text-xs font-semibold text-espresso-800 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-copper-600 shrink-0" />
                            <span className="truncate">{asset.liquidity.split(' ')[0]}</span>
                          </span>
                        </div>
                      </div>

                      {/* Key Highlights & Institutional Entities */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 mb-6">
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-espresso-800 block">
                            Regulatory & Structure Highlights:
                          </span>
                          {asset.keyHighlights.map((hl, hIdx) => (
                            <div key={hIdx} className="flex items-start gap-2 text-xs text-espresso-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                              <span>{hl}</span>
                            </div>
                          ))}
                        </div>

                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-espresso-800 block mb-2">
                            Active Market Entities & Spreads:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {asset.sampleEntities.map((entity, eIdx) => (
                              <span
                                key={eIdx}
                                className="px-2.5 py-1 rounded-lg bg-sand-200/80 border border-champagne-500/40 text-[11px] font-medium text-espresso-800"
                              >
                                {entity}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3 text-[10px] text-espresso-500 font-mono">
                            Oversight: {asset.regulatoryBody}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="pt-4 border-t border-champagne-500/30 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs font-mono text-espresso-700">
                          Payout Model: <strong className="text-espresso-900">{asset.payoutModel}</strong>
                        </span>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={onOpenExplore}
                            icon={<ArrowRight className="w-3.5 h-3.5" />}
                            className="text-xs font-semibold shadow-sm shadow-copper-500/20 cursor-pointer"
                          >
                            Explore Asset Class
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

      {/* VIEW 2: 4-COLUMN RESPONSIVE GRID OVERVIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_ALTERNATIVES.map((asset) => {
            const Icon = asset.icon;
            return (
              <GlassCard
                key={asset.id}
                variant="interactive"
                glowEffect="copper"
                onClick={onOpenExplore}
                className="p-6 flex flex-col justify-between rounded-3xl bg-white/80 border border-champagne-500/40 hover:border-copper-500/60 shadow-glass-sm hover:shadow-glass-md transition-all duration-300 group text-left cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-copper-500/10 border border-copper-500/25 flex items-center justify-center text-copper-600 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="champagne" size="xs">
                      {asset.category.split(' ')[0]}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-display font-bold text-espresso-950 group-hover:text-copper-700 transition-colors mb-1">
                    {asset.shortName}
                  </h3>
                  <p className="text-xs text-copper-700 font-semibold mb-3">
                    {asset.tagline}
                  </p>

                  <p className="text-xs text-espresso-700 line-clamp-3 leading-relaxed mb-4">
                    {asset.description}
                  </p>

                  <div className="p-3 rounded-xl bg-sand-100/90 border border-champagne-500/30 mb-4 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-espresso-600 font-medium">Target Yield</span>
                      <span className="font-mono font-extrabold text-copper-600">{asset.indicativeYield}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-espresso-600 font-medium">Min Ticket</span>
                      <span className="font-mono text-espresso-900 font-semibold truncate max-w-[120px]">{asset.minInvestment}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-champagne-500/25 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-copper-700 group-hover:text-copper-800">
                    Explore Listings
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-copper-600" />
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Global Section Action Footer */}
      <div className="mt-14 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          variant="primary"
          size="md"
          onClick={onOpenExplore}
          icon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto font-semibold shadow-md shadow-copper-500/25 cursor-pointer"
        >
          View All 15+ Verified Opportunities in Catalogue
        </Button>

        {onOpenCompare && (
          <Button
            variant="secondary"
            size="md"
            onClick={onOpenCompare}
            className="w-full sm:w-auto font-semibold cursor-pointer"
          >
            Compare All 8 Asset Categories Side-by-Side
          </Button>
        )}
      </div>

    </section>
  );
};
