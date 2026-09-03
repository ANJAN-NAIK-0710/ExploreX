import { Booking } from '../../src/types';
import { ENV } from '../config/env';

export class EmailService {
  private getFromAddress(): string {
    return ENV.RESEND_FROM_EMAIL || 'ExploreX Travel <onboarding@resend.dev>';
  }

  /**
   * Helper to dispatch email payload to Resend API
   */
  private async sendViaResend(to: string, subject: string, html: string): Promise<boolean> {
    const apiKey = ENV.RESEND_API_KEY;
    if (!apiKey || apiKey.includes('your_resend') || apiKey.includes('re_your_resend')) {
      console.log(`ℹ️ Resend API Key missing: Logged transactional email to ${to} [Subject: ${subject}]`);
      return false;
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          from: this.getFromAddress(),
          to: [to],
          subject,
          html
        })
      });

      if (response.ok) {
        console.log(`✅ Resend transactional email delivered to ${to} [${subject}]`);
        return true;
      } else {
        const errorData = await response.text();
        console.warn(`⚠️ Resend API responded with status ${response.status}:`, errorData);
        return false;
      }
    } catch (err) {
      console.warn('⚠️ Resend email dispatch notice (non-fatal):', err);
      return false;
    }
  }

  /**
   * Send ExploreX Booking Confirmation email via Resend API.
   */
  public async sendBookingConfirmationEmail(booking: Booking, userEmail?: string, userName?: string): Promise<boolean> {
    const recipient = userEmail || 'traveler@explorex.com';
    const name = userName || booking.passengerDetails?.[0]?.name || 'Valued Traveler';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">ExploreX Travel Platform</h1>
          <p style="margin: 4px 0 0 0; color: #38bdf8; font-size: 14px;">Booking Confirmation #${booking.id}</p>
        </div>

        <div style="padding: 24px; background-color: #ffffff; color: #334155; font-size: 14px; line-height: 1.6;">
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Namaste, ${name}!</h2>
          <p>Your travel reservation for <strong>${booking.title}</strong> has been successfully confirmed and paid.</p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; color: #64748b;">Destination:</td>
              <td style="padding: 10px; font-weight: bold; color: #0f172a;">${booking.destinationName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; color: #64748b;">Travel Date:</td>
              <td style="padding: 10px; color: #0f172a;">${booking.travelDate} ${booking.returnDate ? `to ${booking.returnDate}` : ''}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; color: #64748b;">Travelers:</td>
              <td style="padding: 10px; color: #0f172a;">${booking.passengersCount} Person(s)</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; color: #64748b;">Amount Paid:</td>
              <td style="padding: 10px; font-weight: bold; color: #0284c7;">₹${booking.totalAmount.toLocaleString('en-IN')} (${booking.paymentMethod.toUpperCase()})</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px; font-weight: bold; color: #64748b;">Payment Status:</td>
              <td style="padding: 10px; color: #16a34a; font-weight: bold;">CONFIRMED & VERIFIED</td>
            </tr>
          </table>

          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 20px;">
            <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 14px;">Cancellation & Support Policy:</h4>
            <p style="margin: 0; font-size: 12px; color: #64748b;">
              Free cancellation up to 48 hours before travel date. Instant 100% wallet refund. For 24/7 concierge support, reply to this email.
            </p>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
          ExploreX Smart Tourism Platform • Verified Multi-Modal Travel
        </div>
      </div>
    `;

    return this.sendViaResend(recipient, `Booking Confirmed #${booking.id} — ${booking.title}`, html);
  }

  /**
   * Send Signup Verification & Welcome email via Resend.
   */
  public async sendSignupVerificationEmail(email: string, name: string, verificationLink?: string): Promise<boolean> {
    const link = verificationLink || `${ENV.APP_URL}/auth/verify?email=${encodeURIComponent(email)}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">ExploreX Travel Platform</h1>
          <p style="margin: 4px 0 0 0; color: #38bdf8; font-size: 14px;">Welcome & Account Verification</p>
        </div>

        <div style="padding: 24px; background-color: #ffffff; color: #334155; font-size: 14px; line-height: 1.6;">
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Welcome aboard, ${name}!</h2>
          <p>Thank you for joining ExploreX. We are excited to have you explore authentic heritage, cultural specialties, and smart multi-modal itineraries across India.</p>

          <p style="margin: 20px 0;">To complete your account verification, please confirm your email address:</p>

          <div style="text-align: center; margin: 28px 0;">
            <a href="${link}" style="display: inline-block; background-color: #0284c7; color: #ffffff; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px;">
              Verify Email Address
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b;">
            If you did not create an ExploreX account, you can safely ignore this email.
          </p>
        </div>

        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
          ExploreX Smart Tourism Platform • Verified Multi-Modal Travel
        </div>
      </div>
    `;

    return this.sendViaResend(email, 'Welcome to ExploreX — Verify Your Account', html);
  }

  /**
   * Send Password Reset email via Resend.
   */
  public async sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">ExploreX Travel Platform</h1>
          <p style="margin: 4px 0 0 0; color: #38bdf8; font-size: 14px;">Password Reset Request</p>
        </div>

        <div style="padding: 24px; background-color: #ffffff; color: #334155; font-size: 14px; line-height: 1.6;">
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Reset Your Password</h2>
          <p>We received a request to reset your password for your ExploreX account (${email}).</p>

          <p style="margin: 20px 0;">Click the button below to choose a new password. This link will expire in 1 hour:</p>

          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetLink}" style="display: inline-block; background-color: #0284c7; color: #ffffff; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px;">
              Reset Password
            </a>
          </div>

          <p style="font-size: 12px; color: #64748b;">
            If you did not request this password reset, no action is required and your account remains secure.
          </p>
        </div>

        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
          ExploreX Smart Tourism Platform • Verified Multi-Modal Travel
        </div>
      </div>
    `;

    return this.sendViaResend(email, 'Reset Your ExploreX Password', html);
  }

  /**
   * Send Important Notification email via Resend.
   */
  public async sendImportantNotificationEmail(email: string, title: string, message: string): Promise<boolean> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #0f172a; padding: 24px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold;">ExploreX Travel Platform</h1>
          <p style="margin: 4px 0 0 0; color: #38bdf8; font-size: 14px;">Important Notification</p>
        </div>

        <div style="padding: 24px; background-color: #ffffff; color: #334155; font-size: 14px; line-height: 1.6;">
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">${title}</h2>
          <p style="margin: 16px 0; color: #334155;">${message}</p>
        </div>

        <div style="background-color: #f1f5f9; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
          ExploreX Smart Tourism Platform • Verified Multi-Modal Travel
        </div>
      </div>
    `;

    return this.sendViaResend(email, `ExploreX Notice: ${title}`, html);
  }
}

export const emailService = new EmailService();
