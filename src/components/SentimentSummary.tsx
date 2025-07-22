import React from 'react';

interface SentimentData {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentSummaryProps {
  overallSentiment: string;
  sentimentScore: number;
  data: SentimentData[];
  drugName: string;
}

export const SentimentSummary: React.FC<SentimentSummaryProps> = ({
  overallSentiment,
  sentimentScore,
  data,
  drugName
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

      <div className="sentiment-gauge">
        <h4>Sentiment Score Gauge</h4>
        <div className="gauge-container">
          <div className="gauge-track">
            <div 
              className="gauge-fill"
              style={{ 
                width: `${sentimentScore * 100}%`,
                backgroundColor: getSentimentColor(overallSentiment)
              }}
            ></div>
          </div>
          <div className="gauge-labels">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 