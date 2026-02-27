"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthState } from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store/store";
import type { LoginPayload } from "@/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, user } = useSelector((state: RootState) => state.auth);

  // Form states
  const [userType, setUserType] = useState<"labour" | "contractor">("labour");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [useOTP, setUseOTP] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
      payload.email = contact;
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

  // Handle successful login
  useEffect(() => {
    if (success && user) {
      const encodedUsername = user.fullName.toLowerCase().replace(/\s+/g, '-');
      router.push(`/user/${encodedUsername}/${user.userType}`);
      setTimeout(() => {
        dispatch(resetAuthState());
      }, 500);
    }
  }, [success, user, dispatch, router]);

  return (
    <div className="min-h-screen relative py-12 px-4" style={{
      backgroundImage: "url('/images/labourimg.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Background Overlay */}
      {/* <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div> */}
      
      {/* Content Wrapper */}
      <div className="relative z-10">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* User Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                I am a *
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("labour")}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    userType === "labour"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  Labour
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("contractor")}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    userType === "contractor"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                  }`}
                >
                  Contractor
                </button>
              </div>
            </div>

            {/* Email or Mobile Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email or Mobile *
              </label>
              <input
                type="text"
                placeholder="your.email@example.com or +91 XXXXX XXXXX"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${
                  contact && !contactType
                    ? "border-red-300 dark:border-red-500"
                    : "border-gray-200 dark:border-gray-600"
                } focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white`}
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
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {useOTP ? "OTP" : "Password"} *
                </label>
                {useOTP ? (
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                  />
                ) : (
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                  />
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
              onClick={() => router.push(`/register?type=${userType}`)}
              className="text-indigo-600 dark:text-indigo-300 font-bold hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
