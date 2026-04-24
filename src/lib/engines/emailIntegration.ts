/**
 * Email Integration (Resend)
 * Handles all email sending operations
 */

export interface EmailTemplate {
  name: string;
  subject: string;
  html: string;
}

/**
 * Send confirmation email
 */
export async function sendConfirmationEmail(email: string): Promise<boolean> {
  try {
    const response = await fetch('/api/email/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error('Failed to send confirmation email');
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
}

/**
 * Send team invitation email
 */
export async function sendTeamInvitation(
  teamId: string,
  recipientEmail: string,
  senderName: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/email/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        team_id: teamId,
        recipient_email: recipientEmail,
        sender_name: senderName,
      }),
    });

    if (!response.ok) throw new Error('Failed to send invitation');
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to send team invitation:', error);
    return false;
  }
}

/**
 * Send submission evaluation email
 */
export async function sendEvaluationEmail(
  recipientEmail: string,
  challengeTitle: string,
  score: number,
  feedback: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/email/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: recipientEmail,
        notification_type: 'submission_evaluated',
        data: {
          challenge_title: challengeTitle,
          score,
          feedback,
        },
      }),
    });

    if (!response.ok) throw new Error('Failed to send evaluation email');
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to send evaluation email:', error);
    return false;
  }
}

/**
 * Send challenge completion email
 */
export async function sendChallengeCompletionEmail(
  recipientEmail: string,
  challengeTitle: string,
  points: number
): Promise<boolean> {
  try {
    const response = await fetch('/api/email/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: recipientEmail,
        notification_type: 'challenge_completed',
        data: {
          challenge_title: challengeTitle,
          points,
        },
      }),
    });

    if (!response.ok) throw new Error('Failed to send completion email');
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to send completion email:', error);
    return false;
  }
}

/**
 * Send quota warning email
 */
export async function sendQuotaWarningEmail(
  recipientEmail: string,
  percentageUsed: number,
  remainingCredits: number
): Promise<boolean> {
  try {
    const response = await fetch('/api/email/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: recipientEmail,
        notification_type: 'quota_warning',
        data: {
          percentage_used: percentageUsed,
          remaining_credits: remainingCredits,
        },
      }),
    });

    if (!response.ok) throw new Error('Failed to send quota warning');
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to send quota warning:', error);
    return false;
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  recipientEmail: string,
  userName: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/email/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: recipientEmail,
        notification_type: 'welcome',
        data: {
          user_name: userName,
        },
      }),
    });

    if (!response.ok) throw new Error('Failed to send welcome email');
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  recipientEmail: string,
  resetLink: string
): Promise<boolean> {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: recipientEmail,
        subject: 'Reset Your Password',
        template: 'password_reset',
        data: { reset_link: resetLink },
      }),
    });

    if (!response.ok) throw new Error('Failed to send password reset email');
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return false;
  }
}

/**
 * Verify email confirmation token
 */
export async function verifyEmailConfirmation(token: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/email/verify?token=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Failed to verify email');
    const data = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Failed to verify email:', error);
    return false;
  }
}
