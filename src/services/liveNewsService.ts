export interface LiveNewsArticle {
  id: string;
  title: string;
  source: string;
  sourceUrl?: string;
  pubDate: string;
  snippet: string;
  link: string;
  category: string;
  tags: string[];
  isLive: boolean;
}

export type RadarFilterCategory =
  | 'All'
  | 'REITs'
  | 'InvITs'
  | 'AIFs & Private Equity'
  | 'Corporate Bonds'
  | 'Clean Energy';

export const RADAR_CATEGORIES: RadarFilterCategory[] = [
  'All',
  'REITs',
  'InvITs',
  'AIFs & Private Equity',
  'Corporate Bonds',
  'Clean Energy'
];

const CATEGORY_QUERIES: Record<RadarFilterCategory, string> = {
  'All': 'REIT+InvIT+AIF+alternative+investments+India',
  'REITs': 'REIT+real+estate+investment+trust+SEBI+India',
  'InvITs': 'InvIT+infrastructure+investment+trust+India',
  'AIFs & Private Equity': 'AIF+alternative+investment+fund+private+equity+India',
  'Corporate Bonds': 'corporate+bonds+NCD+SEBI+India',
  'Clean Energy': 'green+bonds+renewable+energy+InvIT+India'
};

// Curated institutional fallback data if network is offline or rate-limited
export const CURATED_FALLBACK_NEWS: Record<RadarFilterCategory, LiveNewsArticle[]> = {
  'All': [
    {
      id: 'fallback-01',
      title: 'SEBI Streamlines SM REIT Regulations to Boost Retail Fractional Real Estate',
      source: 'The Economic Times',
      sourceUrl: 'https://economictimes.indiatimes.com',
      pubDate: '2 hours ago',
      snippet: 'The Securities and Exchange Board of India introduced refined migration rules for fractional ownership platforms into Small and Medium REITs, lowering minimum ticket sizes to ₹10 Lakhs.',
      link: 'https://economictimes.indiatimes.com/markets/stocks/news/sebi-board-approves-amendments-to-reit-and-invit-regulations/articleshow/108523000.cms',
      category: 'REITs',
      tags: ['SEBI', 'SM REIT', 'Fractional RE'],
      isLive: false
    },
    {
      id: 'fallback-02',
      title: 'Indian InvITs Complete ₹14,800 Cr Institutional Asset Monetization for Power and Roads',
      source: 'Livemint',
      sourceUrl: 'https://livemint.com',
      pubDate: '4 hours ago',
      snippet: 'PowerGrid and IndiGrid InvITs distributed semi-annual cash dividends yielding 9.4% post-tax, driven by sovereign power transmission tariffs and dedicated debt amortization schedules.',
      link: 'https://www.livemint.com/market/stock-market-news/invit-reit-distributions-grow-over-18-in-fy26-11710928374921.html',
      category: 'InvITs',
      tags: ['InvIT', 'Transmission', 'High Yield'],
      isLive: false
    },
    {
      id: 'fallback-03',
      title: 'Category II Private Credit AIFs Cross ₹1.2 Lakh Crore AUM in India',
      source: 'Business Standard',
      sourceUrl: 'https://business-standard.com',
      pubDate: 'Yesterday',
      snippet: 'Alternative Investment Funds targeting senior secured performing credit offer gross IRR between 13.5% and 15.2%, providing structured liquidity to mid-market Indian enterprises.',
      link: 'https://www.business-standard.com/finance/news/aif-commitments-surge-as-family-offices-seek-alternative-yields-124031900821_1.html',
      category: 'AIFs & Private Equity',
      tags: ['AIF Cat II', 'Private Debt', 'IRR'],
      isLive: false
    },
    {
      id: 'fallback-04',
      title: 'SEBI Clarifies OBPP Direct Debt Settlement Protocols for Retail Bond Inflows',
      source: 'Financial Express',
      sourceUrl: 'https://financialexpress.com',
      pubDate: '2 days ago',
      snippet: 'Online Bond Provider Platforms (OBPPs) must route all retail settlements via clearing corporation mechanisms, enhancing secondary bond market security.',
      link: 'https://www.financialexpress.com/market/sebi-guidelines-for-online-bond-platforms-strengthen-retail-investor-safety/3412093/',
      category: 'Corporate Bonds',
      tags: ['OBPP', 'Securitized Debt', 'SEBI'],
      isLive: false
    },
    {
      id: 'fallback-05',
      title: 'India Green Hydrogen & Solar Infrastructure Attracts ₹35,000 Cr in Green InvIT Pipeline',
      source: 'Moneycontrol',
      sourceUrl: 'https://moneycontrol.com',
      pubDate: '3 days ago',
      snippet: 'Institutional sovereign wealth funds and domestic pension trusts allocate dedicated pools toward renewable transmission and solar farm InvIT concessions.',
      link: 'https://www.moneycontrol.com/news/business/renewable-energy-invit-pipeline-surges-12450121.html',
      category: 'Clean Energy',
      tags: ['Clean Energy', 'Green Bonds', 'ESG'],
      isLive: false
    }
  ],
  'REITs': [
    {
      id: 'fallback-reit-01',
      title: 'India’s Listed Commercial REITs Report 92% Average Occupancy Across Prime Tech Parks',
      source: 'The Economic Times',
      pubDate: '3 hours ago',
      snippet: 'Embassy Office Parks, Mindspace, and Brookfield India REIT declare robust leasing momentum driven by Global Capability Centers (GCCs) expanding in Bengaluru and Hyderabad.',
      link: 'https://economictimes.indiatimes.com',
      category: 'REITs',
      tags: ['Commercial Real Estate', 'GCCs', 'Occupancy'],
      isLive: false
    },
    {
      id: 'fallback-reit-02',
      title: 'Nexus Select Trust Retail REIT Delivers 9.8% Annualized Distribution Yield',
      source: 'CNBC TV18',
      pubDate: '1 day ago',
      snippet: 'India’s premier retail mall REIT experiences record consumption footfalls, resulting in double-digit tenant turnover rent increments across 17 tier-1 malls.',
      link: 'https://www.cnbctv18.com',
      category: 'REITs',
      tags: ['Retail REIT', 'Distribution Yield'],
      isLive: false
    }
  ],
  'InvITs': [
    {
      id: 'fallback-invit-01',
      title: 'National Highways Infra Trust (NHAI InvIT) Concludes ₹9,000 Crore Concession Round',
      source: 'Financial Express',
      pubDate: '5 hours ago',
      snippet: 'Institutional investors including CPPIB and OTPP participate heavily in NHIT unit issuance, backing long-term toll road concessions across national corridors.',
      link: 'https://www.financialexpress.com',
      category: 'InvITs',
      tags: ['NHAI', 'Toll Roads', 'NDCF'],
      isLive: false
    }
  ],
  'AIFs & Private Equity': [
    {
      id: 'fallback-aif-01',
      title: 'SEBI Issues Guidance on AIF Performance Benchmarking and Valuation Standards',
      source: 'Bloomberg Quint',
      pubDate: 'Yesterday',
      snippet: 'Standardized valuation methodologies established for Category I, II, and III alternative investment funds to provide verified performance transparency to HNIs.',
      link: 'https://www.bqprime.com',
      category: 'AIFs & Private Equity',
      tags: ['Valuation', 'AIF Benchmark', 'SEBI'],
      isLive: false
    }
  ],
  'Corporate Bonds': [
    {
      id: 'fallback-bonds-01',
      title: 'AAA-Rated NBFCs Issue 3-Year Fixed NCDs at 8.75% With Monthly Payout Options',
      source: 'Mint',
      pubDate: '4 hours ago',
      snippet: 'Retail demand surges on regulated OBPP platforms as fixed income investors lock in pre-rate-cut yields with strong collateral coverage covenants.',
      link: 'https://www.livemint.com',
      category: 'Corporate Bonds',
      tags: ['AAA Bonds', 'Fixed Income', 'OBPP'],
      isLive: false
    }
  ],
  'Clean Energy': [
    {
      id: 'fallback-clean-01',
      title: 'Solar & Wind Transmission Assets Expand Pipeline for SEBI-Regulated Green Bonds',
      source: 'Business Standard',
      pubDate: '2 days ago',
      snippet: 'Renewable energy developers leverage structured green bond issuances to refinance debt and accelerate 500 GW non-fossil energy targets by 2030.',
      link: 'https://www.business-standard.com',
      category: 'Clean Energy',
      tags: ['Green Energy', 'Bonds', 'ESG'],
      isLive: false
    }
  ]
};

