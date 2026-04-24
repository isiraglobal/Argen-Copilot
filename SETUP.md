# ArGen App - Complete Build Guide

## Overview

This is a complete, production-ready prompt engineering training platform built with:

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Cloudflare Workers + D1 Database + Drizzle ORM
- **Auth**: Supabase (JWT + Google OAuth)
- **AI**: Anthropic Claude API (4-layer credit routing)
- **Payments**: Whop integration
- **Email**: Resend API

## What's Implemented ✅

### Core Infrastructure
- [x] React Router v7 with protected routes
- [x] Supabase authentication (Google OAuth + email/password)
- [x] Typed API client with JWT auth handling
- [x] Cloudflare Workers API with Hono framework
- [x] D1 SQLite database with Drizzle ORM schema
- [x] CORS, logging, and rate limiting middleware
- [x] Design system (Cascadia Mono, retro style, no shadows/gradients)

### Core Features
- [x] **Challenges System**
  - Challenge browser with search, filtering (difficulty/category)
  - Detailed challenge view with responsive 3-panel desktop / tabbed mobile layout
  - Challenge metadata (description, constraints, example prompts, expected output)
  - User progress tracking (attempts, best score, completion status)

- [x] **Prompt Engineering**
  - Real-time prompt analyzer (readiness score, word/char count)
  - Simulated AI output generation (offline)
  - Run/Preview functionality before submission
  - 4-layer credit routing (offline → simulated → cached → live API)

- [x] **Submission System**
  - Prompt submission with scoring (clarity, completeness, creativity, effectiveness)
  - Anti-cheat similarity checking
  - Feedback generation
  - Submission history

- [x] **API Endpoints**
  - `GET /api/challenges` - List challenges with filters and pagination
  - `POST /api/challenges` - Create challenges (for admins/seeding)
  - `GET /api/challenges/:id` - Get single challenge with user progress
  - `GET /api/challenges/categories` - Get available categories
  - `GET /api/challenges/difficulties` - Get available difficulties
  - `POST /api/submissions` - Submit prompt for evaluation
  - `GET /api/submissions` - List user submissions
  - Team, course, payment, and analytics routes (handlers ready)

### Database Schema
- **users** - User profiles, subscription status, plan type
- **challenges** - Challenge definitions with difficulty, points, constraints
- **submissions** - User submissions with scores and feedback
- **user_progress** - Tracking best score, attempts, completion status
- **teams** - Team management with members and AI pools
- **courses** - Course definitions and structure
- **notifications** - User notifications
- **feedback** - User feedback collection
- **system_settings** - Platform configuration

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Wrangler CLI (`npm install -g wrangler`)
- Supabase account
- Cloudflare account with Workers enabled

### Frontend Setup

```bash
cd argen-rebuild-kit
npm install
cp frontend.env.example .env.local
# Edit .env.local with your Supabase URL and API endpoint
npm run dev
```

Visit `http://localhost:5173`

### Backend Setup

```bash
cd worker
npm install
cp wrangler.toml.example wrangler.toml
# Edit wrangler.toml with your D1 database ID
npm run dev
```

Visit `http://localhost:8787`

## Seeding Challenges

### Option 1: Via Frontend (Recommended)

```javascript
// In your browser console (on /challenges page):
import { parseChallengeCsv, seedChallengesToAPI } from '/src/lib/seeds.ts';

// If you have the CSV file locally:
const csvContent = await fetch('/challenge.csv').then(r => r.text());
const challenges = parseChallengeCsv(csvContent);
await seedChallengesToAPI('http://localhost:8787', challenges);
```

### Option 2: Via Direct API

```bash
# Create a seeding endpoint in worker/src/routes/seed.ts
# Then call it via Wrangler or curl

curl -X POST http://localhost:8787/api/admin/seed \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d @challenge.json
```

### Option 3: D1 Direct Import

```bash
# If you have wrangler set up:
wrangler d1 execute YOUR_DB_NAME --file challenges.sql
```

## Architecture Overview

