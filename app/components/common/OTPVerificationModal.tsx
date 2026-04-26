import React, { useState } from "react";
import { apiPost } from "@/lib/api-service";

interface OTPVerificationModalProps {
  isOpen: boolean;
  mobile?: string; // pass user's mobile number
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({ isOpen, mobile }) => {
  const [step, setStep] = useState<'send' | 'input' | 'verifying' | 'success' | 'error'>("send");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const handleSendOTP = async () => {
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await apiPost("/api/twilio/send-verification", { to: `+91${mobile}` }, { includeToken: false });
      if (res.success) {
        setStep("input");
        setInfo("OTP sent to your registered mobile number.");
      } else {
        setError(res.error || "Failed to send OTP.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await apiPost("/api/twilio/verify-otp", { to: `+91${mobile}`, code: otp }, { includeToken: false });
      if (res.success) {
        setStep("success");
        setInfo("OTP verified successfully!");
        // Optionally, trigger a profile refresh here
        window.location.reload();
      } else {
        setError(res.error || "Invalid OTP. Please try again.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center mx-2">
        <h2 className="text-xl font-bold mb-4 text-red-600">OTP Verification Required</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Your account is not active. Please complete OTP verification to use your account.
        </p>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {info && <div className="text-green-600 text-sm mb-2">{info}</div>}
        {step === "send" && (
          <button
            className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition mb-2"
            onClick={handleSendOTP}
            disabled={loading || !mobile}
          >
            {loading ? "Sending..." : `Send OTP to +91${mobile?.replace(/^\+?91/, "")}`}
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-lg text-center tracking-widest"
              placeholder="Enter 6-digit OTP"
              autoFocus
              required
            />
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 transition"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
        {step === "success" && (
          <div className="text-green-700 font-bold text-lg mt-4">Verification complete! Reloading...</div>
        )}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          If you did not receive the OTP, please check your mobile number or try again.
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;
