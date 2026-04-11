"use client";
import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthState } from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store/store";
import type { LoginPayload } from "@/store/slices/authSlice";
import { buildUserDashboardPath } from "@/lib/user-route";
import { apiPost } from "@/lib/api-service";
import { showErrorToast, showSuccessToast } from "@/lib/toast-utils";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, user } = useSelector((state: RootState) => state.auth);

  // Form states
  const [userType, setUserType] = useState<"labour" | "contractor" | "sub_contractor">("labour");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [useOTP, setUseOTP] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Detect if input is email or mobile
  const isEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isMobile = (value: string) => {
    return /^\+?(\d{1,3})?[-.\s]?\d{4,14}$/.test(value.replace(/\s/g, ""));
  };

  const contactType = contact ? (isEmail(contact) ? "email" : isMobile(contact) ? "mobile" : null) : null;

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!contact) {
      return;
    }

    if (!password && !otp) {
      return;
    }

    const payload: LoginPayload = {
      userType,
    };

    if (isEmail(contact)) {
      payload.email = contact.toLowerCase();
    } else if (isMobile(contact)) {
      payload.mobile = contact;
    } else {
      return;
    }

    if (useOTP) {
      payload.otp = otp;
    } else {
      payload.password = password;
    }

    await dispatch(loginUser(payload));
  };

  const handleSendForgotPasswordLink = async () => {
    const email = forgotEmail.trim().toLowerCase();
    if (!isEmail(email)) {
      showErrorToast("Please enter a valid email address.");
      return;
    }

    try {
      setForgotLoading(true);
      const response = await apiPost(
        "/auth/forgot-password",
        { email },
        { includeToken: false }
      );

      if (!response.success) {
        throw new Error(response.error || response.message || "Unable to send reset link.");
      }

      showSuccessToast("Password reset link sent to your email.");
      setIsForgotModalOpen(false);
      setForgotEmail("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send reset link.";
      showErrorToast(message);
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle successful login
  useEffect(() => {
    if (success && user) {
      const redirectPath = searchParams.get('redirect');
      router.push(redirectPath || buildUserDashboardPath(user, userType));
      setTimeout(() => {
        dispatch(resetAuthState());
      }, 500);
    }
  }, [success, user, dispatch, router, searchParams, userType]);

  return (
    <div className="min-h-screen relative py-10 px-2" style={{
      backgroundImage: "url('/images/labourimg.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'left Bottom',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
    }}>
      {/* Background Overlay */}
      {/* <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div> */}
      
      {/* Content Wrapper */}
      <div className="relative z-10">
      <div className="max-w-md mx-auto">
        {/* Back to Home Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-gray-700 dark:text-black-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </button>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-black mb-2">
            Welcome Back
          </h1>
          <p className="text-sm md:text-base text-gray-700 dark:text-black-300">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 dark:bg-gray-900 shadow-2xl rounded-2xl p-6 md:p-8 backdrop-blur-sm border border-gray-100 dark:border-gray-800">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* User Type Selection */}
            

            {/* Email or Mobile Input */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5 uppercase tracking-wider">
                Email or Mobile *
              </label>
              <input
                type="text"
                placeholder="your.email@example.com or +91 XXXXX XXXXX"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
                  contact && !contactType
                    ? "border-red-400 dark:border-red-500"
                    : "border-gray-200 dark:border-gray-700"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all`}
              />
              {contact && !contactType && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Please enter a valid email or mobile number
                </p>
              )}
            </div>

            {/* OTP Toggle (only show if mobile detected) */}
            {contactType === "mobile" && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useOTP"
                  checked={useOTP}
                  onChange={(e) => {
                    setUseOTP(e.target.checked);
                    setPassword("");
                    setOtp("");
                  }}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <label htmlFor="useOTP" className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer">
                  Use OTP instead of password
                </label>
              </div>
            )}

            {/* Password or OTP Input */}
            {contactType && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5 uppercase tracking-wider">
                  {useOTP ? "OTP Code" : "Password"} *
                </label>
                {useOTP ? (
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                  />
                ) : (
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your security password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 pr-12 text-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="w-4 h-4"
                        >
                          <path d="M3 3l18 18" />
                          <path d="M10.58 10.58a2 2 0 102.83 2.83" />
                          <path d="M9.88 5.09A9.77 9.77 0 0112 5c5.52 0 10 7 10 7a18.73 18.73 0 01-3.32 4.31" />
                          <path d="M6.61 6.61C3.62 8.34 2 12 2 12s4.48 7 10 7a9.86 9.86 0 004.2-.93" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="w-4 h-4"
                        >
                          <path d="M2 12s4.48-7 10-7 10 7 10 7-4.48 7-10 7S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(contactType === "email" ? contact.trim().toLowerCase() : "");
                  setIsForgotModalOpen(true);
                }}
                className="text-xs text-indigo-600 dark:text-indigo-300 hover:underline font-semibold"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !contact || !contactType || (!password && !otp)}
              className="w-full px-4 py-2 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-2">
            <button
              type="button"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Continue with Google
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg text-center">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-indigo-600 dark:text-indigo-300 font-bold hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
      </div>

      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 shadow-xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Forgot Password</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Enter your email to receive a password reset link.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                disabled={forgotLoading}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
              >
                Close
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                disabled={forgotLoading}
                className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm font-semibold disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendForgotPasswordLink}
                disabled={forgotLoading || !forgotEmail.trim()}
                className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-60"
              >
                {forgotLoading ? "Sending..." : "Send Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
