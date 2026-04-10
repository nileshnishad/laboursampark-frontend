"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerContractor, resetAuthState } from "@/store/slices/authSlice";
import { uploadFile } from "@/lib/s3-client";
import ImageCropperModal from "@/app/components/ImageCropperModal";
import LocationSelector from "@/app/components/LocationSelector";
import type { LocationData } from "@/lib/use-location";
import dropdownsData from "@/data/dropdowns.json";

const {
  businessTypes: BUSINESS_TYPES,
  teamSize: TEAM_SIZE,
  experienceRange: EXPERIENCE_RANGE,
} = dropdownsData.contractor;

interface ContractorRegisterFormProps {
  registrationRole?: "contractor" | "sub-contractor";
}

export default function ContractorRegisterForm({
  registrationRole = "contractor",
}: ContractorRegisterFormProps) {
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationData | null>(null);
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

  // Company Logo Cropper States
  const [showLogoCropper, setShowLogoCropper] = useState<boolean>(false);
  const [tempLogoSrc, setTempLogoSrc] = useState<string>("");
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string>("");

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
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

  // Handle Company Logo Upload - Show Cropper Instead
  const handleCompanyLogoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadErrors((prev) => ({
        ...prev,
        companyLogo: "Please select a valid image file",
      }));
      return;
    }

    // Validate file size (max 10MB for original)
    if (file.size > 10 * 1024 * 1024) {
      setUploadErrors((prev) => ({
        ...prev,
        companyLogo: "File size must be less than 10MB",
      }));
      return;
    }

    // Create preview URL and show cropper
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setTempLogoSrc(result);
      setShowLogoCropper(true);
      setUploadErrors((prev) => ({ ...prev, companyLogo: "" }));
    };
    reader.readAsDataURL(file);

    // Reset file input
    e.target.value = "";
  };

  // Handle company logo crop completion - Upload cropped image
  const handleLogoCropComplete = async (croppedImage: File) => {
    try {
      // Create preview immediately before uploading
      const previewUrl = URL.createObjectURL(croppedImage);

      // Wait a bit to ensure URL is ready
      setTimeout(() => {
        setCompanyLogoPreview(previewUrl);
      }, 10);

      setUploadStatus((prev) => ({ ...prev, companyLogo: "uploading" }));
      setUploadErrors((prev) => ({ ...prev, companyLogo: "" }));

      const fileUrl = await uploadFile(
        `company-logo-${Date.now()}`,
        croppedImage,
        "contractor",
      );
      setCompanyLogo(fileUrl);

      setUploadStatus((prev) => ({ ...prev, companyLogo: "success" }));
      setShowLogoCropper(false);
      setTempLogoSrc("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setUploadErrors((prev) => ({ ...prev, companyLogo: errorMessage }));
      setUploadStatus((prev) => ({ ...prev, companyLogo: "error" }));
      // Clear preview on error
      setCompanyLogoPreview("");
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
      setShowPassword(false);
      setLocation(null);
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

    const payloadRole: "contractor" | "sub_contractor" =
      registrationRole === "sub-contractor" ? "sub_contractor" : "contractor";

    // Validation
    if (!termsAgreed) {
      alert("Please agree to terms and conditions");
      return;
    }

    if (!fullName || !businessName || !email || !password) {
      alert("Please fill all required fields");
      return;
    }

    if (!location || !location.coordinates) {
      alert("Please provide your location using Auto Detect or manual entry");
      return;
    }

    // Validate location has at least city or state
    if (!location.city && !location.state) {
      alert("Please ensure your location includes city or state information");
      return;
    }

    const formPayload = {
      userType: payloadRole,
      role: payloadRole,
      fullName,
      businessName,
      mobile,
      email,
      password,
      location: {
        city: location.city,
        state: location.state,
        pincode: location.pincode,
        country: location.country,
        address: location.address,
        coordinates: {
          type: "Point",
          coordinates: [location.coordinates.longitude, location.coordinates.latitude] as [number, number], // GeoJSON format: [longitude, latitude]
        },
      },
      registrationNumber,
      businessTypes: selectedBusinessTypes,
      experienceRange,
      teamSize,
      about,
      businessLicenseUrl: businessLicense || null,
      companyLogoUrl: companyLogo || null,
      termsAgreed,
    };

    // Dispatch Redux action to register contractor
    dispatch(registerContractor(formPayload));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back to Home Button */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm transition-colors group"
          >
            ← Back to Home
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
            {registrationRole === "sub-contractor"
              ? "Join as Sub-Contractor"
              : "Register Your Business"}
          </h1>
          <p className="text-sm md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            {registrationRole === "sub-contractor"
              ? "Create your sub-contractor profile and start getting project work."
              : "Get connected with skilled workers and grow your business today."}
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/95 dark:bg-gray-900 shadow-2xl rounded-3xl p-6 md:p-10 backdrop-blur-md border border-gray-100 dark:border-gray-800">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Row 1: Full Name, Business Name, Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5 uppercase tracking-wider">
                  Company Name *
                </label>
                <input
                  type="text"
                  placeholder="Your Company name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5 uppercase tracking-wider">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 XXXXXXXXXX"
                  value={mobile}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Row 2: Email, Password, Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5 uppercase tracking-wider">
                  Email ID *
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-1.5 uppercase tracking-wider">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-12 text-sm rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-4 h-4"
                      >
                        <path d="M3 3l18 18" />
                        <path d="M10.58 10.58a2 2 0 102.83 2.83" />
                        <path d="M9.88 5.09A9.77 9.77 0 0112 5c5.52 0 10 7 10 7a18.73 18.73 0 01-3.32 4.31" />
                        <path d="M6.61 6.61C3.62 8.34 2 12 2 12s4.48 7 10 7a9.86 9.86 0 004.2-.93" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-4 h-4"
                      >
                        <path d="M2 12s4.48-7 10-7 10 7 10 7-4.48 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Location Selector */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Location (City / Area) *
                </label>
                <LocationSelector onLocationChange={setLocation} />
              </div>
            </div>

            {/* Row 4: Registration Number (Single Column) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Registration Number / GST Number *
                </label>
                <input
                  type="text"
                  placeholder="Business registration / GST Number"
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
                <div className="flex gap-4 items-start">
                  {/* Upload Section */}
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCompanyLogoUpload}
                        disabled={
                          loading || uploadStatus.companyLogo === "uploading"
                        }
                        className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white disabled:opacity-50 cursor-pointer"
                      />
                      {uploadStatus.companyLogo === "uploading" && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <span className="inline-block w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Click to select image • Crop and resize • Max 10MB
                    </p>
                  </div>

                  {/* Preview Section */}
                  {companyLogoPreview && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="border-2 border-green-400 rounded-lg p-1 bg-white dark:bg-gray-700 flex items-center justify-center">
                        <img
                          src={companyLogoPreview}
                          alt="Logo Preview"
                          className="w-24 h-24 object-cover rounded"
                          onError={(e) => {
                            console.error("Preview image failed to load:", companyLogoPreview);
                            e.currentTarget.style.display = "none";
                          }}
                          onLoad={() => {
                            console.log("Preview image loaded successfully");
                          }}
                        />
                      </div>
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400">
                        ✓ Uploaded
                      </p>
                    </div>
                  )}
                </div>

                {/* Feedback Messages */}
                <div className="mt-2 space-y-1">
                  {uploadStatus.companyLogo === "success" && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      ✓ Logo uploaded successfully
                    </p>
                  )}
                  {uploadErrors.companyLogo && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      ✗ {uploadErrors.companyLogo}
                    </p>
                  )}
                </div>
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

        {/* Company Logo Cropper Modal */}
        {showLogoCropper && tempLogoSrc && (
          <ImageCropperModal
            imageSrc={tempLogoSrc}
            onCropComplete={handleLogoCropComplete}
            onCancel={() => {
              setShowLogoCropper(false);
              setTempLogoSrc("");
              setUploadErrors((prev) => ({ ...prev, companyLogo: "" }));
            }}
          />
        )}
      </div>
    </div>
  );
}
