import type { InvestmentItem, InvestmentFeeStructure } from '../types';
import rawInvestments from './investmentsData.json';

interface MetadataEnrichment {
  regulatoryBody: string;
  lockInPeriod: string;
  feeStructure: InvestmentFeeStructure;
}

const METADATA_ENRICHMENTS: Record<string, MetadataEnrichment> = {
  'embassy-office-parks-reit': {
    regulatoryBody: 'SEBI (REIT Regulations 2014)',
    lockInPeriod: 'None (Listed on NSE & BSE)',
    feeStructure: {
      managementFee: '1.00% p.a. Investment Management Fee',
      performanceFee: '0% (No promote / carry fee)',
      exitLoadOrLockInFee: 'Nil (Standard exchange brokerage only)',
      summary: '1.00% AMC Fee • 0% Carry • Daily T+1 Liquidity'
    }
  },
  'mindspace-business-parks-reit': {
    regulatoryBody: 'SEBI (REIT Regulations 2014)',
    lockInPeriod: 'None (Listed on NSE & BSE)',
    feeStructure: {
      managementFee: '0.95% p.a. Manager Fee',
      performanceFee: '0% (No performance fee)',
      exitLoadOrLockInFee: 'Nil (Exchange traded)',
      summary: '0.95% AMC Fee • 0% Carry • Daily T+1 Liquidity'
    }
  },
  'brookfield-india-reit': {
    regulatoryBody: 'SEBI (REIT Regulations 2014)',
    lockInPeriod: 'None (Listed on NSE & BSE)',
    feeStructure: {
      managementFee: '1.00% p.a. Investment Manager Fee',
      performanceFee: '0% Carry',
      exitLoadOrLockInFee: 'Nil',
      summary: '1.00% AMC Fee • 0% Carry • Exchange Traded'
    }
  },
  'nexus-select-trust-reit': {
    regulatoryBody: 'SEBI (REIT Regulations 2014)',
    lockInPeriod: 'None (Listed on NSE & BSE)',
    feeStructure: {
      managementFee: '1.00% p.a. REIT Manager Fee',
      performanceFee: '0% Carry',
      exitLoadOrLockInFee: 'Nil',
      summary: '1.00% AMC Fee • 0% Carry • Exchange Traded'
    }
  },
  'indigrid-invit': {
    regulatoryBody: 'SEBI (InvIT Regulations 2014)',
    lockInPeriod: 'None (Listed on NSE & BSE)',
    feeStructure: {
      managementFee: '0.75% p.a. Investment Manager Fee',
      performanceFee: '0% Carry',
      exitLoadOrLockInFee: 'Nil',
      summary: '0.75% Management Fee • 0% Carry • Exchange Traded'
    }
  },
  'powergrid-invit': {
    regulatoryBody: 'SEBI (InvIT Regulations 2014)',
    lockInPeriod: 'None (Listed on NSE & BSE)',
    feeStructure: {
      managementFee: '0.50% p.a. PSU Sponsor Management Fee',
      performanceFee: '0% Carry',
      exitLoadOrLockInFee: 'Nil',
      summary: '0.50% Low Management Fee • 0% Carry • Sovereign PSU Backed'
    }
  },
  'tata-capital-ncd-aaa': {
    regulatoryBody: 'SEBI & RBI',
    lockInPeriod: 'Fixed 36 to 60 Months (Tradable on NSE/BSE)',
    feeStructure: {
      managementFee: '0.00% Direct Investor Fee',
      performanceFee: '0% Performance Fee',
      exitLoadOrLockInFee: 'Nil (Secondary market spread applies)',
      summary: '0% Management Fee • 0% Carry • Fixed Coupon'
    }
  },
  'grip-ev-lease-sdi': {
    regulatoryBody: 'SEBI (NCS Regulations)',
    lockInPeriod: '28 Months Amortizing (Monthly Principal + Interest payback)',
    feeStructure: {
      managementFee: '0.00% Direct Investor Fee (covered by originator spread)',
      performanceFee: '0% Performance Fee',
      exitLoadOrLockInFee: 'Nil (Amortizing return of capital)',
      summary: '0% Investor Fee • 0% Carry • Monthly Amortization'
    }
  },
  'rbi-sgb-gold-bonds': {
    regulatoryBody: 'RBI (Reserve Bank of India)',
    lockInPeriod: '5 Years Lock-in (8 Years Full Maturity)',
    feeStructure: {
      managementFee: '0.00% Nil',
      performanceFee: '0% Nil',
      exitLoadOrLockInFee: 'Nil on RBI redemption',
      summary: 'Zero Fees • 100% Sovereign Guarantee • 0% Capital Gains Tax'
    }
  },
  'nippon-gold-bees-etf': {
    regulatoryBody: 'SEBI (Mutual Fund Regulations)',
    lockInPeriod: 'None (Instant T+1 Market Liquidity)',
    feeStructure: {
      managementFee: '0.79% Total Expense Ratio (TER)',
      performanceFee: '0% Nil',
      exitLoadOrLockInFee: 'Nil',
      summary: '0.79% TER • Daily Real-time Trading on NSE/BSE'
    }
  },
  'vivriti-private-credit-aif-cat2': {
    regulatoryBody: 'SEBI (AIF Category II Regulations)',
    lockInPeriod: '4 Years Strict Lock-in (Close-ended)',
    feeStructure: {
      managementFee: '1.50% p.a. Management Fee on Invested Capital',
      performanceFee: '10% Performance Fee (Carried Interest above 9% Hurdle)',
      exitLoadOrLockInFee: 'No premature redemption permitted',
      summary: '1.50% Mgmt Fee • 10% Carry above 9% Hurdle • 4-Yr Lock-in'
    }
  },
  'altgraaf-bengaluru-tech-hub': {
    regulatoryBody: 'SEBI & MCA',
    lockInPeriod: '36 Months Lock-in',
    feeStructure: {
      managementFee: '1.00% p.a. SPV Asset Management Fee',
      performanceFee: '0% Performance Fee',
      exitLoadOrLockInFee: '2% if redeemed in secondary window before 24m',
      summary: '1.00% SPV Management Fee • 0% Carry • 36m Tenor'
    }
  },
  'hdb-financial-pre-ipo-shares': {
    regulatoryBody: 'SEBI & MCA',
    lockInPeriod: '6 Months Mandatory Lock-in post-IPO Listing',
    feeStructure: {
      managementFee: '0.00% Ongoing Fee',
      performanceFee: '0% Performance Fee',
      exitLoadOrLockInFee: '1.5% One-time off-market broking/stamp duty',
      summary: '1.5% One-time Stamp/Fee • 6m Post-IPO Lock-in'
    }
  },
  'faircent-prime-p2p-credit': {
    regulatoryBody: 'RBI (NBFC-P2P Regulations)',
    lockInPeriod: '12 Months Minimum Principal Lock-in',
    feeStructure: {
      managementFee: '1.50% Servicing & Processing Fee on Collections',
      performanceFee: '0% Performance Fee',
      exitLoadOrLockInFee: 'Nil',
      summary: '1.50% Collection Fee • Monthly EMI Liquidity'
    }
  },
  'susten-clean-energy-solar-spv': {
    regulatoryBody: 'SEBI & MNRE',
    lockInPeriod: '48 Months Lock-in',
    feeStructure: {
      managementFee: '0.85% p.a. Operational & Asset Monitoring Fee',
      performanceFee: '0% Performance Fee',
      exitLoadOrLockInFee: 'Nil',
      summary: '0.85% SPV Fee • 0% Carry • 48m Solar Bond'
    }
  }
};

