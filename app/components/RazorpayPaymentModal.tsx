/**
 * Razorpay Payment Modal Component
 * Handles payment flow with Razorpay integration
 */

"use client";

import React, { useState } from "react";
import razorpayService from "@/lib/razorpay-service";
import { toast } from "react-toastify";

interface RazorpayPaymentModalProps {
  isOpen: boolean;
  amount: number;
  userType: "labour" | "contractor" | "sub_contractor";
  userDetails: {
    name: string;
    email: string;
    phone: string;
    userId?: string;
  };
  onClose: () => void;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export default function RazorpayPaymentModal({
  isOpen,
  amount,
  userType,
  userDetails,
  onClose,
  onPaymentSuccess,
  onPaymentError,
}: RazorpayPaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const userTypeLabel =
    userType === "labour"
      ? "Labour"
      : userType === "sub_contractor"
      ? "Sub-Contractor"
      : "Contractor";

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Load Razorpay script
      const scriptLoaded = await razorpayService.loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay. Please check your internet connection.");
      }

      // Create order
      toast.loading("Creating payment order...", { autoClose: false });
      const order = await razorpayService.createOrder(
        amount,
        "INR",
        `${userType}_${Date.now()}`,
        userDetails.userId,
        userType
      );
      toast.dismiss();

      // Open Razorpay payment modal
      razorpayService.openPayment(
        order,
        { ...userDetails, userType },
        async (response) => {
          try {
            // Verify payment
            toast.loading("Verifying payment...", { autoClose: false });
            const verificationResult = await razorpayService.verifyPayment(response);
            toast.dismiss();

            if (verificationResult.success) {
              toast.success("Payment successful! Processing your request...");
              onPaymentSuccess({
                ...response,
                amount,
                userType,
              });
            } else {
              toast.error(verificationResult.message || "Payment verification failed");
              onPaymentError(verificationResult.message || "Payment verification failed");
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Payment verification failed";
            toast.error(errorMessage);
            onPaymentError(errorMessage);
          }
        },
        (error) => {
          toast.error(error);
          onPaymentError(error);
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Payment initiation failed";
      toast.error(errorMessage);
      onPaymentError(errorMessage);
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Complete Payment
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Amount Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">
            Amount for {userTypeLabel} (3 Months)
          </p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            ₹{amount}
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-6">
          <p className="text-xs text-green-700 dark:text-green-300">
            ✓ Secure payment powered by Razorpay
          </p>
          <p className="text-xs text-green-700 dark:text-green-300">
            ✓ PCI-DSS compliant & SSL encrypted
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>💳 Pay ₹{amount}</>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-white rounded-lg font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
