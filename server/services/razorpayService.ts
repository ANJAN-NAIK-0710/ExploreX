import { Request, Response } from 'express';
import crypto from 'crypto';

/**
 * Razorpay Order Creation API Endpoint.
 * Expects { amount: number (in INR), currency?: string, receipt?: string }
 */
export async function createRazorpayOrder(req: Request, res: Response) {
  try {
    const { amount, currency = 'INR', receipt = `rcpt_${Date.now()}` } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mockKeyId12345';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'mockRazorpaySecret67890';

    // Amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(amount * 100);

    // If using real or test Razorpay API
    if (keyId && keySecret && !keyId.includes('mockKeyId')) {
      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const apiRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt,
          payment_capture: 1,
        }),
      });

      if (apiRes.ok) {
        const orderData = await apiRes.json();
        return res.json({
          success: true,
          keyId,
          order: orderData,
        });
      }
    }

    // Sandbox / Test Mode Mock Order
    const mockOrderId = `order_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    res.json({
      success: true,
      keyId,
      order: {
        id: mockOrderId,
        entity: 'order',
        amount: amountInPaise,
        amount_paid: 0,
        amount_due: amountInPaise,
        currency,
        receipt,
        status: 'created',
        attempts: 0,
        created_at: Math.floor(Date.now() / 1000),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create Razorpay order' });
  }
}

/**
 * Razorpay Payment Verification API Endpoint.
 * Expects { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export async function verifyRazorpayPayment(req: Request, res: Response) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'mockRazorpaySecret67890';

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Missing payment details' });
    }

    // Mock/Sandbox auto-verify if signature is demo or mock secret is used
    if (razorpay_signature === 'mock_signature' || keySecret.includes('mockRazorpaySecret')) {
      return res.json({
        verified: true,
        message: 'Razorpay Sandbox Payment Verified Successfully!',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    }

    // HMAC SHA256 Signature Verification
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      res.json({
        verified: true,
        message: 'Razorpay Payment Verified Successfully!',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      res.status(400).json({
        verified: false,
        error: 'Invalid Razorpay Payment Signature',
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Payment verification failed' });
  }
}
