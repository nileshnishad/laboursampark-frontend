import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGet } from "@/lib/api-service";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface SubscriptionTickerProps {
  userType: "labour" | "contractor" | "sub_contractor";
}

const SubscriptionTicker: React.FC<SubscriptionTickerProps> = ({ userType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Get username from Redux or params
  const { user } = useSelector((state: RootState) => state.auth);
  const params = useParams();
  // Prefer fullName (slugified), fallback to params.username
  let username = params.username as string;
  if (user?.fullName) {
    username = user.fullName.trim().toLowerCase().replace(/\s+/g, "-");
  }

  console.log("user",user);
  

  const handlePayNow = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet(`/api/subscription/plan?userType=${encodeURIComponent(userType)}`);
      // Use correct price path
      const price = res?.data?.data?.price ?? res?.data?.price;
      if (!res.success || !price) throw new Error("Could not fetch plan price");
      // Use actual username
      router.push(`/user/${user.fullName.trim().toLowerCase().replace(/\s+/g, "-")}/${userType}/payment?amount=${price}`);
    } catch (e: any) {
      setError(e.message || "Failed to fetch plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-xs sm:text-md w-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-yellow-900 font-bold py-2 px-4 text-center animate-pulse flex items-center justify-center gap-2">
      <span>⚠️ Your profile is hidden. Pay your subscription to get full access and visibility!</span>
      <button
        onClick={handlePayNow}
        className="px-4 py-1 bg-blue-700 text-xs text-white rounded-full font-bold hover:bg-blue-800 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Loading..." : "Pay Now"}
      </button>
      {error && <span className="ml-1 text-red-700 text-xs font-normal">{error}</span>}
    </div>
  );
};

export default SubscriptionTicker;
