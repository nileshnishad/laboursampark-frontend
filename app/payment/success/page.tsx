"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { fetchPaymentStatus, type PaymentStatusResponse } from "@/lib/payu-service";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [statusData, setStatusData] = useState<PaymentStatusResponse | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // PayU passes these params on redirect
  const txnId = searchParams.get("txnid") || searchParams.get("txnId") || "";
  const mihpayid = searchParams.get("mihpayid") || "";
  const amount = searchParams.get("amount") || "";
  const productInfo = searchParams.get("productinfo") || searchParams.get("productInfo") || "";
  const payuStatus = searchParams.get("status") || "success";

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

  const handleGoToDashboard = () => {
    router.push("/");
  };

  // Derive display values — prefer verified backend data over URL params
  const displayAmount = statusData?.amount ? `₹${statusData.amount}` : amount ? `₹${amount}` : "";
  const displayTxnId = statusData?.txnId || txnId;
  const displayStatus = statusData?.status || payuStatus;
  const displayProduct = statusData?.productInfo || productInfo;

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
        {/* Success icon */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">
          Payment Successful!
        </h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-5">
          Your payment has been processed. Your profile will be visible shortly.
        </p>

        {/* Backend status verification */}
        {statusLoading && (
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            Verifying payment with server...
          </div>
        )}
        {statusError && (
          <div className="text-xs text-amber-600 dark:text-amber-400 text-center mb-4">
            ⚠️ {statusError}
          </div>
        )}

        {/* Transaction details */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-4 mb-6 space-y-2">
          {displayTxnId && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Transaction ID</span>
              <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[55%] text-right">
                {displayTxnId}
              </span>
            </div>
          )}
          {(statusData?.paymentId || mihpayid) && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Payment ID</span>
              <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[55%] text-right">
                {statusData?.paymentId || mihpayid}
              </span>
            </div>
          )}
          {displayAmount && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Amount Paid</span>
              <span className="font-semibold text-green-700 dark:text-green-400">
                {displayAmount}
              </span>
            </div>
          )}
          {displayProduct && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Product</span>
              <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[55%] text-right">
                {displayProduct}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Status</span>
            <span className="font-semibold text-green-600 dark:text-green-400 capitalize">
              {displayStatus}
            </span>
          </div>
          {statusData && (
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              <span className="text-xs text-green-600 dark:text-green-400">
                Verified by server
              </span>
            </div>
          )}
        </div>

        {/* Note */}
        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mb-5">
          A confirmation will be reflected on your profile within a few minutes.
        </p>

        {/* Actions */}
        <button
          onClick={handleGoToDashboard}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="w-10 h-10 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

