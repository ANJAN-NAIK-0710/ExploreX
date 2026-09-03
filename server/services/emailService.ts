import { Booking } from '../../src/types';
import { ENV } from '../config/env';

export class EmailService {
  /**
   * Send ExploreX Booking Confirmation email via Resend API.
   * Email failure does NOT invalidate the booking.
   */
  public async sendBookingConfirmationEmail(booking: Booking, userEmail?: string, userName?: string): Promise<boolean> {
    const apiKey = ENV.RESEND_API_KEY;
    const recipient = userEmail || 'traveler@explorex.com';
    const name = userName || booking.passengerDetails?.[0]?.name || 'Valued Traveler';

    if (!apiKey || apiKey.includes('your_resend')) {
      console.log(`ℹ️ Resend API Key missing: Logged confirmation for Booking #${booking.id} to ${recipient}`);
      return false;
    }

    try {
      const htmlContent = `
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
                <td style="padding: 10px; font-bold; color: #0f172a;">${booking.destinationName}</td>
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
                <td style="padding: 10px; font-bold; color: #0284c7;">$${booking.totalAmount} (${booking.paymentMethod.toUpperCase()})</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 10px; font-weight: bold; color: #64748b;">Payment Status:</td>
                <td style="padding: 10px; color: #16a34a; font-bold;">CONFIRMED & VERIFIED</td>
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

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          from: 'ExploreX Travel <confirmations@explorex.com>',
          to: [recipient],
          subject: `Booking Confirmed #${booking.id} — ${booking.title}`,
          html: htmlContent
        })
      });

      if (response.ok) {
        console.log(`✅ Resend confirmation email delivered to ${recipient}`);
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Resend email notification notice (non-fatal):', err);
      return false;
    }
  }
}

export const emailService = new EmailService();
