import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerLabour, resetAuthState } from "@/store/slices/authSlice";
import { uploadFile } from "@/lib/s3-client";
import ImageCropperModal from "@/app/components/ImageCropperModal";
import LocationSelector from "@/app/components/LocationSelector";
import type { LocationData } from "@/lib/use-location";
import dropdownsData from "@/data/dropdowns.json";

const { skills: SKILLS_OPTIONS, experienceRange: EXPERIENCE_RANGE } =
  dropdownsData.labour;

export default function LabourRegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, success, error, message } = useAppSelector(
    (state) => state.auth,
  );

  // Basic Information
  const [fullName, setFullName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationData | null>(null);

  // Professional Information
  const [experience, setExperience] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState<boolean>(false);

  // Additional Info
  const [bio, setBio] = useState<string>("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);

  // S3 Upload Status
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadError, setUploadError] = useState<string>("");

  // Image Cropper States
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [tempImageSrc, setTempImageSrc] = useState<string>("");
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>("");

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  // Handle Profile Photo Upload - Show Cropper Instead
  const handleProfilePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    // Validate file size (max 10MB for original)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      return;
    }

    // Create preview URL and show cropper
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setTempImageSrc(result);
      setShowCropper(true);
      setUploadError("");
    };
    reader.readAsDataURL(file);

    // Reset file input
    e.target.value = "";
  };

  // Handle crop completion - Upload cropped image
  const handleCropComplete = async (croppedImage: File) => {
    try {
      // Create preview immediately before uploading
      const previewUrl = URL.createObjectURL(croppedImage);

      // Wait a bit to ensure URL is ready
      setTimeout(() => {
        setProfilePhotoPreview(previewUrl);
      }, 10);

      setUploadStatus("uploading");
      setUploadError("");

      const fileUrl = await uploadFile(
        `profile-photo-${Date.now()}`,
        croppedImage,
        "labour",
      );
      setProfilePhotoUrl(fileUrl);
      setUploadStatus("success");
      setShowCropper(false);
      setTempImageSrc("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setUploadError(errorMessage);
      setUploadStatus("error");
      // Clear preview on error
      setProfilePhotoPreview("");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown="skills"]')) {
        setSkillsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle successful registration
  useEffect(() => {
    if (success && message) {
      alert(message);
      // Reset form
      setFullName("");
      setAge("");
      setMobileNumber("");
      setEmail("");
      setPassword("");
      setLocation(null);
      setExperience("");
      setSelectedSkills([]);
      setBio("");
      setProfilePhotoUrl("");
      setTermsAgreed(false);
      setUploadStatus("idle");
      setUploadError("");
      setShowPassword(false);

      // Reset state and redirect
      dispatch(resetAuthState());
      router.push("/login");
    }
  }, [success, message, dispatch, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!termsAgreed) {
      alert("Please agree to terms and conditions");
      return;
    }

    if (!fullName || !email || !password || !selectedSkills.length) {
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
      userType: "labour",
      fullName,
      age: age ? parseInt(age) : null,
      mobile: mobileNumber,
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
          coordinates: [
            location.coordinates.longitude,
            location.coordinates.latitude,
          ] as [number, number], // GeoJSON format: [longitude, latitude]
        },
      },
      experience,
      skills: selectedSkills,
      bio,
      profilePhotoUrl: profilePhotoUrl || null,
      termsAgreed,
    };
    // Dispatch Redux action to register labour
    dispatch(registerLabour(formPayload));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 py-4 px-2">
      <div className="max-w-6xl mx-auto">
        {/* Back to Home Button */}


        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
            Join as Labour
          </h1>
          <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
            Create your profile and get work opportunities
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/95 dark:bg-gray-900 shadow-2xl rounded-2xl p-4 md:p-8 backdrop-blur-sm border border-gray-100 dark:border-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* SECTION 1: Profile Photo - Top Center */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">1</span>
                Profile Photo
              </h2>

              {/* Photo Preview or Upload Area */}
              <div className="flex flex-col items-center gap-3 w-full max-w-md">
                {profilePhotoPreview ? (
                  <div className="relative group">
                    <div className="border-4 border-green-400 rounded-full p-1 bg-white dark:bg-gray-700 flex items-center justify-center shadow-lg">
                      <img
                        src={profilePhotoPreview}
                        alt="Profile Preview"
                        className="w-22 h-22 rounded-full object-cover"
                        onError={(e) => {
                          console.error("Preview image failed to load:", profilePhotoPreview);
                          e.currentTarget.style.display = "none";
                        }}
                        onLoad={() => {
                          console.log("Preview image loaded successfully");
                        }}
                      />
                    </div>
                    <div className="flex gap-1 mt-2">
                      <label className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors cursor-pointer flex items-center gap-2">
                        <span>📷 Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePhotoUpload}
                          disabled={loading || uploadStatus === "uploading"}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">✓ Photo Uploaded</p>
                  </div>
                ) : (
                  <label className="w-full cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full w-22 h-22 mx-auto flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="text-center">
                        <span className="text-xl block mb-1">📷</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Add Photo</span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      disabled={loading || uploadStatus === "uploading"}
                      className="hidden"
                    />
                  </label>
                )}

                {/* Upload Status Messages */}
                <div className="text-center w-full">
                  {uploadStatus === "uploading" && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Uploading...</p>
                    </div>
                  )}
                  {uploadError && (
                    <p className="text-xs text-red-600 dark:text-red-400">✗ {uploadError}</p>
                  )}
                  {!profilePhotoPreview && uploadStatus !== "uploading" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Max 10MB • Crop & Resize Available</p>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: Personal Details */}
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Personal Details</h2>

              {/* Row 1: Name, Age, Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
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
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Row 2: Email, Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Email ID *
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                          <path d="M15.171 13.576l1.414 1.414A1 1 0 0016 14h-2.5a1.5 1.5 0 01-1.5-1.5V9.914l1.171 1.171a4 4 0 000 5.656z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>            </div>
            {/* SECTION 3: Professional Details */}
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-3">Professional Details</h2>

              {/* Row: Experience & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Years of Experience *
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                  >
                    <option>Select experience</option>
                    {EXPERIENCE_RANGE.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Your Location *{" "}
                    <span className="text-red-500 text-xs">
                      (Auto-detect available)
                    </span>
                  </label>
                  <LocationSelector
                    onLocationChange={setLocation}
                    initialLocation={location}
                    required={true}
                  />
                </div>
              </div>

              {/* Skills */}
              <div data-dropdown="skills" className="mb-3">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Select Skills *
                </label>
                <div className="relative">
                  {/* Dropdown Button */}
                  <button
                    type="button"
                    onClick={() => setSkillsDropdownOpen(!skillsDropdownOpen)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white bg-white text-left flex justify-between items-center"
                  >
                    <span>
                      {selectedSkills.length > 0
                        ? `${selectedSkills.length} selected`
                        : "Select skills"}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${skillsDropdownOpen ? "rotate-180" : ""
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
                  {skillsDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                      <div className="max-h-48 overflow-y-auto p-2 space-y-2">
                        {SKILLS_OPTIONS.map((skill) => (
                          <label
                            key={skill}
                            className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSkills.includes(skill)}
                              onChange={() => toggleSkill(skill)}
                              className="w-4 h-4 rounded"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {skill}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Skills Chips */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 mt-2 bg-blue-50 dark:bg-blue-900 rounded">
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

              {/* Bio */}
              <div className="mt-3">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  About You / Bio
                </label>
                <textarea
                  placeholder="Tell about your experience and expertise..."
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white resize-none"
                />
              </div>
            </div>

            {/* SECTION 4: Terms & Submission */}
            <div>
              <div className="flex items-start gap-2 mb-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="w-4 h-4 rounded mt-1 cursor-pointer accent-blue-600"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed cursor-pointer"
                >
                  I agree to the <span className="text-blue-600 dark:text-blue-400 font-semibold">Terms & Conditions</span> and <span className="text-blue-600 dark:text-blue-400 font-semibold">Privacy Policy</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg text-center">
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login?type=labour")}
              className="text-blue-600 dark:text-blue-300 font-bold hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>

        {/* Image Cropper Modal */}
        {showCropper && tempImageSrc && (
          <ImageCropperModal
            imageSrc={tempImageSrc}
            onCropComplete={handleCropComplete}
            onCancel={() => {
              setShowCropper(false);
              setTempImageSrc("");
              setUploadError("");
            }}
          />
        )}
      </div>
    </div>
  );
}
