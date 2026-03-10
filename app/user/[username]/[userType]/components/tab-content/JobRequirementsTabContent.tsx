"use client";

import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import LabourCard from "../LabourCard";
import type { TabContentProps } from "../TabValueContentMap";
import type { RootState } from "@/store/store";
import { showSuccessToast, showWarningToast } from "@/lib/toast-utils";

type RequirementTarget = "labour" | "sub_contractor" | "both";

interface RequirementFormState {
  title: string;
  target: RequirementTarget;
  description: string;
  location: string;
  budget: string;
  timeline: string;
  workersNeeded: string;
  skills: string;
}

interface PublishedRequirement extends RequirementFormState {
  id: string;
  createdAt: string;
}

const INITIAL_FORM: RequirementFormState = {
  title: "",
  target: "both",
  description: "",
  location: "",
  budget: "",
  timeline: "",
  workersNeeded: "",
  skills: "",
};

export default function JobRequirementsTabContent(props: TabContentProps) {
  const { usersLoading, usersError, filteredData, onConnect } = props;
  const { user } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState<RequirementFormState>(INITIAL_FORM);
  const [publishedRequirements, setPublishedRequirements] = useState<PublishedRequirement[]>([]);
  const isProfileHidden = user?.display === false;

  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.description.trim() &&
      form.location.trim() &&
      form.budget.trim() &&
      form.timeline.trim()
    );
  }, [form]);

  const updateField = <K extends keyof RequirementFormState>(field: K, value: RequirementFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePublishRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProfileHidden) {
      showWarningToast("Make profile visible to create a job.");
      return;
    }
    if (!canSubmit) return;

    const requirement: PublishedRequirement = {
      ...form,
      id: `${Date.now()}`,
      createdAt: new Date().toLocaleString(),
    };

    setPublishedRequirements((prev) => [requirement, ...prev]);
    setForm(INITIAL_FORM);
    showSuccessToast("Job requirement published successfully.");
  };

  return (
    <div className="max-w-7xl mx-auto">
      

      <div className="relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 mb-5">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3">
          Create New Job
        </h3>

        <form
          onSubmit={handlePublishRequirement}
          className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ${isProfileHidden ? "opacity-40 pointer-events-none select-none" : ""}`}
        >
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Work Title *</label>
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g., Basement slab and beam casting"
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Target *</label>
            <select
              value={form.target}
              onChange={(e) => updateField("target", e.target.value as RequirementTarget)}
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="both">Labour + Sub-Contractor</option>
              <option value="labour">Labour</option>
              <option value="sub_contractor">Sub-Contractor</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Location *</label>
            <input
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="e.g., Pune, Kharadi"
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>


          

          <div>
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Workers Needed</label>
            <input
              value={form.workersNeeded}
              onChange={(e) => updateField("workersNeeded", e.target.value)}
              placeholder="e.g., 12"
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Required Skills</label>
            <input
              value={form.skills}
              onChange={(e) => updateField("skills", e.target.value)}
              placeholder="e.g., Shuttering, RCC, Steel Fixing"
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Requirement Details *</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              placeholder="Explain work scope, quality expectations, start date, and completion terms."
              className="mt-1 w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={!canSubmit || isProfileHidden}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold"
            >
              Publish Requirement
            </button>
          </div>
        </form>

        {isProfileHidden && (
          <div className="absolute inset-0 rounded-xl bg-white/70 dark:bg-gray-900/75 backdrop-blur-[1px] flex items-center justify-center p-4">
            <div className="max-w-md text-center rounded-lg border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/25 px-4 py-3">
              <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                Make profile visible to create a job.
              </p>
              <p className="mt-1 text-xs text-orange-700 dark:text-orange-300">
                Your profile is hidden right now. Complete payment and make your profile visible, then you can publish jobs.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-5 mb-5">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3">Published Jobs</h3>

        {publishedRequirements.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400">No Jobs published yet.</p>
        ) : (
          <div className="space-y-3">
            {publishedRequirements.map((item) => (
              <div key={item.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.createdAt}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">Target: {item.target.replace("_", " ")}</span>
                  <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">Budget: {item.budget}</span>
                  <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Timeline: {item.timeline}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     

    </div>
  );
}
