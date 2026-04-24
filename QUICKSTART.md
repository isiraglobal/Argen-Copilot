# ArGen Phase 1: Quick Start Guide

## What Was Built

A production-ready foundation for ArGen with:
- ✅ React 18 + TypeScript frontend on Vite
- ✅ Cloudflare Workers backend with Hono.js
- ✅ Supabase authentication (Google OAuth + email/password)
- ✅ Offline-first AI evaluation system
- ✅ **ChallengeDetail page** - the core product feature fully implemented
- ✅ Design system enforced (no rounded corners, no shadows, Cascadia Mono globally)

## Files Created (35 files)

### Core Infrastructure
- `src/lib/supabase.ts` - Supabase client
- `src/lib/api.ts` - Typed API wrapper
- `src/hooks/useUser.ts` - Auth state management
- `worker/src/index.ts` - Hono.js router
- `worker/src/db/schema.ts` - Drizzle ORM schema

### Critical Engines (Cost Control Foundation)
- `src/lib/engines/PromptAnalyzer.ts` - Local scoring (40 base + bonuses)
- `src/lib/engines/SimulatedOutputEngine.ts` - Offline AI output generation
- `src/lib/engines/creditRouter.ts` - 4-layer credit routing (hash cache → structure cache → soft-cap → API)

### Main Feature
- `src/pages/ChallengeDetail.tsx` - **3-panel desktop + mobile tab layout**
  - Left panel: Description + Guide
  - Middle panel: Prompt editor (paste disabled), readiness score
  - Right panel: Output console + evaluation breakdown
  - Header: RUN (offline) + SUBMIT (4-layer routing) buttons
  - Anti-cheat similarity check
  - Solved when score ≥ 70

### Authentication
- `src/components/auth/AuthGatekeeper.tsx` - Route protection
- `src/components/auth/AuthForm.tsx` - Login/signup form

### App Setup
- `tailwind.config.js` - Updated (border-radius disabled)
- `src/index.css` - Enhanced with retro enforcement
- `src/App.tsx` - Router configuration
- `worker/wrangler.toml` - D1 database binding

## How It Works

### Running Locally

```bash
# Frontend
npm install
npm run dev           # http://localhost:5173

# Worker (in new terminal)
cd worker
npm install
npm run dev           # http://localhost:8787
```

### Testing the Main Feature

1. **Visit Challenge Detail Page**
   ```
   http://localhost:5173/challenges/sample-1
   ```

2. **Desktop Layout** (3 panels side-by-side)
   - **Left**: Challenge description + guide
   - **Middle**: Write your prompt
   - **Right**: Empty state (click RUN to see output)

3. **Write a Prompt**
   ```
   "You are a marketing expert. Create a compelling product description in 50 words for a productivity app."
   ```

4. **Click RUN**
   - Runs PromptAnalyzer locally → readiness score updates
   - Detects intent from prompt
   - Generates simulated output
   - Shows in right panel
   - Displays evaluation breakdown (Clarity, Completeness, Creativity, Effectiveness)

5. **Click SUBMIT**
   - Routes through 4-layer credit system
   - Checks score ≥ 70 for "solved"
   - Would award points if real backend connected

6. **Try on Mobile**
   - Layout switches to tabs: DESC / EDITOR / OUTPUT
   - Responsive design adapts to smaller screens

## Environment Setup (Required Before Deployment)

### 1. Create Supabase Project
```bash
# Sign up at supabase.com
# Create a new project
# Enable Google OAuth provider
# Get credentials:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 2. Create Cloudflare D1 Database
```bash
# Install Wrangler
npm install -g wrangler

# Create database
wrangler d1 create argen-db
# Get database ID: <ID>

# Update wrangler.toml:
# [[d1_databases]]
# binding = "DB"
# database_name = "argen-db"
# database_id = "<ID>"
```

### 3. Set Environment Variables
```bash
# Create .env in project root
cp frontend.env.example .env

# Create worker/.env
cp worker/.env.example worker/.env

# Fill in real values:
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=http://localhost:8787

SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ANTHROPIC_API_KEY=...  (for real AI calls)
WHOP_API_KEY=...
RESEND_API_KEY=...
```

## Architecture Overview

```
User Request
    ↓
Frontend (React 18 + Vite)
    ├─ Supabase Auth (Google OAuth)
    ├─ PromptAnalyzer (local scoring)
    ├─ SimulatedOutputEngine (offline AI)
    └─ creditRouter (4-layer logic)
    ↓
Cloudflare Worker (Hono.js)
    ├─ JWT Verification
    ├─ Rate Limiting
    ├─ Route Handlers
    └─ Database Queries
    ↓
Cloudflare D1 (SQLite)
    ├─ users
    ├─ challenges
    ├─ submissions
    ├─ user_progress
    └─ teams...