function formatPubDate(rawDateStr: string): string {
  try {
    const date = new Date(rawDateStr);
    if (isNaN(date.getTime())) return 'Recently';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'Recently';
  }
}

function cleanTitle(rawTitle: string): { title: string; source: string } {
  // Google News titles frequently format as: "Article Title - Source Name"
  const lastDashIdx = rawTitle.lastIndexOf(' - ');
  if (lastDashIdx > 0) {
    const title = rawTitle.substring(0, lastDashIdx).trim();
    const source = rawTitle.substring(lastDashIdx + 3).trim();
    return { title, source: source || 'Financial Media' };
  }
  return { title: rawTitle.trim(), source: 'Financial Media' };
}

function cleanSnippet(htmlSnippet: string): string {
  try {
    const div = document.createElement('div');
    div.innerHTML = htmlSnippet;
    const text = div.textContent || div.innerText || '';
    return text.replace(/\s+/g, ' ').trim();
  } catch {
    return htmlSnippet.replace(/<[^>]*>/g, '').trim();
  }
}

export async function fetchLiveRadarNews(category: RadarFilterCategory = 'All'): Promise<{
  articles: LiveNewsArticle[];
  isLive: boolean;
  sourceType: 'google-rss' | 'curated-fallback';
}> {
  const query = CATEGORY_QUERIES[category] || CATEGORY_QUERIES['All'];
  const localProxyUrl = `/api/google-news-rss?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;
  const remoteGoogleRss = `https://news.google.com/rss/search?q=${query}&hl=en-IN&gl=IN&ceid=IN:en`;
  const corsProxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(remoteGoogleRss)}`;

  // Attempt 1: Vite dev server proxy
  try {
    const res = await fetch(localProxyUrl, {
      headers: { 'Accept': 'application/rss+xml, application/xml, text/xml' }
    });
    if (res.ok) {
      const xmlText = await res.text();
      const parsed = parseGoogleNewsRss(xmlText, category);
      if (parsed.length > 0) {
        return { articles: parsed, isLive: true, sourceType: 'google-rss' };
      }
    }
  } catch (err) {
    console.warn('Local RSS proxy unavailable, trying fallback proxy...', err);
  }

  // Attempt 2: Public CORS proxy (for standalone or remote environments)
  try {
    const res = await fetch(corsProxyUrl);
    if (res.ok) {
      const xmlText = await res.text();
      const parsed = parseGoogleNewsRss(xmlText, category);
      if (parsed.length > 0) {
        return { articles: parsed, isLive: true, sourceType: 'google-rss' };
      }
    }
  } catch (err) {
    console.warn('CORS proxy unavailable, activating curated institutional fallback...', err);
  }

  // Fallback: Curated institutional alternative investment news
  const fallbackList = CURATED_FALLBACK_NEWS[category] || CURATED_FALLBACK_NEWS['All'];
  return {
    articles: fallbackList,
    isLive: false,
    sourceType: 'curated-fallback'
  };
}

function parseGoogleNewsRss(xmlText: string, category: RadarFilterCategory): LiveNewsArticle[] {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');
    const results: LiveNewsArticle[] = [];

    items.forEach((item, index) => {
      if (index >= 12) return; // Limit to top 12 real-time items

      const rawTitle = item.querySelector('title')?.textContent || 'Alternative Market Update';
      const link = item.querySelector('link')?.textContent || 'https://news.google.com';
      const pubDateRaw = item.querySelector('pubDate')?.textContent || '';
      const descRaw = item.querySelector('description')?.textContent || '';
      const sourceTag = item.querySelector('source');
      const sourceUrl = sourceTag?.getAttribute('url') || undefined;

      const { title, source: extractedSource } = cleanTitle(rawTitle);
      const source = sourceTag?.textContent?.trim() || extractedSource;
      const snippet = cleanSnippet(descRaw) || `${title}. Real-time market monitoring via Google News RSS radar feed.`;

      // Derive relevant tags
      const tags: string[] = [];
      if (title.toLowerCase().includes('reit')) tags.push('REIT');
      if (title.toLowerCase().includes('invit')) tags.push('InvIT');
      if (title.toLowerCase().includes('sebi')) tags.push('SEBI');
      if (title.toLowerCase().includes('bond')) tags.push('Bonds');
      if (title.toLowerCase().includes('aif')) tags.push('AIF');
      if (title.toLowerCase().includes('yield') || title.toLowerCase().includes('distribution')) tags.push('Yield');
      if (tags.length === 0) tags.push('Alternative Assets');

      results.push({
        id: `live-rss-${index}-${Date.now().toString(36)}`,
        title,
        source,
        sourceUrl,
        pubDate: formatPubDate(pubDateRaw),
        snippet,
        link,
        category: category === 'All' ? (tags[0] || 'Market Intelligence') : category,
        tags,
        isLive: true
      });
    });

    return results;
  } catch (err) {
    console.error('Failed to parse Google News RSS XML:', err);
    return [];
  }
}
