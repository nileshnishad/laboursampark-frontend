"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"labour" | "contractor">("labour");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Attempting login with:", { email, password, userType });

    try {
      // Mock API call - replace with actual API endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          userType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      // Handle successful login
      if (data.status === "success") {
        // Store user data or token
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userType", data.userType);
        localStorage.setItem("userId", data.userId);

        // Redirect based on userType
        if (data.userType === "labour") {
          router.push("/dashboard/labour");
        } else if (data.userType === "contractor") {
          router.push("/dashboard/contractor");
        } else {
          setError("Invalid user type received");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
         
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Login As *
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

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-100">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Password *
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  Remember me
                </span>
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
              disabled={loading}
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

          {/* Social Login - Placeholder */}
          <div className="space-y-2">
            <button
              type="button"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Continue with Google
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Continue with Phone
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
  );
}