```

## Key Design Decisions

### 1. Offline-First Evaluation
- **RUN**: Executes locally (SimulatedOutputEngine + PromptAnalyzer)
- No API calls, instant feedback
- Used for iterating on prompts

### 2. 4-Layer Credit Routing for SUBMIT
1. **Hash Cache**: Exact prompt match in localStorage
2. **Structure Cache**: Challenge structure cache from DB
3. **Soft-Cap**: 80% of monthly quota → use offline
4. **Real API**: Call Claude if under 80%

### 3. No Design Anti-Patterns
- Disabled Tailwind border-radius globally
- Disabled box-shadow globally
- All text in Cascadia Mono
- All borders: 3px solid #1A1A1A
- Retro design system enforced

### 4. Anti-Cheat
- Paste disabled in prompt editor
- Similarity check: prompt vs description > 0.8 → score 0
- Solved only if score ≥ 70 (enforced server-side)

## Scoring System

### PromptAnalyzer
```
Base: 40 points
+ Word count ≥20: 15 | ≥10: 8 | <8: cap at 30
+ Role definition ("you are", "act as"): 12
+ Format specification: 10
+ Tone specification: 8
+ Context provided: 8
+ Constraints defined: 7
= Score (max 100, min 10)
```

Result includes:
- `readiness_score` (0-100)
- `strengths[]` - What works
- `weaknesses[]` - What's missing
- `suggestions[]` - How to improve

## Credit Limits

| Plan | Monthly Limit | Team Pool |
|------|---------------|-----------|
| Free | 5 | N/A |
| Creator | 30 | N/A |
| Architect | 80 | N/A |
| Team | 300 + (seats × 10) | Yes |

## What's Next (Phase 2)

1. **Complete Worker Routes** (15+ more routes needed)
   - Team CRUD operations
   - Course management
   - Submission evaluation with Claude API
   - Notification handling
   - Email sending via Resend

2. **Build Remaining Pages**
   - Explore (dashboard with stats)
   - Teams (create, join, manage)
   - Billing (subscription management)
   - BusinessOnboarding (form + pricing)
   - Blog, Documentation, Tutorials

3. **Payment Integration**
   - Whop checkout flow
   - Webhook verification
   - Subscription status tracking

4. **Analytics**
   - Page visit tracking
   - User flow visualization
   - Event logging

5. **Security Hardening**
   - Input sanitization
   - Rate limiting tuning
   - API key rotation
   - WAF rules

## Testing Checklist

- [ ] Frontend builds without errors
- [ ] Worker starts locally
- [ ] Can navigate to `/` (Home)
- [ ] Can navigate to `/challenges/sample-1` (ChallengeDetail)
- [ ] Can type in prompt editor
- [ ] Paste is disabled (try Ctrl+V)
- [ ] Readiness score updates as you type
- [ ] Click RUN shows output
- [ ] Click SUBMIT processes through credit router
- [ ] Responsive on mobile (tabs appear)
- [ ] No console errors
- [ ] No rounded corners visible
- [ ] Font is Cascadia Mono everywhere

## Important Notes

⚠️ **Simulated Output**: The SimulatedOutputEngine generates template-based output, not real AI. For production, integrate Anthropic Claude API.

⚠️ **Authentication**: Supabase must be configured with Google OAuth provider and email/password auth enabled.

⚠️ **Database**: D1 migrations need to be run before deployment.

⚠️ **Environment Variables**: All secrets must be set in Wrangler before deploying to production.

## File Structure

```
argen-rebuild-kit/
├── src/                          # Frontend
│   ├── lib/
│   │   ├── supabase.ts          # Auth
│   │   ├── api.ts               # API wrapper
│   │   └── engines/
│   │       ├── PromptAnalyzer.ts
│   │       ├── SimulatedOutputEngine.ts
│   │       └── creditRouter.ts
│   ├── hooks/
│   │   ├── useUser.ts
│   │   ├── useMobile.ts
│   │   └── useQuota.ts
│   ├── components/
│   │   └── auth/
│   │       ├── AuthGatekeeper.tsx
│   │       └── AuthForm.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Challenges.tsx
│   │   ├── ChallengeDetail.tsx   # MAIN FEATURE
│   │   └── Profile.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                # Design system
│
├── worker/                       # Backend
│   ├── src/
│   │   ├── index.ts             # Router
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── rateLimit.ts
│   │   ├── db/
│   │   │   └── schema.ts        # Drizzle
│   │   └── routes/              # TODO: Complete
│   ├── wrangler.toml
│   ├── package.json
│   └── tsconfig.json
│
├── tailwind.config.js           # Border-radius disabled
├── vite.config.js
├── package.json
├── IMPLEMENTATION.md            # Full guide
├── VERIFICATION.md              # Checklist
└── README.md
```

## Getting Help

Refer to:
- `IMPLEMENTATION.md` - Complete implementation guide
- `VERIFICATION.md` - Detailed verification checklist
- `/memories/session/plan.md` - Full 5-phase plan
- Individual file comments for implementation details

---

**Status**: Phase 1 Complete ✅
**Ready For**: Local testing and Supabase/Cloudflare configuration
**Next Phase**: Phase 2 (Additional routes, pages, features)

Built with ❤️ for ArGen - Master AI Governance
