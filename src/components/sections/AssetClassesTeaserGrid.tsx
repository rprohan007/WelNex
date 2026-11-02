import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { 
  Building2, 
  TowerControl, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Coins, 
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldAlert
} from 'lucide-react';

export interface AssetTeaserItem {
  id: string;
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  indicativeYield: string;
  minInvestment: string;
  riskRating: 'Low-Moderate' | 'Moderate' | 'High';
  liquidity: string;
  payoutModel: string;
  description: string;
  highlights: string[];
  icon: React.ElementType;
}

export const ASSET_TEASERS: AssetTeaserItem[] = [
  {
    id: 'reits',
    name: 'Real Estate Investment Trusts',
    shortName: 'Commercial & Retail REITs',
    category: 'Real Estate',
    tagline: 'Grade-A Commercial Office Parks & Tech Campuses',
    indicativeYield: '6.8% – 8.5% p.a.',
    minInvestment: '₹300 – ₹400 (1 Unit on NSE/BSE)',
    riskRating: 'Moderate',
    liquidity: 'High (Exchange Traded T+1)',
    payoutModel: 'Quarterly (Mandatory 90% NDCF)',
    description: 'SEBI-regulated trusts holding income-generating commercial office parks and premier retail malls backed by multinational tech and BFSI tenants.',
    highlights: ['Mandatory 90% NDCF payout by SEBI law', '6 to 9 year lease contracts (WALE)', 'Partial tax-free return of capital'],
    icon: Building2
  },
  {
    id: 'invits',
    name: 'Infrastructure Investment Trusts',
    shortName: 'Infrastructure InvITs',
    category: 'Infrastructure',
    tagline: 'Highways, Power Grids & Pipeline Corridors',
    indicativeYield: '9.5% – 13.0% p.a.',
    minInvestment: '₹100 – ₹140 (1 Unit on NSE/BSE)',
    riskRating: 'Moderate',
    liquidity: 'High (Exchange Traded T+1)',
    payoutModel: 'Quarterly Distributions',
    description: 'Pooled vehicles owning critical, sovereign-linked utility infrastructure like interstate transmission lines, national highway toll plazas, and clean energy grids.',
    highlights: ['25 to 35-year concession tenures', 'Inflation-indexed annuity cash flows', 'Significant yield spread over G-Sec'],
    icon: TowerControl
  },
  {
    id: 'aifs',
    name: 'Alternative Investment Funds',
    shortName: 'Category I, II & III AIFs',
    category: 'Private Equity & Credit',
    tagline: 'Venture Capital, Private Debt & Pre-IPO Funds',
    indicativeYield: '14.0% – 18.0% p.a. (Target IRR)',
    minInvestment: '₹1,00,00,000 (SEBI Accredited)',
    riskRating: 'High',
    liquidity: 'Low (3 to 7 Year Lock-in)',
    payoutModel: 'Milestone & Exit Cascades',
    description: 'Privately pooled institutional investment vehicles targeting high-growth private businesses, distressed asset turnarounds, mezzanine credit, and structured equity.',
    highlights: ['Institutional co-investment opportunities', 'Active board governance & value creation', 'Tax pass-through status for Cat I & II'],
    icon: Layers
  },
  {
    id: 'debt',
    name: 'Corporate Bonds & SDIs',
    shortName: 'Securitized Debt & Bonds',
    category: 'Fixed Income',
    tagline: 'Senior Secured Debentures & Corporate Leases',
    indicativeYield: '9.0% – 13.5% p.a.',
    minInvestment: '₹10,000 – ₹1,00,000',
    riskRating: 'Low-Moderate',
    liquidity: 'Medium (OBPP & RFQ Platforms)',
    payoutModel: 'Monthly / Quarterly Fixed',
    description: 'Fixed-income debentures and Securitized Debt Instruments (SDIs) issued by AAA/AA-rated NBFCs, or backed by bankruptcy-remote corporate equipment receivables.',
    highlights: ['Senior legal charge held by SEBI Trustees', 'Fixed contractual coupon dates', 'Listed on SEBI-regulated bond platforms'],
    icon: ShieldCheck
  },
  {
    id: 'renewables',
    name: 'Renewable Energy Assets',
    shortName: 'Clean Solar & Green Infra',
    category: 'Clean Energy',
    tagline: 'Utility-Scale Solar Parks & Wind Corridors',
    indicativeYield: '10.0% – 12.5% p.a.',
    minInvestment: '₹10,000 – ₹25,000',
    riskRating: 'Moderate',
    liquidity: 'Medium-High',
    payoutModel: 'Quarterly Power Offtake Yields',
    description: 'Green power infrastructure generating steady revenues through 25-year sovereign-backed Power Purchase Agreements (PPAs) with SECI and state electricity utilities.',
    highlights: ['Guaranteed tariff off-take contracts', 'Direct ESG & sustainability alignment', 'Tax depreciation benefits'],
    icon: Zap
  },
  {
    id: 'gold',
    name: 'Precious Metals & Gold',
    shortName: 'SGBs & Physical Bullion ETFs',
    category: 'Precious Metals',
    tagline: 'Sovereign Gold Bonds & Insured Vault ETFs',
    indicativeYield: '2.50% Coupon + Bullion Price',
    minInvestment: '₹6,500 – ₹7,500 (1 Gram Lot)',
    riskRating: 'Low-Moderate',
    liquidity: 'High (Exchange Traded T+1)',
    payoutModel: 'Semi-Annual Cash Coupon',
    description: 'RBI-issued Sovereign Gold Bonds offering a guaranteed 2.50% annual coupon payout and 100% tax exemption at maturity, plus physically vault-stored Gold & Silver ETFs.',
    highlights: ['Zero capital gains tax on 8Y SGB maturity', 'Zero storage fees or making charges', 'Proven macroeconomic hedge vs inflation'],
    icon: Coins
  }
];

