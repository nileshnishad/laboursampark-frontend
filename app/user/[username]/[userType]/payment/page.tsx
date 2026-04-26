"use client";

import React, { useMemo, useState, useEffect } from "react";
import { apiGet } from "@/lib/api-service";
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

  // Use fullName slug for username if available, else fallback to params.username
  let username = params.username as string;
  let fullName = username.replace(/-/g, " ");
  if (user?.fullName) {
    fullName = user.fullName;
    username = user.fullName.trim().toLowerCase().replace(/\s+/g, "-");
  }
  const userType = normalizeUserType(params.userType as string);
  const userTypeLabel = getUserTypeLabel(userType);


  // Subscription plan state
  const [plan, setPlan] = useState<any>(null);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError] = useState<string | null>(null);

  useEffect(() => {
    setPlanLoading(true);
    setPlanError(null);
    apiGet(`/api/subscription/plan?userType=${encodeURIComponent(userType)}`)
      .then((res) => {
        if (res.success && res.data) {

          console.log(res?.data?.data);
          
          setPlan(res?.data?.data);
        } else {
          setPlanError(res.error || res.message || "Could not fetch plan");
        }
      })
      .catch((e) => setPlanError(e.message || "Could not fetch plan"))
      .finally(() => setPlanLoading(false));
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
    if (!plan) return;
    try {
      setPayError(null);
      setPayStatus("loading");

      const payload = buildSubscriptionPayload(userType, plan.price);
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

  if (planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Loading subscription plan...</p>
      </div>
    );
  }
  if (planError || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-red-600 dark:text-red-400">{planError || "Could not load plan."}</p>
      </div>
    );
  }

  // Calculate per-day cost (after plan is loaded)
  const duration = plan?.durationDays || 90;
  const price = plan?.price || 0;
  const pricePerDay = price && duration ? (price / duration).toFixed(2) : "-";

  // UI config for each user type
  const planUI = {
    labour: {
      color: 'green',
      bg: 'bg-green-50',
      border: 'border-green-400',
      button: 'bg-green-600 hover:bg-green-700',
      icon: (
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-2">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-green-600"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="2"/></svg>
        </span>
      ),
      features: [
        "Basic Job Access",
        "Limited Contractor Connections",
        "Profile Listing",
        "Support Access",
      ],
    },
    sub_contractor: {
      color: 'orange',
      bg: 'bg-orange-50',
      border: 'border-orange-400',
      button: 'bg-orange-500 hover:bg-orange-600',
      icon: (
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 mb-2">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-orange-500"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="currentColor" strokeWidth="2"/></svg>
        </span>
      ),
      features: [
        "Post Small Projects",
        "Connect with Labour",
        "Basic Analytics",
        "Priority Listing",
      ],
    },
    contractor: {
      color: 'blue',
      bg: 'bg-blue-50',
      border: 'border-blue-400',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: (
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-2">
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-blue-600"><rect x="7" y="7" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M9 17v2h6v-2" stroke="currentColor" strokeWidth="2"/></svg>
        </span>
      ),
      features: [
        "Unlimited Project Posting",
        "Direct Labour Hiring",
        "Advanced Analytics",
        "Priority Support",
        "Verified Badge",
      ],
    },
  };
  const ui = planUI[userType] || planUI.labour;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/10 dark:to-gray-900 flex flex-col items-center justify-center py-8">
      <header className="w-full max-w-2xl mx-auto mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-yellow-900 dark:text-yellow-100 tracking-tight mb-1">Subscription Plan</h1>
        <p className="text-center text-gray-700 dark:text-gray-200 text-sm mb-2">Upgrade your profile and unlock all features!</p>
      </header>
      <main className="w-full max-w-md mx-auto p-3 ">
        <div className={`rounded-2xl shadow-xl border-2 ${ui.border} ${ui.bg} bg-white dark:bg-gray-800 p-0 flex flex-col items-center relative w-full max-w-md sm:max-w-lg mx-auto`}>
          {/* Card Header */}
          <div className={`w-full rounded-t-2xl flex flex-col items-center justify-center py-3 sm:py-4 ${
            userType === 'labour' ? 'bg-green-600' : userType === 'sub_contractor' ? 'bg-orange-500' : 'bg-blue-600'
          }`}>
            <span className="uppercase text-white font-extrabold tracking-wider text-lg">
              {userTypeLabel}
            </span>
          </div>
          <div className="p-3 sm:p-6 flex flex-col items-center w-full">
            <div className="flex flex-col items-center w-full gap-1 sm:gap-2">
              <div className="mb-1 sm:mb-2">{ui.icon}</div>
              <div className="text-xs text-gray-500 mb-1 sm:mb-2">{fullName}</div>
              <div className={`text-2xl sm:text-3xl font-extrabold mb-0.5 sm:mb-1 text-${ui.color}-700 dark:text-${ui.color}-400`}>₹{price}</div>
              <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 mb-1 sm:mb-2">for {duration} Days</div>
              <div className={`text-xs font-semibold mb-2 sm:mb-3 px-2 sm:px-3 py-0.5 sm:py-1 rounded bg-white/80 border border-dashed border-gray-300 text-gray-700 dark:bg-gray-900/40 dark:text-gray-100`}>₹{pricePerDay} / Day <span className="text-gray-400">({price} ÷ {duration} Days)</span></div>
            </div>
            <ul className="w-full mb-2 sm:mb-4 mt-1 sm:mt-2 space-y-1 sm:space-y-2">
              {(Array.isArray(plan?.features) && plan.features.length > 0 ? plan.features : ui.features).map((feature: string, idx: number) => (
                <li key={idx} className={`flex items-center gap-2 text-sm text-${ui.color}-800 dark:text-${ui.color}-100`}>
                  <span className={`text-lg font-bold text-${ui.color}-700 dark:text-${ui.color}-300`}>✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="w-full flex flex-col gap-1 sm:gap-2 mt-1 sm:mt-2">
              <button
                onClick={handlePayNow}
                disabled={payStatus === "loading" || payStatus === "success"}
                className={`w-full py-2 sm:py-3 rounded-lg font-bold text-white text-sm sm:text-base transition-colors ${ui.button} disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
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
                  <>SUBSCRIBE NOW</>
                )}
              </button>
              <button
                onClick={handleBack}
                disabled={payStatus === "loading" || payStatus === "success"}
                className="w-full py-2 sm:py-3 rounded-lg font-semibold text-gray-800 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 text-sm sm:text-base transition-colors"
              >
                Go Back
              </button>
            </div>
            {payError && (
              <div className="w-full rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 px-3 py-2.5 mt-3">
                <p className="text-xs text-red-700 dark:text-red-300 flex items-start gap-1.5">
                  <span className="shrink-0">⚠️</span>
                  <span>{payError}</span>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="w-full max-w-md mx-auto mt-6 text-xs text-gray-600 dark:text-gray-300 flex flex-col items-center gap-1">
          <div>Note: {duration} Days = {Math.round(duration/30)} Months (All plans billed for {duration} days only)</div>
          <div>All amounts are in Indian Rupees (₹) | No Hidden Charges</div>
        </div>
        {/* FAQ Section */}
        <div className="w-full max-w-md mx-auto mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
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
                answer: plan?.durationDays ? `${plan.durationDays} days from payment date. You can renew your ${userType === "labour" ? "labour" : userType === "sub_contractor" ? "sub-contractor" : "contractor"} profile anytime.` : `3 months from payment date. You can renew your ${userType === "labour" ? "labour" : userType === "sub_contractor" ? "sub-contractor" : "contractor"} profile anytime.`,
              },
            ].map((faq, idx) => (
              <div key={idx}>
                <button
                  className="w-full text-left font-semibold text-gray-800 dark:text-gray-200 focus:outline-none"
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                >
                  {faq.question}
                </button>
                {expandedFAQ === idx && (
                  <div className="pl-2 text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
