export interface Drug {
  drugbank_id: string;
  name: string;
  generic_name: string;
  brand_names: string[];
  drug_class: string;
  description: string;
  match_score: number;
  match_type: string;
}

export interface SearchResponse {
  query: string;
  results: Drug[];
  total_found: number;
}

export interface SentimentResponse {
  drug_name: string;
  sentiment_data: import('./SentimentDataPoint').SentimentDataPoint[];
  overall_sentiment: string;
  sentiment_score: number;
}

export interface Recommendation {
  name: string;
  similarity_score: number;
  reason: string;
}

export interface RecommendationResponse {
  original_drug: string;
  recommendations: Recommendation[];
}

export interface SideEffect {
  effect: string;
  frequency: string;
  severity: string;
}

export interface SideEffectsResponse {
  drug_name: string;
  common_side_effects: SideEffect[];
  serious_side_effects: SideEffect[];
}

export interface DrugSummaryData {
  drug_name: string;
  total_posts: number;
  summary: string;
  sentiment_analysis: {
    average_positive: number;
    average_neutral: number;
    average_negative: number;
  };
  key_themes: string[];
  subreddit_distribution: Record<string, number>;
  post_examples: {
    positive_experiences: string[];
    neutral_discussions: string[];
    negative_experiences: string[];
  };
  analysis_date: string;
  error?: string;
}

export interface DrugSummariesData {
  metadata: {
    total_drugs_analyzed: number;
    total_posts_across_all_drugs: number;
    generation_date: string;
    data_source: string;
    analysis_description: string;
  };
  drug_summaries: DrugSummaryData[];
} 