interface AssetClassesTeaserGridProps {
  onOpenExplore: () => void;
  onOpenCompare?: () => void;
}

export const AssetClassesTeaserGrid: React.FC<AssetClassesTeaserGridProps> = ({
  onOpenExplore,
  onOpenCompare
}) => {
  return (
    <section id="launch-assets" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sand scroll-mt-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <Badge variant="copper" size="sm" className="mb-3" withDot={true}>
          Priority Alternative Asset Classes
        </Badge>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-espresso-950 mb-3">
          Discover India's Core Alternatives
        </h2>
        <p className="text-sm sm:text-base text-espresso-700 leading-relaxed">
          Six institutional-grade asset categories empowering Indian investors to generate predictable cash flow and build resilient, inflation-protected wealth.
        </p>
      </div>

      {/* 3-Column Glass Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ASSET_TEASERS.map((asset) => {
          const Icon = asset.icon;
          return (
            <GlassCard
              key={asset.id}
              variant="interactive"
              glowEffect="copper"
              className="p-6 sm:p-7 flex flex-col justify-between rounded-3xl bg-white/75 border border-champagne-500/40 hover:border-copper-500/60 shadow-glass-sm hover:shadow-glass-md transition-all duration-300 group text-left"
            >
              <div>
                {/* Header with Icon & Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-copper-500/10 border border-copper-500/25 flex items-center justify-center text-copper-600 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="champagne" size="xs">
                    {asset.category}
                  </Badge>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-display font-extrabold text-espresso-950 group-hover:text-copper-700 transition-colors mb-1.5">
                  {asset.shortName}
                </h3>
                <p className="text-xs text-copper-700 font-semibold mb-3">
                  {asset.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-espresso-700 leading-relaxed mb-5">
                  {asset.description}
                </p>

                {/* Core Metrics Box */}
                <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-sand-100/90 border border-champagne-500/30 mb-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-600 block">
                      Target Yield
                    </span>
                    <span className="font-mono text-sm font-extrabold text-copper-600 flex items-center gap-1 mt-0.5">
                      <TrendingUp className="w-3.5 h-3.5 text-copper-600 shrink-0" />
                      <span>{asset.indicativeYield}</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-600 block">
                      Min Ticket
                    </span>
                    <span className="font-mono text-xs font-bold text-espresso-900 block mt-0.5 truncate">
                      {asset.minInvestment}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-champagne-500/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-600 block">
                      Risk Profile
                    </span>
                    <span className="text-xs font-semibold text-espresso-800 flex items-center gap-1 mt-0.5">
                      <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{asset.riskRating}</span>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-champagne-500/20">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-espresso-600 block">
                      Liquidity
                    </span>
                    <span className="text-xs font-semibold text-espresso-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-copper-600 shrink-0" />
                      <span className="truncate">{asset.liquidity.split(' ')[0]}</span>
                    </span>
                  </div>
                </div>

                {/* Key Institutional Highlights */}
                <div className="space-y-1.5 mb-6">
                  {asset.highlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-espresso-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-copper-500 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-4 border-t border-champagne-500/25 flex items-center justify-between">
                <span className="text-[11px] font-mono text-espresso-600">
                  {asset.payoutModel}
                </span>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenExplore}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="text-xs font-semibold shadow-sm shadow-copper-500/20 cursor-pointer"
                >
                  Explore Assets
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Global Teaser Footer Action */}
      <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button
          variant="secondary"
          size="md"
          onClick={onOpenExplore}
          icon={<ArrowRight className="w-4 h-4" />}
          className="w-full sm:w-auto font-semibold"
        >
          View All Curated Opportunities in Catalogue
        </Button>

        {onOpenCompare && (
          <Button
            variant="ghost"
            size="md"
            onClick={onOpenCompare}
            className="w-full sm:w-auto text-copper-700 hover:text-copper-800 font-semibold cursor-pointer"
          >
            Compare All 6 Categories Side-by-Side
          </Button>
        )}
      </div>

    </section>
  );
};
