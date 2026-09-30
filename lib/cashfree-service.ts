import { apiDelete, apiGet, apiPost } from "./api-service";

export type CashfreePaymentState = "SUCCESS" | "PENDING" | "FAILED" | "CANCELLED" | "UNKNOWN";
export type CashfreePurpose = "subscription" | "renewal" | "upgrade";
export type CashfreeTransferMode = "imps" | "neft" | "rtgs" | "upi";

export interface CashfreeOrderRequest {
  amount: number;
  productInfo: string;
  purpose: CashfreePurpose;
  description?: string;
  metadata?: Record<string, string>;
}

export interface CashfreeOrderResponse {
  paymentId: string;
  paymentSessionId: string;
  orderId?: string;
  amount: number;
  currency: string;
}

export interface CashfreePaymentStatus {
  paymentId: string;
  status: CashfreePaymentState;
  amount: number;
  currency: string;
  productInfo?: string;
  message?: string;
}

export interface CashfreeRefundRequest {
  amount: number;
  note?: string;
}

export interface CashfreeRefundResponse {
  refundId: string;
  paymentId: string;
  amount: number;
  status: string;
}

export interface CashfreeBeneficiaryRequest {
  beneficiaryId: string;
  name: string;
  email: string;
  phone: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  vpa?: string;
}

export interface CashfreePayoutRequest {
  beneficiaryId: string;
  amount: number;
  transferMode: CashfreeTransferMode;
}

export interface CashfreePayoutResponse {
  payoutId: string;
  beneficiaryId: string;
  amount: number;
  status: string;
  transferMode?: CashfreeTransferMode;
}

export interface CashfreeApiError {
  status?: number;
  message: string;
}

const getApiBase = (): string => process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

const unwrap = <T>(data: unknown): T => {
  const response = data as { data?: T } | T;
  return (response && typeof response === "object" && "data" in response
    ? response.data
    : response) as T;
};

const requestId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const ensureSuccess = <T>(response: { success: boolean; data?: unknown; error?: string; message?: string; status?: number }): T => {
  if (!response.success) {
    throw { status: response.status, message: response.error || response.message || "Cashfree request failed." } satisfies CashfreeApiError;
  }
  return unwrap<T>(response.data);
};

const normaliseStatus = (value: unknown): CashfreePaymentState => {
  const status = String(value || "UNKNOWN").toUpperCase();
  if (["SUCCESS", "PAID", "COMPLETED"].includes(status)) return "SUCCESS";
  if (["PENDING", "ACTIVE", "PROCESSING"].includes(status)) return "PENDING";
  if (["FAILED", "ERROR", "REJECTED"].includes(status)) return "FAILED";
  if (["CANCELLED", "CANCELED"].includes(status)) return "CANCELLED";
  return "UNKNOWN";
};

export async function createCashfreeOrder(payload: CashfreeOrderRequest): Promise<CashfreeOrderResponse> {
  const response = await apiPost("/api/cashfree/orders", payload, {
    baseUrl: getApiBase(),
    timeout: 15000,
    headers: { "x-idempotency-key": requestId() },
  });
  const data = ensureSuccess<Record<string, unknown>>(response);
  const paymentSessionId = String(data.paymentSessionId || data.payment_session_id || "");
  if (!paymentSessionId) throw new Error("Cashfree did not return a payment session.");
  return {
    paymentId: String(data.paymentId || data.payment_id || data.id || ""),
    paymentSessionId,
    orderId: data.orderId ? String(data.orderId) : undefined,
    amount: Number(data.amount ?? payload.amount),
    currency: String(data.currency || "INR"),
  };
}

export async function getCashfreePaymentStatus(paymentId: string): Promise<CashfreePaymentStatus> {
  const response = await apiGet(`/api/cashfree/orders/${encodeURIComponent(paymentId)}/status`, { baseUrl: getApiBase() });
  const data = ensureSuccess<Record<string, unknown>>(response);
  return {
    paymentId: String(data.paymentId || data.payment_id || paymentId),
    status: normaliseStatus(data.status || data.paymentStatus || data.payment_status),
    amount: Number(data.amount ?? 0),
    currency: String(data.currency || "INR"),
    productInfo: data.productInfo ? String(data.productInfo) : undefined,
    message: data.message ? String(data.message) : undefined,
  };
}

export const createCashfreeRefund = (paymentId: string, payload: CashfreeRefundRequest) =>
  apiPost(`/api/cashfree/payments/${encodeURIComponent(paymentId)}/refund`, payload, { baseUrl: getApiBase(), headers: { "x-idempotency-key": requestId() } });
export const getCashfreeRefund = (paymentId: string) =>
  apiGet(`/api/cashfree/payments/${encodeURIComponent(paymentId)}/refund`, { baseUrl: getApiBase() });
export const createCashfreeBeneficiary = (payload: CashfreeBeneficiaryRequest) =>
  apiPost("/api/cashfree/beneficiaries", payload, { baseUrl: getApiBase() });
export const getCashfreeBeneficiary = (beneficiaryId: string) =>
  apiGet(`/api/cashfree/beneficiaries/${encodeURIComponent(beneficiaryId)}`, { baseUrl: getApiBase() });
export const deleteCashfreeBeneficiary = (beneficiaryId: string) =>
  apiDelete(`/api/cashfree/beneficiaries/${encodeURIComponent(beneficiaryId)}`, { baseUrl: getApiBase() });
export const createCashfreePayout = (payload: CashfreePayoutRequest) =>
  apiPost("/api/cashfree/payouts", payload, { baseUrl: getApiBase(), headers: { "x-idempotency-key": requestId() } });
export const getCashfreePayouts = () => apiGet("/api/cashfree/payouts", { baseUrl: getApiBase() });
export const getCashfreePayout = (payoutId: string) => apiGet(`/api/cashfree/payouts/${encodeURIComponent(payoutId)}`, { baseUrl: getApiBase() });
export const retryCashfreePayout = (payoutId: string) => apiPost(`/api/cashfree/payouts/${encodeURIComponent(payoutId)}/retry`, {}, { baseUrl: getApiBase(), headers: { "x-idempotency-key": requestId() } });