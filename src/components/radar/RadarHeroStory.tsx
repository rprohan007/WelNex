import React from 'react';
import type { RadarFeaturedStory } from '../../types/radar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Clock,
  ArrowRight,
  ExternalLink,
  Landmark,
  Radio
} from 'lucide-react';


interface RadarHeroStoryProps {
  story: RadarFeaturedStory;
  onReadAnalysis?: (story: RadarFeaturedStory) => void;
}

export const RadarHeroStory: React.FC<RadarHeroStoryProps> = ({
  story,
  onReadAnalysis
}) => {
  return (
    <div className="rounded-3xl border border-champagne-500/50 bg-white/80 backdrop-blur-xl shadow-glass-md overflow-hidden transition-all duration-300 hover:border-champagne-500/70 mb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        
        {/* Left Column: Visual Story Shell / Graphic Slot */}
        <div className={`lg:col-span-5 p-6 sm:p-8 bg-gradient-to-br ${story.imageAccent || 'from-copper-700/40 via-amber-600/30 to-espresso-950'} flex flex-col justify-between text-sand-50 relative overflow-hidden`}>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

          {/* Top Tag Badges */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-100/20 backdrop-blur-md border border-white/20 text-xs font-bold text-sand-100">
              <Radio className="w-3.5 h-3.5 text-copper-300 animate-pulse" />
              <span>{story.tag}</span>
            </span>

            <span className="font-mono text-xs text-sand-200">
              {story.date}
            </span>
          </div>

          {/* Graphic Icon & Big Stat Representation */}
          <div className="my-10 relative z-10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 flex items-center justify-center text-sand-50 shadow-inner">
              <Landmark className="w-6 h-6" />
            </div>

            {story.keyStat && (
              <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/15 w-fit">
                <span className="text-[10px] uppercase font-bold tracking-wider text-champagne-300 block">
                  {story.keyStat.label}
                </span>
                <span className="text-xl sm:text-2xl font-mono font-black text-white block mt-0.5">
                  {story.keyStat.value}
                </span>
              </div>
            )}
          </div>

          {/* Bottom attribution */}
          <div className="relative z-10 flex items-center justify-between text-xs text-sand-200/90 border-t border-white/15 pt-3">
            <span className="font-medium truncate">
              Source: {story.source}
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              <span>{story.readTime}</span>
            </span>
          </div>
        </div>

        {/* Right Column: Story Editorial Body */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="copper" size="xs">
                {story.category}
              </Badge>
              <span className="text-xs text-copper-700 font-semibold">
                Lead Regulatory Intelligence
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-espresso-950 leading-tight">
              {story.title}
            </h3>

            <p className="text-xs sm:text-sm text-espresso-700 leading-relaxed">
              {story.excerpt}
            </p>

            <div className="p-4 rounded-2xl bg-sand-100/90 border border-champagne-500/35 text-xs text-espresso-800 leading-relaxed">
              <strong className="text-copper-700 block mb-1">
                Institutional Analysis:
              </strong>
              {story.analysisSummary}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-champagne-500/30">
            <span className="text-xs text-espresso-500">
              Verified from official statutory gazette
            </span>

            <div className="flex items-center gap-2.5">
              {story.sourceUrl && (
                <a
                  href={story.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-espresso-700 hover:text-copper-700 hover:bg-copper-500/10 border border-champagne-500/30 transition-all flex items-center gap-1.5"
                >
                  <span>SEBI Circular</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <Button
                variant="primary"
                size="sm"
                onClick={() => onReadAnalysis?.(story)}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                Read Analysis
              </Button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
