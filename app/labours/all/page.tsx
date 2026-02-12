"use client";
import { useEffect, useState } from "react";

type Labour = {
  id: number;
  name: string;
  trade: string;
  location: string;
  experience: number;
  skills: string[];
  phone: string;
  email: string;
  languages: string[];
  profilePic: string;
  verified: boolean;
  workNature: string;
  feedback: { from: string; role: string; comment: string; rating: number }[];
};

export default function AllLaboursPage() {
  const [labours, setLabours] = useState<Labour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/labours.json")
      .then((res) => res.json())
      .then((data) => {
        setLabours(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching labours:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 md:pt-32 pb-8 md:pb-16 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 dark:text-white mb-3">All Labours</h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl">Browse all available skilled labourers in our network. Find verified professionals for your project needs.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-600 dark:text-gray-300">Loading labours...</div>
          </div>
        )}

        {/* Labours Grid */}
        {!loading && labours.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {labours.map((l) => (
              <div key={l.id} className="h-full">
                {/* Aadhar-style Card */}
                <div className="w-full bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-blue-200 sm:border-2 dark:border-blue-700 h-full flex flex-col">
                  {/* Header Bar */}
                  <div className="h-1 sm:h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                  
                  {/* Card Content */}
                  <div className="p-3 sm:p-6 flex flex-col h-full">
                    {/* Top Section - Avatar and Main Info */}
                    <div className="flex gap-3 sm:gap-5 mb-3 sm:mb-5">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-14 sm:w-20 h-14 sm:h-20 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl border border-blue-300 sm:border-2 shadow-md">
                          {l.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                      </div>
                      
                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 mb-0.5">
                          <h3 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-white truncate">{l.name}</h3>
                          {l.verified && <span title="Verified" className="text-green-500 text-sm sm:text-lg flex-shrink-0">✔️</span>}
                        </div>
                        <div className="text-blue-700 dark:text-blue-300 font-semibold text-xs sm:text-sm mb-0.5 truncate">{l.trade}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs truncate">{l.location}</div>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400"><strong>Experience:</strong></span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{l.experience} yrs</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400"><strong>Work Nature:</strong></span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium line-clamp-1 text-right ml-2">{l.workNature}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-3 sm:mb-4">
                      <div className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1 sm:mb-2">Skills</div>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {l.skills.slice(0, 3).map((s) => (
                          <span key={s} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium">{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-3 sm:mb-4">
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">Languages</div>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {l.languages.slice(0, 2).map((lang) => (
                          <span key={lang} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">{lang}</span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-0.5 sm:space-y-1 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-xs">
                        <span className="text-gray-600 dark:text-gray-400"><strong>Phone:</strong></span>
                        <span className="text-gray-800 dark:text-gray-200 ml-1 sm:ml-2 text-xs">{l.phone}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-600 dark:text-gray-400"><strong>Email:</strong></span>
                        <span className="text-gray-800 dark:text-gray-200 ml-1 sm:ml-2 truncate text-xs">{l.email}</span>
                      </div>
                    </div>

                    {/* Feedback */}
                    {l.feedback.length > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 sm:p-3 mt-auto">
                        <div className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-1">Recent Feedback</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                          <span className="font-semibold text-blue-700 dark:text-blue-300">{l.feedback[0].from}</span>
                          <span className="text-yellow-500 ml-1">★{l.feedback[0].rating}</span>
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
        {!loading && labours.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">No labours found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
