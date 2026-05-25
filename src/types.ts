export interface User {
  name: string;
  email: string;
}

export interface PlatformStatus {
  [platform: string]: 'success' | 'failed' | 'disabled';
}

export interface ScrapedSource {
  platform: 'reddit' | 'youtube' | 'wikipedia' | 'web';
  title: string;
  url: string;
  content?: string;
  summary?: string;
  author?: string;
  channel?: string;
  upvotes?: number;
  views?: number;
  likes?: number;
  comments?: number;
  comments_count?: number;
  created?: string;
}

export interface TrendItem {
  date: string;
  value: number;
}

export interface RelatedQuery {
  query: string;
  value: number | string;
}

export interface GoogleTrendsData {
  trends: TrendItem[];
  top_related?: RelatedQuery[];
  rising_related?: RelatedQuery[];
}

export interface AIAnalysisReport {
  detailed_explanation: string;
  market_analysis: string;
  public_opinion: string;
  sentiment_analysis: string;
  trend_analysis: string;
}

export interface Analysis {
  id?: string;
  query: string;
  platform_status: PlatformStatus;
  analysis: AIAnalysisReport;
  google_trends?: GoogleTrendsData | null;
  source_count: number;
  scraped_sources?: ScrapedSource[];
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}
