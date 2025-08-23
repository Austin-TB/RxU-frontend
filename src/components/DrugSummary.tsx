import React from 'react';
import type { DrugSummaryData } from '../types/ApiTypes';

interface DrugSummaryProps {
  drugName: string;
  summaryData: DrugSummaryData | null;
}

export const DrugSummary: React.FC<DrugSummaryProps> = ({ drugName, summaryData }) => {
  if (!summaryData) {
    return (
      <div className="drug-summary-content">
        <div className="empty-state">
          <h3>No Community Insights Available</h3>
          <p>We couldn't find social media discussions about {drugName}.</p>
          <p>This drug may have limited online mentions or may not be in our current dataset.</p>
        </div>
      </div>
    );
  }

  if (summaryData.error) {
    return (
      <div className="drug-summary-content">
        <div className="error-state">
          <h3>Error Loading Community Insights</h3>
          <p>{summaryData.error}</p>
        </div>
      </div>
    );
  }

  const getSentimentColor = (score: number) => {
    if (score > 0.4) return '#22c55e'; // green
    if (score > 0.2) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="drug-summary-content">
      {/* Overview Section */}
      <div className="summary-overview">
        <h3>Community Insights for {summaryData.drug_name}</h3>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-value">{summaryData.total_posts}</span>
            <span className="stat-label">Social Media Posts</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{Object.keys(summaryData.subreddit_distribution).length}</span>
            <span className="stat-label">Communities</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{summaryData.key_themes.length}</span>
            <span className="stat-label">Key Themes</span>
          </div>
        </div>
        <p className="summary-text">{summaryData.summary}</p>
      </div>

      {/* Sentiment Analysis */}
      <div className="summary-section">
        <h4>Community Sentiment</h4>
        <div className="sentiment-bars-container">
          <div className="sentiment-bar-item">
            <span className="sentiment-label">Positive</span>
            <div className="sentiment-bar-track">
              <div 
                className="sentiment-bar-fill positive"
                style={{ 
                  width: `${summaryData.sentiment_analysis.average_positive * 100}%`,
                  backgroundColor: getSentimentColor(summaryData.sentiment_analysis.average_positive)
                }}
              />
            </div>
            <span className="sentiment-value">
              {(summaryData.sentiment_analysis.average_positive * 100).toFixed(1)}%
            </span>
          </div>
          <div className="sentiment-bar-item">
            <span className="sentiment-label">Neutral</span>
            <div className="sentiment-bar-track">
              <div 
                className="sentiment-bar-fill neutral"
                style={{ 
                  width: `${summaryData.sentiment_analysis.average_neutral * 100}%`,
                  backgroundColor: '#6b7280'
                }}
              />
            </div>
            <span className="sentiment-value">
              {(summaryData.sentiment_analysis.average_neutral * 100).toFixed(1)}%
            </span>
          </div>
          <div className="sentiment-bar-item">
            <span className="sentiment-label">Negative</span>
            <div className="sentiment-bar-track">
              <div 
                className="sentiment-bar-fill negative"
                style={{ 
                  width: `${summaryData.sentiment_analysis.average_negative * 100}%`,
                  backgroundColor: getSentimentColor(summaryData.sentiment_analysis.average_negative)
                }}
              />
            </div>
            <span className="sentiment-value">
              {(summaryData.sentiment_analysis.average_negative * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Key Themes */}
      <div className="summary-section">
        <h4>Discussion Topics</h4>
        <div className="themes-container">
          {summaryData.key_themes.slice(0, 8).map((theme, index) => (
            <span key={index} className="theme-tag">
              {theme}
            </span>
          ))}
        </div>
      </div>

      {/* Top Communities */}
      <div className="summary-section">
        <h4>Top Communities</h4>
        <div className="communities-list">
          {Object.entries(summaryData.subreddit_distribution)
            .slice(0, 5)
            .map(([subreddit, count]) => (
              <div key={subreddit} className="community-item">
                <span className="community-name">r/{subreddit}</span>
                <span className="community-count">{count} posts</span>
              </div>
            ))}
        </div>
      </div>

      {/* Post Examples */}
      <div className="summary-section">
        <h4>Community Experiences</h4>
        <div className="experiences-container">
          {summaryData.post_examples.positive_experiences.length > 0 && (
            <div className="experience-group">
              <h5 className="experience-title positive">Positive Experiences</h5>
              {summaryData.post_examples.positive_experiences.slice(0, 2).map((post, index) => (
                <div key={index} className="experience-item positive">
                  <p>{post}</p>
                </div>
              ))}
            </div>
          )}

          {summaryData.post_examples.negative_experiences.length > 0 && (
            <div className="experience-group">
              <h5 className="experience-title negative">Concerns & Issues</h5>
              {summaryData.post_examples.negative_experiences.slice(0, 2).map((post, index) => (
                <div key={index} className="experience-item negative">
                  <p>{post}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="summary-footer">
        <p className="analysis-note">
          Analysis based on {summaryData.total_posts} social media posts • 
          Last updated: {formatDate(summaryData.analysis_date)}
        </p>
      </div>
    </div>
  );
};