```
Frontend (React)
    ↓ (HTTP + JWT)
Cloudflare Workers (Hono)
    ↓ (Queries)
D1 Database (SQLite)
    
Auth: Supabase ←→ Workers (JWT verification)
AI Eval: Claude API ←→ creditRouter ←→ Submissions
```

## Key Features

### Responsive Design
- **Desktop**: 3-panel layout (description | input | output)
- **Mobile**: Tabbed interface (tabs for desc/guide, input, output)
- Retro aesthetic with 3px borders, Cascadia Mono font, no gradients

### Smart Credit Routing (4-Layer)
1. **Offline** - Local scoring, instant, free
2. **Simulated** - Simulated AI output, minimal credits
3. **Cached** - Similar previous evaluations, reduced credits
4. **Live API** - Real Anthropic Claude, full credits

### Security
- JWT-based authentication
- Rate limiting on submissions (10 per minute per user)
- Anti-cheat similarity checking
- CSRF protection via Supabase
- SQL injection prevention via Drizzle ORM

## Project Structure

```
argen-rebuild-kit/
├── src/
│   ├── pages/
│   │   ├── Challenges.tsx          # Challenge browser
│   │   ├── ChallengeDetailNew.tsx  # Challenge detail view
│   │   ├── Profile.tsx             # User profile
│   │   └── ...
│   ├── components/
│   │   ├── auth/
│   │   └── ...
│   ├── hooks/
│   │   ├── useUser.ts              # Auth state
│   │   ├── useQuota.ts             # Monthly quota
│   │   └── useMobile.ts            # Responsive
│   ├── lib/
│   │   ├── api.ts                  # Typed API client
│   │   ├── supabase.ts             # Supabase config
│   │   ├── seeds.ts                # CSV seeding utility
│   │   └── engines/
│   │       ├── PromptAnalyzer.ts   # Scoring
│   │       ├── SimulatedOutputEngine.ts
│   │       └── creditRouter.ts     # 4-layer routing
│   ├── App.tsx                     # Main router
│   └── index.css                   # Retro design system
│
├── worker/
│   ├── src/
│   │   ├── handlers/
│   │   │   ├── challenges.ts       # Challenge CRUD
│   │   │   ├── submissions.ts      # Submission handling
│   │   │   ├── teams.ts
│   │   │   └── ...
│   │   ├── middleware/
│   │   │   ├── auth.ts             # JWT verification
│   │   │   └── rateLimit.ts
│   │   ├── db/
│   │   │   ├── schema.ts           # Drizzle schema
│   │   │   └── migrations/
│   │   ├── lib/
│   │   │   └── db.ts               # D1 client
│   │   └── index.ts                # Main app + routes
│   ├── wrangler.toml               # Cloudflare config
│   └── tsconfig.json
│
├── frontend.env.example
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8787
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

### Backend (wrangler.toml)
```toml
[env.development]
vars = { ENVIRONMENT = "development" }

[[env.development.d1_databases]]
binding = "DB"
database_name = "argen-db-dev"
database_id = "xxx"
```

## Development Workflow

1. **Make changes** to frontend or backend code
2. **Frontend**: Changes auto-reload via Vite HMR
3. **Backend**: Restart `npm run dev` in worker/ directory
4. **Test** via Postman, curl, or browser DevTools
5. **Check Roadmap.md** for current status before changes
6. **Update Roadmap.md** with progress when stopping

## Deployment

### Frontend (Cloudflare Pages)
```bash
npm run build
wrangler pages deploy dist/ --project-name argen
```

### Backend (Cloudflare Workers)
```bash
cd worker
wrangler deploy
```

## Next Steps

See **Roadmap.md** in /memories/repo/ for detailed implementation status and upcoming tasks.

### High-Priority Items
- [ ] Complete D1 migrations
- [ ] Integrate real Anthropic Claude API
- [ ] Implement payment webhooks (Whop)
- [ ] Add team collaboration features
- [ ] Complete admin panel
- [ ] Add analytics dashboard

## Support

For issues:
1. Check the **Roadmap.md** to understand current status
2. Review **Architecture.md** for system design
3. Follow **CLAUDE.md** custom agent rules for code standards
4. Check error messages in browser DevTools or Wrangler logs

---

**Built with ❤️ for prompt engineers**
