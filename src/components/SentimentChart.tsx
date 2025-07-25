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

  return (
    <div className="sentiment-trend-chart">
      <h4>Sentiment Trends for {drugName}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            stroke="#666"
            fontSize={12}
            domain={[0, 100]}
            label={{ value: 'Sentiment %', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number) => [`${value}%`, '']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Positive" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Neutral" 
            stroke="#6b7280" 
            strokeWidth={3}
            dot={{ fill: '#6b7280', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="Negative" 
            stroke="#ef4444" 
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
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

  return (
    <div className="sentiment-distribution">
      <h4>Overall Sentiment Distribution</h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value}%`, '']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}; 