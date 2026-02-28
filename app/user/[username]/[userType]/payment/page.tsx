"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store/store";

type UserType = "labour" | "contractor";

type PaymentMethod = "upi" | "card" | "netbanking";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");

  const username = params.username as string;
  const userType = params.userType as UserType;

  const payableAmount = useMemo(() => {
    return userType === "labour" ? 499 : 999;
  }, [userType]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleBack = () => {
    router.push(`/user/${username}/${userType}`);
  };

  const handlePay = () => {
    alert(`Payment flow will start for ₹${payableAmount} via ${paymentMethod.toUpperCase()}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Complete Payment
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            Make payment to make your profile visible and receive more connections.
          </p>

          <div className="mt-5 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Amount</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹{payableAmount}</p>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Select Payment Method</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">UPI</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">Card (Credit / Debit)</span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "netbanking"}
                  onChange={() => setPaymentMethod("netbanking")}
                />
                <span className="text-sm text-gray-900 dark:text-gray-100">Net Banking</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handlePay}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              Pay ₹{payableAmount}
            </button>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold text-sm transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
