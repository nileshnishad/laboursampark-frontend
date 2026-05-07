import React, { useEffect, useMemo, useState } from "react";
import { apiPost } from "@/lib/api-service";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface OTPVerificationModalProps {
  isOpen: boolean;
  mobile?: string; // pass user's mobile number
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({ isOpen, mobile }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [step, setStep] = useState<"send" | "input" | "success">("send");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [editableMobile, setEditableMobile] = useState("");
  const [isEditingNumber, setIsEditingNumber] = useState(false);

  const toDigits = (value: string): string => value.replace(/\D/g, "");
  const normalizeIndianMobile = (value: string): string => {
    const digits = toDigits(value);
    const tenDigits = digits.length > 10 ? digits.slice(-10) : digits;
    return tenDigits ? `+91${tenDigits}` : "";
  };

  useEffect(() => {
    if (isOpen) {
      setEditableMobile(toDigits(mobile || "").slice(-10));
      setOtp("");
      setError("");
      setInfo("");
      setIsEditingNumber(false);
      setStep("send");
    }
  }, [isOpen, mobile]);

  const mobileForOtp = useMemo(() => normalizeIndianMobile(editableMobile), [editableMobile]);
  const isValidMobile = toDigits(editableMobile).length === 10;
  const displayMobile = isValidMobile ? `+91 ${toDigits(editableMobile)}` : "Not available";
  const userId = user?._id || user?.id || user?.userId || "";

  const handleSendOTP = async () => {
    if (loading) {
      return;
    }

    if (!isValidMobile) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!userId) {
      setError("User ID missing. Please login again.");
      return;
    }

    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await apiPost(
        "/api/twilio/send-verification",
        { to: mobileForOtp, userId },
        { includeToken: false }
      );
      if (res.success) {
        setStep("input");
        setInfo(`OTP sent to ${displayMobile}.`);
      } else {
        setError(res.error || "Failed to send OTP.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (loading) {
      return;
    }

    if (!isValidMobile) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!userId) {
      setError("User ID missing. Please login again.");
      return;
    }

    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await apiPost(
        "/api/twilio/verify-otp",
        { to: mobileForOtp, userId, code: otp },
        { includeToken: false }
      );
      if (res.success) {
        setStep("success");
        setInfo("OTP verified successfully!");
        // Optionally, trigger a profile refresh here
        window.location.reload();
      } else {
        setError(res.error || "Invalid OTP. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-3 border border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">OTP Verification Required</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          Verify your mobile number to activate your account and continue.
        </p>

        {step === "send" && (
          <div className="mb-4 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-left">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Mobile No:</p>
            {!isEditingNumber ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{displayMobile}</p>
                <button
                  type="button"
                  onClick={() => setIsEditingNumber(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  disabled={loading}
                >
                  Edit Number
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={editableMobile}
                  onChange={(e) => setEditableMobile(toDigits(e.target.value).slice(0, 10))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter 10-digit mobile"
                  disabled={loading}
                />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="text-red-700 dark:text-red-300 text-sm mb-3 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-3 py-2">
            {error}
          </div>
        )}
        {info && (
          <div className="text-green-700 dark:text-green-300 text-sm mb-3 rounded-lg border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-900/20 px-3 py-2">
            {info}
          </div>
        )}

        {step === "send" && (
          <button
            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            onClick={handleSendOTP}
            disabled={loading || !isValidMobile}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {step === "input" && (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleVerifyOTP();
            }}
            className="flex flex-col gap-3"
          >
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-lg text-center tracking-widest"
              placeholder="Enter 6-digit OTP"
              autoFocus
              required
              disabled={loading}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-60"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={handleSendOTP}
                className="w-full py-2.5 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-60"
                disabled={loading || !isValidMobile}
              >
                Resend OTP
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep("send");
                setIsEditingNumber(true);
                setOtp("");
                setError("");
                setInfo("");
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              disabled={loading}
            >
              Change Mobile Number
            </button>
          </form>
        )}
        {step === "success" && (
          <div className="text-green-700 dark:text-green-300 font-semibold text-base mt-2">
            Verification successful. Refreshing your session...
          </div>
        )}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Need help? Ensure your network is stable and the entered mobile number is correct.
        </div>

        {loading && (
          <div className="absolute inset-0 rounded-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-[1px] flex items-center justify-center">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <span className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Please wait...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPVerificationModal;
