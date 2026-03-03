/**
 * Payment API Endpoints Configuration
 * Routes for payment operations (create order, verify payment, etc.)
 */

import { apiService } from "./api-service";

interface CreateOrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
  userType?: string;
  userId?: string;
}

interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  userId?: string;
  userType?: string;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  order?: any;
  data?: any;
}

export const paymentApi = {
  /**
   * Create a payment order via Razorpay
   * Backend should use Razorpay API to create order
   */
  createOrder: (data: CreateOrderRequest): Promise<any> =>
    apiService.post("/payments/create-order", data, {
      includeToken: true,
    }),

  /**
   * Verify payment signature
   * Backend should verify with Razorpay using secret key
   */
  verifyPayment: (data: VerifyPaymentRequest): Promise<any> =>
    apiService.post("/payments/verify-payment", data, {
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
  recordPaymentFailure: (data: {
    orderId: string;
    error: string;
    userId?: string;
  }): Promise<any> =>
    apiService.post("/payments/failure", data, {
      includeToken: true,
    }),
};

export default paymentApi;
