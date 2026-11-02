import { useState, useEffect, useLayoutEffect } from 'react';
import { TickerMarquee } from './components/layout/TickerMarquee';
import { GlassNav } from './components/layout/GlassNav';
import { HeroSection } from './components/sections/HeroSection';
import { HowItWorksHorizontalScroll } from './components/sections/HowItWorksHorizontalScroll';
import { CoreAlternativesStackedDeck } from './components/sections/CoreAlternativesStackedDeck';
import { InteractivePreviewWidget } from './components/sections/InteractivePreviewWidget';
import { WaitlistCard } from './components/sections/WaitlistCard';
import { Footer } from './components/layout/Footer';
import { ExploreModal } from './components/modals/ExploreModal';
import { AdminLoginModal } from './components/modals/AdminLoginModal';
import { ExploreCatalogue } from './components/explore/ExploreCatalogue';
import { InvestmentDetailPage } from './components/explore/InvestmentDetailPage';
import { SideBySideComparisonMatrix } from './components/compare/SideBySideComparisonMatrix';
import { FinancialCalculatorsSuite } from './components/calculators/FinancialCalculatorsSuite';
import { AcademyFramework } from './components/academy/AcademyFramework';
import { WelNexRadarShell } from './components/radar/WelNexRadarShell';
import { AdminCMSPortal } from './components/admin/AdminCMSPortal';
import { ContactUsPage } from './components/contact/ContactUsPage';
import { VirtualSimulatorDashboard } from './components/simulator/VirtualSimulatorDashboard';
import { getInvestmentById } from './data/investmentsData';
import { useAuth } from './context/AuthContext';
import { ClerkAuthModal } from './components/auth/ClerkAuthModal';
import type { TickerItem } from './types';

type AppView = 'home' | 'catalogue' | 'detail' | 'compare' | 'calculators' | 'academy' | 'radar' | 'simulator' | 'contact' | 'admin';

