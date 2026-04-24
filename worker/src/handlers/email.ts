import { Context } from 'hono';

export async function sendEmail(c: Context, userId: string) {
  try {
    const { recipient, subject, template, data } = await c.req.json();

    if (!recipient || !subject || !template) {
      return c.json(
        { error: 'Recipient, subject, and template are required' },
        400
      );
    }

    // TODO: Send email via Resend API
    // const resend = new Resend(RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@argen.dev',
    //   to: recipient,
    //   subject,
    //   html: renderTemplate(template, data),
    // });

    return c.json({
      success: true,
      email_id: `email_${Date.now()}`,
      recipient,
      subject,
      sent_at: new Date().toISOString(),
    }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to send email' }, 500);
  }
}

export async function sendConfirmationEmail(c: Context, userId: string) {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    // TODO: Send confirmation email via Resend
    // Generate confirmation token
    const confirmationToken = Buffer.from(`${userId}:${Date.now()}`).toString(
      'base64'
    );

    return c.json({
      success: true,
      email,
      confirmation_sent: true,
      expires_in: 24 * 60 * 60, // 24 hours
      sent_at: new Date().toISOString(),
    }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to send confirmation email' }, 500);
  }
}

export async function sendInvitationEmail(c: Context, userId: string) {
  try {
    const { team_id, recipient_email, sender_name } = await c.req.json();

    if (!team_id || !recipient_email) {
      return c.json(
        { error: 'Team ID and recipient email are required' },
        400
      );
    }

    // Generate invitation link
    const invitationCode = Buffer.from(`${team_id}:${recipient_email}:${Date.now()}`).toString(
      'base64'
    );

    // TODO: Send invitation email via Resend

    return c.json({
      success: true,
      recipient_email,
      team_id,
      invitation_sent: true,
      expires_in: 7 * 24 * 60 * 60, // 7 days
      sent_at: new Date().toISOString(),
    }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to send invitation email' }, 500);
  }
}

export async function sendNotificationEmail(c: Context, userId: string) {
  try {
    const { recipient, notification_type, data } = await c.req.json();

    // TODO: Send notification email via Resend
    // Different templates for different types:
    // - submission_evaluated
    // - challenge_solved
    // - team_invitation
    // - quota_warning
    // - course_progress

    return c.json({
      success: true,
      recipient,
      notification_type,
      sent_at: new Date().toISOString(),
    }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to send notification email' }, 500);
  }
}

export async function verifyEmailConfirmation(c: Context) {
  try {
    const { token } = c.req.query();

    if (!token) {
      return c.json({ error: 'Token is required' }, 400);
    }

    // TODO: Decode token, verify user, mark email as confirmed
    const decoded = Buffer.from(token as string, 'base64').toString();
    const [userId, timestamp] = decoded.split(':');

    // Check if token is not expired (24 hours)
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > 24 * 60 * 60 * 1000) {
      return c.json({ error: 'Token has expired' }, 400);
    }

    // TODO: Mark user email as confirmed in D1

    return c.json({
      success: true,
      user_id: userId,
      email_confirmed: true,
      confirmed_at: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({ error: 'Failed to verify email' }, 500);
  }
}
