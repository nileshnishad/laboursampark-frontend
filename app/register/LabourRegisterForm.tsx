import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerLabour, resetAuthState } from "@/store/slices/authSlice";
import { uploadFile } from "@/lib/s3-client";
import dropdownsData from "@/data/dropdowns.json";

const {
  skills: SKILLS_OPTIONS,
  workType: WORK_TYPES,
  workingHours: WORKING_HOURS,
  experienceRange: EXPERIENCE_RANGE,
} = dropdownsData.labour;

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
  const [location, setLocation] = useState<string>("");

  // Professional Information
  const [experience, setExperience] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [selectedHours, setSelectedHours] = useState<string>("");
  const [skillsDropdownOpen, setSkillsDropdownOpen] = useState<boolean>(false);
  const [workTypesDropdownOpen, setWorkTypesDropdownOpen] =
    useState<boolean>(false);

  // Additional Info
  const [bio, setBio] = useState<string>("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");
  const [termsAgreed, setTermsAgreed] = useState<boolean>(false);

  // S3 Upload Status
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadError, setUploadError] = useState<string>("");

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const toggleWorkType = (type: string) => {
    setSelectedWorkTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const removeWorkType = (type: string) => {
    setSelectedWorkTypes((prev) => prev.filter((t) => t !== type));
  };

  // Handle Profile Photo Upload
  const handleProfilePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setUploadStatus("uploading");
    setUploadError("");

    try {
      const fileUrl = await uploadFile(
        `profile-photo-${Date.now()}`,
        file,
        "labour",
      );
      setProfilePhotoUrl(fileUrl);
      setUploadStatus("success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      setUploadError(errorMessage);
      setUploadStatus("error");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown="skills"]')) {
        setSkillsDropdownOpen(false);
      }
      if (!target.closest('[data-dropdown="work-types"]')) {
        setWorkTypesDropdownOpen(false);
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
      setLocation("");
      setExperience("");
      setSelectedSkills([]);
      setSelectedWorkTypes([]);
      setSelectedHours("");
      setBio("");
      setProfilePhotoUrl("");
      setTermsAgreed(false);
      setUploadStatus("idle");
      setUploadError("");

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

    const formPayload = {
      userType: "labour",
      fullName,
      age: age ? parseInt(age) : null,
      mobile: mobileNumber,
      email,
      password,
      location,
      experience,
      skills: selectedSkills,
      workTypes: selectedWorkTypes,
      preferredWorkingHours: selectedHours,
      bio,
      profilePhotoUrl: profilePhotoUrl || null,
      termsAgreed,
    };
    // Dispatch Redux action to register labour
    dispatch(registerLabour(formPayload));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            Join as Labour
          </h1>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
            Create your profile and get work opportunities
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Row 1: Name, Age, Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Password / OTP *
                </label>
                <input
                  type="password"
                  placeholder="Enter password or OTP"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="Your city/location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Skills */}
            {/* Skills Dropdown */}
            <div data-dropdown="skills">
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
                    className={`w-4 h-4 transition-transform ${
                      skillsDropdownOpen ? "rotate-180" : ""
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

            {/* Work Type Dropdown */}
            <div data-dropdown="work-types">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Interested In (Work Type) *
              </label>
              <div className="relative">
                {/* Dropdown Button */}
                <button
                  type="button"
                  onClick={() =>
                    setWorkTypesDropdownOpen(!workTypesDropdownOpen)
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white bg-white text-left flex justify-between items-center"
                >
                  <span>
                    {selectedWorkTypes.length > 0
                      ? `${selectedWorkTypes.length} selected`
                      : "Select work types"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      workTypesDropdownOpen ? "rotate-180" : ""
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
                {workTypesDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <div className="max-h-48 overflow-y-auto p-2 space-y-2">
                      {WORK_TYPES.map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedWorkTypes.includes(type)}
                            onChange={() => toggleWorkType(type)}
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

              {/* Selected Work Types Chips */}
              {selectedWorkTypes.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 mt-2 bg-indigo-50 dark:bg-indigo-900 rounded">
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
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Profile Photo
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  disabled={loading || uploadStatus === "uploading"}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white disabled:opacity-50"
                />
                {uploadStatus === "uploading" && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <span className="inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                  </div>
                )}
              </div>
              {uploadStatus === "success" && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ✓ Profile photo uploaded successfully
                </p>
              )}
              {uploadError && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  ✗ {uploadError}
                </p>
              )}
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
                className="flex-1 px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg text-center">
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
      </div>
    </div>
  );
}
