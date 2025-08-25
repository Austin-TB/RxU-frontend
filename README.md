# RxU Frontend

A modern React-based web application for drug research and sentiment analysis, built with TypeScript and Vite.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn package manager
- Modern web browser with ES2020+ support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RxU/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🏗️ Architecture

### Project Structure

```
frontend/
├── public/
│   └── vite.svg            # Static assets
├── src/
│   ├── components/         # Reusable React components
│   │   ├── AutocompleteInput.tsx    # Drug search input
│   │   ├── DrugSummary.tsx          # Community insights display
│   │   ├── LoadingSpinner.tsx       # Loading states
│   │   ├── SentimentChart.tsx       # Chart components
│   │   └── SentimentSummary.tsx     # Sentiment overview
│   ├── data/               # Static data and configurations
│   │   ├── drug_social_media_summaries.json # Local drug insights
│   │   └── drugNames.ts     # Drug autocomplete data
│   ├── types/              # TypeScript type definitions
│   │   ├── ApiTypes.ts      # API response types
│   │   └── SentimentDataPoint.ts # Sentiment data structure
│   ├── App.tsx             # Main application component
│   ├── App.css             # Application styles
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite build configuration
└── README.md              # This file
```

### Technology Stack

- **React 19.1.0**: UI library with latest features
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and dev server
- **Recharts**: Data visualization and charting
- **CSS3**: Modern styling with custom properties
- **ESLint**: Code linting and quality assurance

## ✨ Features

### 🔍 **Drug Search**
- **Autocomplete Input**: Real-time drug name suggestions
- **Fuzzy Search**: Find drugs even with partial/misspelled names
- **Multiple Results**: Browse and compare search results
- **Match Scoring**: See relevance scores for search results

### 📊 **Sentiment Analysis**
- **Interactive Charts**: Line charts for sentiment trends
- **Distribution Analysis**: Pie charts for overall sentiment
- **Historical Data**: Time-series sentiment tracking
- **Community Insights**: Real-world user experiences

### 💡 **Drug Information**
- **Detailed Profiles**: Comprehensive drug information
- **Alternative Recommendations**: Similar drug suggestions
- **Side Effects**: Common and serious side effects
- **Brand Names**: Generic and brand name mapping

### 🎨 **User Interface**
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional interface
- **Accessibility**: WCAG 2.1 compliance
- **Performance**: Optimized loading and interactions

## 🧩 Components

### Core Components

#### **App.tsx**
Main application component managing:
- State management for search and drug data
- API integration with backend services
- Tab navigation between different views
- Loading states and error handling

```tsx
const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
const [sentiment, setSentiment] = useState<SentimentResponse | null>(null);
const [activeTab, setActiveTab] = useState<'summary' | 'sentiment' | 'recommendations' | 'side-effects'>('summary');
```

#### **AutocompleteInput.tsx**
Advanced search input with:
- Real-time autocomplete suggestions
- Keyboard navigation support
- Accessibility features
- Custom styling and theming

#### **SentimentChart.tsx**
Data visualization components:
- **SentimentTrendChart**: Line chart for sentiment over time
- **SentimentDistribution**: Pie chart for overall sentiment breakdown
- Responsive design for mobile and desktop
- Interactive tooltips and legends

#### **DrugSummary.tsx**
Community insights component displaying:
- Social media analysis summaries
- Key themes and discussions
- Subreddit distribution
- Example posts from users

#### **LoadingSpinner.tsx**
Customizable loading component:
- Multiple sizes (small, medium, large)
- Custom messages
- Smooth animations
- Accessible loading states

## 🌐 API Integration

### Backend Configuration

```typescript
const API_BASE = 'https://rxuu-backend-306624049631.europe-west1.run.app';
// Development: 'http://localhost:8080'
```

### API Calls

#### **Drug Search**
```typescript
const searchDrugs = async () => {
  const response = await fetch(`${API_BASE}/api/drugs/search?q=${encodeURIComponent(searchQuery)}`);
  const data: SearchResponse = await response.json();
  setSearchResults(data.results);
};
```

#### **Drug Details (Parallel Fetching)**
```typescript
const selectDrug = async (drug: Drug) => {
  const [sentimentRes, recommendationsRes, sideEffectsRes] = await Promise.all([
    fetch(`${API_BASE}/api/drugs/sentiment?drug_name=${encodeURIComponent(drug.name)}`),
    fetch(`${API_BASE}/api/drugs/recommend?drug_name=${encodeURIComponent(drug.name)}`),
    fetch(`${API_BASE}/api/drugs/side-effects?drug_name=${encodeURIComponent(drug.name)}`)
  ]);
};
```

### Error Handling

```typescript
try {
  // API call
} catch (error) {
  console.error('API Error:', error);
  alert('Operation failed. Please check your connection and try again.');
}
```

## 🔧 Development

### Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

### Code Quality

#### **ESLint Configuration**
- React-specific rules
- TypeScript integration
- Hook rules for React
- Import/export validation

#### **TypeScript Configuration**
- Strict mode enabled
- Path mapping for clean imports
- React JSX support
- Modern ES features

## 🚀 Deployment

### Static Hosting

The built application can be deployed to any static hosting service:

#### **Netlify**
```bash
# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### **Vercel**
```bash
# Deploy with Vercel CLI
npm run build
vercel --prod
```

#### **GitHub Pages**
```bash
# Build and deploy to gh-pages
npm run build
npx gh-pages -d dist
```

### Environment Variables

For different environments, create environment files:

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080

# .env.production
VITE_API_BASE_URL=https://rxuu-backend-306624049631.europe-west1.run.app
```

## 📊 Performance

### Optimization Strategies

#### **Bundle Size**
- **Vendor Splitting**: Separate chunks for better caching
- **Dynamic Imports**: Lazy loading for non-critical components
- **Tree Shaking**: Remove unused code

#### **Runtime Performance**
- **React Optimization**: Proper key props and memoization
- **Chart Performance**: Efficient data transformation
- **API Calls**: Parallel requests where possible

### Performance Metrics

Target performance metrics:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```
3. **Make changes** following code style guidelines
4. **Add tests** for new functionality
5. **Run linter and tests**
   ```bash
   npm run lint
   npm run test
   ```
6. **Submit pull request**

### Code Style Guidelines

- Use TypeScript for all new components
- Follow React best practices and hooks guidelines
- Write descriptive component and variable names
- Add JSDoc comments for complex functions
- Maintain consistent formatting with Prettier

## 🆘 Support & Troubleshooting

### Common Issues

#### **Development Server Won't Start**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### **Build Errors**
```bash
# Type check for errors
npx tsc --noEmit

# Check for linting issues
npm run lint
```

### Getting Help

- Check the browser console for errors
- Review the API documentation
- Create an issue in the repository
- Check existing issues for similar problems

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔄 Changelog

### v1.0.0
- Initial release with drug search functionality
- Sentiment analysis visualization
- Responsive design implementation
- Community insights feature
- Interactive charts and data visualization
- Complete TypeScript integration