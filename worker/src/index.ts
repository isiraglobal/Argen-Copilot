import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { verifyJWT, requireAuth } from './middleware/auth';
import { rateLimit } from './middleware/rateLimit';
import { initializeDB } from './lib/db';

// Import handlers
import * as teamHandlers from './handlers/teams';
import * as courseHandlers from './handlers/courses';
import * as submissionHandlers from './handlers/submissions';
import * as paymentHandlers from './handlers/payments';
import * as emailHandlers from './handlers/email';
import * as analyticsHandlers from './handlers/analytics';
import * as governanceHandlers from './handlers/governance';
import * as adminHandlers from './handlers/admin';
import * as challengeHandlers from './handlers/challenges';

interface HonoEnv {
  Bindings: {
    DB: D1Database;
  };
}

const app = new Hono<HonoEnv>();

// Middleware
app.use(logger());

// CORS - restrict to Cloudflare Pages domain
const allowedOrigins = [
  'https://argen.pages.dev',
  'http://localhost:5173', // Vite dev
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin) => {
      if (!origin) return '*';
      return allowedOrigins.some((allowed) => origin.includes(allowed)) ? origin : '';
    },
    credentials: true,
  })
);

// ============================================================================
// PUBLIC ROUTES (No auth required)
// ============================================================================

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/public/challenges', (c) => {
  return c.json({ challenges: [], total: 0 });
});

app.get('/api/whop/plans', (c) => 
  paymentHandlers.getWhopPlans(c)
);

// ============================================================================
// USER ROUTES
// ============================================================================

app.get('/api/user/profile', (c) =>
  requireAuth(async (c, userId) => {
    return c.json({
      id: userId,
      email: 'user@example.com',
      name: 'User',
      plan_type: 'free',
      plan_name: 'Explorer',
    });
  })(c)
);

app.get('/api/user/quota', (c) =>
  requireAuth(async (c, userId) => {
    return c.json({
      monthly_limit: 5,
      used_this_month: 0,
      remaining: 5,
      percentage_used: 0,
      can_use_api: true,
      next_reset_date: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    });
  })(c)
);

// ============================================================================
// CHALLENGE ROUTES
// ============================================================================

app.get('/api/challenges', (c) => {
  const db = initializeDB(c.env);
  return challengeHandlers.getChallenges(c, db);
});

app.post('/api/challenges', (c) =>
  requireAuth(async (c, userId) => {
    const db = initializeDB(c.env);
    return challengeHandlers.createChallenge(c, db, userId);
  })(c)
);

app.get('/api/challenges/:id', (c) =>
  requireAuth(async (c, userId) => {
    const db = initializeDB(c.env);
    return challengeHandlers.getChallenge(c, db, userId);
  })(c)
);

app.get('/api/challenges/categories', (c) => {
  const db = initializeDB(c.env);
  return challengeHandlers.getCategories(c, db);
});

app.get('/api/challenges/difficulties', (c) => {
  const db = initializeDB(c.env);
  return challengeHandlers.getDifficulties(c, db);
});

app.get('/api/user/progress/:challengeId', (c) =>
  requireAuth(async (c, userId) => {
    const db = initializeDB(c.env);
    return challengeHandlers.getUserProgress(c, db, userId);
  })(c)
);

// ============================================================================
// SUBMISSION ROUTES
// ============================================================================

app.post('/api/submissions', rateLimit(10, 60), (c) =>
  requireAuth(async (c, userId) => submissionHandlers.submitPrompt(c, userId))(c)
);

app.get('/api/submissions', (c) =>
  requireAuth(async (c, userId) => submissionHandlers.listSubmissions(c, userId))(c)
);

app.get('/api/submissions/:id', (c) =>
  requireAuth(async (c, userId) => submissionHandlers.getSubmission(c, userId))(c)
);

app.delete('/api/submissions/:id', (c) =>
  requireAuth(async (c, userId) => submissionHandlers.deleteSubmission(c, userId))(c)
);

app.post('/api/submissions/:id/evaluate', (c) =>
  requireAuth(async (c, userId) => submissionHandlers.evaluateSubmission(c, userId))(c)
);

