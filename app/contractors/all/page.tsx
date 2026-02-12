"use client";
import { useEffect, useState } from "react";

type Contractor = {
  id: number;
  name: string;
  type: string;
  location: string;
  projects: number;
  specialization: string[];
  phone: string;
  email: string;
  rating: number;
  languages: string[];
  available: boolean;
  profilePic: string;
  bio: string;
  verified: boolean;
  workTypes: string[];
  workStyle: string;
  feedback: { from: string; role: string; comment: string; rating: number }[];
};

export default function AllContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/contractors.json")
      .then((res) => res.json())
      .then((data) => {
        setContractors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching contractors:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 pb-8 md:pb-16 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-900 dark:text-white mb-3">All Contractors</h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl">Browse all available contractors in our network. Find verified professionals for your construction and project needs.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-600 dark:text-gray-300">Loading contractors...</div>
          </div>
        )}

        {/* Contractors Grid */}
        {!loading && contractors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contractors.map((c) => (
              <div key={c.id} className="h-full">
                {/* Aadhar-style Card */}
                <div className="w-full bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-green-200 sm:border-2 dark:border-green-700 h-full flex flex-col">
                  {/* Header Bar */}
                  <div className="h-1 sm:h-2 bg-linear-to-r from-green-600 to-green-400"></div>
                  
                  {/* Card Content */}
                  <div className="p-3 sm:p-6 flex flex-col h-full">
                    {/* Top Section - Avatar and Main Info */}
                    <div className="flex gap-3 sm:gap-5 mb-3 sm:mb-5">
                      {/* Avatar */}
                      <div className="shrink-0">
                        <div className="w-14 sm:w-20 h-14 sm:h-20 rounded-lg bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl border border-green-300 sm:border-2 shadow-md">
                          {c.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                      </div>
                      
                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 mb-0.5">
                          <h3 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-white truncate">{c.name}</h3>
                          {c.verified && <span title="Verified" className="text-green-500 text-sm sm:text-lg shrink-0">✔️</span>}
                        </div>
                        <div className="text-green-700 dark:text-green-300 font-semibold text-xs sm:text-sm mb-0.5 truncate">{c.type}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs truncate">{c.location}</div>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400"><strong>Rating:</strong></span>
                        <span className="text-yellow-600 dark:text-yellow-400 font-bold">★ {c.rating}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400"><strong>Projects:</strong></span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{c.projects}</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{c.bio}</p>
                    </div>

                    {/* Specialization */}
                    <div className="mb-3 sm:mb-4">
                      <div className="text-xs font-bold text-green-700 dark:text-green-300 mb-1 sm:mb-2">Specialization</div>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {c.specialization.slice(0, 2).map((s) => (
                          <span key={s} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium">{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Work Types */}
                    <div className="mb-3 sm:mb-4">
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Work Types</div>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {c.workTypes.slice(0, 2).map((w) => (
                          <span key={w} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">{w}</span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-0.5 sm:space-y-1 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-xs">
                        <span className="text-gray-600 dark:text-gray-400"><strong>Phone:</strong></span>
                        <span className="text-gray-800 dark:text-gray-200 ml-1 sm:ml-2 text-xs">{c.phone}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-600 dark:text-gray-400"><strong>Email:</strong></span>
                        <span className="text-gray-800 dark:text-gray-200 ml-1 sm:ml-2 truncate text-xs">{c.email}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-600 dark:text-gray-400"><strong>Available:</strong></span>
                        <span className={`ml-1 sm:ml-2 font-medium text-xs ${c.available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{c.available ? 'Yes' : 'No'}</span>
                      </div>
                    </div>

                    {/* Feedback */}
                    {c.feedback.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 sm:p-3 mt-auto">
                        <div className="text-xs font-bold text-green-700 dark:text-green-300 mb-1">Recent Feedback</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                          <span className="font-semibold text-green-700 dark:text-green-300">{c.feedback[0].from}</span>
                          <span className="text-yellow-500 ml-1">★{c.feedback[0].rating}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && contractors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">No contractors found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
