/**
 * Analytics Tracking System
 * Tracks user events for insights and metrics
 */

export interface AnalyticsEvent {
  event_type: string;
  event_name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

/**
 * Track a generic event
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    const payload: AnalyticsEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
    };

    // Send to analytics endpoint
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

/**
 * Track page view
 */
export async function trackPageView(
  pagePath: string,
  pageTitle?: string,
  referrer?: string
): Promise<void> {
  try {
    await fetch('/api/analytics/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_path: pagePath,
        page_title: pageTitle || document.title,
        referrer: referrer || document.referrer,
      }),
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
}

/**
 * Track user submission
 */
export async function trackSubmission(
  challengeId: string,
  score: number,
  mode: 'offline' | 'api'
): Promise<void> {
  await trackEvent({
    event_type: 'submission',
    event_name: 'prompt_submitted',
    properties: {
      challenge_id: challengeId,
      score,
      mode,
    },
  });
}

/**
 * Track challenge completion
 */
export async function trackChallengeCompletion(
  challengeId: string,
  difficulty: string,
  points: number,
  attempts: number
): Promise<void> {
  await trackEvent({
    event_type: 'achievement',
    event_name: 'challenge_completed',
    properties: {
      challenge_id: challengeId,
      difficulty,
      points,
      attempts,
    },
  });
}

/**
 * Track team creation
 */
export async function trackTeamCreation(teamName: string): Promise<void> {
  await trackEvent({
    event_type: 'user_action',
    event_name: 'team_created',
    properties: {
      team_name: teamName,
    },
  });
}

/**
 * Track payment event
 */
export async function trackPayment(
  plan: string,
  amount: number,
  billingCycle: string
): Promise<void> {
  await trackEvent({
    event_type: 'payment',
    event_name: 'subscription_created',
    properties: {
      plan,
      amount,
      billing_cycle: billingCycle,
    },
  });
}

/**
 * Track error event
 */
export async function trackError(
  errorType: string,
  message: string,
  context?: Record<string, any>
): Promise<void> {
  await trackEvent({
    event_type: 'error',
    event_name: errorType,
    properties: {
      message,
      ...context,
    },
  });
}

/**
 * Setup auto page view tracking
 * Call this in your app initialization
 */
export function setupAutoTracking(): void {
  // Track initial page load
  trackPageView(window.location.pathname);

  // Track page changes (for single-page apps)
  let lastPath = window.location.pathname;
  setInterval(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      trackPageView(currentPath);
      lastPath = currentPath;
    }
  }, 1000);
}

/**
 * Get user analytics summary
 */
export async function getUserAnalytics(): Promise<any> {
  try {
    const response = await fetch('/api/analytics/user');
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user analytics:', error);
    return null;
  }
}
