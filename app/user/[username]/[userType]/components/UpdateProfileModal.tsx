"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "@/store/slices/authSlice";
import { uploadFile } from "@/lib/s3-client";
import ImageCropperModal from "@/app/components/ImageCropperModal";
import LocationSelector from "@/app/components/LocationSelector";
import { LocationData } from "@/lib/use-location";
import type { AppDispatch, RootState } from "@/store/store";
import dropdownsData from "@/data/dropdowns.json";

type UserType = "labour" | "contractor";

const {
  teamSize: TEAM_SIZE_OPTIONS,
  experienceRange: EXPERIENCE_RANGE_OPTIONS,
  servicesOffered: SERVICES_OPTIONS,
  coverageArea: COVERAGE_AREA_OPTIONS,
} = dropdownsData.contractor;

type ProfileFormState = {
  location: LocationData | null;
  age: string;
  display: boolean;
  availability: boolean;
  preferredLanguages: string;
  experience: string;
  workingHours: string;
  bio: string;
  skills: string;
  workTypes: string;
  serviceCategories: string;
  businessName: string;
  registrationNumber: string;
  experienceRange: string;
  teamSize: string;
  about: string;
  servicesOffered: string;
  coverageArea: string;
  companyLogoUrl: string;
  profilePhotoUrl: string;
};

const toCsv = (value: any): string => {
  if (!Array.isArray(value)) return "";
  return value.join(", ");
};

