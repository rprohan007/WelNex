import { useState, useMemo } from 'react';
import type { RadarArticle, RadarFeaturedStory, RadarCategory, AssistantQueryPair } from '../types/radar';
import rawRadarData from '../data/radarData.json';

interface RadarDataFile {
  featuredStory: RadarFeaturedStory;
  articles: RadarArticle[];
  quickQueries: AssistantQueryPair[];
}

export const useRadarData = () => {
  const data = rawRadarData as RadarDataFile;

  const [selectedCategory, setSelectedCategory] = useState<RadarCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<RadarArticle | null>(null);
  const [assistantActiveQuery, setAssistantActiveQuery] = useState<AssistantQueryPair | null>(data.quickQueries[0]);
  const [assistantInput, setAssistantInput] = useState<string>('');
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  // Dynamic Categories
  const categories: RadarCategory[] = [
    'All',
    'SEBI Regulations',
    'REITs & InvITs',
    'AIF Updates',
    'Market Analysis'
  ];

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return data.articles.filter((art) => {
      // Category filter
      if (selectedCategory !== 'All' && art.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(q);
        const matchesSummary = art.summary.toLowerCase().includes(q);
        const matchesSource = art.source.toLowerCase().includes(q);
        const matchesTag = art.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesSource && !matchesTag) {
          return false;
        }
      }

      return true;
    });
  }, [data.articles, selectedCategory, searchQuery]);

  // Ask WelNex query runner
  const handleAskAssistant = (promptText: string) => {
    if (!promptText.trim()) return;

    setIsAnswering(true);
    setAssistantInput(promptText);

    // Check if query matches a quick query or generate structured response
    const matched = data.quickQueries.find(
      (q) =>
        q.query.toLowerCase().includes(promptText.toLowerCase()) ||
        promptText.toLowerCase().includes(q.query.toLowerCase().slice(0, 15))
    );

    setTimeout(() => {
      if (matched) {
        setAssistantActiveQuery(matched);
      } else {
        setAssistantActiveQuery({
          query: promptText,
          response: `Based on current SEBI regulations and market frameworks, "${promptText}" relates to institutional alternative assets in India. Institutional vehicles such as commercial REITs and infrastructure InvITs operate under strict 90% NDCF payout mandates, independent trusteeship, and transparent quarterly asset valuations.`,
          keyPoints: [
            "Governed by statutory SEBI regulations (REIT/InvIT 2014, AIF 2012, NCS 2021)",
            "Quarterly asset valuations by independent registered valuers",
            "Bankruptcy-remote SPV title holding",
            "Mandatory investor dispute resolution via SEBI SCORES portal"
          ],
          categoryTag: 'Educational Analysis'
        });
      }
      setIsAnswering(false);
    }, 300);
  };

  return {
    featuredStory: data.featuredStory,
    articles: data.articles,
    filteredArticles,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    selectedArticle,
    setSelectedArticle,
    quickQueries: data.quickQueries,
    assistantActiveQuery,
    setAssistantActiveQuery,
    assistantInput,
    setAssistantInput,
    isAnswering,
    handleAskAssistant
  };
};
