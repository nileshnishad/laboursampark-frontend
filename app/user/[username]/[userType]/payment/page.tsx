"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store/store";
import RazorpayPaymentModal from "@/app/components/RazorpayPaymentModal";
import { toast } from "react-toastify";

type UserType = "labour" | "contractor";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const username = params.username as string;
  const userType = params.userType as UserType;

  const payableAmount = useMemo(() => {
    return userType === "labour" ? 499 : 999;
  }, [userType]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleBack = () => {
    router.push(`/user/${username}/${userType}`);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    try {
      setIsProcessing(true);
      console.log("Payment successful:", paymentData);

      // TODO: Update user subscription status on backend
      // After backend confirms payment, redirect to dashboard
      setTimeout(() => {
        toast.success("Payment verified! Your profile is now visible.");
        setIsPaymentModalOpen(false);
        router.push(`/user/${username}/${userType}`);
      }, 2000);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Error processing payment. Please contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    toast.error(error);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-4">
          <div className="flex justify-between items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="shrink-0">
                <img
                  src={user?.companyLogoUrl || user?.profilePhotoUrl || `https://ui-avatars.com/api/?name=${username}&background=random&rounded=true`}
                  alt={username}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-600 dark:border-blue-400 shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${username}&background=random&rounded=true`;
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate leading-tight">
                  {userType === "labour" ? "Labour" : "Contractor"} Dashboard
                </h1>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize truncate leading-tight">
                    Welcome, {username.replace(/-/g, " ")}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-red-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-700 transition-all whitespace-nowrap shrink-0"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8">
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Your Verification
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8">
            Make a one-time payment to verify your profile. This makes your profile visible to potential clients 
            and increases your chances of getting more work opportunities.
          </p>

          {/* Benefits Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 sm:p-6 mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Benefits of Verification:</h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>Profile visibility to hundreds of potential clients</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>Higher priority in search results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>Direct contact from interested parties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>Verified badge on your profile</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>3 months of premium visibility</span>
              </li>
            </ul>
          </div>

          {/* Amount Section */}
          <div className="bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-6 mb-8 border border-blue-200 dark:border-blue-800">
            <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-2">
              One-time Payment for 3 Months
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                ₹{payableAmount}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                (including GST)
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-8 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
              <span className="text-lg">🔒</span>
              Secure payment via Razorpay - PCI-DSS compliant & SSL encrypted
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              disabled={isProcessing}
              className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-base sm:text-lg transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>💳 Pay ₹{payableAmount}</>
              )}
            </button>
            <button
              onClick={handleBack}
              disabled={isProcessing}
              className="flex-1 sm:flex-none px-6 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-white rounded-lg font-semibold transition-colors"
            >
              Back to Profile
            </button>
          </div>

          {/* FAQ Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Is my payment secure?</p>
                <p>Yes, we use Razorpay which is PCI-DSS compliant and uses industry-standard SSL encryption.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">What payment methods are accepted?</p>
                <p>We accept UPI, Credit/Debit Cards, and Net Banking through Razorpay.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">Can I get a refund?</p>
                <p>Refunds are processed within 5-7 business days if requested within 30 days of payment.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white mb-1">How long is the verification valid?</p>
                <p>Verification is valid for 3 months from the date of payment. You can renew anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Razorpay Payment Modal */}
      {user && (
        <RazorpayPaymentModal
          isOpen={isPaymentModalOpen}
          amount={payableAmount}
          userType={userType}
          userDetails={{
            name: user.fullName || username,
            email: user.email || "",
            phone: user.mobile || "",
            userId: user._id,
          }}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
    </div>
  );
}
