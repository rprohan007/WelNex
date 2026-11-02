import React, { useState } from 'react';
import { DistributionYieldCalculator } from './DistributionYieldCalculator';
import { TotalReturnCompoundingCalculator } from './TotalReturnCompoundingCalculator';
import { ScenarioStressTestCalculator } from './ScenarioStressTestCalculator';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Coins,
  TrendingUp,
  Sliders,
  ShieldAlert,
  Sparkles
} from 'lucide-react';


interface FinancialCalculatorsSuiteProps {
  onOpenWaitlist?: () => void;
  isStandalonePage?: boolean;
  initialActiveTab?: CalculatorTab;
  userId?: string;
  userEmail?: string;
  onOpenAuthModal?: () => void;
}

type CalculatorTab = 'yield' | 'total-return' | 'stress-test';

export const FinancialCalculatorsSuite: React.FC<FinancialCalculatorsSuiteProps> = ({
  onOpenWaitlist,
  isStandalonePage = false,
  initialActiveTab = 'yield',
  userId,
  userEmail,
  onOpenAuthModal
}) => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(initialActiveTab);

  const tabs = [
    {
      id: 'yield' as CalculatorTab,
      label: 'Yield & Passive Income',
      sublabel: 'Cash Flow & Distribution Frequency',
      icon: Coins,
      badge: 'Tool A'
    },
    {
      id: 'total-return' as CalculatorTab,
      label: 'Total Return & Compounding',
      sublabel: 'Yield vs. Capital Growth Split',
      icon: TrendingUp,
      badge: 'Tool B'
    },
    {
      id: 'stress-test' as CalculatorTab,
      label: 'Scenario Stress-Testing',
      sublabel: 'Rate Hike & Vacancy Sensitivity',
      icon: Sliders,
      badge: 'Tool C'
    }
  ];

  return (
    <section id="calculators" className={`w-full ${isStandalonePage ? 'pt-28 pb-24' : 'py-20'} bg-sand text-espresso-950`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-champagne-500/30">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="copper" size="sm" withDot>
                Phase 4 Interactive Suite
              </Badge>
              <span className="text-xs font-semibold text-espresso-700">
                Institutional Financial Modeling
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-espresso-950 tracking-tight">
              WelNex Financial Calculators Suite
            </h2>
            <p className="text-sm sm:text-base text-espresso-700 mt-2.5 max-w-2xl leading-relaxed">
              Model real periodic distributions, simulate compound total return trajectories, and run dynamic macroeconomic stress tests before committing capital.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenWaitlist && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenWaitlist}
                icon={<Sparkles className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                Request Custom Model
              </Button>
            )}
          </div>
        </div>

        {/* SIMULATOR SLOT MOUNT (Expose Clerk / Auth UID & Workspace) */}
        {userId && userEmail ? (
          <div className="mb-6 p-4 rounded-2xl bg-white/90 border border-copper-500/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-copper-500/15 border border-copper-500/30 flex items-center justify-center text-copper-700 shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-espresso-950">
                    Active Virtual Portfolio Slot
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-800 font-bold border border-emerald-500/30">
                    Live Cloud Sync
                  </span>
                </div>
                <span className="text-xs text-espresso-600 font-mono block mt-0.5">
                  Workspace: <span className="text-espresso-900 font-semibold">{userEmail}</span> • Slot UID: <span className="text-copper-700 font-bold">{userId}</span>
                </span>
              </div>
            </div>
            <span className="text-[11px] text-espresso-500 sm:max-w-xs text-left sm:text-right">
              Scenarios and custom yield weights auto-bind to this virtual workspace slot.
            </span>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-2xl bg-white/70 border border-champagne-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-champagne-500/30 border border-champagne-500/40 flex items-center justify-center text-espresso-700 shrink-0">
                <Sliders className="w-5 h-5 text-copper-600" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-espresso-950 block">
                  Guest Simulator Sandbox
                </span>
                <span className="text-xs text-espresso-600 block mt-0.5">
                  Sign in with Google to automatically save your virtual stress-test scenarios, yield allocations, and cash flow forecasts to your personal account.
                </span>
              </div>
            </div>
            {onOpenAuthModal && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onOpenAuthModal}
                className="text-xs font-bold shrink-0 shadow-xs"
              >
                Sign In with Google
              </Button>
            )}
          </div>
        )}

        {/* REGULATORY ASSUMPTION DISCLAIMER (Prompt requirement) */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-sand-200/80 border border-champagne-500/50 backdrop-blur-md flex items-start gap-3.5 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-copper-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-[13px] text-espresso-800 leading-relaxed">
            <strong className="font-bold text-copper-800 block mb-0.5">
              Educational Modeling Assumptions & Non-Advisory Notice:
            </strong>
            All projections, compounding models, cash flows, and stress simulations rendered by the WelNex Financial Calculators Suite are illustrative educational tools based strictly on user assumptions. Past performance or historical distribution rates do not guarantee future yields or capital appreciation. WelNex is not a registered financial advisor or broker-dealer and does not solicit securities. Consult statutory offering memorandums and your chartered accountant or SEBI-registered Investment Advisor (RIA).
          </div>
        </div>

        {/* TAB NAVIGATION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 sm:p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-start gap-3.5 relative overflow-hidden ${
                  isActive
                    ? 'bg-white border-copper-500 shadow-glass-md ring-2 ring-copper-500/20'
                    : 'bg-white/60 border-champagne-500/35 hover:border-copper-500/40 hover:bg-white/80'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-copper-500 via-champagne-500 to-copper-600" />
                )}
                <div
                  className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                    isActive ? 'bg-copper-500 text-white' : 'bg-copper-500/10 text-copper-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-copper-700">
                      {tab.badge}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold text-copper-700 bg-copper-500/10 px-2 py-0.5 rounded-full">
                        Active Model
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm sm:text-base font-display font-bold text-espresso-950 truncate">
                    {tab.label}
                  </h4>
                  <p className="text-xs text-espresso-600 truncate mt-0.5">
                    {tab.sublabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE CALCULATOR DISPLAY CONTAINER */}
        <div className="animate-fadeIn">
          {activeTab === 'yield' && (
            <DistributionYieldCalculator onOpenWaitlist={onOpenWaitlist} />
          )}

          {activeTab === 'total-return' && (
            <TotalReturnCompoundingCalculator onOpenWaitlist={onOpenWaitlist} />
          )}

          {activeTab === 'stress-test' && (
            <ScenarioStressTestCalculator onOpenWaitlist={onOpenWaitlist} />
          )}
        </div>

      </div>
    </section>
  );
};
