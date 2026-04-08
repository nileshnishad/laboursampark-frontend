"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { fetchPaymentStatus, type PaymentStatusResponse } from "@/lib/payu-service";

function PaymentFailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [statusData, setStatusData] = useState<PaymentStatusResponse | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // PayU passes these params on redirect
  const txnId = searchParams.get("txnid") || searchParams.get("txnId") || "";
  const errorMessage =
    searchParams.get("error_Message") ||
    searchParams.get("error_message") ||
    searchParams.get("message") ||
    "";
  const amount = searchParams.get("amount") || "";
  const payuStatus = searchParams.get("status") || "failed";

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);

    // Call backend status API with the paymentId saved before redirect
    const paymentId = sessionStorage.getItem("payu_payment_id");
    if (paymentId) {
      setStatusLoading(true);
      fetchPaymentStatus(paymentId)
        .then((data) => {
          setStatusData(data);
          sessionStorage.removeItem("payu_payment_id");
        })
        .catch((err) => {
          setStatusError(err instanceof Error ? err.message : "Could not verify payment.");
        })
        .finally(() => setStatusLoading(false));
    }

    return () => clearTimeout(t);
  }, []);

  const handleRetry = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const displayTxnId = statusData?.txnId || txnId;
  const displayAmount = statusData?.amount ? `₹${statusData.amount}` : amount ? `₹${amount}` : "";
  const displayStatus = statusData?.status || payuStatus;
  const displayError =
    errorMessage ||
    (statusData?.status && statusData.status !== "success"
      ? `Payment ${statusData.status}. Please try again.`
      : "Your payment could not be processed. Please try again.");

  return (
    <div className="min-h-screen bg-gray-900/80 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 sm:p-8 transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
        }`}
      >
        {/* Failure icon */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">
          Payment Failed
        </h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-5">
          {displayError}
        </p>

        {/* Backend status verification */}
        {statusLoading && (
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            Checking payment status...
          </div>
        )}
        {statusError && (
          <div className="text-xs text-amber-600 dark:text-amber-400 text-center mb-4">
            ⚠️ {statusError}
          </div>
        )}

        {/* Transaction details */}
        {(displayTxnId || displayAmount || statusData?.paymentId) && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 p-4 mb-5 space-y-2">
            {displayTxnId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Transaction ID</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[55%] text-right">
                  {displayTxnId}
                </span>
              </div>
            )}
            {statusData?.paymentId && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Payment ID</span>
                <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[55%] text-right">
                  {statusData.paymentId}
                </span>
              </div>
            )}
            {displayAmount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Amount</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{displayAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <span className="font-semibold text-red-600 dark:text-red-400 capitalize">
                {displayStatus}
              </span>
            </div>
            {statusData && (
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Verified by server
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tip */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700 p-3 mb-6">
          <p className="text-xs text-yellow-700 dark:text-yellow-300 flex items-start gap-2">
            <span className="shrink-0">💡</span>
            <span>
              If money was deducted from your account, it will be automatically refunded within 3–5
              business days. Contact support if you need help.
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleRetry}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleGoHome}
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-semibold text-sm transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="w-10 h-10 border-4 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentFailureContent />
    </Suspense>
  );
}


