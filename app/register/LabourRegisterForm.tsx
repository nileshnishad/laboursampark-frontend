"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SKILLS_OPTIONS = [
  "Plumbing",
  "Electrical Work",
  "Carpentry",
  "Painting",
  "Masonry",
  "Welding",
  "HVAC",
  "Roofing",
  "Tiling",
  "Scaffolding",
];

const WORK_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Project-based",
];

const WORKING_HOURS = [
  "8 AM - 5 PM",
  "9 AM - 6 PM",
  "10 AM - 7 PM",
  "Flexible",
  "Night Shift",
];

export default function LabourRegisterForm() {
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [selectedHours, setSelectedHours] = useState<string>("");

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleWorkType = (type: string) => {
    setSelectedWorkTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const removeWorkType = (type: string) => {
    setSelectedWorkTypes((prev) => prev.filter((t) => t !== type));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-3"
            style={{
              background:
                "linear-gradient(to right, rgb(59, 130, 246), rgb(37, 99, 235))",
            }}
          >
            <span className="text-4xl">👷</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Join as Labour
          </h1>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            Create your profile and get work opportunities
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <form className="space-y-6">
            {/* Row 1: Name, Age, Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Age *
                </label>
                <input
                  type="number"
                  placeholder="Age"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 XXXXXXXXXX"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Row 2: Email, Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Email ID *
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Password / OTP *
                </label>
                <input
                  type="password"
                  placeholder="Enter password or OTP"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Row 3: Experience, Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Years of Experience *
                </label>
                <select className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white">
                  <option>Select experience</option>
                  <option>0-1 year</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5-10 years</option>
                  <option>10+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="Your city/location"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Skills *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                {SKILLS_OPTIONS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-2 text-xs rounded-lg font-medium transition-all ${
                      selectedSkills.includes(skill)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {/* Selected Skills Chips */}
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-blue-50 dark:bg-blue-900 rounded">
                  {selectedSkills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100 text-xs rounded-full"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-blue-900 dark:text-blue-100 hover:font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Work Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Interested In (Work Type) *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {WORK_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleWorkType(type)}
                    className={`px-3 py-2 text-xs rounded-lg font-medium transition-all ${
                      selectedWorkTypes.includes(type)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {/* Selected Work Types Chips */}
              {selectedWorkTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-indigo-50 dark:bg-indigo-900 rounded">
                  {selectedWorkTypes.map((type) => (
                    <div
                      key={type}
                      className="flex items-center gap-1 px-2 py-1 bg-indigo-200 dark:bg-indigo-700 text-indigo-900 dark:text-indigo-100 text-xs rounded-full"
                    >
                      <span>{type}</span>
                      <button
                        type="button"
                        onClick={() => removeWorkType(type)}
                        className="text-indigo-900 dark:text-indigo-100 hover:font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Working Hours */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Preferred Working Hours *
              </label>
              <select
                value={selectedHours}
                onChange={(e) => setSelectedHours(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select working hours</option>
                {WORKING_HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                About You / Bio
              </label>
              <textarea
                placeholder="Tell about your experience and expertise..."
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 rounded mt-0.5"
              />
              <label
                htmlFor="terms"
                className="text-xs text-gray-700 dark:text-gray-300"
              >
                I agree to the Terms & Conditions and Privacy Policy
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg text-center">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <button className="text-blue-600 dark:text-blue-300 font-bold hover:underline">
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
