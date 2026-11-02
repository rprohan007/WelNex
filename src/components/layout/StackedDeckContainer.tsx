import React, { useEffect, useState, useRef } from 'react';

interface StackedDeckContainerProps {
  heroContent: React.ReactNode;
  howItWorksContent: React.ReactNode;
  launchAssetsContent: React.ReactNode;
  comparisonContent: React.ReactNode;
  pillarsContent: React.ReactNode;
  waitlistContent: React.ReactNode;
}

export const StackedDeckContainer: React.FC<StackedDeckContainerProps> = ({
  heroContent,
  howItWorksContent,
  launchAssetsContent,
  comparisonContent,
  pillarsContent,
  waitlistContent
}) => {
  const heroCardRef = useRef<HTMLDivElement>(null);
  const howItWorksCardRef = useRef<HTMLDivElement>(null);
  const [heroScale, setHeroScale] = useState(1);
  const [heroOpacity, setHeroOpacity] = useState(1);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (howItWorksCardRef.current) {
            const rect = howItWorksCardRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Trigger depth effect as the How It Works card slides up towards the top sticky position (~80px)
            const targetTop = 80;
            const startTransitionPoint = windowHeight * 0.75;
            
            if (rect.top <= startTransitionPoint && rect.top >= targetTop) {
              const progress = (startTransitionPoint - rect.top) / (startTransitionPoint - targetTop);
              // Scale from 1 down to 0.96
              const newScale = 1 - (progress * 0.04);
              // Opacity from 1 down to 0.88
              const newOpacity = 1 - (progress * 0.12);
              setHeroScale(newScale);
              setHeroOpacity(newOpacity);
            } else if (rect.top < targetTop) {
              setHeroScale(0.96);
              setHeroOpacity(0.88);
            } else {
              setHeroScale(1);
              setHeroOpacity(1);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full bg-sand">
      
      {/* CARD 01: Hero Section (Pins at top: 80px while next section slides over) */}
      <div 
        ref={heroCardRef}
        className="sticky top-20 z-10 w-full transition-transform duration-150 ease-out origin-top will-change-transform"
        style={{
          transform: `scale(${heroScale})`,
          opacity: heroOpacity
        }}
      >
        <div className="w-full bg-sand">
          {heroContent}
        </div>
      </div>

      {/* CARD 02: "How It Works" Deck (Slides smoothly OVER the Hero card) */}
      <div 
        ref={howItWorksCardRef}
        className="sticky top-20 z-20 w-full rounded-t-[2.5rem] bg-sand border-t-2 border-champagne-500/50 shadow-[0_-15px_40px_rgba(74,43,29,0.08)] mt-[-2rem] pt-8"
      >
        {howItWorksContent}
      </div>

      {/* CARD 03: Priority 1 Launch Assets Teaser Grid (Slides smoothly OVER How It Works) */}
      <div 
        className="sticky top-24 z-30 w-full rounded-t-[2.5rem] bg-sand border-t-2 border-champagne-500/50 shadow-[0_-15px_40px_rgba(74,43,29,0.08)] mt-[-2rem] pt-8"
      >
        {launchAssetsContent}
      </div>

      {/* CARD 04: Asset Comparison Matrix & Benchmark Spread */}
      <div 
        className="sticky top-28 z-40 w-full rounded-t-[2.5rem] bg-sand border-t-2 border-champagne-500/50 shadow-[0_-15px_40px_rgba(74,43,29,0.08)] mt-[-2rem] pt-8"
      >
        {comparisonContent}
      </div>

      {/* CARD 05: Pillars & Community Waitlist */}
      <div 
        className="relative z-50 w-full rounded-t-[2.5rem] bg-sand border-t-2 border-champagne-500/50 shadow-[0_-15px_40px_rgba(74,43,29,0.08)] mt-[-2rem] pt-8"
      >
        {pillarsContent}
        {waitlistContent}
      </div>

    </div>
  );
};
