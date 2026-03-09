"use client";
import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LabourRegisterForm from "./LabourRegisterForm";
import ContractorRegisterForm from "./ContractorRegisterForm";

function RegisterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userType = searchParams.get("type") as
    | "labour"
    | "contractor"
    | "sub_contractor"
    | "sub-contractor"
    | null;
  const contractorRole = searchParams.get("role") as
    | "contractor"
    | "sub-contractor"
    | "sub_contractor"
    | null;

  const normalizedUserType = (() => {
    if (userType === "sub_contractor" || userType === "sub-contractor") {
      return "sub_contractor" as const;
    }
    if (userType === "labour" || userType === "contractor") {
      return userType;
    }
    return null;
  })();

  const normalizedRole = (() => {
    if (contractorRole === "sub_contractor" || contractorRole === "sub-contractor") {
      return "sub-contractor" as const;
    }
    return "contractor" as const;
  })();

  if (!normalizedUserType) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Select Registration Type
            </h1>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
              Choose how you want to register before continuing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => router.push("/register?type=labour")}
              className="text-left bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-transparent hover:border-blue-400 transition-all"
            >
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-2">Labour</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Register as a skilled labourer to connect with contractors and get job opportunities.
              </p>
            </button>

            <button
              onClick={() => router.push("/register?type=contractor&role=contractor")}
              className="text-left bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-transparent hover:border-indigo-400 transition-all"
            >
              <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">Contractor</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Register as a main contractor managing projects and labour teams.
              </p>
            </button>

            <button
              onClick={() => router.push("/register?type=sub-contractor")}
              className="text-left bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-transparent hover:border-green-400 transition-all"
            >
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">Sub-Contractor</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Register as a sub-contractor working under contractors on assigned work.
              </p>
            </button>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (normalizedUserType === "labour") {
    return <LabourRegisterForm />;
  }

  if (normalizedUserType === "contractor" && !contractorRole) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Select Contractor Type
            </h1>
            <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
              Choose whether you want to register as a Contractor or Sub-Contractor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => router.push("/register?type=contractor&role=contractor")}
              className="text-left bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-transparent hover:border-indigo-400 transition-all"
            >
              <h2 className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">Contractor</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Register as a main contractor managing projects and labour teams.
              </p>
            </button>

            <button
              onClick={() => router.push("/register?type=contractor&role=sub-contractor")}
              className="text-left bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-transparent hover:border-green-400 transition-all"
            >
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">Sub-Contractor</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Register as a sub-contractor working under contractors on assigned work.
              </p>
            </button>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/register")}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return normalizedUserType === "sub_contractor" ? (
    <ContractorRegisterForm registrationRole="sub-contractor" />
  ) : (
    <ContractorRegisterForm registrationRole={normalizedRole} />
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center"><div className="text-gray-900 dark:text-white">Loading...</div></div>}>
      <RegisterContent />
    </Suspense>
  );
}
