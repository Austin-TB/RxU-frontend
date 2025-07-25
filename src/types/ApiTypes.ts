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