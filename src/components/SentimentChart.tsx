import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import type { SentimentDataPoint } from '../types/SentimentDataPoint';

interface SentimentChartProps {
  data: SentimentDataPoint[];
  drugName: string;
}

export const SentimentTrendChart: React.FC<SentimentChartProps> = ({ data, drugName }) => {
  // Transform data for better chart display
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    Positive: Math.round(item.positive * 100),
    Neutral: Math.round(item.neutral * 100),
    Negative: Math.round(item.negative * 100),
    post_count: item.post_count
  }));

  // Responsive chart height based on screen size
  const getChartHeight = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 480) return 200;
      if (window.innerWidth <= 768) return 250;
    }
    return 300;
  };

  return (
    <div className="sentiment-trend-chart">
      <h4>Sentiment Trends for {drugName}</h4>
      <ResponsiveContainer width="100%" height={getChartHeight()}>
        <LineChart 
          data={chartData} 
          margin={{ 
            top: 5, 
            right: typeof window !== 'undefined' && window.innerWidth <= 768 ? 10 : 30, 
            left: typeof window !== 'undefined' && window.innerWidth <= 768 ? 5 : 20, 
            bottom: 5 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            fontSize={typeof window !== 'undefined' && window.innerWidth <= 768 ? 10 : 12}
            tick={{ fontSize: typeof window !== 'undefined' && window.innerWidth <= 768 ? 10 : 12 }}
          />
          <YAxis 
            stroke="#666"
            fontSize={typeof window !== 'undefined' && window.innerWidth <= 768 ? 10 : 12}
            domain={[0, 100]}
            width={typeof window !== 'undefined' && window.innerWidth <= 768 ? 40 : 60}
            label={typeof window !== 'undefined' && window.innerWidth > 768 ? 
              { value: 'Sentiment %', angle: -90, position: 'insideLeft' } : 
              undefined
            }
            tick={{ fontSize: typeof window !== 'undefined' && window.innerWidth <= 768 ? 10 : 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              fontSize: typeof window !== 'undefined' && window.innerWidth <= 768 ? '12px' : '14px'
            }}
            formatter={(value: number) => [`${value}%`, '']}
          />
          <Legend 
            wrapperStyle={{ 
              fontSize: typeof window !== 'undefined' && window.innerWidth <= 768 ? '12px' : '14px' 
            }}
          />
          <Line 
            type="monotone" 
            dataKey="Positive" 
            stroke="#10b981" 
            strokeWidth={typeof window !== 'undefined' && window.innerWidth <= 768 ? 2 : 3}
            dot={{ 
              fill: '#10b981', 
              strokeWidth: 2, 
              r: typeof window !== 'undefined' && window.innerWidth <= 768 ? 3 : 4 
            }}
            activeDot={{ r: typeof window !== 'undefined' && window.innerWidth <= 768 ? 4 : 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Neutral" 
            stroke="#6b7280" 
            strokeWidth={typeof window !== 'undefined' && window.innerWidth <= 768 ? 2 : 3}
            dot={{ 
              fill: '#6b7280', 
              strokeWidth: 2, 
              r: typeof window !== 'undefined' && window.innerWidth <= 768 ? 3 : 4 
            }}
            activeDot={{ r: typeof window !== 'undefined' && window.innerWidth <= 768 ? 4 : 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Negative" 
            stroke="#ef4444" 
            strokeWidth={typeof window !== 'undefined' && window.innerWidth <= 768 ? 2 : 3}
            dot={{ 
              fill: '#ef4444', 
              strokeWidth: 2, 
              r: typeof window !== 'undefined' && window.innerWidth <= 768 ? 3 : 4 
            }}
            activeDot={{ r: typeof window !== 'undefined' && window.innerWidth <= 768 ? 4 : 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface SentimentDistributionProps {
  data: SentimentDataPoint[];
}

export const SentimentDistribution: React.FC<SentimentDistributionProps> = ({ data }) => {
  // Calculate average sentiment distribution
  const avgSentiment = data.reduce(
    (acc, curr) => ({
      positive: acc.positive + curr.positive,
      neutral: acc.neutral + curr.neutral,
      negative: acc.negative + curr.negative
    }),
    { positive: 0, neutral: 0, negative: 0 }
  );

  const total = data.length;
  const pieData = [
    {
      name: 'Positive',
      value: Math.round((avgSentiment.positive / total) * 100),
      color: '#10b981'
    },
    {
      name: 'Neutral',
      value: Math.round((avgSentiment.neutral / total) * 100),
      color: '#6b7280'
    },
    {
      name: 'Negative',
      value: Math.round((avgSentiment.negative / total) * 100),
      color: '#ef4444'
    }
  ];

  // Responsive chart configuration
  const getChartConfig = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const isSmallMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
    
    return {
      height: isSmallMobile ? 200 : isMobile ? 220 : 250,
      outerRadius: isSmallMobile ? 60 : isMobile ? 70 : 80,
      fontSize: isSmallMobile ? 10 : isMobile ? 11 : 12,
      showLabels: !isSmallMobile
    };
  };

  const config = getChartConfig();

  return (
    <div className="sentiment-distribution">
      <h4>Overall Sentiment Distribution</h4>
      <ResponsiveContainer width="100%" height={config.height}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={config.showLabels ? 
              ({ name, value }) => `${name}: ${value}%` : 
              false
            }
            outerRadius={config.outerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}%`, '']}
            contentStyle={{
              fontSize: `${config.fontSize}px`,
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}; 