app.get('/api/submissions/stats/user', (c) =>
  requireAuth(async (c, userId) => submissionHandlers.getSubmissionStats(c, userId))(c)
);

// ============================================================================
// TEAM ROUTES
// ============================================================================

app.post('/api/teams', (c) =>
  requireAuth(async (c, userId) => teamHandlers.createTeam(c, userId))(c)
);

app.get('/api/teams', (c) =>
  requireAuth(async (c, userId) => teamHandlers.listTeams(c, userId))(c)
);

app.get('/api/teams/:id', (c) =>
  requireAuth(async (c, userId) => teamHandlers.getTeam(c, userId))(c)
);

app.patch('/api/teams/:id', (c) =>
  requireAuth(async (c, userId) => teamHandlers.updateTeam(c, userId))(c)
);

app.delete('/api/teams/:id', (c) =>
  requireAuth(async (c, userId) => teamHandlers.deleteTeam(c, userId))(c)
);

app.post('/api/teams/:id/members', (c) =>
  requireAuth(async (c, userId) => teamHandlers.addTeamMember(c, userId))(c)
);

app.delete('/api/teams/:id/members/:memberId', (c) =>
  requireAuth(async (c, userId) => teamHandlers.removeTeamMember(c, userId))(c)
);

app.post('/api/teams/join', (c) =>
  requireAuth(async (c, userId) => teamHandlers.joinTeam(c, userId))(c)
);

// ============================================================================
// COURSE ROUTES
// ============================================================================

app.post('/api/courses', (c) =>
  requireAuth(async (c, userId) => courseHandlers.createCourse(c, userId))(c)
);

app.get('/api/courses', (c) =>
  requireAuth(async (c, userId) => courseHandlers.listCourses(c, userId))(c)
);

app.get('/api/courses/:id', (c) =>
  requireAuth(async (c, userId) => courseHandlers.getCourse(c, userId))(c)
);

app.patch('/api/courses/:id', (c) =>
  requireAuth(async (c, userId) => courseHandlers.updateCourse(c, userId))(c)
);

app.delete('/api/courses/:id', (c) =>
  requireAuth(async (c, userId) => courseHandlers.deleteCourse(c, userId))(c)
);

app.post('/api/courses/:id/progress', (c) =>
  requireAuth(async (c, userId) => courseHandlers.updateCourseProgress(c, userId))(c)
);

// ============================================================================
// PAYMENT ROUTES
// ============================================================================

app.post('/api/payments/checkout', (c) =>
  requireAuth(async (c, userId) => paymentHandlers.createCheckout(c, userId))(c)
);

app.get('/api/payments/subscription', (c) =>
  requireAuth(async (c, userId) => paymentHandlers.getUserSubscription(c, userId))(c)
);

app.post('/api/payments/sync', (c) =>
  requireAuth(async (c, userId) => paymentHandlers.syncWhopSubscription(c, userId))(c)
);

app.post('/api/payments/cancel', (c) =>
  requireAuth(async (c, userId) => paymentHandlers.cancelSubscription(c, userId))(c)
);

app.post('/api/whop/webhook', (c) =>
  paymentHandlers.handleWhopWebhook(c)
);

// ============================================================================
// EMAIL ROUTES
// ============================================================================

app.post('/api/email/send', (c) =>
  requireAuth(async (c, userId) => emailHandlers.sendEmail(c, userId))(c)
);

app.post('/api/email/confirm', (c) =>
  requireAuth(async (c, userId) => emailHandlers.sendConfirmationEmail(c, userId))(c)
);

app.post('/api/email/invite', (c) =>
  requireAuth(async (c, userId) => emailHandlers.sendInvitationEmail(c, userId))(c)
);

app.post('/api/email/notify', (c) =>
  requireAuth(async (c, userId) => emailHandlers.sendNotificationEmail(c, userId))(c)
);

app.get('/api/email/verify', (c) =>
  emailHandlers.verifyEmailConfirmation(c)
);

