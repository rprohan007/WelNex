import type { AssetComparison } from '../types';

export const ASSET_COMPARISONS: AssetComparison[] = [
  {
    id: 'reits',
    category: 'Commercial Real Estate',
    name: 'Real Estate Investment Trusts (REITs)',
    indicativeYield: '6.5% – 8.5% p.a.',
    liquidity: 'High (Exchange Traded)',
    minInvestment: '₹300 – ₹400 (1 Unit on NSE/BSE)',
    taxEfficiency: 'Partial tax exemption on Return of Capital / Dividends under specific SPV rules',
    riskRating: 'Moderate',
    instruments: ['Embassy Office Parks', 'Mindspace Business Parks', 'Brookfield India', 'Nexus Select'],
    description: 'SEBI-regulated instruments owning institutional Grade-A office parks and shopping malls with Fortune 500 tenants and 90%+ mandatory cash distribution.'
  },
  {
    id: 'invits',
    category: 'Critical Infrastructure',
    name: 'Infrastructure Investment Trusts (InvITs)',
    indicativeYield: '9.5% – 13.0% p.a.',
    liquidity: 'High (Exchange Traded)',
    minInvestment: '₹100 – ₹140 (1 Unit on NSE/BSE)',
    taxEfficiency: 'Cash flows split across Interest, Dividend, and Return of Capital',
    riskRating: 'Moderate',
    instruments: ['IndiGrid InvIT (Power Grid)', 'PowerGrid InvIT', 'IRB InvIT (Highways)', 'NHAI InvIT'],
    description: 'Pools of high-utility revenue-generating infrastructure assets (toll roads, interstate power transmission corridors, pipelines) generating recurring dividend distributions.'
  },
  {
    id: 'sdi',
    category: 'Structured Credit',
    name: 'Securitized Debt Instruments (SDIs)',
    indicativeYield: '11.0% – 14.5% p.a.',
    liquidity: 'Low (Fixed Tenor)',
    minInvestment: '₹10,000 – ₹1,00,000',
    taxEfficiency: 'Interest income taxed as per investor slab rate',
    riskRating: 'Moderate-High',
    instruments: ['Equipment Lease Rentals', 'EV Fleet Securitization', 'Vendor Invoicing Backed Bonds'],
    description: 'SEBI-governed instrument backed by isolated tangible pools of corporate leases or receivables, deposited with a SEBI-registered Trustee.'
  },
  {
    id: 'bonds',
    category: 'Fixed Income',
    name: 'Corporate Bonds & Senior NCDs',
    indicativeYield: '8.5% – 11.5% p.a.',
    liquidity: 'Medium',
    minInvestment: '₹10,000 (Via RFQ / OBPP Platforms)',
    taxEfficiency: 'Taxed at marginal slab rate for listed debentures',
    riskRating: 'Low-Moderate',
    instruments: ['Tata Capital NCDs', 'L&T Finance Bonds', 'Piramal Capital', 'Muthoot Finance'],
    description: 'Direct fixed-coupon instruments issued by Indian conglomerates and NBFCs, rated A to AAA with defined tenors and senior charge on assets.'
  },
  {
    id: 'gold',
    category: 'Precious Metals',
    name: 'Sovereign Gold Bonds & Gold ETFs',
    indicativeYield: '2.5% p.a. + Gold Appreciation',
    liquidity: 'High (Exchange Traded)',
    minInvestment: '₹6,000 – ₹7,200 (1 Gram Gold)',
    taxEfficiency: 'SGB: 100% Capital Gains Tax Exempt if held to 8y maturity; 2.5% coupon taxable',
    riskRating: 'Low-Moderate',
    instruments: ['RBI SGB Tranches', 'Nippon Gold BeES', 'ICICI Prudential Gold ETF'],
    description: 'Sovereign-backed paper gold backed by the Reserve Bank of India with an additional 2.50% annual coupon payout and zero storage risk.'
  }
];

export const FREQUENTLY_ASKED_QUESTIONS = [
  {
    question: "Is WelNex an investment broker or fund manager?",
    answer: "No. WelNex is strictly an educational discovery, comparison, and virtual simulation platform. WelNex does not collect investor funds, pool capital, act as a broker, or provide personalized financial advisory (RIA). All asset data and simulation tools are for educational discovery only."
  },
  {
    question: "How do Indian REITs and InvITs distribute income?",
    answer: "Under SEBI regulations, Indian REITs and InvITs are mandated to distribute at least 90% of their net distributable cash flows to unit-holders at least semi-annually (most distribute quarterly). Distributions typically consist of interest, dividends, and return of capital (RoC)."
  },
  {
    question: "What is the minimum investment required for alternative assets in India?",
    answer: "Historically, alternative assets required ₹10 Lakhs to ₹1 Crore. Today, SEBI has reduced the trading lot size for listed REITs and InvITs to just 1 unit (approx ₹100 - ₹400), making them universally accessible to retail investors."
  },
  {
    question: "How does the WelNex Virtual Simulator work?",
    answer: "The WelNex Virtual Simulator allows you to create paper portfolios across REITs, InvITs, and fixed-income assets. You can project simulated quarterly cash flows, stress-test yields against inflation, and analyze portfolio risk without committing real money."
  }
];
