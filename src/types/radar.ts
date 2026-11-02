export type RadarCategory =
  | 'All'
  | 'SEBI Regulations'
  | 'REITs & InvITs'
  | 'AIF Updates'
  | 'Market Analysis';

export interface RadarArticle {
  id: string;
  title: string;
  category: RadarCategory;
  date: string;
  readTime: string;
  source: string;
  sourceUrl?: string;
  summary: string;
  externalUrl?: string;
  tags: string[];
  impactLevel?: 'High' | 'Medium' | 'Informational';
  featured?: boolean;
  keyTakeaways?: string[];
}

export interface RadarFeaturedStory {
  id: string;
  title: string;
  tag: string;
  category: RadarCategory;
  date: string;
  readTime: string;
  source: string;
  sourceUrl?: string;
  excerpt: string;
  analysisSummary: string;
  keyStat?: { label: string; value: string };
  imageUrl?: string;
  imageAccent?: string;
  externalUrl?: string;
}

export interface AssistantQueryPair {
  query: string;
  response: string;
  keyPoints?: string[];
  categoryTag?: string;
}
