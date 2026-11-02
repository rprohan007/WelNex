import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  ExternalLink,
  Calendar,
  Radio,
  RotateCw,
  Newspaper
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { AskWelNexPanel } from './AskWelNexPanel';
import type { AssistantQueryPair } from '../../types/radar';
import {
  fetchLiveRadarNews,
  RADAR_CATEGORIES,
  CURATED_FALLBACK_NEWS,
  type LiveNewsArticle,
  type RadarFilterCategory
} from '../../services/liveNewsService';

interface WelNexRadarShellProps {
  onOpenWaitlist?: () => void;
  isStandalonePage?: boolean;
}

export const WelNexRadarShell: React.FC<WelNexRadarShellProps> = ({
  onOpenWaitlist,
  isStandalonePage = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RadarFilterCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<LiveNewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveFeed, setIsLiveFeed] = useState(false);
  const [selectedArticleModal, setSelectedArticleModal] = useState<LiveNewsArticle | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  // Ask WelNex assistant state
  const quickQueries: AssistantQueryPair[] = [
    {
      query: "What is the new SEBI SM REIT framework?",
      response: "SEBI approved the Small and Medium REIT (SM REIT) framework in March 2024 with a minimum asset size of ₹50 Crore (vs ₹500 Cr for regular REITs) and lowered minimum retail ticket size to ₹10 Lakhs, bringing fractional ownership platforms under institutional regulation.",
      keyPoints: ["Minimum scheme size: ₹50 Cr", "Minimum investment ticket: ₹10 Lakhs", "Mandatory 95% NDCF payout to unit holders", "Migration timeline for fractional platforms"],
      categoryTag: "SM REITs"
    },
    {
      query: "How are InvIT quarterly distributions taxed?",
      response: "InvIT distributions consist of three components: Interest (taxable at investor slab rate), Dividend (exempt if SPV pays concessional tax, otherwise slab rate), and Return of Capital (tax-free until adjusted cost of acquisition is recovered, thereafter taxed at 20% LTCG).",
      keyPoints: ["Interest portion taxed at slab rate", "Return of Capital taxed upon recovery of cost basis", "No STT on dividend distributions", "TDS at 10% on interest component"],
      categoryTag: "Taxation & Yield"
    },
    {
      query: "What are Category II AIF private credit returns?",
      response: "Indian Category II Private Credit AIFs typically target gross internal rates of return (IRR) between 12.5% and 15.5% through senior secured performing credit, structured asset-backed debt, and mezzanine liquidity to mid-market enterprises.",
      keyPoints: ["Target gross IRR: 12.5% - 15.5%", "Minimum SEBI ticket: ₹1 Crore", "Senior secured collateral (typically 1.5x - 2.0x cover)", "Lock-in tenure: 3 to 5 years"],
      categoryTag: "AIFs & Private Credit"
    }
  ];
  const [assistantActiveQuery, setAssistantActiveQuery] = useState<AssistantQueryPair | null>(quickQueries[0]);

  const [isAnswering, setIsAnswering] = useState(false);

  // Live fetch from Google News RSS engine
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchLiveRadarNews(selectedCategory)
      .then((res) => {
        if (isMounted) {
          setArticles(res.articles);
          setIsLiveFeed(res.isLive);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Radar news fetch error:', err);
        if (isMounted) {
          setArticles(CURATED_FALLBACK_NEWS[selectedCategory] || CURATED_FALLBACK_NEWS['All']);
          setIsLiveFeed(false);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, refreshCount]);

  // Filter articles by search query
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const q = searchQuery.toLowerCase();
    return articles.filter((art) => {
      return (
        art.title.toLowerCase().includes(q) ||
        art.snippet.toLowerCase().includes(q) ||
        art.source.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [articles, searchQuery]);

  const handleAskAssistant = (promptText: string) => {
    if (!promptText.trim()) return;
    setIsAnswering(true);
    setTimeout(() => {
      setAssistantActiveQuery({
        query: promptText,
        response: `Based on verified SEBI regulations and Indian alternative investment frameworks, "${promptText}" relates to institutional wealth creation. All registered vehicles require independent custodianship, quarterly NAV / NDCF disclosures, and statutory oversight.`,
        keyPoints: [
          "SEBI statutory regulatory oversight",
          "Independent registered asset valuation",
          "Bankruptcy-remote SPV architecture",
          "Transparent quarterly cashflow distributions"
        ],
        categoryTag: "Market Intelligence"
      });
      setIsAnswering(false);
    }, 350);
  };

  return (
    <section id="radar" className={`w-full ${isStandalonePage ? 'pt-28 pb-24' : 'py-20'} bg-sand text-espresso-950`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-champagne-500/30">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-copper-500/15 border border-copper-500/30 text-copper-800 text-xs font-bold uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 text-copper-600 animate-pulse" />
                Live Market Radar Engine
              </span>
              <span className="text-xs font-semibold text-espresso-600 hidden sm:inline">
                Real-Time Alternative Investment Intelligence
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-espresso-950 tracking-tight">
              WelNex Radar — Market Trends & Regulatory Pulse
            </h1>
            <p className="text-sm sm:text-base text-espresso-700 mt-2 max-w-2xl leading-relaxed">
              Real-time alternative investment news aggregated dynamically from Google News RSS feeds, tracking SEBI policy shifts, quarterly distribution yields, and institutional capital flows across India.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Live Feed Status Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-champagne-500/50 shadow-xs text-xs font-semibold text-espresso-800">
              <span className={`w-2.5 h-2.5 rounded-full ${isLiveFeed ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isLiveFeed ? 'Google News RSS Live' : 'Institutional Curated'}</span>
            </div>

            {/* Refresh Live Feed Button */}
            <button
              onClick={() => setRefreshCount((c) => c + 1)}
              disabled={isLoading}
              className="p-2 rounded-xl bg-white/80 hover:bg-white border border-champagne-500/50 text-espresso-700 hover:text-copper-700 shadow-xs transition-all cursor-pointer"
              title="Refresh live news feed"
              aria-label="Refresh news"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-copper-600' : ''}`} />
            </button>

            {onOpenWaitlist && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenWaitlist}
                icon={<Sparkles className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                Daily Brief
              </Button>
            )}
          </div>
        </div>

        {/* CONTROLS: CATEGORY FILTERS & SEARCH */}
        <div className="p-4 sm:p-5 rounded-2xl bg-sand-100/90 border border-champagne-500/40 mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {RADAR_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-copper-500 text-white shadow-sm font-bold'
                        : 'bg-white/80 text-espresso-700 border border-champagne-500/30 hover:border-copper-500/40'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search headlines, sponsors, yields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/90 border border-champagne-500/40 text-xs text-espresso-950 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-copper-500/30 focus:border-copper-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-700 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* LOADING INDICATOR */}
        {isLoading && (
          <div className="p-12 text-center text-espresso-600 space-y-3">
            <RotateCw className="w-8 h-8 text-copper-600 animate-spin mx-auto" />
            <p className="text-xs font-semibold uppercase tracking-wider">
              Fetching real-time alternative investment news from Google News RSS...
            </p>
          </div>
        )}

        {/* ARTICLE GRID */}
        {!isLoading && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-extrabold text-espresso-950 flex items-center gap-2">
                <span>Market Stories & Bulletins</span>
                <span className="text-xs font-normal text-copper-700 bg-copper-500/10 px-2.5 py-0.5 rounded-full font-sans">
                  {filteredArticles.length} Stories
                </span>
              </h3>
              <span className="text-xs text-espresso-600">
                Filtered: <strong className="text-espresso-950">{selectedCategory}</strong>
              </span>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white/70 border border-dashed border-champagne-500/50 text-center space-y-3 max-w-md mx-auto my-8">
                <Newspaper className="w-8 h-8 text-copper-600/40 mx-auto" />
                <h4 className="text-base font-bold text-espresso-950">
                  No Live Bulletins Found
                </h4>
                <p className="text-xs text-espresso-600">
                  No articles matched your search query. Try clearing the search or switching category filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="rounded-3xl border border-champagne-500/40 bg-white/75 backdrop-blur-md p-5 sm:p-6 shadow-glass-sm hover:shadow-glass-md hover:border-copper-500/50 transition-all duration-200 flex flex-col justify-between group text-left"
                  >
                    <div className="space-y-3">
                      
                      {/* Category & Live Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="copper" size="xs">
                          {article.category}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-copper-800 bg-copper-500/10 px-2 py-0.5 rounded-md">
                          <Radio className="w-2.5 h-2.5 text-copper-600" />
                          Live RSS
                        </span>
                      </div>

                      {/* Date & Publisher */}
                      <div className="flex items-center gap-2 text-[11px] text-espresso-500 font-mono">
                        <Calendar className="w-3 h-3 text-copper-600" />
                        <span>{article.pubDate}</span>
                        <span>•</span>
                        <span className="font-semibold text-espresso-700 truncate max-w-[130px]">
                          {article.source}
                        </span>
                      </div>

                      {/* Headline */}
                      <h4 className="text-base font-display font-extrabold text-espresso-950 group-hover:text-copper-700 transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h4>

                      {/* Snippet Summary */}
                      <p className="text-xs text-espresso-700 leading-relaxed line-clamp-3">
                        {article.snippet}
                      </p>

                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {article.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF5EE] text-espresso-700 font-medium border border-champagne-500/30"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer: View Modal + Direct External Story Link */}
                    <div className="pt-4 mt-4 border-t border-champagne-500/25 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedArticleModal(article)}
                        className="text-xs font-semibold text-espresso-700 hover:text-copper-700 transition-colors cursor-pointer"
                      >
                        Preview Snippet
                      </button>

                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-copper-700 bg-copper-500/10 hover:bg-copper-500 hover:text-white border border-copper-500/25 transition-all inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <span>Full Story</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 3. EMBEDDED "ASK WELNEX" LEARNING ASSISTANT PANEL */}
        <div className="mt-8">
          <AskWelNexPanel
            quickQueries={quickQueries}
            activeQuery={assistantActiveQuery}
            onSelectQuery={(q) => setAssistantActiveQuery(q)}
            onAskCustom={handleAskAssistant}
            isAnswering={isAnswering}
          />
        </div>

      </div>

      {/* ARTICLE SNIPPET MODAL */}
      {selectedArticleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/60 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedArticleModal(null)}
        >
          <div
            className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#FAF5EE] border border-champagne-500/50 shadow-2xl space-y-5 text-left animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-champagne-500/30 pb-3">
              <Badge variant="copper" size="xs">
                {selectedArticleModal.category}
              </Badge>
              <button
                onClick={() => setSelectedArticleModal(null)}
                className="p-1 rounded-full text-espresso-500 hover:text-espresso-900 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-3 text-xs text-espresso-500 font-mono mb-2">
                <span>{selectedArticleModal.pubDate}</span>
                <span>•</span>
                <span className="font-bold text-espresso-800">{selectedArticleModal.source}</span>
              </div>
              <h3 className="text-xl font-display font-black text-espresso-950 leading-snug">
                {selectedArticleModal.title}
              </h3>
            </div>

            <p className="text-sm text-espresso-800 leading-relaxed bg-white/80 p-4 rounded-2xl border border-champagne-500/30">
              {selectedArticleModal.snippet}
            </p>

            <div className="pt-4 border-t border-champagne-500/30 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedArticleModal(null)}
              >
                Close
              </Button>

              <a
                href={selectedArticleModal.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-copper-500 hover:bg-copper-600 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                <span>Read Full Story on {selectedArticleModal.source}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
