# ArGen — Self-Hosted Rebuild Guide

## Stack
- React 18 + Vite
- Tailwind CSS
- Lucide React (icons)
- react-router-dom v7
- react-markdown
- framer-motion
- @tanstack/react-query
- jszip

## Replacing Base44

### 1. Authentication
Replace `base44.auth.me()` with your own JWT/session auth.
Example (Supabase): `const { data: { user } } = await supabase.auth.getUser()`

### 2. Database / Entities
Replace `base44.entities.X.filter()`, `.create()`, `.update()`, `.delete()`
with fetch calls to your own REST API or Supabase/Firebase.
Stub file provided at `src/api/apiClient.js`.

### 3. Email
Replace `base44.integrations.Core.SendEmail()` with Resend, SendGrid, or Nodemailer.

### 4. LLM / AI calls
Replace `base44.integrations.Core.InvokeLLM()` with OpenAI / Anthropic API calls.

### 5. Backend functions
Replace `base44.functions.invoke('functionName', payload)` with calls to your own API routes.
See `server/` folder for Express equivalents of all backend functions.

### 6. Logo
Current logo is hosted on Supabase CDN. Download it and place at `public/logo.png`.
Update all references from the CDN URL to `/logo.png`.

### 7. Font (Cascadia Code)
Add to your project: https://github.com/microsoft/cascadia-code/releases
Or keep the CDN link in index.css.

### 8. Payments (Whop → Stripe)
See `src/payments/MIGRATION.md` for Stripe migration guide.

## Design System
- Background: #F5F1E8 (cream)
- Dark: #1A1A1A
- Accent/Green: #2D5F4F
- All borders: 3px solid #1A1A1A, no border-radius
- Font: Cascadia Mono (monospace)
- CSS classes: retro-box, retro-box-dark, retro-box-green, retro-btn, retro-btn-primary

## Running locally
```bash
npm install
npm run dev
```
# Argen-Copilot
