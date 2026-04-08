"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { createPayULink, buildSubscriptionPayload, type PayULinkStatus } from "@/lib/payu-service";

type UserType = "labour" | "contractor" | "sub_contractor";

const normalizeUserType = (type: string): UserType => {
  const normalized = type.toLowerCase();
  if (normalized === "sub_contractor" || normalized === "sub-contractor") {
    return "sub_contractor";
  }
  return normalized === "contractor" ? "contractor" : "labour";
};

const getUserTypeLabel = (type: UserType): string => {
  if (type === "labour") return "Labour";
  if (type === "sub_contractor") return "Sub-Contractor";
  return "Contractor";
};

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [payStatus, setPayStatus] = useState<PayULinkStatus>("idle");
  const [payError, setPayError] = useState<string | null>(null);

  const username = params.username as string;
  const userType = normalizeUserType(params.userType as string);
  const userTypeLabel = getUserTypeLabel(userType);

  const payableAmount = useMemo(() => {
    if (userType === "labour") return 5;
    if (userType === "sub_contractor") return 10;
    return 15;
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

  const handlePayNow = async () => {
    try {
      setPayError(null);
      setPayStatus("loading");

      const payload = buildSubscriptionPayload(userType, payableAmount);
      const result = await createPayULink(payload);

      // Persist paymentId so success/failure pages can call the status API
      if (result.paymentId) {
        sessionStorage.setItem("payu_payment_id", result.paymentId);
      }

      setPayStatus("success");
      // Redirect to PayU payment page
      window.location.href = result.paymentUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment initiation failed. Please try again.";
      setPayError(message);
      setPayStatus("error");
    }
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-4 py-1.5 sm:py-2">
          <div className="flex justify-between items-start sm:items-center gap-2 sm:gap-3">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="shrink-0">
                <img
                  src={user?.companyLogoUrl || user?.profilePhotoUrl || `https://ui-avatars.com/api/?name=${username}&background=random&rounded=true`}
                  alt={username}
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-blue-600 dark:border-blue-400 shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${username}&background=random&rounded=true`;
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate leading-tight">
                  {userTypeLabel} Payment
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize truncate leading-tight">
                  {username.replace(/-/g, " ")}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-2 sm:px-3 py-1 bg-red-600 text-white rounded-lg font-semibold text-xs hover:bg-red-700 transition-all whitespace-nowrap shrink-0"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="w-full max-w-2xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
          {/* Heading & Description */}
          <div className="mb-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
              {userType === "labour" 
                ? "Make Yourself Visible to Contractors" 
                : "Be Visible to Trusted Labours on LabourSampark"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {userType === "labour"
                ? "Verify your profile on LabourSampark to get discovered by contractors looking for skilled labour. Increase your earning potential through direct job opportunities."
                : "Verify your contractor profile on LabourSampark to connect with verified and trusted labours. Manage projects and find qualified workers for your requirements."}
            </p>
          </div>

          {/* Benefits Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-xs sm:text-sm">
              {userType === "labour" ? "Visibility Benefits on LabourSampark" : "Contractor Visibility & Project Management"}
            </h3>
            <ul className="space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              {userType === "labour" ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">✓</span>
                    <span>Appear in contractor searches on LabourSampark</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">✓</span>
                    <span>Get direct project opportunities from verified contractors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">✓</span>
                    <span>Priority visibility for 3 months on LabourSampark</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">✓</span>
                    <span>Verified LabourSampark badge for credibility</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">✓</span>
                    <span>Browse and connect with verified labours on LabourSampark</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">✓</span>
                    <span>Visibility in labour searches - Find trusted workers easily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">✓</span>
                    <span>Premium contractor badge on LabourSampark</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">✓</span>
                    <span>3 months of verified contractor status</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Amount Section */}
          <div className="bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-2 mb-3 border border-blue-200 dark:border-blue-800">
            <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
              {userType === "labour" ? "3 Months Visibility on LabourSampark" : "3 Months Contractor Listing on LabourSampark"}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
                ₹{payableAmount}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                (includes GST)
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 mb-3 border border-green-200 dark:border-green-800">
            <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-2">
              <span>🔒</span>
              <span>Secure payment processing powered by PayU</span>
            </p>
          </div>

          {/* Error banner */}
          {payError && (
            <div className="rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 px-3 py-2.5 mb-3">
              <p className="text-xs text-red-700 dark:text-red-300 flex items-start gap-1.5">
                <span className="shrink-0">⚠️</span>
                <span>{payError}</span>
              </p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <button
              onClick={handlePayNow}
              disabled={payStatus === "loading" || payStatus === "success"}
              className="flex-1 px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
            >
              {payStatus === "loading" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Initiating Payment...
                </>
              ) : payStatus === "success" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting to PayU...
                </>
              ) : (
                <>💳 Pay ₹{payableAmount} via PayU</>
              )}
            </button>
            <button
              onClick={handleBack}
              disabled={payStatus === "loading" || payStatus === "success"}
              className="flex-1 sm:flex-none px-4 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-white rounded-lg font-semibold text-sm transition-colors"
            >
              Go Back
            </button>
          </div>

          {/* Info Note for Future Features */}
          {userType === "contractor" && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 mt-3 border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <span className="font-semibold">💡 Coming Soon:</span> Project enquiry features will be available soon on LabourSampark. Your verified contractor status gives you early access to these premium features.
              </p>
            </div>
          )}

          {/* FAQ Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Quick FAQs</h3>
            <div className="space-y-2">
              {[
                {
                  question: "Is payment secure on LabourSampark?",
                  answer: "Yes. Your payment details are fully encrypted and never stored on our servers. We follow PCI-DSS security standards.",
                },
                {
                  question: "What payment methods are accepted?",
                  answer: "UPI, Debit/Credit Cards, Net Banking - all major payment options are available on LabourSampark.",
                },
                {
                  question: "How long is verification valid?",
                  answer: `3 months from payment date. You can renew your ${userType === "labour" ? "labour" : userType === "sub_contractor" ? "sub-contractor" : "contractor"} profile anytime.`,
                },
                {
                  question: "What if I want to cancel?",
                  answer: "Refunds are processed within 30 days of payment. Contact LabourSampark support for assistance.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between text-left transition-colors"
                  >
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                      {faq.question}
                    </p>
                    <svg
                      className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform shrink-0 ${
                        expandedFAQ === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-3 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
