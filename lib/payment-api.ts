/**
 * Payment API Endpoints Configuration
 * Routes for payment operations (create order, verify payment, etc.)
 */

import { apiService } from "./api-service";

interface CreateCheckoutRequest {
  amount: number;
  currency?: string;
  purpose?: string;
  description?: string;
  checkoutTtlMinutes?: number;
  metadata?: Record<string, unknown>;
  userType?: "labour" | "contractor" | "sub_contractor";
  userId?: string;
}

interface VerifyPaymentRequest {
  paymentId: string;
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  metadata?: Record<string, unknown>;
}

interface RecordPaymentFailureRequest {
  paymentId: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  status: "failed" | "cancelled" | "expired";
  error: {
    code?: string;
    description: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>;
}

export const paymentApi = {
  /**
   * Create checkout session/order via backend checkout API
   */
  createCheckout: (data: CreateCheckoutRequest): Promise<any> =>
    apiService.post("/api/payments/checkout", data, {
      includeToken: true,
    }),

  /**
   * Verify payment signature
   * Backend should verify with Razorpay using secret key
   */
  verifyPayment: (data: VerifyPaymentRequest): Promise<any> =>
    apiService.post("/api/payments/verify", data, {
      includeToken: true,
    }),

  /**
   * Get payment history for user
   */
  getPaymentHistory: (userId: string): Promise<any> =>
    apiService.get(`/payments/history/${userId}`, {
      includeToken: true,
    }),

  /**
   * Check if user has active subscription
   */
  checkSubscriptionStatus: (userId: string): Promise<any> =>
    apiService.get(`/payments/subscription-status/${userId}`, {
      includeToken: true,
    }),

  /**
   * Get payment details
   */
  getPaymentDetails: (paymentId: string): Promise<any> =>
    apiService.get(`/payments/${paymentId}`, {
      includeToken: true,
    }),

  /**
   * Handle payment failure
   */
  recordPaymentFailure: (data: RecordPaymentFailureRequest): Promise<any> =>
    apiService.post("/api/payments/failure", data, {
      includeToken: true,
    }),
};

export default paymentApi;
