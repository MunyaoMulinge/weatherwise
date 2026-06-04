# WeatherWise — Smart Weather Dashboard

A clean, responsive full-stack weather dashboard that integrates with the [Weather-AI](https://weather-ai.co) developer platform. Features real-time weather forecasts, AI-powered insights, interactive maps, usage analytics, and dark mode — built to demonstrate solid API integration, caching strategy, and modern frontend architecture.

**Live Demo:** [https://weatherwise-demo.vercel.app](https://weatherwise-demo.vercel.app) *(update after deployment)*  
**API Base:** [https://weatherwise-api.onrender.com](https://weatherwise-api.onrender.com) *(update after deployment)*  
**API Docs:** [https://weather-ai.co/docs](https://weather-ai.co/docs)

---

## Submission Checklist

Per the assignment requirements from Weather-AI:

| Requirement | Status | Details |
|-------------|--------|---------|
| ✅ Integrates Weather-AI APIs | Complete | `/v1/weather`, `/v1/weather-geo`, `/v1/usage` |
| ✅ Clean, functional project | Complete | React + TypeScript + Tailwind, full error handling |
| ✅ GitHub repository | Ready | Push to your account |
| ✅ Clean `README.md` with setup instructions | Complete | This file — local setup, Docker, production deploy |
| ✅ Live deployment link | Ready | Vercel (frontend) + Render (backend) — see instructions below |

---

## Features

- **Real-Time Weather** — Current conditions + 7-day forecast via Weather-AI `/v1/weather`
- **AI-Powered Summaries** — Gemini-generated weather insights from `/v1/weather?ai=true`
- **Auto-Detect Location** — IP-based geolocation with `/v1/weather-geo?ip=auto`
- **City Search** — OpenStreetMap Nominatim geocoding with autocomplete
- **Interactive Map** — Leaflet map showing the selected location
- **Hourly Forecast** — Scrollable 24-hour temperature and precipitation breakdown
- **Usage Analytics** — Live API quota tracking from `/v1/usage`
- **Dark Mode** — Full dark/light theme toggle with persistent preference
- **Responsive Design** — Mobile-first UI optimized for all screen sizes
- **Caching** — Server-side Node-Cache (5-min weather, 24h geocode) to minimize API calls
- **Rate Limiting** — Express rate limiter to protect endpoints

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Recharts, Leaflet |
| **Backend** | Node.js, Express, TypeScript |
| **DevOps** | Docker, Docker Compose, GitHub Actions CI/CD |
| **APIs** | Weather-AI REST API, OpenStreetMap Nominatim |

---

## Architecture

```
┌─────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Browser   │◄────►│  Express Proxy  │◄────►│  Weather-AI API │
│  (React)    │      │  (Node/TypeScript)│     │  (REST)         │
└─────────────┘      └─────────────────┘      └─────────────────┘
                            │
                            ▼
                     ┌─────────────────┐
                     │  Node-Cache     │
                     │  (5min/24hr TTL)│
                     └─────────────────┘
```

The Express backend acts as a **secure proxy** — it stores the Weather-AI API key server-side, adds caching to reduce redundant calls, and handles CORS for the frontend.

---

## Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- A free [Weather-AI](https://weather-ai.co) API key

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/weatherwise.git
cd weatherwise
```

### 2. Install dependencies

```bash
npm run install:all
```

This installs dependencies for both `backend/` and `frontend/`.

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
PORT=3001
WEATHER_AI_API_KEY=wai_your_actual_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

> Get your API key from the [Weather-AI Dashboard](https://weather-ai.co/dashboard) → API Keys.

### 4. Start the development servers

```bash
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Health check:** http://localhost:3001/health

---

## Docker Deployment

### Option A: Docker Compose (recommended for local)

```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your WEATHER_AI_API_KEY

docker-compose up --build
```

- **Frontend:** http://localhost
- **Backend:** http://localhost:3001

### Option B: Individual Docker builds

```bash
# Backend
docker build -t weatherwise-backend ./backend
docker run -p 3001:3001 --env-file backend/.env weatherwise-backend

# Frontend
docker build -t weatherwise-frontend ./frontend
docker run -p 80:80 weatherwise-frontend
```

---

## Production Deployment

### Recommended: Vercel (Frontend) + Render (Backend)

This is the fastest, free-tier path to a live deployment.

#### Step 1: Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `weatherwise-api`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Click **Advanced** and add environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `3001`
   - `WEATHER_AI_API_KEY` = `wai_your_actual_key`
   - `CORS_ORIGIN` = `https://weatherwise-demo.vercel.app` *(update after Vercel deploy)*
6. Click **Create Web Service**
7. Copy your Render URL (e.g., `https://weatherwise-api.onrender.com`)

> Render free tier spins down after 15 min of inactivity. First request may take ~30s to wake up.

#### Step 2: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variable:
   - `VITE_API_URL` = `https://weatherwise-api.onrender.com` *(your Render URL from Step 1)*
6. Click **Deploy**
7. Copy your Vercel URL (e.g., `https://weatherwise-demo.vercel.app`)

#### Step 3: Update CORS

1. Go back to your Render dashboard → Web Service → Environment
2. Update `CORS_ORIGIN` to match your actual Vercel URL
3. Click **Save Changes** — Render will redeploy automatically

### Alternative Platforms

| Platform | Best For | Notes |
|----------|----------|-------|
| **Vercel** | Frontend | Native Vite support, auto-deploys from Git |
| **Render** | Backend | Free tier, zero-config Node.js, sleeps on idle |
| **Railway** | Backend | Free tier, slightly faster cold starts than Render |
| **Fly.io** | Backend | Free allowance, closer to bare-metal |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `GET` | `/api/weather/forecast?lat=&lon=&days=` | Weather forecast (cached 5 min) |
| `GET` | `/api/weather/current?lat=&lon=` | Current weather only |
| `GET` | `/api/weather/geo?ip=auto` | Auto-detect by IP |
| `GET` | `/api/geocode/search?q=` | City search via OpenStreetMap |
| `GET` | `/api/geocode/reverse?lat=&lon=` | Reverse geocoding |
| `GET` | `/api/usage` | API usage statistics (cached 1 min) |

---

## Project Structure

```
weatherwise/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express server entry
│   │   ├── routes/               # API route handlers
│   │   ├── services/             # External API integrations
│   │   └── types/                # TypeScript interfaces
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Main application
│   │   ├── components/           # React UI components
│   │   ├── hooks/                # TanStack Query hooks
│   │   ├── services/             # API client
│   │   └── types/                # TypeScript interfaces
│   ├── public/
│   ├── vercel.json               # Vercel SPA routing config
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── render.yaml                   # One-click Render deploy
├── .github/workflows/ci.yml      # GitHub Actions CI/CD
├── package.json                  # Root workspace scripts
└── README.md
```

---

## Weather-AI API Integration

This project consumes the following Weather-AI endpoints:

| Endpoint | Plan | Purpose |
|----------|------|---------|
| `GET /v1/weather` | Free+ | Core weather data + forecast |
| `GET /v1/weather-geo` | Free+ | IP-based auto-detection |
| `GET /v1/usage` | Free+ | Quota tracking |

Free tier includes **1,000 requests/month** and **200 AI requests/month** — sufficient for demo and light usage.

---

## Design Decisions

1. **Backend Proxy** — The API key never reaches the browser. The Express server proxies all Weather-AI calls, enabling caching and rate limiting.
2. **OpenStreetMap Geocoding** — Weather-AI accepts `lat/lon` only. Nominatim converts city names to coordinates at no cost.
3. **Node-Cache** — Two-tier caching: 5-minute TTL for weather data (balances freshness with API quota), 24-hour TTL for geocoding (stable data).
4. **TanStack Query** — Frontend data fetching with automatic background refetch, stale-while-revalidate, and error retry.
5. **Docker Multi-Stage Builds** — Minimizes final image size by separating build dependencies from production artifacts.

---

## Future Enhancements

- [ ] **Tree Analysis Module** — Integrate `/v1/trees/analyze` for farm canopy health assessment
- [ ] **Webhook Subscriptions** — Pro-tier weather alerts pushed to the app
- [ ] **SMS Alerts** — Scale-tier integration for SMS weather notifications
- [ ] **Charts** — Recharts temperature/precipitation trend visualization
- [ ] **PWA** — Service worker for offline access to cached forecasts

---

## License

MIT

---

## Author

**Victor Mulinge** — Full Stack Developer  
[GitHub](https://github.com/MunyaoMulinge) • [Portfolio](https://vmulinge.dev) • munyaomulinge@protonmail.com
