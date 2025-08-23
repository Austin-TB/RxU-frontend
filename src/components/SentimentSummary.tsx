import React from 'react';
import type { SentimentDataPoint } from '../types/SentimentDataPoint';

interface SentimentSummaryProps {
  overallSentiment: string;
  sentimentScore: number;
  data: SentimentDataPoint[];
  drugName: string;
}

export const SentimentSummary: React.FC<SentimentSummaryProps> = ({
  overallSentiment,
  sentimentScore,
  data
}) => {
  // Calculate additional metrics
  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];
  
  const trend = latestData && previousData 
    ? latestData.positive - previousData.positive
    : 0;

  const averagePositive = data.reduce((sum, d) => sum + d.positive, 0) / data.length;
  const averageNegative = data.reduce((sum, d) => sum + d.negative, 0) / data.length;

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      default:
        return '😐';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0.05) return '📈';
    if (trend < -0.05) return '📉';
    return '➡️';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return '#10b981';
      case 'negative':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="sentiment-summary">
      <div className="sentiment-summary-grid">
        <div className="sentiment-card primary">
          <div className="sentiment-card-icon">
            {getSentimentIcon(overallSentiment)}
          </div>
          <div className="sentiment-card-content">
            <h3>Overall Sentiment</h3>
            <p 
              className="sentiment-value"
              style={{ color: getSentimentColor(overallSentiment) }}
            >
              {overallSentiment.charAt(0).toUpperCase() + overallSentiment.slice(1)}
            </p>
            <span className="sentiment-score">
              Score: {(sentimentScore * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="sentiment-card">
          <div className="sentiment-card-icon">
            {getTrendIcon(trend)}
          </div>
          <div className="sentiment-card-content">
            <h3>Recent Trend</h3>
            <p className={`trend-value ${trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral'}`}>
              {trend > 0.05 ? 'Improving' : trend < -0.05 ? 'Declining' : 'Stable'}
            </p>
            <span className="trend-detail">
              {trend > 0 ? '+' : ''}{(trend * 100).toFixed(1)}% change
            </span>
          </div>
        </div>

        <div className="sentiment-card">
          <div className="sentiment-card-icon">
            👥
          </div>
          <div className="sentiment-card-content">
            <h3>Positive Mentions</h3>
            <p className="metric-value positive">
              {(averagePositive * 100).toFixed(1)}%
            </p>
            <span className="metric-detail">
              Average across {data.length} days
            </span>
          </div>
        </div>

        <div className="sentiment-card">
          <div className="sentiment-card-icon">
            ⚠️
          </div>
          <div className="sentiment-card-content">
            <h3>Negative Mentions</h3>
            <p className="metric-value negative">
              {(averageNegative * 100).toFixed(1)}%
            </p>
            <span className="metric-detail">
              Monitor for concerns
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 