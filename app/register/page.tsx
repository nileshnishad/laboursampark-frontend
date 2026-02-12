"use client";
import React, { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import LabourRegisterForm from "./LabourRegisterForm";
import ContractorRegisterForm from "./ContractorRegisterForm";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userType = searchParams.get("type") as "labour" | "contractor" | null;

  if (!userType || (userType !== "labour" && userType !== "contractor")) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Invalid Registration Link</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return userType === "labour" ? <LabourRegisterForm /> : <ContractorRegisterForm />;
}
