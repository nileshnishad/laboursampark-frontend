"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerContractor, resetAuthState } from "@/store/slices/authSlice";
import { uploadFile } from "@/lib/s3-client";
import dropdownsData from "@/data/dropdowns.json";

const {
  businessTypes: BUSINESS_TYPES,
  servicesOffered: SERVICES_OPTIONS,
  teamSize: TEAM_SIZE,
  experienceRange: EXPERIENCE_RANGE,
  coverageArea: COVERAGE_AREA,
} = dropdownsData.contractor;

export default function ContractorRegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, success, error, message } = useAppSelector(
    (state) => state.auth,
  );

  // Basic Information
  const [businessName, setBusinessName] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [mobile, setMobileNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [registrationNumber, setRegistrationNumber] = useState<string>("");

  // Business Details
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>(
    [],
  );
  const [experienceRange, setExperienceRange] = useState<string>("");
  const [teamSize, setTeamSize] = useState<string>("");

  // Multi-select Options
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedCoverage, setSelectedCoverage] = useState<string[]>([]);
  const [businessTypeDropdownOpen, setBusinessTypeDropdownOpen] =
    useState<boolean>(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] =
    useState<boolean>(false);
  const [coverageDropdownOpen, setCoverageDropdownOpen] =
    useState<boolean>(false);

  // Additional Info
  const [about, setAbout] = useState<string>("");
  const [businessLicense, setBusinessLicense] = useState<string>("");
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);

  // S3 Upload Status
  const [uploadStatus, setUploadStatus] = useState<{
    businessLicense: "idle" | "uploading" | "success" | "error";
    companyLogo: "idle" | "uploading" | "success" | "error";
  }>({
    businessLicense: "idle",
    companyLogo: "idle",
  });

  const [uploadErrors, setUploadErrors] = useState<{
    businessLicense: string;
    companyLogo: string;
  }>({
    businessLicense: "",
    companyLogo: "",
  });

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const toggleCoverage = (area: string) => {
    setSelectedCoverage((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area],
    );
  };

  const removeService = (service: string) => {
    setSelectedServices((prev) => prev.filter((s) => s !== service));
  };

  const removeCoverage = (area: string) => {
    setSelectedCoverage((prev) => prev.filter((a) => a !== area));
  };

  const toggleBusinessType = (type: string) => {
    setSelectedBusinessTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const removeBusinessType = (type: string) => {
    setSelectedBusinessTypes((prev) => prev.filter((t) => t !== type));
  };

  // Handle Business License Upload
  const handleBusinessLicenseUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadErrors((prev) => ({
        ...prev,
        businessLicense: "File size must be less than 5MB",
      }));
      return;
    }

    setUploadStatus((prev) => ({ ...prev, businessLicense: "uploading" }));
    setUploadErrors((prev) => ({ ...prev, businessLicense: "" }));

    try {
      const fileUrl = await uploadFile(
        `business-license-${Date.now()}`,
        file,
        "contractor",
      );
      setBusinessLicense(fileUrl);
      setUploadStatus((prev) => ({ ...prev, businessLicense: "success" }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadErrors((prev) => ({ ...prev, businessLicense: errorMessage }));
      setUploadStatus((prev) => ({ ...prev, businessLicense: "error" }));
    }
  };

  // Handle Company Logo Upload
  const handleCompanyLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadErrors((prev) => ({
        ...prev,
        companyLogo: "File size must be less than 5MB",
      }));
      return;
    }

    setUploadStatus((prev) => ({ ...prev, companyLogo: "uploading" }));
    setUploadErrors((prev) => ({ ...prev, companyLogo: "" }));

    try {
      const fileUrl = await uploadFile(
        `company-logo-${Date.now()}`,
        file,
        "contractor",
      );
      setCompanyLogo(fileUrl);
      setUploadStatus((prev) => ({ ...prev, companyLogo: "success" }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadErrors((prev) => ({ ...prev, companyLogo: errorMessage }));
      setUploadStatus((prev) => ({ ...prev, companyLogo: "error" }));
    }
  };

  // Handle successful registration
  useEffect(() => {
    if (success && message) {
      alert(message);
      // Reset form
      setBusinessName("");
      setFullName("");
      setMobileNumber("");
      setEmail("");
      setPassword("");
      setLocation("");
      setRegistrationNumber("");
      setSelectedBusinessTypes([]);
      setExperienceRange("");
      setTeamSize("");
      setSelectedServices([]);
      setSelectedCoverage([]);
      setAbout("");
      setBusinessLicense("");
      setCompanyLogo("");
      setTermsAgreed(false);
      setUploadStatus({ businessLicense: "idle", companyLogo: "idle" });
      setUploadErrors({ businessLicense: "", companyLogo: "" });

      // Reset state and redirect
      dispatch(resetAuthState());
      router.push("/login");
    }
  }, [success, message, dispatch, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown="business-types"]')) {
        setBusinessTypeDropdownOpen(false);
      }
      if (!target.closest('[data-dropdown="services"]')) {
        setServicesDropdownOpen(false);
      }
      if (!target.closest('[data-dropdown="coverage"]')) {
        setCoverageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!termsAgreed) {
      alert("Please agree to terms and conditions");
      return;
    }

    if (!fullName || !businessName || !email || !password) {
      alert("Please fill all required fields");
      return;
    }

    const formPayload = {
      userType: "contractor",
      fullName,
      businessName,
      mobile,
      email,
      password,
      location,
      registrationNumber,
      businessTypes: selectedBusinessTypes,
      experienceRange,
      teamSize,
      servicesOffered: selectedServices,
      coverageArea: selectedCoverage,
      about,
      businessLicenseUrl: businessLicense || null,
      companyLogoUrl: companyLogo || null,
      termsAgreed,
    };

    // Dispatch Redux action to register contractor
    dispatch(registerContractor(formPayload));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Register Your Business
          </h1>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            Get connected with skilled workers and grow your business
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Row 1: Full Name, Business Name, Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  placeholder="Your business name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
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
                  value={mobile}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Row 2: Email, Password, Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Email ID *
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Password / OTP *
                </label>
                <input
                  type="password"
                  placeholder="Enter password or OTP"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Row 3: Registration Number (Single Column) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  placeholder="Business registration"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Business Types Dropdown */}
            <div data-dropdown="business-types">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Business Types (Select Multiple) *
              </label>
              <div className="relative">
                {/* Dropdown Button */}
                <button
                  type="button"
                  onClick={() =>
                    setBusinessTypeDropdownOpen(!businessTypeDropdownOpen)
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white bg-white text-left flex justify-between items-center"
                >
                  <span>
                    {selectedBusinessTypes.length > 0
                      ? `${selectedBusinessTypes.length} selected`
                      : "Select business types"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      businessTypeDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {businessTypeDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <div className="max-h-48 overflow-y-auto p-2 space-y-2">
                      {BUSINESS_TYPES.map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedBusinessTypes.includes(type)}
                            onChange={() => toggleBusinessType(type)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Business Types Chips */}
              {selectedBusinessTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 mt-2 bg-blue-50 dark:bg-blue-900 rounded">
                  {selectedBusinessTypes.map((type) => (
                    <div
                      key={type}
                      className="flex items-center gap-1 px-2 py-1 bg-blue-200 dark:bg-blue-700 text-blue-900 dark:text-blue-100 text-xs rounded-full"
                    >
                      <span>{type}</span>
                      <button
                        type="button"
                        onClick={() => removeBusinessType(type)}
                        className="text-blue-900 dark:text-blue-100 hover:font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Services Offered Dropdown */}
            <div data-dropdown="services">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Services Offered (Select Multiple) *
              </label>
              <div className="relative">
                {/* Dropdown Button */}
                <button
                  type="button"
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white bg-white text-left flex justify-between items-center"
                >
                  <span>
                    {selectedServices.length > 0
                      ? `${selectedServices.length} selected`
                      : "Select services offered"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      servicesDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {servicesDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <div className="max-h-48 overflow-y-auto p-2 space-y-2">
                      {SERVICES_OPTIONS.map((service) => (
                        <label
                          key={service}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service)}
                            onChange={() => toggleService(service)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {service}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Services Chips */}
              {selectedServices.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 mt-2 bg-indigo-50 dark:bg-indigo-900 rounded">
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

            {/* Coverage Area Dropdown */}
            <div data-dropdown="coverage">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Service Coverage Area (Select Multiple) *
              </label>
              <div className="relative">
                {/* Dropdown Button */}
                <button
                  type="button"
                  onClick={() => setCoverageDropdownOpen(!coverageDropdownOpen)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white bg-white text-left flex justify-between items-center"
                >
                  <span>
                    {selectedCoverage.length > 0
                      ? `${selectedCoverage.length} selected`
                      : "Select coverage areas"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      coverageDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {coverageDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <div className="max-h-48 overflow-y-auto p-2 space-y-2">
                      {COVERAGE_AREA.map((area) => (
                        <label
                          key={area}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCoverage.includes(area)}
                            onChange={() => toggleCoverage(area)}
                            className="w-4 h-4 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {area}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Coverage Chips */}
              {selectedCoverage.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 mt-2 bg-purple-50 dark:bg-purple-900 rounded">
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

            {/* Row 4: Experience, Team Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Experience Range *
                </label>
                <select
                  value={experienceRange}
                  onChange={(e) => setExperienceRange(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select experience</option>
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
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select team size</option>
                  {TEAM_SIZE.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* About Business */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                About Your Business
              </label>
              <textarea
                placeholder="Describe your business, specialties, and what makes you unique..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={3}
                disabled={loading}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white disabled:opacity-50"
              />
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Business License / Insurance
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleBusinessLicenseUpload}
                    disabled={
                      loading || uploadStatus.businessLicense === "uploading"
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  />
                  {uploadStatus.businessLicense === "uploading" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="inline-block w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                    </div>
                  )}
                </div>
                {uploadStatus.businessLicense === "success" && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ File uploaded successfully
                  </p>
                )}
                {uploadErrors.businessLicense && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    ✗ {uploadErrors.businessLicense}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Company Logo / Photo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCompanyLogoUpload}
                    disabled={
                      loading || uploadStatus.companyLogo === "uploading"
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white disabled:opacity-50"
                  />
                  {uploadStatus.companyLogo === "uploading" && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="inline-block w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                    </div>
                  )}
                </div>
                {uploadStatus.companyLogo === "success" && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    ✓ File uploaded successfully
                  </p>
                )}
                {uploadErrors.companyLogo && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    ✗ {uploadErrors.companyLogo}
                  </p>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
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
                disabled={loading}
                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg text-center">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login?type=contractor")}
              className="text-indigo-600 dark:text-indigo-300 font-bold hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
