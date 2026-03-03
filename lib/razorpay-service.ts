/**
 * Razorpay Service - Handles payment creation and verification
 */

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
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to paise
          currency,
          receipt: receipt || `receipt_${Date.now()}`,
          userId,
          userType,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
      }

      const data = await response.json();
      return data.order;
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
      const response = await fetch("/api/payments/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error(`Failed to verify payment: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
    }
  }

  /**
   * Record payment failure for debugging
   */
  async recordFailure(
    orderId: string,
    error: string,
    userId?: string,
    userType?: string
  ): Promise<void> {
    try {
      const response = await fetch("/api/payments/failure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          error,
          userId,
          userType,
        }),
      });

      if (!response.ok) {
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
    const keyId = this.getKeyId();
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
        onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          const errorMsg = "Payment cancelled by user";
          this.recordFailure(
            order.id,
            errorMsg,
            userDetails.userId,
            userDetails.userType
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
        order.id,
        errorMsg,
        userDetails.userId,
        userDetails.userType
      );
      onError(errorMsg);
    });

    rzp.open();
  }
}

export default new RazorpayService();
