import React from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { GlassCard } from '../common/GlassCard';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  Building2, 
  Zap, 
  Coins 
} from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onWaitlistClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onWaitlistClick
}) => {
  const scrollY = useScrollProgress();

  // Smooth subtle parallax transforms for background ambient depth
  const backgroundOrbTransform = `translate3d(0, ${scrollY * 0.35}px, 0)`;
  const backgroundBadgesTransform = `translate3d(0, ${scrollY * 0.18}px, 0)`;

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-36 md:pb-24 overflow-hidden bg-sand">
      
      {/* Parallax Depth Layering - Background Ambient Liquid Gradient Orbs */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[450px] md:w-[950px] md:h-[550px] bg-gradient-to-tr from-copper-500/12 via-champagne-500/18 to-transparent rounded-full blur-3xl pointer-events-none -z-10 will-change-transform"
        style={{ transform: backgroundOrbTransform }}
      />
      <div 
        className="absolute top-1/3 -left-20 w-80 h-80 bg-copper-500/10 rounded-full blur-3xl pointer-events-none -z-10 will-change-transform"
        style={{ transform: backgroundOrbTransform }}
      />
      <div 
        className="absolute top-1/2 -right-20 w-96 h-96 bg-champagne-500/25 rounded-full blur-3xl pointer-events-none -z-10 will-change-transform"
        style={{ transform: backgroundOrbTransform }}
      />

      {/* Floating Institutional Insight Badges */}
      <div 
        className="hidden md:flex absolute top-44 left-12 p-3 rounded-2xl bg-white/65 backdrop-blur-md border border-champagne-500/35 shadow-sm text-xs font-semibold text-espresso-800 items-center gap-2 pointer-events-none -z-10 will-change-transform"
        style={{ transform: backgroundBadgesTransform }}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
        <span>REITs: 90% Mandatory Payout by Law</span>
      </div>

      <div 
        className="hidden md:flex absolute top-56 right-16 p-3 rounded-2xl bg-white/65 backdrop-blur-md border border-champagne-500/35 shadow-sm text-xs font-semibold text-espresso-800 items-center gap-2 pointer-events-none -z-10 will-change-transform"
        style={{ transform: backgroundBadgesTransform }}
      >
        <Sparkles className="w-3.5 h-3.5 text-copper-600" />
        <span>Yield Spread: +475 bps vs 10Y G-Sec</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Foreground Content: Title & CTAs */}
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Primary Tagline Badge */}
          <div className="inline-flex items-center gap-2 mb-6 animate-fadeIn">
            <Badge variant="copper" size="md" withDot={true}>
              India's Alternative Investment Discovery Platform
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-espresso-950 tracking-tight leading-[1.1] mb-6">
            The Future of Investing Belongs <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-copper-500 via-copper-600 to-amber-700">
              Beyond the Stock Market.
            </span>
          </h1>

          {/* Subtitle explaining educational and discovery boundary */}
          <p className="text-base sm:text-lg md:text-xl text-espresso-700 font-normal leading-relaxed max-w-3xl mx-auto mb-10">
            Discover, understand, and compare India's emerging alternative investments—from real estate and infrastructure to private debt, renewable energy, and unlisted assets. All in one clear, educational platform.
          </p>

          {/* Call-to-Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              onClick={onExploreClick}
              className="w-full sm:w-auto text-base shadow-lg shadow-copper-500/25 font-semibold"
            >
              Explore Investments
            </Button>

            <Button
              variant="secondary"
              size="lg"
              icon={<Sparkles className="w-4 h-4 text-copper-600" />}
              iconPosition="left"
              onClick={onWaitlistClick}
              className="w-full sm:w-auto text-base font-semibold"
            >
              Join Early Waitlist
            </Button>
          </div>

          {/* Strict Educational Non-Brokerage Reassurance */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-sand-200/90 border border-champagne-500/40 text-xs text-espresso-700 mb-12 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-copper-600" />
            <span>Strictly Educational & Discovery Platform • No Fund Pooling • Zero Brokerage Bias</span>
          </div>

          {/* Value Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            <GlassCard variant="subtle" className="p-4 sm:p-5 bg-white/70">
              <div className="w-8 h-8 rounded-lg bg-copper-500/10 text-copper-600 flex items-center justify-center mb-3">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-espresso-900 font-mono">
                ₹1.2L Cr+
              </div>
              <div className="text-xs text-espresso-600 mt-1 font-medium">
                Underlying Assets Tracked
              </div>
            </GlassCard>

            <GlassCard variant="subtle" className="p-4 sm:p-5 bg-white/70">
              <div className="w-8 h-8 rounded-lg bg-copper-500/10 text-copper-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-espresso-900 font-mono">
                7.5% – 13%
              </div>
              <div className="text-xs text-espresso-600 mt-1 font-medium">
                Indicative Yield Spreads
              </div>
            </GlassCard>

            <GlassCard variant="subtle" className="p-4 sm:p-5 bg-white/70">
              <div className="w-8 h-8 rounded-lg bg-copper-500/10 text-copper-600 flex items-center justify-center mb-3">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-espresso-900 font-mono">
                1 Unit
              </div>
              <div className="text-xs text-espresso-600 mt-1 font-medium">
                SEBI Retail Minimum Lot
              </div>
            </GlassCard>

            <GlassCard variant="subtle" className="p-4 sm:p-5 bg-white/70">
              <div className="w-8 h-8 rounded-lg bg-copper-500/10 text-copper-600 flex items-center justify-center mb-3">
                <Coins className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-espresso-900 font-mono">
                90%+
              </div>
              <div className="text-xs text-espresso-600 mt-1 font-medium">
                Mandatory Payout by Law
              </div>
            </GlassCard>
          </div>

        </div>

      </div>
    </section>
  );
};
