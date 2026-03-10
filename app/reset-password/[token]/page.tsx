"use client";

import React, { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiPost } from "@/lib/api-service";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetToken = useMemo(() => {
    const raw = params?.token;
    return typeof raw === "string" ? raw : "";
  }, [params]);

  const passwordRule = useMemo(() => {
    const hasMinLength = newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);

    return {
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      isValid: hasMinLength && hasUppercase && hasLowercase && hasNumber,
    };
  }, [newPassword]);

  const canSubmit =
    Boolean(resetToken) &&
    passwordRule.isValid &&
    confirmPassword.trim().length >= 8 &&
    newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetToken) {
      showErrorToast("Invalid or missing reset token.");
      return;
    }

    if (!passwordRule.isValid) {
      showErrorToast("Password must be minimum 8 characters and include uppercase, lowercase, and number.");
      return;
    }

    if (confirmPassword.trim().length < 8) {
      showErrorToast("Confirm password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showErrorToast("Password and confirm password do not match.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await apiPost(
        "/api/users/reset-password",
        {
          resetToken,
          newPassword,
          confirmPassword,
        },
        { includeToken: false }
      );

      if (!response.success) {
        throw new Error(response.error || response.message || "Unable to reset password.");
      }

      showSuccessToast("Password reset successful. Please log in.");
      setTimeout(() => {
        router.push("/login");
      }, 800);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reset password.";
      showErrorToast(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen py-10 px-3 sm:px-4"
      style={{
        backgroundImage: "url('/images/labourimg.jpg')",
        backgroundSize: "contain",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm transition-colors"
          >
            <span>←</span>
            Back to Login
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            Enter your new password and confirm it to update your account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 pr-16 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 text-xs font-semibold text-indigo-600 dark:text-indigo-300"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-gray-600 dark:text-gray-400">
                Minimum 8 chars, with uppercase, lowercase, and number.
              </p>
              {newPassword && !passwordRule.isValid && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  Password does not meet required format.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 pr-16 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 text-xs font-semibold text-indigo-600 dark:text-indigo-300"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-600 dark:text-red-400">Passwords do not match.</p>
            )}

            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="w-full px-4 py-2 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
