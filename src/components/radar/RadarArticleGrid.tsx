import React from 'react';
import type { RadarArticle } from '../../types/radar';
import { RadarArticleCard } from './RadarArticleCard';
import { Newspaper } from 'lucide-react';

interface RadarArticleGridProps {
  articles: RadarArticle[];
  onSelectArticle?: (article: RadarArticle) => void;
}

export const RadarArticleGrid: React.FC<RadarArticleGridProps> = ({
  articles,
  onSelectArticle
}) => {
  if (articles.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-white/70 border border-dashed border-champagne-500/50 text-center space-y-3 max-w-md mx-auto my-8">
        <Newspaper className="w-8 h-8 text-copper-600/40 mx-auto" />
        <h4 className="text-base font-bold text-espresso-950">
          No Market Bulletins Found
        </h4>
        <p className="text-xs text-espresso-600">
          No articles matched the selected regulatory filter or keyword.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <RadarArticleCard
          key={article.id}
          article={article}
          onSelectArticle={onSelectArticle}
        />
      ))}
    </div>
  );
};
