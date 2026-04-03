# EBL Bank Sentiment Analysis Dashboard

A comprehensive sentiment analysis dashboard for analyzing social media posts and comments about banks. This Next.js application provides real-time insights into customer sentiment, emotions, geographic distribution, and actionable recommendations.

## Features

- **KPI Dashboard**: Real-time metrics including total posts, comments, sentiment scores, and engagement rates
- **Sentiment Analysis**: Distribution of positive, negative, and neutral sentiments with trend analysis
- **Emotion Detection**: Multi-dimensional emotion analysis (joy, sadness, anger, fear, surprise, disgust)
- **Bank Mentions**: Comparative analysis of mentions across different banks
- **Geographic Visualization**: Interactive map showing sentiment distribution by location
- **AI Overview**: AI-generated insights and strategic recommendations
- **Action Items**: Prioritized list of recommended actions based on sentiment trends
- **Top Posts Analysis**: Identification and analysis of most impactful posts
- **Full Data Explorer**: Paginated view of all posts and comments with filtering
- **Dark/Light Theme**: Toggle between dark and light modes

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with Turbopack
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **Charts**: [Recharts](https://recharts.org)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Data Tables**: [TanStack Table](https://tanstack.com/table)

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API server running (default: `http://localhost:8080/api`)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd EBL-bank-sentiment-analysis
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables:
```bash
# Copy the example environment file
copy .env.example .env.local

# Edit .env.local and add your API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Running the Project

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
├── app/                      # Next.js app directory
│   ├── globals.css          # Global styles
│   ├── layout.js            # Root layout
│   └── page.js              # Home page
├── components/
│   ├── common/              # Reusable common components
│   ├── pages/home/          # Home page specific components
│   └── ui/                  # shadcn/ui components
├── services/                # API service functions
│   ├── actionItems.service.js
│   ├── aiOverview.service.js
│   ├── darhboard.service.js
│   ├── emotion.service.js
│   ├── fullData.service.js
│   ├── sentiment.service.js
│   └── strategicOverview.service.js
├── lib/                     # Utility functions
├── providers/               # React context providers
└── public/                  # Static assets
```

## API Endpoints

The application connects to the following backend endpoints:

- `GET /kpi` - Dashboard KPI metrics
- `GET /sentiment-analysis/sentiments` - Sentiment distribution data
- `GET /sentiment-analysis/top-posts` - Top performing posts
- `GET /sentiment-analysis/emotions` - Emotion analysis data
- `GET /sentiment-analysis/categories` - Category-based analysis
- `GET /bank-mentions` - Bank mention statistics
- `GET /geolocation` - Geographic sentiment distribution
- `GET /ai-overview` - AI-generated insights
- `GET /action-items` - Recommended action items
- `GET /full-data/posts/:page` - Paginated posts data
- `GET /full-data/comments/:page` - Paginated comments data

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes |

## Key Components

- **Dashboard**: Main dashboard view with KPI cards and charts
- **SentimentDistribution**: Visualizes sentiment trends over time
- **EmotionDonutChart**: Circular chart showing emotion distribution
- **GeoMap**: Interactive map for geographic sentiment analysis
- **BankMentionsBarChart**: Comparative bank mention visualization
- **ActionItems**: List of AI-recommended actions
- **AllPosts/AllComments**: Data tables with pagination and filtering

## Development

The project uses:
- ESLint for code linting
- Tailwind CSS for styling
- Server-side data fetching with "use server" directive
- Responsive design for mobile and desktop views

## Build for Production

```bash
npm run build
npm run start
```

## Deploy

This application can be deployed to:
- [Vercel](https://vercel.com) (recommended for Next.js)
- [Netlify](https://netlify.com)
- Any Node.js hosting platform

For Vercel deployment:
```bash
vercel deploy
```

Remember to set the `NEXT_PUBLIC_API_URL` environment variable in your deployment platform.

## License

[Your License Here]

## Support

For issues and questions, please open an issue in the repository.
