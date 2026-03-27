/**
 * Razorpay Service - Handles payment creation and verification
 */

import paymentApi from "./payment-api";

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  [key: string]: any;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  paymentId?: string;
  userId?: string;
  userType?: string;
}

export interface RazorpayConfig {
  key_id: string;
}

class RazorpayService {
  private keyId: string | null = null;

  constructor() {
    this.keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || null;
  }

  /**
   * Load Razorpay script dynamically
   */
  loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  /**
   * Get Razorpay key ID
   */
  getKeyId(): string | null {
    return this.keyId;
  }

  /**
   * Create a payment order on backend
   */
  async createOrder(
    amount: number,
    currency: string = "INR",
    receipt?: string,
    userId?: string,
    userType?: string
  ): Promise<RazorpayOrder> {
    try {
      const response = await paymentApi.createCheckout({
        amount,
        currency,
        purpose: "subscription",
        description: "LabourSampark profile payment",
        checkoutTtlMinutes: 15,
        metadata: {
          plan: userType || "standard",
          source: "web",
          receipt: receipt || `receipt_${Date.now()}`,
          userId: userId || "",
        },
        userId,
        userType: userType as "labour" | "contractor" | "sub_contractor" | undefined,
      });

      if (!response.success) {
        throw new Error(response.error || response.message || "Failed to create checkout");
      }

      const payload = response.data || {};
      const checkoutData = payload.data || payload;

      const orderId =
        checkoutData.razorpayOrderId ||
        checkoutData.order_id ||
        checkoutData.orderId ||
        checkoutData.id;

      const rawAmount = checkoutData.amountInPaise ?? checkoutData.amount;
      const amountInPaise =
        rawAmount !== undefined
          ? Number(rawAmount)
          : Math.round(amount * 100);

      const orderCurrency = checkoutData.currency || currency;

      if (!orderId) {
        throw new Error("Checkout API did not return a Razorpay order id");
      }

      if (Number.isNaN(amountInPaise) || amountInPaise <= 0) {
        throw new Error("Checkout API returned invalid amount");
      }

      return {
        ...checkoutData,
        id: orderId,
        amount: amountInPaise,
        currency: orderCurrency,
        receipt: checkoutData.receipt || receipt || `receipt_${Date.now()}`,
        paymentId: checkoutData.paymentId,
        razorpayKeyId: checkoutData.razorpayKeyId,
      };
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  /**
   * Verify payment signature on backend
   */
  async verifyPayment(
    paymentData: RazorpayPaymentResponse
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!paymentData.paymentId) {
        throw new Error("Missing paymentId for verification");
      }

      const response = await paymentApi.verifyPayment({
        paymentId: paymentData.paymentId,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        metadata: {
          client: "frontend-web",
        },
      });

      if (!response.success) {
        throw new Error(response.error || response.message || "Failed to verify payment");
      }

      const payload = response.data || {};
      return {
        success: Boolean(payload.success ?? true),
        message: payload.message || "Payment verified successfully",
      };
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  }

  /**
   * Record payment failure for debugging
   */
  async recordFailure(
    payload: {
      paymentId?: string;
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
  ): Promise<void> {
    try {
      if (!payload.paymentId) {
        console.warn("Skipping payment failure record: missing paymentId");
        return;
      }

      const response = await paymentApi.recordPaymentFailure({
        paymentId: payload.paymentId,
        razorpay_order_id: payload.razorpay_order_id,
        razorpay_payment_id: payload.razorpay_payment_id,
        status: payload.status,
        error: payload.error,
        metadata: {
          client: "frontend-web",
          ...(payload.metadata || {}),
        },
      });

      if (!response.success) {
        console.warn("Failed to record payment failure");
      }
    } catch (error) {
      console.error("Error recording payment failure:", error);
      // Don't throw - this is just for logging
    }
  }

  /**
   * Open Razorpay payment modal
   */
  openPayment(
    order: RazorpayOrder,
    userDetails: {
      name: string;
      email: string;
      phone: string;
      userId?: string;
      userType?: string;
    },
    onSuccess: (response: RazorpayPaymentResponse) => void,
    onError: (error: string) => void
  ): void {
    const keyId = order.razorpayKeyId || this.getKeyId();
    if (!keyId) {
      onError("Razorpay key not configured");
      return;
    }

    const options = {
      key: keyId,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      name: "LabourSampark",
      description: "Professional Verification Fee",
      image: "/images/logo.jpg",
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone,
      },
      handler: (response: RazorpayPaymentResponse) => {
        console.log("Payment successful:", response);
        onSuccess({
          ...response,
          paymentId: order.paymentId,
          userId: userDetails.userId,
          userType: userDetails.userType,
        });
      },
      modal: {
        ondismiss: () => {
          const errorMsg = "Payment cancelled by user";
          this.recordFailure(
            {
              paymentId: order.paymentId,
              razorpay_order_id: order.id,
              status: "cancelled",
              error: {
                code: "CHECKOUT_CLOSED",
                description: errorMsg,
                source: "customer",
                step: "checkout",
                reason: "user_cancelled",
              },
            }
          );
          onError(errorMsg);
        },
      },
      timeout: 500, // 5 minutes in seconds
      notes: {
        userId: userDetails.userId || "",
        userType: userDetails.userType || "",
        timestamp: new Date().toISOString(),
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", (response: any) => {
      const errorMsg =
        response.error?.description || "Payment failed. Please try again.";
      console.error("Payment failed:", response);
      this.recordFailure(
        {
          paymentId: order.paymentId,
          razorpay_order_id: order.id,
          razorpay_payment_id: response?.error?.metadata?.payment_id,
          status: "failed",
          error: {
            code: response?.error?.code,
            description: errorMsg,
            source: response?.error?.source,
            step: response?.error?.step,
            reason: response?.error?.reason,
            metadata: {
              order_id: response?.error?.metadata?.order_id,
              payment_id: response?.error?.metadata?.payment_id,
            },
          },
        }
      );
      onError(errorMsg);
    });

    rzp.open();
  }
}

export default new RazorpayService();
