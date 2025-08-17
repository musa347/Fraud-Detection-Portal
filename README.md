#  FraudGuard AI - Advanced Fraud Detection Portal

A cutting-edge, AI-powered fraud detection portal built with React, TypeScript, and modern web technologies. This application provides real-time fraud analysis, comprehensive analytics, and machine learning insights to help detect and prevent fraudulent transactions.

##  Features

###  AI-Powered Analysis
- **Real-time ML Model Insights**: Advanced machine learning algorithms analyze transactions in real-time
- **Confidence Scoring**: Each prediction comes with a confidence score
- **Feature Importance**: Understand which factors contribute most to fraud detection
- **Risk Level Classification**: Automatic categorization into LOW, MEDIUM, HIGH, and CRITICAL risk levels

###  Advanced Analytics Dashboard
- **Interactive Charts**: Multiple chart types including line, bar, pie, and scatter plots
- **Transaction Trends**: Visualize fraud patterns over time
- **Risk Distribution**: Comprehensive breakdown of risk levels
- **Amount Analysis**: Fraud correlation with transaction amounts
- **Type Analysis**: Fraud rates by transaction type

###  Modern UI/UX
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion powered animations and transitions
- **Glass Morphism**: Modern glass-like UI elements
- **Interactive Components**: Hover effects and micro-interactions

###  Fraud Analyzer
- **Comprehensive Input Form**: Easy-to-use transaction input interface
- **Real-time Results**: Instant fraud probability calculation
- **AI Explanations**: Detailed explanations of why transactions are flagged
- **Export Capabilities**: Download analysis results as JSON
- **Analysis History**: Track recent fraud analyses

###  Dashboard Features
- **Model Performance Metrics**: Accuracy, Precision, Recall, F1-Score
- **Live Transaction Monitoring**: Real-time transaction feed
- **Statistical Overview**: Key performance indicators
- **Circular Progress Indicators**: Visual representation of model performance

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Responsive chart library
- **Lucide React** - Beautiful icon library
- **React Router** - Client-side routing

### Backend Integration
- **Spring Boot API**: `https://fraud-detection-backend-9ssq.onrender.com`
- **FastAPI ML Service**: `https://fraud-detection-mcw8.onrender.com`
- **RESTful APIs**: Clean API integration with error handling

### Development Tools
- **Vite** - Fast build tool and dev server
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fraud-detection-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Pages & Components

###  Dashboard (`/`)
- Model performance overview
- Recent transaction analysis
- Live monitoring feed
- Key statistics and metrics

###  Analyzer (`/analyzer`)
- Transaction input form
- Real-time fraud analysis
- AI explanations and insights
- Feature importance visualization
- Export functionality

###  Analytics (`/charts`)
- Multiple chart types and visualizations
- Time-based trend analysis
- Risk distribution charts
- Transaction type analysis
- Amount correlation studies

##  Key Features Breakdown

### Machine Learning Integration
```typescript
interface FraudResult {
  fraudProbability: number;
  flagged: boolean;
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string[];
  featureImportance: { [key: string]: number };
  modelVersion: string;
  processingTime: number;
}
```

### Theme System
- Persistent theme selection (localStorage)
- System-wide dark/light mode support
- Smooth theme transitions
- Tailwind CSS dark mode integration

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized performance on all devices

## 🔧 Configuration

### API Endpoints
The application connects to two main services:
- **Spring Boot Backend**: Handles transaction processing and scoring
- **FastAPI ML Service**: Provides machine learning model predictions

### Environment Variables
Create a `.env` file for custom configuration:
```env
VITE_API_BASE_URL=https://fraud-detection-backend-9ssq.onrender.com
VITE_ML_API_URL=https://fraud-detection-mcw8.onrender.com
```

##  Design System

### Color Palette
- **Primary**: Blue gradient (#3b82f6 to #8b5cf6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)
- **Neutral**: Gray scale for backgrounds and text

### Typography
- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300-900
- **Responsive sizing**: Tailwind CSS utilities

### Components
- Consistent spacing and sizing
- Reusable component architecture
- Accessible design patterns
- Modern card-based layouts

##  Analytics & Insights

### Fraud Detection Metrics
- **Accuracy**: Overall model correctness
- **Precision**: True positive rate
- **Recall**: Sensitivity to fraud cases
- **F1-Score**: Harmonic mean of precision and recall

### Visualization Types
- **Line Charts**: Trend analysis over time
- **Bar Charts**: Categorical comparisons
- **Pie Charts**: Distribution analysis
- **Scatter Plots**: Correlation studies
- **Area Charts**: Volume analysis

##  Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo and useMemo optimizations
- **Bundle Optimization**: Vite's efficient bundling
- **Image Optimization**: Responsive images and lazy loading
- **CSS Optimization**: Tailwind CSS purging

##  Security Features

- **Input Validation**: Client-side form validation
- **API Error Handling**: Comprehensive error management
- **Type Safety**: TypeScript for runtime safety
- **Secure API Calls**: Proper error handling and timeouts

##  Future Enhancements

- [ ] Real-time WebSocket integration
- [ ] Advanced filtering and search
- [ ] Custom alert system
- [ ] PDF report generation
- [ ] Multi-language support
- [ ] Advanced user management
- [ ] API rate limiting visualization
- [ ] Machine learning model comparison

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

##  Acknowledgments

- **Machine Learning Models**: Powered by advanced fraud detection algorithms
- **UI/UX Inspiration**: Modern fintech and security applications
- **Open Source Libraries**: Thanks to all the amazing open source contributors

---

**Built with ❤ for fraud prevention and financial security**
