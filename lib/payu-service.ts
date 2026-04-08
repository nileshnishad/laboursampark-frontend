/**
 * PayU Payment Service
 * Handles payment link creation and redirection via backend API.
 */

import { apiPost } from "./api-service";

// ─── Config (reads from env at call-time so it always picks up .env.local) ───

const getApiBase = (): string =>
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

const getSuccessUrl = (): string =>
  process.env.NEXT_PUBLIC_PAYU_SUCCESS_URL ||
  `${typeof window !== "undefined" ? window.location.origin : ""}/payment/success`;

const getFailureUrl = (): string =>
  process.env.NEXT_PUBLIC_PAYU_FAILURE_URL ||
  `${typeof window !== "undefined" ? window.location.origin : ""}/payment/failure`;

// ─── Types ────────────────────────────────────────────────────────────────────

export type PayUPurpose = "subscription" | "renewal" | "upgrade";

export interface PayUCreateLinkPayload {
  amount: number;
  productInfo: string;
  purpose: PayUPurpose;
  description?: string;
  successUrl?: string;
  failureUrl?: string;
}

export interface PayUCreateLinkResponse {
  paymentUrl: string;  // normalised from API's paymentLink field
  paymentLink: string; // raw value from API
  txnId: string;
  paymentId: string;
  gateway: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

export type PayULinkStatus = "idle" | "loading" | "success" | "error";

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Creates a PayU payment link by calling the backend.
 * On success returns the payment URL to redirect the user to.
 *
 * @throws Error with a user-friendly message on any failure
 */
export async function createPayULink(
  payload: PayUCreateLinkPayload
): Promise<PayUCreateLinkResponse> {
  const body = {
    amount: payload.amount,
    productInfo: payload.productInfo,
    purpose: payload.purpose,
    description: payload.description || payload.productInfo,
    successUrl: payload.successUrl || getSuccessUrl(),
    failureUrl: payload.failureUrl || getFailureUrl(),
  };

  const response = await apiPost<any>(
    "/api/payments/payu/create-link",
    body,
    { baseUrl: getApiBase(), timeout: 15000 }
  );

  if (!response.success) {
    const msg =
      response.error ||
      response.message ||
      "Failed to initiate payment. Please try again.";
    throw new Error(msg);
  }

  // Actual response shape: { success, message, data: { paymentLink, txnId, paymentId, gateway, amount, currency, expiresAt } }
  const d: any = (response.data as any)?.data ?? response.data ?? {};
  const paymentLink: string =
    d.paymentLink ||
    d.paymentUrl ||
    d.payment_link ||
    d.payment_url ||
    "";

  if (!paymentLink) {
    throw new Error("Payment gateway did not return a redirect URL.");
  }

  return {
    paymentUrl: paymentLink, // alias for easy use in redirect
    paymentLink,
    txnId: d.txnId || "",
    paymentId: d.paymentId || "",
    gateway: d.gateway || "payu",
    amount: Number(d.amount ?? 0),
    currency: d.currency || "INR",
    expiresAt: d.expiresAt || "",
  };
}

/**
 * Build the standard payload for a visibility/subscription payment.
 */
export function buildSubscriptionPayload(
  userType: "labour" | "contractor" | "sub_contractor",
  amount: number
): PayUCreateLinkPayload {
  const labelMap: Record<string, string> = {
    labour: "Labour",
    contractor: "Contractor",
    sub_contractor: "Sub-Contractor",
  };
  const label = labelMap[userType] ?? "User";

  return {
    amount,
    productInfo: `${label} profile visibility – LabourSampark`,
    purpose: "subscription",
    description: `3-month profile visibility subscription for ${label} on LabourSampark`,
  };
}
