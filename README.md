# 🔥 Deluminator Scoreboard 🔥

A Vue.js application for tracking lanternfly elimination efforts with real-time leaderboards and cloud storage.

## Features

- 📊 **Real-time Leaderboard**: See who's contributing the most to lanternfly elimination
- 🎯 **Easy Reporting**: Simple form to report your daily unaliving count
- ☁️ **Cloud Storage**: Data persisted with Vercel Postgres
- 🎨 **Modern UI**: Built with Vue 3, shadcn/ui components, and Tailwind CSS
- 📱 **Responsive**: Works perfectly on mobile and desktop
- ⚡ **Real-time Sync**: Updates shared across all users instantly
- 🦗 **Animated Background**: Lanternflies flying around for immersion

## Tech Stack

- **Frontend**: Vue 3, Pinia, Tailwind CSS, shadcn/ui
- **Backend**: Vercel Serverless Functions
- **Database**: Postgres with Prisma ORM
- **Deployment**: Vercel with automatic HTTPS and global CDN

## Development

### Local Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd deluminator-scoreboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development servers:
```bash
# Run both API and frontend servers
npm run dev:full

# Or run them separately:
npm run dev:api    # API server on :3000
npm run dev        # Frontend on :5173
```

The app will be available at `http://localhost:5173` with the API at `http://localhost:3000`.

### API Endpoints

- `GET /api/scores` - Get all scores and stats
- `POST /api/scores/add` - Add a new score
- `DELETE /api/scores/clear` - Clear all scores

## Deployment to Vercel

### Prerequisites

1. Create a [Vercel account](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`

### Deploy Steps

1. **Connect to GitHub**: Push your code to a GitHub repository

2. **Deploy to Vercel**: Connect your GitHub repo to Vercel or use:
```bash
vercel --prod
```

3. **Add Postgres Database**:
   - Go to your Vercel project dashboard
   - Navigate to "Storage" tab
   - Browse Marketplace for Postgres providers
   - Select a provider (like Neon, Supabase, or PlanetScale)
   - Follow setup wizard to connect to your project

4. **Environment Variables**: The Postgres connection variables will be automatically added:
   - `DATABASE_URL` (main connection for Prisma)
   - `DIRECT_URL` (for migrations and schema operations)

5. **Database Setup**: After deployment, the database schema will be automatically created on first API call

Your app will be live at `https://your-project-name.vercel.app`!

## Usage

1. **Report Lanternflies**: Enter your name and count, then click "Submit Report"
2. **View Leaderboard**: See rankings with crown/medal emojis for top contributors
3. **Track Progress**: Community stats show total impact
4. **Clear Data**: Admin option to reset the leaderboard

## Contributing

This app helps track the elimination of spotted lanternflies, an invasive species that damages crops and plants. Every report helps understand the community impact in controlling this pest!

## Environment

- Node.js 20+
- Vue 3.4+
- Modern browser with ES2020+ support