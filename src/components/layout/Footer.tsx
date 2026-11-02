import React from 'react';
import { WelNexLogo } from '../common/WelNexLogo';
import { ShieldAlert, Mail, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenExplore?: () => void;
  onOpenWaitlist?: () => void;
  onOpenCompare?: () => void;
  onOpenCalculators?: () => void;
  onOpenAcademy?: () => void;
  onOpenRadar?: () => void;
  onOpenContact?: () => void;
  onOpenSimulator?: () => void;
  onNavigateHome?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenExplore, 
  onOpenWaitlist,
  onOpenCompare,
  onOpenCalculators,
  onOpenAcademy,
  onOpenRadar,
  onOpenContact,
  onOpenSimulator,
  onNavigateHome
}) => {
  return (
    <footer className="w-full bg-sand-100/90 border-t border-champagne-500/30 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <WelNexLogo size="lg" />

            <p className="text-xs sm:text-sm text-espresso-700 leading-relaxed max-w-sm mt-3">
              WelNex (evolved from BrickByBrick) is India's alternative investment discovery, comparison, and virtual simulation platform. Unbiased institutional analytics for modern Indian wealth creators.
            </p>
            
            {/* Official Social Links & Contact */}
            <div className="pt-2 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-espresso-900 block">
                Official Connect & Socials:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Email */}
                <a
                  href="mailto:connect.welnex@gmail.com"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-champagne-500/40 text-xs font-medium text-espresso-800 hover:text-copper-600 hover:border-copper-500/50 transition-all shadow-sm"
                  aria-label="Email WelNex"
                >
                  <Mail className="w-3.5 h-3.5 text-copper-600" />
                  <span>connect.welnex@gmail.com</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/_welnex_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-champagne-500/40 text-xs font-medium text-espresso-800 hover:text-copper-600 hover:border-copper-500/50 transition-all shadow-sm"
                  aria-label="WelNex on Instagram"
                >
                  <svg className="w-3.5 h-3.5 text-copper-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                  <span>@_welnex_</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/welnex-alt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 border border-champagne-500/40 text-xs font-medium text-espresso-800 hover:text-copper-600 hover:border-copper-500/50 transition-all shadow-sm"
                  aria-label="WelNex on LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 text-copper-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect width="4" height="12" x="2" y="9"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                  <span>LinkedIn</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </div>
            </div>
          </div>


          {/* Column 1: Discovery */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-espresso-950 mb-4">
              Discovery
            </h4>
            <ul className="space-y-2.5 text-xs text-espresso-700">
              <li>
                <button onClick={onOpenExplore} className="hover:text-copper-600 transition-colors cursor-pointer">
                  Commercial REITs
                </button>
              </li>
              <li>
                <button onClick={onOpenExplore} className="hover:text-copper-600 transition-colors cursor-pointer">
                  Infrastructure InvITs
                </button>
              </li>
              <li>
                <button onClick={onOpenExplore} className="hover:text-copper-600 transition-colors cursor-pointer">
                  Securitized Debt (SDI)
                </button>
              </li>
              <li>
                <button onClick={onOpenExplore} className="hover:text-copper-600 transition-colors cursor-pointer">
                  Corporate Senior NCDs
                </button>
              </li>
              <li>
                <button onClick={onOpenExplore} className="hover:text-copper-600 transition-colors cursor-pointer">
                  Sovereign Gold Bonds
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Tools & Simulation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-espresso-950 mb-4">
              Tools & Radar
            </h4>
            <ul className="space-y-2.5 text-xs text-espresso-700">
              <li>
                <a href="#how-it-works" className="hover:text-copper-600 transition-colors">
                  How It Works (3 Steps)
                </a>
              </li>
              <li>
                <button 
                  onClick={onOpenRadar || (() => { window.location.hash = '#radar'; })} 
                  className="hover:text-copper-600 transition-colors cursor-pointer text-left"
                >
                  WelNex Radar & Pulse
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenCompare || (() => { window.location.hash = '#compare'; })} 
                  className="hover:text-copper-600 transition-colors cursor-pointer text-left"
                >
                  Comparison Matrix
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenCalculators || (() => { window.location.hash = '#calculators'; })} 
                  className="hover:text-copper-600 transition-colors cursor-pointer text-left"
                >
                  Financial Calculators Suite
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSimulator || onOpenWaitlist} 
                  className="hover:text-copper-600 transition-colors cursor-pointer text-left"
                >
                  Virtual Portfolio Simulator
                </button>
              </li>
              <li>
                <button onClick={onOpenWaitlist} className="hover:text-copper-600 transition-colors cursor-pointer text-left">
                  Early Beta Access
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-espresso-950 mb-4">
              Platform & Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-espresso-700">
              <li>
                <button 
                  onClick={onOpenAcademy || (() => { window.location.hash = '#academy'; })} 
                  className="hover:text-copper-600 transition-colors cursor-pointer text-left"
                >
                  WelNex Academy
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateHome || (() => { window.scrollTo({ top: 0, behavior: 'smooth' }); })} 
                  className="hover:text-copper-600 transition-colors cursor-pointer text-left"
                >
                  Home Overview
                </button>
              </li>

              <li>
                <a href="#hero" className="hover:text-copper-600 transition-colors">
                  BrickByBrick Heritage
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="hover:text-copper-600 transition-colors">
                  Regulatory Boundary
                </a>
              </li>
              <li>
                <a href="#waitlist" className="hover:text-copper-600 transition-colors">
                  Founder's Circle Waitlist
                </a>
              </li>
              <li>
                <button 
                  onClick={onOpenContact || (() => { window.location.href = 'mailto:connect.welnex@gmail.com'; })} 
                  className="hover:text-copper-600 transition-colors cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* IMPORTANT MANDATORY REGULATORY DISCLAIMER CONTAINER */}
        <div id="disclaimer" className="p-6 rounded-3xl bg-sand-200/80 border border-champagne-500/40 mb-10 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-copper-500/15 border border-copper-500/30 flex items-center justify-center text-copper-600 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-2 text-xs text-espresso-800 leading-relaxed">
              <h5 className="font-bold uppercase tracking-wider text-copper-700 text-[11px]">
                Strict Educational, Discovery & Virtual Simulation Boundary (Disclaimer)
              </h5>
              <p>
                <strong>WelNex is strictly an educational discovery, comparison, and virtual simulation platform.</strong> WelNex is <strong>NOT</strong> a broker, dealer, investment advisor (RIA), research analyst (RA), portfolio manager, or asset management company registered with SEBI, RBI, or any financial regulator.
              </p>
              <p>
                WelNex does <strong>NOT</strong> collect investor funds, pool capital, hold client custody, solicit investments, endorse specific securities, or execute transactions. All market quotations, distribution yields, cash flow breakdowns, and risk scores displayed on WelNex are indicative, delayed, and compiled strictly from publicly available SEBI filings, stock exchanges (NSE/BSE), and trustee disclosures for informational analysis.
              </p>
              <p className="text-[11px] text-espresso-700">
                Alternative investments—including REITs, InvITs, corporate debentures, and securitized credit—carry market, credit, tenant default, and liquidity risks. Indicative yields are subject to market conditions and are not guaranteed returns. Past performance does not assure future results. Users must conduct their own independent due diligence and consult certified financial planners or chartered accountants before making any actual financial commitments.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-champagne-500/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-espresso-600">
          <div>
            © 2026 WelNex India Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Discover. Understand. Explore.</span>
            <span>•</span>
            <span>Evolved from BrickByBrick</span>
            <span>•</span>
            <a href="mailto:connect.welnex@gmail.com" className="text-copper-700 hover:underline">
              connect.welnex@gmail.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