export const INVESTMENTS_DATA: InvestmentItem[] = (rawInvestments as InvestmentItem[]).map((item) => {
  const enrichment = METADATA_ENRICHMENTS[item.id] || {
    regulatoryBody: item.sebiRegulated ? 'SEBI' : 'RBI / Partner',
    lockInPeriod: item.tenure.includes('Perpetual') ? 'None (Exchange Traded)' : item.tenure,
    feeStructure: {
      managementFee: '1.00% p.a.',
      performanceFee: '0%',
      exitLoadOrLockInFee: 'Nil',
      summary: 'Standard Asset Management Fee'
    }
  };

  return {
    ...item,
    regulatoryBody: enrichment.regulatoryBody,
    lockInPeriod: enrichment.lockInPeriod,
    feeStructure: enrichment.feeStructure
  };
});

export const getAllInvestments = (): InvestmentItem[] => {
  try {
    const stored = localStorage.getItem('welnex_custom_investments');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sanitize baseline prices for core REITs and listed assets so stale cached mock prices (like 388.50) are eliminated
        return parsed.map((item: InvestmentItem) => {
          const baseline = INVESTMENTS_DATA.find((b) => b.id === item.id);
          if (baseline) {
            if (item.id === 'embassy-office-parks-reit' && (!item.currentPrice || item.currentPrice < 400)) {
              return { ...item, currentPrice: baseline.currentPrice, minInvestment: baseline.minInvestment, minInvestmentNumeric: baseline.minInvestmentNumeric };
            }
            if (item.id === 'mindspace-business-parks-reit' && (!item.currentPrice || item.currentPrice < 450)) {
              return { ...item, currentPrice: baseline.currentPrice, minInvestment: baseline.minInvestment, minInvestmentNumeric: baseline.minInvestmentNumeric };
            }
            if (item.id === 'brookfield-india-reit' && (!item.currentPrice || item.currentPrice < 300)) {
              return { ...item, currentPrice: baseline.currentPrice, minInvestment: baseline.minInvestment, minInvestmentNumeric: baseline.minInvestmentNumeric };
            }
          }
          return item;
        });
      }
    }
  } catch {
    // fallback
  }
  return INVESTMENTS_DATA;
};

export const getInvestmentById = (id: string): InvestmentItem | undefined => {
  return getAllInvestments().find((item) => item.id === id);
};

export const getInvestmentsByPriority = (priority: 'Priority 1' | 'Priority 2'): InvestmentItem[] => {
  return getAllInvestments().filter((item) => item.priorityTier === priority);
};

export const getInvestmentsByCategory = (category: string): InvestmentItem[] => {
  return getAllInvestments().filter((item) => item.category === category);
};

