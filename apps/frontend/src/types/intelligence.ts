export type InsightCategory = 'Priority' | 'Risk' | 'Opportunity' | 'Trend';

export interface IntelligenceSource {
  id: string;
  type: string; // e.g., 'review', 'campaign', 'ad_copy', 'metric'
  origin: string; // URL, platform, etc.
  timestamp: string; // ISO date string
  freshness: number; // 0.0 to 1.0
  reliability: number; // 0.0 to 1.0
  raw_data: Record<string, unknown>;
}

export interface NeuroInsight {
  id: string;
  source_id: string;
  category: InsightCategory;
  title: string;
  description: string;
  actionable_items: string[];
  confidence_score: number; // 0.0 to 1.0
  created_at: string; // ISO date string
}
