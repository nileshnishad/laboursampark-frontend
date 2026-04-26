import React from "react";

interface SubscriptionAttentionProps {
  onPay: () => void;
}

const SubscriptionAttention: React.FC<SubscriptionAttentionProps> = ({ onPay }) => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 my-4 shadow">
    <div className="flex-1">
      <div className="font-bold text-lg mb-1">Attention Required</div>
      <div className="text-sm">Your profile is currently <span className="font-bold text-red-600">hidden</span>. To make your account visible and access all features, please pay the subscription amount.</div>
    </div>
    <button
      onClick={onPay}
      className="mt-3 sm:mt-0 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition"
    >
      Pay Subscription
    </button>
  </div>
);

export default SubscriptionAttention;
