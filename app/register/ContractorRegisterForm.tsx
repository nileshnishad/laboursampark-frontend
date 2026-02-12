"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const BUSINESS_TYPES = [
  "Construction",
  "Renovation",
  "Plumbing",
  "Electrical",
  "Painting",
  "Carpentry",
  "Landscaping",
  "HVAC",
  "Roofing",
  "General Contracting",
];

const SERVICES_OPTIONS = [
  "Residential",
  "Commercial",
  "Industrial",
  "Maintenance",
  "Installation",
  "Repair",
  "Demolition",
  "Finishing",
];

const TEAM_SIZE = [
  "Solo (Just Me)",
  "2-5 workers",
  "6-10 workers",
  "11-20 workers",
  "20+ workers",
];

const EXPERIENCE_RANGE = [
  "0-1 year",
  "1-3 years",
  "3-5 years",
  "5-10 years",
  "10+ years",
];

const COVERAGE_AREA = [
  "Local Only",
  "Within City",
  "Multi-City",
  "State Wide",
  "Pan India",
];

export default function ContractorRegisterForm() {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedCoverage, setSelectedCoverage] = useState<string[]>([]);

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const toggleCoverage = (area: string) => {
    setSelectedCoverage((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const removeService = (service: string) => {
    setSelectedServices((prev) => prev.filter((s) => s !== service));
  };

  const removeCoverage = (area: string) => {
    setSelectedCoverage((prev) => prev.filter((a) => a !== area));
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
                "linear-gradient(to right, rgb(99, 102, 241), rgb(79, 70, 229))",
            }}
          >
            <span className="text-4xl">🏢</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Register Your Business
          </h1>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            Get connected with skilled workers and grow your business
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <form className="space-y-6">
            {/* Row 1: Business Name, Mobile, Email */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  placeholder="Your business name"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 XXXXXXXXXX"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Email ID *
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Row 2: Password, Location, Registration Number */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Password / OTP *
                </label>
                <input
                  type="password"
                  placeholder="Enter password or OTP"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Location (City) *
                </label>
                <input
                  type="text"
                  placeholder="Your city"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  placeholder="Business registration"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Row 3: Business Type, Experience, Team Size */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Business Type *
                </label>
                <select className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white">
                  <option>Select business type</option>
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Experience Range *
                </label>
                <select className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white">
                  <option>Select experience</option>
                  {EXPERIENCE_RANGE.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Team Size *
                </label>
                <select className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white">
                  <option>Select team size</option>
                  {TEAM_SIZE.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Services Offered */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Services Offered (Select Multiple) *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {SERVICES_OPTIONS.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`px-3 py-2 text-xs rounded-lg font-medium transition-all ${
                      selectedServices.includes(service)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {service}
                  </button>
                ))}
              </div>
              {/* Selected Services Chips */}
              {selectedServices.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-indigo-50 dark:bg-indigo-900 rounded">
                  {selectedServices.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-1 px-2 py-1 bg-indigo-200 dark:bg-indigo-700 text-indigo-900 dark:text-indigo-100 text-xs rounded-full"
                    >
                      <span>{service}</span>
                      <button
                        type="button"
                        onClick={() => removeService(service)}
                        className="text-indigo-900 dark:text-indigo-100 hover:font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coverage Area */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Service Coverage Area (Select Multiple) *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                {COVERAGE_AREA.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleCoverage(area)}
                    className={`px-3 py-2 text-xs rounded-lg font-medium transition-all ${
                      selectedCoverage.includes(area)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
              {/* Selected Coverage Chips */}
              {selectedCoverage.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-purple-50 dark:bg-purple-900 rounded">
                  {selectedCoverage.map((area) => (
                    <div
                      key={area}
                      className="flex items-center gap-1 px-2 py-1 bg-purple-200 dark:bg-purple-700 text-purple-900 dark:text-purple-100 text-xs rounded-full"
                    >
                      <span>{area}</span>
                      <button
                        type="button"
                        onClick={() => removeCoverage(area)}
                        className="text-purple-900 dark:text-purple-100 hover:font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* About Business */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                About Your Business
              </label>
              <textarea
                placeholder="Describe your business, specialties, and what makes you unique..."
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            {/* Business License & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Business License / Insurance
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Company Logo / Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
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
                className="flex-1 px-4 py-2 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg text-center">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <button className="text-indigo-600 dark:text-indigo-300 font-bold hover:underline">
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
