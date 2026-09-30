"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getCashfreePaymentStatus, type CashfreePaymentStatus } from "@/lib/cashfree-service";

const statusText: Record<string, { title: string; body: string; tone: string }> = {
  SUCCESS: { title: "Payment Successful", body: "Your payment is confirmed. Your account benefits will update shortly.", tone: "text-green-700" },
  FAILED: { title: "Payment Failed", body: "The payment was not confirmed. You can safely try again.", tone: "text-red-700" },
  CANCELLED: { title: "Payment Cancelled", body: "No payment was confirmed. You can return and try again when ready.", tone: "text-amber-700" },
  PENDING: { title: "Payment Processing", body: "The backend is still confirming your payment. Refresh this page in a moment.", tone: "text-blue-700" },
  UNKNOWN: { title: "Payment Status Unavailable", body: "We could not determine the final payment state yet.", tone: "text-slate-700" },
};

export default function CashfreeStatusPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId") || "";
  const [status, setStatus] = useState<CashfreePaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!paymentId) {
      setError("Missing payment reference.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setStatus(await getCashfreePaymentStatus(paymentId));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not verify payment status.");
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const display = statusText[status?.status || "UNKNOWN"];
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-16">
      <section className="mx-auto max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg dark:bg-gray-900">
        <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">Cashfree payment</p>
        <h1 className={`mt-3 text-3xl font-bold ${display.tone}`}>{loading ? "Checking payment..." : display.title}</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{error || display.body}</p>
        {status?.status === "PENDING" && (
          <button onClick={() => void refresh()} disabled={loading} className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-50">
            {loading ? "Refreshing..." : "Refresh status"}
          </button>
        )}
        {status?.status !== "SUCCESS" && status?.status !== "PENDING" && (
          <Link href="/" className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white dark:bg-white dark:text-gray-900">Return home</Link>
        )}
      </section>
    </main>
  );
}