// ============================================================================
// ANALYTICS ROUTES
// ============================================================================

app.post('/api/analytics/track', (c) =>
  requireAuth(async (c, userId) => analyticsHandlers.trackEvent(c, userId))(c)
);

app.post('/api/analytics/page-view', (c) =>
  requireAuth(async (c, userId) => analyticsHandlers.trackPageView(c, userId))(c)
);

app.get('/api/analytics/dashboard', (c) =>
  requireAuth(async (c, userId) => analyticsHandlers.getAnalytics(c, userId))(c)
);

app.get('/api/analytics/page/:page', (c) =>
  requireAuth(async (c, userId) => analyticsHandlers.getPageViewStats(c, userId))(c)
);

app.get('/api/analytics/user', (c) =>
  requireAuth(async (c, userId) => analyticsHandlers.getUserAnalytics(c, userId))(c)
);

app.get('/api/analytics/events', (c) =>
  requireAuth(async (c, userId) => analyticsHandlers.getEventLog(c, userId))(c)
);

app.get('/api/analytics/funnel', (c) =>
  analyticsHandlers.getConversionFunnel(c)
);

// ============================================================================
// GOVERNANCE ROUTES
// ============================================================================

app.get('/api/governance/audit-log', (c) =>
  requireAuth(async (c, userId) => governanceHandlers.getAuditLog(c, userId))(c)
);

app.post('/api/governance/audit-log', (c) =>
  requireAuth(async (c, userId) => governanceHandlers.logAuditEvent(c, userId))(c)
);

app.post('/api/governance/decisions', (c) =>
  requireAuth(async (c, userId) => governanceHandlers.createAIDecision(c, userId))(c)
);

app.get('/api/governance/decisions', (c) =>
  requireAuth(async (c, userId) => governanceHandlers.getAIDecisions(c, userId))(c)
);

app.get('/api/governance/settings', (c) =>
  governanceHandlers.getGovernanceSettings(c)
);

app.patch('/api/governance/settings', (c) =>
  requireAuth(async (c, userId) => governanceHandlers.updateGovernanceSettings(c))(c)
);

app.get('/api/governance/compliance', (c) =>
  requireAuth(async (c, userId) => governanceHandlers.getComplianceReport(c, userId))(c)
);

// ============================================================================
// ADMIN ROUTES
// ============================================================================

app.get('/api/admin/users', (c) =>
  requireAuth(async (c, userId) => adminHandlers.listAdminUsers(c, userId))(c)
);

app.get('/api/admin/stats', (c) =>
  requireAuth(async (c, userId) => adminHandlers.getAdminStats(c, userId))(c)
);

app.post('/api/admin/users/suspend', (c) =>
  requireAuth(async (c, userId) => adminHandlers.suspendUser(c, userId))(c)
);

app.post('/api/admin/users/unsuspend', (c) =>
  requireAuth(async (c, userId) => adminHandlers.unsuspendUser(c, userId))(c)
);

app.post('/api/admin/users/delete', (c) =>
  requireAuth(async (c, userId) => adminHandlers.deleteUserData(c, userId))(c)
);

app.get('/api/admin/export/:user_id', (c) =>
  requireAuth(async (c, userId) => adminHandlers.exportUserData(c, userId))(c)
);

app.get('/api/admin/health', (c) =>
  requireAuth(async (c, userId) => adminHandlers.getSystemHealth(c, userId))(c)
);

app.get('/api/admin/approvals', (c) =>
  requireAuth(async (c, userId) => adminHandlers.getPendingApprovals(c, userId))(c)
);

// ============================================================================
// NOTIFICATION ROUTES
// ============================================================================

app.get('/api/notifications', (c) =>
  requireAuth(async (c, userId) => {
    return c.json({ notifications: [] });
  })(c)
);

app.patch('/api/notifications/:id', (c) =>
  requireAuth(async (c, userId) => {
    return c.json({ success: true });
  })(c)
);

// ============================================================================
// 404 FALLBACK
// ============================================================================

app.all('*', (c) => {
  return c.json({ error: 'Not Found' }, 404);
});

export default app;
