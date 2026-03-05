// app/user/[username]/[userType]/components/LabourCard-i18n-example.tsx
/**
 * यह एक EXAMPLE है कि कैसे LabourCard में i18n integrate करें
 * अपने actual LabourCard.tsx में इसे apply करें
 */

"use client";

import React from "react";
import { useLanguage } from "@/app/context/LanguageContext";
import { t } from "@/lib/i18n";
import { translateUserData, translationGroups } from "@/lib/api-translator";

interface LabourCardProps {
  labour: any;
  isConnected?: boolean;
  isPending?: boolean;
  onConnect?: (labourId: string) => void;
}

export default function LabourCardWithI18n({
  labour,
  onConnect,
}: LabourCardProps) {
  const { locale } = useLanguage();
  const [sending, setSending] = React.useState(false);

  // Translate API data हिंदी / मराठी में
  const translatedLabour = translateUserData(
    labour,
    locale,
    translationGroups.labour
  );

  // अब translatedLabour को display में use करो
  const name = translatedLabour.fullName || translatedLabour.name || "Labour";
  const userType = translatedLabour.userType || t(locale, "labour.title");
  const experience = translatedLabour.experienceRange || "Not specified";
  const phone = translatedLabour.mobile || translatedLabour.phone || "N/A";
  const email = translatedLabour.email || "N/A";
  const rating = translatedLabour.rating || 4.5;
  const completedJobs = translatedLabour.completedJobs || 0;
  const skills = translatedLabour.skills || [];
  const status = translatedLabour.status || "active";

  // Static strings को हिंदी में
  const statusText =
    status === "connected"
      ? t(locale, "common.connected")
      : status === "pending"
        ? t(locale, "common.pending")
        : t(locale, "common.available");

  const isActuallyConnected = labour.status === "connected";
  const isActuallyPending = labour.status === "pending";

  const handleConnect = async () => {
    if (onConnect) {
      setSending(true);
      await onConnect(labour._id || labour.id);
      setSending(false);
    }
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-blue-200 dark:border-blue-700 flex flex-col">
      {/* Header Bar */}
      <div className="h-1 bg-linear-to-r from-blue-600 to-blue-400"></div>

      {/* ID Card Style Content */}
      <div className="p-3 sm:p-2 space-y-2">
        {/* Top Row - Info and Photo */}
        <div className="flex gap-3 items-start">
          {/* Left Side - Name, Contact, Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white truncate">
                {name}
              </h3>
            </div>

            <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 space-y-0.5">
              <div className="truncate">
                <span className="font-semibold">📧</span> {email}
              </div>
              <div className="truncate">
                <span className="font-semibold">📱</span> {phone}
              </div>
              <div className="text-xs">
                <span className="font-semibold text-green-600 dark:text-green-400">
                  ✓ {statusText} {t(locale, "labour.title")}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Profile Photo */}
          <div className="shrink-0">
            <div className="w-16 h-16 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg border border-blue-300 shadow-md">
              {getInitials(name)}
            </div>
          </div>
        </div>

        {/* Skills Row - Translated */}
        {skills.length > 0 && (
          <div className="pt-1">
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 3).map((s: string) => (
                <span
                  key={s}
                  className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-medium truncate"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience Row - Translated */}
        <div className="pt-1">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>{t(locale, "common.experience")}:</strong> {experience}
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex gap-1 pt-1 text-xs">
          <div className="flex-1">
            <span className="text-gray-600 dark:text-gray-400">
              {t(locale, "common.rating")}:
            </span>
            <span className="text-yellow-600 dark:text-yellow-400 font-bold ml-1">
              ★ {rating}
            </span>
          </div>
          <div className="flex-1">
            <span className="text-gray-600 dark:text-gray-400">
              {t(locale, "common.jobs")}:
            </span>
            <span className="text-gray-800 dark:text-gray-200 font-medium ml-1">
              {completedJobs}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          {isActuallyConnected ? (
            <button
              disabled
              className="w-full px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded font-semibold text-xs cursor-default transition-all"
            >
              ✓ {t(locale, "common.connected")}
            </button>
          ) : isActuallyPending ? (
            <button
              disabled
              className="w-full px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded font-semibold text-xs cursor-default transition-all"
            >
              ⏳ {t(locale, "common.pending")}
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={sending}
              className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Connect"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