const toArray = (value: string): string[] => {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getInitialFormState = (user: any): ProfileFormState => ({
  location: user?.location && typeof user.location === "object" ? user.location : null,
  age: user?.age ? String(user.age) : "",
  display: user?.display === true,
  availability: user?.availability !== false,
  preferredLanguages: toCsv(user?.preferredLanguages),
  experience: user?.experience || "",
  workingHours: user?.preferredWorkingHours || user?.workingHours || "",
  bio: user?.bio || "",
  skills: toCsv(user?.skills),
  workTypes: toCsv(user?.workTypes),
  serviceCategories: toCsv(user?.serviceCategories),
  businessName: user?.businessName || "",
  registrationNumber: user?.registrationNumber || "",
  experienceRange: user?.experienceRange || "",
  teamSize: user?.teamSize || "",
  about: user?.about || "",
  servicesOffered: toCsv(user?.servicesOffered),
  coverageArea: toCsv(user?.coverageArea),
  companyLogoUrl: user?.companyLogoUrl || "",
  profilePhotoUrl: user?.profilePhotoUrl || "",
});

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateProfileModal({ isOpen, onClose }: UpdateProfileModalProps) {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user, updatingProfile } = useSelector((state: RootState) => state.auth);
  const userType = params.userType as UserType;
  const [form, setForm] = useState<ProfileFormState>(() => getInitialFormState(user));
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [coverageDropdownOpen, setCoverageDropdownOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<"company" | "profile" | null>(null);
  const [cropTarget, setCropTarget] = useState<"company" | "profile" | null>(null);
  const [tempImageSrc, setTempImageSrc] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (isOpen && user) {
      setForm(getInitialFormState(user));
    }
  }, [isOpen, user]);

  const updateField = React.useCallback(
    (key: keyof ProfileFormState, value: any) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  // Early return after all hooks are defined
  if (!isOpen || !user) {
    return null;
  }

  const immutableInfo = [
    { label: "Full Name", value: user.fullName || "Not specified" },
    { label: "Email", value: user.email || "Not specified" },
    { label: "Mobile", value: user.mobile || "Not specified" },
    { label: "Password", value: "********" },
  ];

  const toggleCsvOption = (key: "servicesOffered" | "coverageArea", value: string) => {
    const current = toArray(form[key]);
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    updateField(key, next.join(", "));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const commonPayload: Record<string, any> = {
      location: form.location,
      display: form.display,
      availability: form.availability,
      preferredLanguages: toArray(form.preferredLanguages),
      profilePhotoUrl: form.profilePhotoUrl || null,
      companyLogoUrl: form.companyLogoUrl || null,
    };

    if (form.age.trim()) {
      commonPayload.age = Number(form.age);
    }

    const labourPayload: Record<string, any> = {
      experience: form.experience.trim(),
      preferredWorkingHours: form.workingHours.trim(),
      workingHours: form.workingHours.trim(),
      bio: form.bio.trim(),
      skills: toArray(form.skills),
      workTypes: toArray(form.workTypes),
      serviceCategories: toArray(form.serviceCategories),
    };

    const contractorPayload: Record<string, any> = {
      businessName: form.businessName.trim(),
      registrationNumber: form.registrationNumber.trim(),
      experienceRange: form.experienceRange.trim(),
      teamSize: form.teamSize.trim(),
      about: form.about.trim(),
      servicesOffered: toArray(form.servicesOffered),
      coverageArea: toArray(form.coverageArea),
    };

    const payload = {
      ...commonPayload,
      ...(userType === "labour" ? labourPayload : contractorPayload),
    };

    const resultAction = await dispatch(updateUserProfile(payload));
    if (updateUserProfile.fulfilled.match(resultAction)) {
      onClose();
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: "company" | "profile") => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setTempImageSrc(result);
      setCropTarget(type);
      setUploadError("");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleCropComplete = async (croppedImage: File) => {
    if (!cropTarget) return;

    setUploadingImage(cropTarget);

    try {
      const fileUrl = await uploadFile(
        `${cropTarget === "company" ? "company-logo" : "profile-photo"}-${Date.now()}`,
        croppedImage,
        userType
      );

      if (cropTarget === "company") {
        updateField("companyLogoUrl", fileUrl);
      } else {
        updateField("profilePhotoUrl", fileUrl);
      }

      setCropTarget(null);
      setTempImageSrc("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Image upload failed";
      setUploadError(message);
    } finally {
      setUploadingImage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-gray-800 shadow-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Update Profile</h4>
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-md text-sm font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Cannot be changed</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {immutableInfo.map((item) => (
                <div key={item.label}>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">{item.label}</label>
                  <input
                    value={item.value}
                    disabled
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-sm text-gray-600 dark:text-gray-300"
                    readOnly
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Editable details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Profile Picture</label>
                <div className="flex items-center gap-3">
                  <img
                    src={form.profilePhotoUrl || "https://ui-avatars.com/api/?name=Profile&background=random&rounded=true"}
                    alt="Profile"
                    className="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                  />
                  <label className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs sm:text-sm cursor-pointer">
                    {uploadingImage === "profile" ? "Uploading..." : "Change"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, "profile")}
                      disabled={uploadingImage !== null}
                    />
                  </label>
                </div>
              </div>
              {userType === "contractor" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Company Logo</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={form.companyLogoUrl || "https://ui-avatars.com/api/?name=Company&background=random&rounded=true"}
                      alt="Company Logo"
                      className="w-14 h-14 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <label className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs sm:text-sm cursor-pointer">
                      {uploadingImage === "company" ? "Uploading..." : "Change"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "company")}
                        disabled={uploadingImage !== null}
                      />
                    </label>
                  </div>
                </div>
              )}
              {uploadError && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-red-600 dark:text-red-400">{uploadError}</p>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Location Details</label>
                <LocationSelector
                  onLocationChange={(location) => updateField("location", location)}
                  initialLocation={form.location}
                  required={false}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Profile Visibility</label>
                <select
                  value={form.display ? "visible" : "hidden"}
                  onChange={(e) => updateField("display", e.target.value === "visible")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                >
                  <option value="visible">Visible</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Availability</label>
                <select
                  value={form.availability ? "yes" : "no"}
                  onChange={(e) => updateField("availability", e.target.value === "yes")}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                >
                  <option value="yes">Available</option>
                  <option value="no">Not Available</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Preferred Languages (comma separated)</label>
                <input
                  value={form.preferredLanguages}
                  onChange={(e) => updateField("preferredLanguages", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                />
              </div>

              {userType === "labour" ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Experience</label>
                    <input
                      value={form.experience}
                      onChange={(e) => updateField("experience", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Working Hours</label>
                    <input
                      value={form.workingHours}
                      onChange={(e) => updateField("workingHours", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Bio</label>
                    <textarea
                      rows={3}
                      value={form.bio}
                      onChange={(e) => updateField("bio", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Skills (comma separated)</label>
                    <input
                      value={form.skills}
                      onChange={(e) => updateField("skills", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Work Types (comma separated)</label>
                    <input
                      value={form.workTypes}
                      onChange={(e) => updateField("workTypes", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Service Categories (comma separated)</label>
                    <input
                      value={form.serviceCategories}
                      onChange={(e) => updateField("serviceCategories", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Business Name</label>
                    <input
                      value={form.businessName}
                      onChange={(e) => updateField("businessName", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Registration Number</label>
                    <input
                      value={form.registrationNumber}
                      onChange={(e) => updateField("registrationNumber", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Experience Range</label>
                    <select
                      value={form.experienceRange}
                      onChange={(e) => updateField("experienceRange", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                    >
                      <option value="">Select experience range</option>
                      {EXPERIENCE_RANGE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Team Size</label>
                    <select
                      value={form.teamSize}
                      onChange={(e) => updateField("teamSize", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                    >
                      <option value="">Select team size</option>
                      {TEAM_SIZE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">About</label>
                    <textarea
                      rows={3}
                      value={form.about}
                      onChange={(e) => updateField("about", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Services Offered (comma separated)</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setServicesDropdownOpen((prev) => !prev)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-left"
                      >
                        {toArray(form.servicesOffered).length > 0
                          ? toArray(form.servicesOffered).join(", ")
                          : "Select services offered"}
                      </button>

                      {servicesDropdownOpen && (
                        <div className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-2">
                          {SERVICES_OPTIONS.map((option) => {
                            const selected = toArray(form.servicesOffered).includes(option);
                            return (
                              <label
                                key={option}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => toggleCsvOption("servicesOffered", option)}
                                />
                                <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">{option}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Coverage Area (comma separated)</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setCoverageDropdownOpen((prev) => !prev)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-left"
                      >
                        {toArray(form.coverageArea).length > 0
                          ? toArray(form.coverageArea).join(", ")
                          : "Select coverage area"}
                      </button>

                      {coverageDropdownOpen && (
                        <div className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-2">
                          {COVERAGE_AREA_OPTIONS.map((option) => {
                            const selected = toArray(form.coverageArea).includes(option);
                            return (
                              <label
                                key={option}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={() => toggleCsvOption("coverageArea", option)}
                                />
                                <span className="text-xs sm:text-sm text-gray-800 dark:text-gray-200">{option}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-semibold"
              disabled={updatingProfile}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-60"
              disabled={updatingProfile}
            >
              {updatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {cropTarget && tempImageSrc && (
        <ImageCropperModal
          imageSrc={tempImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setCropTarget(null);
            setTempImageSrc("");
          }}
        />
      )}
    </div>
  );
}
