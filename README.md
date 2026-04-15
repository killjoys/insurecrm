# InsureCRM

A modern insurance CRM web application for Thailand-based insurance agents. Built with React, TypeScript, Tailwind CSS, and Express.

## Features

- **Dashboard** — Three views: Operations (today's tasks/tickets), Business (revenue/charts), Pipeline (leads funnel)
- **Lead Management** — Track prospects from first contact to conversion
- **Client Management** — Full client profiles with tier classification (VIP/Standard)
- **Policy Management** — All insurance categories (Life, Health, PA, Motor, Fire) with business-rule enforcement
- **Renewal Tracking** — Upcoming renewals with urgency indicators
- **Ticket System** — Service requests with priority and status tracking
- **Thai/English** — Full bilingual support with currency and date formatting

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS 4, Vite, React Router, Recharts |
| Backend | Node.js, Express 5, TypeScript |
| Data | Repository pattern — mock (in-memory) or database-backed |

## Quick Start

```bash
# Install dependencies
npm install

# Run both frontend + backend in development
npm run dev:all
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server only |
| `npm run dev:server` | Start backend API server only (with hot-reload) |
| `npm run dev:all` | Start both frontend and backend |
| `npm run build` | Build frontend for production |
| `npm run start` | Start production server (API + static files) |
| `npm run lint` | Run ESLint |

## Production Deployment

### Option 1: Node.js

```bash
npm install
npm run build
npm start
```

The production server serves both the API and the built frontend on a single port (default `3001`).

### Option 2: Docker

```bash
docker build -t insurecrm .
docker run -p 3001:3001 insurecrm
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment (`development` / `production`) |
| `USE_DB` | `false` | Set to `true` to use database repositories instead of mock data |

## Project Structure

```
├── server/                  # Backend API
│   ├── index.ts             # Express entry point
│   ├── types.ts             # Shared backend types & DTOs
│   ├── repositories/        # Data access layer
│   │   ├── *Repository.ts   # Interfaces
│   │   ├── mock*.ts         # In-memory implementations (dev)
│   │   └── db*.ts           # Database stubs (production)
│   └── routes/              # Express route handlers
├── src/                     # Frontend (React SPA)
│   ├── api/                 # API client modules
│   ├── components/          # Shared UI components
│   ├── context/             # React Context (global state)
│   ├── data/                # Seed data (fallback)
│   ├── i18n/                # Thai/English translations
│   ├── pages/               # Page components
│   └── types/               # TypeScript types
├── Dockerfile
└── package.json
```

## Adding a Real Database

1. Implement the `db*Repository.ts` stubs in `server/repositories/` with your ORM/query builder of choice
2. Set `USE_DB=true` in your environment
3. The rest of the app works without changes thanks to the repository pattern
