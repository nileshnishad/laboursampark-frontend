"use client";

interface UserProfileModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ user, isOpen, onClose }: UserProfileModalProps) {
  if (!isOpen || !user) return null;

  const name = user.fullName || user.name || "User";
  const email = user.email || "N/A";
  const phone = user.mobile || user.phone || "N/A";
  let location = user.location || user.address || user.city || "N/A";
  if (typeof location === "object" && location !== null) {
    location = [location.address, location.city].filter(Boolean).join(", ") || "N/A";
  }
  const experience = user.experience || user.experienceRange || "N/A";
  const rating = user.rating || 0;
  const totalReviews = user.totalReviews || user.reviews?.length || 0;
  const completedJobs = user.completedJobs || user.projects || 0;
  const verified = user.aadharVerified || user.verified || false;
  const profilePic = user.profilePic || user.profilePhotoUrl || "";
  const bio = user.bio || user.description || "";
  const skills = user.skills || [];
  const workTypes = user.workTypes || user.workType || [];
  const serviceCategories = user.serviceCategories || [];
  const available = user.availability !== undefined ? user.availability : (user.available !== undefined ? user.available : true);
  const feedback = user.feedback || user.reviews || [];
  const certifications = user.certifications || [];

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Modal Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg h-[75vh] flex flex-col">
        
        {/* HEADER */}
        <div className="bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 p-4 sm:p-6 flex gap-4 items-start border-b border-blue-400">
          {/* Profile Photo */}
          <div className="shrink-0">
            {profilePic ? (
              <img
                src={profilePic}
                alt={name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border-3 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-white flex items-center justify-center text-blue-600 font-bold text-xl sm:text-2xl border-3 border-white shadow-lg">
                {getInitials(name)}
              </div>
            )}
          </div>

          {/* Header Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg sm:text-2xl font-bold text-white truncate">
                {name}
              </h1>
              {verified && (
                <span title="Verified" className="text-xl shrink-0">
                  ✔️
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-blue-100 mb-2">{location}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs sm:text-sm px-2 py-1 rounded-full font-semibold ${
                available
                  ? "bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                  : "bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-200"
              }`}>
                {available ? "✓ Available" : "✗ Not Available"}
              </span>
            </div>
          </div>
        </div>

        {/* BODY - Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 sm:p-3 text-center">
              <div className="text-yellow-600 dark:text-yellow-400 font-bold text-lg sm:text-xl">★ {rating}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
              <div className="text-xs text-gray-500">({totalReviews})</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2 sm:p-3 text-center">
              <div className="text-purple-600 dark:text-purple-400 font-bold text-lg sm:text-xl">{completedJobs}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Jobs Done</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded p-2 sm:p-3 text-center">
              <div className="text-orange-600 dark:text-orange-400 font-bold text-sm sm:text-lg">{experience}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Experience</div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-3 sm:p-4 space-y-2">
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">📧 Email:</span> {email}
            </p>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">📱 Phone:</span> {phone}
            </p>
          </div>

          {/* Bio */}
          {bio && (
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">About</h3>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{bio}</p>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">🛠️ Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 6).map((skill: string) => (
                  <span
                    key={skill}
                    className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 6 && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 self-center">
                    +{skills.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Work Types */}
          {workTypes.length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">💼 Work Types</h3>
              <div className="flex flex-wrap gap-1.5">
                {workTypes.slice(0, 5).map((type: string) => (
                  <span
                    key={type}
                    className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">🎓 Certifications</h3>
              <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                {certifications.slice(0, 3).map((cert: string) => (
                  <li key={cert} className="flex gap-2">
                    <span>→</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews */}
          {feedback.length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2">⭐ Reviews</h3>
              <div className="space-y-2">
                {feedback.slice(0, 2).map((review: any, idx: number) => (
                  <div key={idx} className="bg-gray-100 dark:bg-gray-700/50 rounded p-2 sm:p-3 border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white text-xs">
                        {review.from || "User"}
                      </span>
                      <span className="text-yellow-500 font-bold text-xs shrink-0">★{review.rating}</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{review.comment || review.feedback || ""}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 sm:py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg transition-colors text-xs sm:text-sm"
          >
            Close
          </button>
          <button
            className="flex-1 px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-xs sm:text-sm"
          >
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}
