"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

export default function ContractorsSection() {
  const [contractors, setContractors] = useState<Contractor[]>([]);

  useEffect(() => {
    fetch("/data/contractors.json")
      .then((res) => res.json())
      .then(setContractors);
  }, []);

  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section id="contractors" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900 dark:text-white">Contractors</h2>
        <a
          href="/contractors/all"
          className="px-2 py-2 text-sm bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow"
        >
          More Contractors
        </a>
      </div>
      {contractors.length > 0 ? (
        <Slider {...slickSettings}>
          {contractors.map((c) => (
            <div key={c.id} className="px-2">
              {/* Aadhar-style Card */}
              <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl overflow-hidden border border-green-200 sm:border-2 dark:border-green-700">
                {/* Header Bar */}
                <div className="h-1 sm:h-2 bg-linear-to-r from-green-600 to-green-400"></div>
                
                {/* Card Content */}
                <div className="p-3 sm:p-6">
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
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 sm:p-3">
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
       
        </Slider>
      ) : (
        <p className="text-gray-500">Loading contractors...</p>
      )}
    </section>
  );
}
