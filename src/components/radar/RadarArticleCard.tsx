import React from 'react';
import type { RadarArticle } from '../../types/radar';
import { Badge } from '../common/Badge';
import {
  Calendar,
  Clock,
  ArrowUpRight
} from 'lucide-react';


interface RadarArticleCardProps {
  article: RadarArticle;
  onSelectArticle?: (article: RadarArticle) => void;
}

export const RadarArticleCard: React.FC<RadarArticleCardProps> = ({
  article,
  onSelectArticle
}) => {
  const getImpactBadge = (level?: RadarArticle['impactLevel']) => {
    switch (level) {
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-800 border border-rose-500/25">
            High Market Impact
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/25">
            Moderate Shift
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sand-200 text-espresso-700 border border-champagne-500/30">
            Regulatory Notice
          </span>
        );
    }
  };

  return (
    <div className="rounded-3xl border border-champagne-500/40 bg-white/75 backdrop-blur-md p-5 sm:p-6 shadow-glass-sm hover:shadow-glass-md hover:border-copper-500/50 transition-all duration-200 flex flex-col justify-between group text-left">
      
      {/* Top Header Row */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="copper" size="xs">
            {article.category}
          </Badge>
          {getImpactBadge(article.impactLevel)}
        </div>

        {/* Date and Reading Time */}
        <div className="flex items-center gap-3 text-[11px] text-espresso-500 font-mono">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-copper-600" />
            <span>{article.date}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-espresso-400" />
            <span>{article.readTime}</span>
          </span>
        </div>

        {/* Article Title */}
        <h4 className="text-base font-display font-extrabold text-espresso-950 group-hover:text-copper-700 transition-colors leading-snug line-clamp-2">
          {article.title}
        </h4>

        {/* Article Summary */}
        <p className="text-xs text-espresso-700 leading-relaxed line-clamp-3">
          {article.summary}
        </p>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {article.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded-md bg-sand-200/80 text-espresso-700 font-medium border border-champagne-500/25"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Source & Action Trigger */}
      <div className="pt-4 mt-4 border-t border-champagne-500/25 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-espresso-600 truncate max-w-[170px]">
          By {article.source}
        </span>

        <button
          onClick={() => onSelectArticle?.(article)}
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-copper-700 bg-copper-500/10 hover:bg-copper-500 hover:text-white border border-copper-500/25 transition-all flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>Analysis</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