export default function App() {
  const { user, openAuthModal } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // CRITICAL NAVIGATION SCROLL FIX:
  // Disable browser scroll restoration so page transitions never preserve bottom/offset scroll
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Check if initial hash is #admin
    if (window.location.hash === '#admin') {
      setCurrentView('admin');
    }
  }, []);

  // Global layout scroll reset on every view or selected asset change
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [currentView, selectedAssetId]);

  const handleScrollToWaitlist = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      setTimeout(() => {
        const el = document.getElementById('waitlist');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('waitlist');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenExploreCatalogue = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentView('catalogue');
  };

  const handleOpenCompare = (ids?: string[]) => {
    if (ids && ids.length) {
      setCompareIds(ids);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentView('compare');
  };

  const handleOpenCalculators = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentView('calculators');
  };

  const handleOpenSimulator = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentView('simulator');
  };

  const handleOpenAcademy = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentView('academy');
  };

  const handleOpenRadar = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentView('radar');
  };

  const handleOpenContact = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentView('contact');
  };

  const handleOpenAdmin = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentView('admin');
  };

  const handleSelectInvestment = (id: string) => {
    setSelectedAssetId(id);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentView('detail');
  };

  const handleBackToCatalogue = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentView('catalogue');
  };

  const handleBackToHome = () => {
    setSelectedAssetId(null);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setCurrentView('home');
  };

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 investments at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  // Map clicked ticker item to investment detail if matching
  const handleSelectTickerItem = (item: TickerItem) => {
    const symbolMap: { [key: string]: string } = {
      'EMBASSY': 'embassy-office-parks-reit',
      'MINDSPACE': 'mindspace-business-parks-reit',
      'BIRET': 'brookfield-india-reit',
      'NXST': 'nexus-select-trust-reit',
      'INDIGRID': 'indigrid-invit',
      'PGINVIT': 'powergrid-invit',
      'TATACAP': 'tata-capital-ncd-aaa',
      'GOLDBEES': 'nippon-gold-bees-etf',
      'SGB': 'rbi-sgb-gold-bonds',
      'SDI-EV04': 'grip-ev-lease-sdi'
    };

    const targetId = symbolMap[item.symbol];
    if (targetId) {
      handleSelectInvestment(targetId);
    } else {
      handleOpenExploreCatalogue();
    }
  };

  const selectedInvestment = selectedAssetId ? getInvestmentById(selectedAssetId) : undefined;

  return (
    <div className="min-h-screen bg-sand text-espresso-950 font-sans selection:bg-copper-500/20 selection:text-copper-700">
      
      {/* 1. TOP LIVE MARQUEE TICKER */}
      <TickerMarquee onSelectItem={handleSelectTickerItem} />

      {/* STICKY GLASS NAVIGATION BAR */}
      <GlassNav
        onOpenAdminLogin={handleOpenAdmin}
        onOpenExplore={handleOpenExploreCatalogue}
        onOpenAcademy={handleOpenAcademy}
        onOpenRadar={handleOpenRadar}
        onOpenContact={handleOpenContact}
        onOpenSimulator={handleOpenSimulator}
        currentView={currentView}
        onNavigateHome={handleBackToHome}
      />

      {/* VIEW 1: STREAMLINED HOMEPAGE LANDING ARCHITECTURE */}
      {currentView === 'home' && (
        <main className="w-full bg-sand">
          
          {/* 2. HERO SECTION + WAITLIST CTA */}
          <HeroSection
            onExploreClick={handleOpenExploreCatalogue}
            onWaitlistClick={handleScrollToWaitlist}
          />

          {/* 3. HOW IT WORKS (01. Educate -> 02. Simulate and Explore -> 03. Discover and Access) */}
          <HowItWorksHorizontalScroll
            onOpenWaitlist={handleScrollToWaitlist}
            onOpenExplore={handleOpenExploreCatalogue}
            onOpenAcademy={handleOpenAcademy}
            onOpenSimulator={handleOpenSimulator}
          />

          {/* 4. HOMEPAGE CORE ALTERNATIVES — 3D STACKED CARD SCROLL SECTION */}
          <CoreAlternativesStackedDeck
            onOpenExplore={handleOpenExploreCatalogue}
            onOpenCompare={() => handleOpenCompare()}
          />

          {/* 5. INTERACTIVE PREVIEW WIDGET (Interactive portfolio/terminal teaser & 4 Calibrated Feature Boxes) */}
          <InteractivePreviewWidget
            onOpenCompare={() => handleOpenCompare()}
            onOpenSimulator={handleOpenSimulator}
            onOpenExplore={handleOpenExploreCatalogue}
            onOpenAcademy={handleOpenAcademy}
          />

          {/* 6. EMBEDDED WAITLIST CARD */}
          <WaitlistCard />

        </main>
      )}

      {/* VIEW 2: DEDICATED EXPLORE CATALOGUE (/explore) */}
      {currentView === 'catalogue' && (
        <ExploreCatalogue
          onSelectInvestment={handleSelectInvestment}
          onOpenWaitlist={handleScrollToWaitlist}
          onBackToHome={handleBackToHome}
          onNavigateToCompare={handleOpenCompare}
          onNavigateToCalculators={handleOpenCalculators}
        />
      )}

      {/* VIEW 3: DEDICATED INVESTMENT DETAIL PAGE */}
      {currentView === 'detail' && selectedInvestment && (
        <InvestmentDetailPage
          investment={selectedInvestment}
          onBackToCatalogue={handleBackToCatalogue}
          onToggleCompare={handleToggleCompare}
          isComparing={compareIds.includes(selectedInvestment.id)}
          onOpenWaitlist={handleScrollToWaitlist}
          onNavigateToCompare={(id) => handleOpenCompare([id])}
          onNavigateToCalculators={handleOpenCalculators}
        />
      )}

      {/* VIEW 4: DEDICATED STANDALONE COMPARISON MATRIX (/compare) */}
      {currentView === 'compare' && (
        <div className="w-full bg-sand min-h-screen">
          <SideBySideComparisonMatrix
            isStandalonePage={true}
            initialSelectedIds={compareIds.length > 0 ? compareIds : undefined}
            onViewInvestmentDetail={handleSelectInvestment}
            onOpenWaitlist={handleScrollToWaitlist}
          />
        </div>
      )}

      {/* VIEW 5: DEDICATED STANDALONE FINANCIAL CALCULATORS SUITE (/calculators) */}
      {currentView === 'calculators' && (
        <div className="w-full bg-sand min-h-screen">
          <FinancialCalculatorsSuite
            isStandalonePage={true}
            initialActiveTab="yield"
            onOpenWaitlist={handleScrollToWaitlist}
          />
        </div>
      )}

      {/* VIEW 6: DEDICATED STANDALONE VIRTUAL SIMULATOR (/simulator) */}
      {currentView === 'simulator' && (
        <VirtualSimulatorDashboard
          userId={user?.id}
          userEmail={user?.primaryEmailAddress?.emailAddress}
          onOpenAuthModal={openAuthModal}
          onBackToHome={handleBackToHome}
          onOpenExplore={handleOpenExploreCatalogue}
        />
      )}

      {/* VIEW 7: DEDICATED STANDALONE ACADEMY (/academy) */}
      {currentView === 'academy' && (
        <div className="w-full bg-sand min-h-screen">
          <AcademyFramework
            isStandalonePage={true}
            onOpenWaitlist={handleScrollToWaitlist}
          />
        </div>
      )}

      {/* VIEW 8: DEDICATED STANDALONE WELNEX RADAR (/radar) */}
      {currentView === 'radar' && (
        <div className="w-full bg-sand min-h-screen">
          <WelNexRadarShell
            isStandalonePage={true}
            onOpenWaitlist={handleScrollToWaitlist}
          />
        </div>
      )}

      {/* VIEW 9: PHASE 6 DEDICATED ADMIN CMS PORTAL (/admin) */}
      {currentView === 'admin' && (
        <AdminCMSPortal
          onBackToHome={handleBackToHome}
          onOpenExplore={handleOpenExploreCatalogue}
        />
      )}

      {/* VIEW 10: USER CONTACT US PAGE (/contact) */}
      {currentView === 'contact' && (
        <ContactUsPage
          onBackToHome={handleBackToHome}
          onOpenExplore={handleOpenExploreCatalogue}
        />
      )}

      {/* 7. FOOTER WITH DISCLAIMERS & SOCIAL LINKS */}
      <Footer
        onOpenExplore={handleOpenExploreCatalogue}
        onOpenWaitlist={handleScrollToWaitlist}
        onOpenCompare={() => handleOpenCompare()}
        onOpenCalculators={handleOpenCalculators}
        onOpenAcademy={handleOpenAcademy}
        onOpenRadar={handleOpenRadar}
        onOpenContact={handleOpenContact}
        onOpenSimulator={handleOpenSimulator}
        onNavigateHome={handleBackToHome}
      />

      {/* GLOBAL MODALS */}
      <ExploreModal
        isOpen={isExploreModalOpen}
        onClose={() => setIsExploreModalOpen(false)}
        onOpenWaitlist={handleScrollToWaitlist}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
      />

      {/* CLERK AUTHENTICATION MODAL */}
      <ClerkAuthModal />

    </div>
  );
}
