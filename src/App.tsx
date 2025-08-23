import { useState } from 'react'
import './App.css'
import { SentimentTrendChart, SentimentDistribution } from './components/SentimentChart'
import { SentimentSummary } from './components/SentimentSummary'
import { LoadingSpinner } from './components/LoadingSpinner'
import { AutocompleteInput } from './components/AutocompleteInput'
import { DrugSummary } from './components/DrugSummary'
import type { Drug, SearchResponse, SentimentResponse, RecommendationResponse, SideEffectsResponse, DrugSummaryData, DrugSummariesData } from './types/ApiTypes';

// Import the drug summaries JSON data
import drugSummariesData from './data/drug_social_media_summaries.json';

const API_BASE = 'https://rxuu-backend-306624049631.europe-west1.run.app';
// const API_BASE = 'http://localhost:8080';

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Drug[]>([])
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null)
  const [sentiment, setSentiment] = useState<SentimentResponse | null>(null)
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null)
  const [sideEffects, setSideEffects] = useState<SideEffectsResponse | null>(null)
  const [drugSummary, setDrugSummary] = useState<DrugSummaryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'summary' | 'sentiment' | 'recommendations' | 'side-effects'>('summary')

  // Function to find drug summary from local JSON data
  const findDrugSummary = (drugName: string): DrugSummaryData | null => {
    const summariesData = drugSummariesData as unknown as DrugSummariesData;
    const normalizedName = drugName.toLowerCase().trim();
    
    return summariesData.drug_summaries.find(summary => 
      summary.drug_name.toLowerCase() === normalizedName ||
      summary.drug_name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(summary.drug_name.toLowerCase())
    ) || null;
  };

  const searchDrugs = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/drugs/search?q=${encodeURIComponent(searchQuery)}`);
      const data: SearchResponse = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please check your internet connection and try again.');
    }
    setLoading(false);
  };

  const selectDrug = async (drug: Drug) => {
    setSelectedDrug(drug);
    setLoading(true);
    
    // Get drug summary from local JSON (no API call needed)
    const summary = findDrugSummary(drug.name);
    setDrugSummary(summary);
    
    try {
      // Fetch all drug details in parallel
      const [sentimentRes, recommendationsRes, sideEffectsRes] = await Promise.all([
        fetch(`${API_BASE}/api/drugs/sentiment?drug_name=${encodeURIComponent(drug.name)}`),
        fetch(`${API_BASE}/api/drugs/recommend?drug_name=${encodeURIComponent(drug.name)}`),
        fetch(`${API_BASE}/api/drugs/side-effects?drug_name=${encodeURIComponent(drug.name)}`)
      ]);

      const [sentimentData, recommendationsData, sideEffectsData] = await Promise.all([
        sentimentRes.json(),
        recommendationsRes.json(),
        sideEffectsRes.json()
      ]);

      setSentiment(sentimentData);
      setRecommendations(recommendationsData);
      setSideEffects(sideEffectsData);
    } catch (error) {
      console.error('Failed to fetch drug details:', error);
      alert('Failed to fetch drug details');
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchDrugs();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-top">
          <div className="brand-name">RxU</div>
        </div>
        
        <div className="app-header-content">
          <div className="hero">
            <h1 className="hero-title">Discover drug insights with real-world sentiment</h1>
            <p className="app-header-description">
              We merge data and technology to help you research medications more confidently.
            </p>

            {/* Search Section (inside hero) */}
            <form onSubmit={handleSearch} className="search-form hero-search">
              <div className="search-pill">
                <AutocompleteInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSubmit={searchDrugs}
                  placeholder="Search for a drug..."
                  className="pill-input"
                  disabled={loading}
                />
                <button type="submit" disabled={loading} className="pill-button">
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Results remain below hero */}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <section className="results-section">
            <h2>Search Results ({searchResults.length} found)</h2>
            <div className="drug-grid">
              {searchResults.map((drug) => (
                <div
                  key={drug.drugbank_id}
                  className={`drug-card ${selectedDrug?.drugbank_id === drug.drugbank_id ? 'selected' : ''}`}
                  onClick={() => selectDrug(drug)}
                >
                  <h3>{drug.name}</h3>
                  <p className="generic-name">{drug.generic_name}</p>
                  <p className="drug-class">{drug.drug_class}</p>
                  <div className="match-info">
                    <span className="match-type">{drug.match_type}</span>
                    <span className="match-score">{drug.match_score}% match</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Drug Details */}
        {selectedDrug && (
          <section className="details-section">
            <h2>Drug Details: {selectedDrug.name}</h2>
            <div className="drug-info">
              <p><strong>Generic Name:</strong> {selectedDrug.generic_name}</p>
              <p><strong>Drug Class:</strong> {selectedDrug.drug_class}</p>
              <p><strong>Description:</strong> {selectedDrug.description}</p>
              {selectedDrug.brand_names.length > 0 && (
                <p><strong>Brand Names:</strong> {selectedDrug.brand_names.join(', ')}</p>
              )}
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                Community Insights
              </button>
              <button 
                className={`tab ${activeTab === 'sentiment' ? 'active' : ''}`}
                onClick={() => setActiveTab('sentiment')}
              >
                Sentiment Analysis
              </button>
              <button 
                className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
                onClick={() => setActiveTab('recommendations')}
              >
                Recommendations
              </button>
              <button 
                className={`tab ${activeTab === 'side-effects' ? 'active' : ''}`}
                onClick={() => setActiveTab('side-effects')}
              >
                Side Effects
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {activeTab === 'summary' && (
                <DrugSummary
                  drugName={selectedDrug.name}
                  summaryData={drugSummary}
                />
              )}

              {activeTab === 'sentiment' && sentiment && (
                <div className="sentiment-content">
                  <SentimentSummary
                    overallSentiment={sentiment.overall_sentiment}
                    sentimentScore={sentiment.sentiment_score}
                    data={sentiment.sentiment_data}
                    drugName={selectedDrug.name}
                  />
                  
                  <div className="sentiment-charts-grid">
                    <div className="chart-section">
                      <SentimentTrendChart
                        data={sentiment.sentiment_data}
                        drugName={selectedDrug.name}
                      />
                    </div>
                    
                    <div className="chart-section">
                      <SentimentDistribution
                        data={sentiment.sentiment_data}
                      />
                    </div>
                  </div>
                  
                  {/* Fallback: Keep original data display for reference */}
                  <details className="sentiment-raw-data">
                    <summary>View Raw Sentiment Data</summary>
                    <div className="sentiment-data">
                      {sentiment.sentiment_data.map((data, index) => (
                        <div key={index} className="sentiment-day">
                          <span className="date">{data.date}</span>
                          <div className="sentiment-bars">
                            <div className="sentiment-bar positive" style={{width: `${data.positive * 100}%`}}>
                              Positive: {(data.positive * 100).toFixed(1)}%
                            </div>
                            <div className="sentiment-bar neutral" style={{width: `${data.neutral * 100}%`}}>
                              Neutral: {(data.neutral * 100).toFixed(1)}%
                            </div>
                            <div className="sentiment-bar negative" style={{width: `${data.negative * 100}%`}}>
                              Negative: {(data.negative * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}

              {activeTab === 'sentiment' && loading && (
                <div className="sentiment-content">
                  <LoadingSpinner 
                    message="Analyzing sentiment data..." 
                    size="large"
                  />
                </div>
              )}

              {activeTab === 'sentiment' && !sentiment && !loading && selectedDrug && (
                <div className="sentiment-content">
                  <div className="empty-state">
                    <h3>No Sentiment Data Available</h3>
                    <p>We couldn't find sentiment analysis data for {selectedDrug.name}.</p>
                    <p>This could be due to limited social media mentions or data processing issues.</p>
                  </div>
                </div>
              )}

              {activeTab === 'recommendations' && recommendations && (
                <div className="recommendations-content">
                  <h3>Alternative Recommendations</h3>
                  {recommendations.recommendations.map((rec, index) => (
                    <div key={index} className="recommendation-card">
                      <h4>{rec.name}</h4>
                      <p className="similarity">Similarity: {(rec.similarity_score * 100).toFixed(1)}%</p>
                      <p className="reason">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'side-effects' && sideEffects && (
                <div className="side-effects-content">
                  <h3>Side Effects</h3>
                  
                  <div className="side-effects-group">
                    <h4>Common Side Effects</h4>
                    {sideEffects.common_side_effects.map((effect, index) => (
                      <div key={index} className="side-effect">
                        <span className="effect-name">{effect.effect}</span>
                        <span className={`frequency ${effect.frequency}`}>{effect.frequency}</span>
                        <span className={`severity ${effect.severity}`}>{effect.severity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="side-effects-group">
                    <h4>Serious Side Effects</h4>
                    {sideEffects.serious_side_effects.map((effect, index) => (
                      <div key={index} className="side-effect serious">
                        <span className="effect-name">{effect.effect}</span>
                        <span className={`frequency ${effect.frequency}`}>{effect.frequency}</span>
                        <span className={`severity ${effect.severity}`}>{effect.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
