"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { contractorApi } from "@/lib/api-endpoints";
import Skeleton from "./Skeleton";

type Contractor = {
  _id: string;
  fullName: string;
  email: string;
  userType: string;
  companyLogoUrl: string;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  experienceRange: string;
  availability: boolean;
  serviceCategories: string[];
  coverageArea: string[];
  certifications: string[];
  mobile: string;
  workTypes?: string[];
  location?: {
    coordinates?: {
      coordinates?: [number, number];
      type?: string;
    };
  };
  skills?: string[];
};

export default function ContractorsSection() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        setLoading(true);
        const response = await contractorApi.getAll();
        
        if (response.success && response.data) {
          // Extract contractors from nested response structure
          const contractors = response.data?.data?.users || response.data?.users || (Array.isArray(response.data) ? response.data : []);
          setContractors(Array.isArray(contractors) ? contractors : []);
          setError(null);
        } else {
          setError(response.error || "Failed to fetch contractors");
          setContractors([]);
        }
      } catch (err) {
        console.error("Error fetching contractors:", err);
        setError("Error fetching contractors");
        setContractors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
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
      
      {/* Loading State - Show Skeleton Carousel */}
      {loading && (
        <Slider {...slickSettings}>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} type="card" />
          ))}
        </Slider>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="flex justify-center items-center py-20">
          <div className="text-red-600 dark:text-red-400">Error: {error}</div>
        </div>
      )}
      
      {/* Contractors Carousel */}
      {!loading && !error && contractors.length > 0 ? (
        <Slider {...slickSettings}>
          {contractors.map((c) => (
            <div key={c._id} className="px-1.5 sm:px-2">
              {/* Aadhar-style Card */}
              <div className="w-full bg-white dark:bg-gray-800 rounded-lg sm:rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-green-200 sm:border-2 dark:border-green-700 h-full flex flex-col">
                {/* Header Bar */}
                <div className="h-0.5 sm:h-1 bg-linear-to-r from-green-600 to-green-400"></div>
                
                {/* Card Content */}
                <div className="p-2 sm:p-3 flex flex-col h-full">
                  {/* Top Section - Avatar and Main Info */}
                  <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3">
                    {/* Avatar */}
                    <div className="shrink-0">
                      <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-md bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg sm:text-xl border border-green-300 sm:border-2 shadow-md">
                        {c.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-800 dark:text-white truncate">{c.fullName}</h3>
                      <div className="flex items-center gap-1 mb-0.5">
                        {c.certifications && c.certifications.length > 0 && <span title="Verified" className="text-green-500 text-xs shrink-0">✔️</span>}
                        <div className="text-green-700 dark:text-green-300 font-semibold text-xs truncate">{c.userType}</div>
                      </div>
                      <div className="text-yellow-600 dark:text-yellow-400 text-xs font-bold">★ {c.rating}</div>
                    </div>
                  </div>

                  {/* Projects & Experience */}
                  <div className="flex gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 text-xs">
                    <span className="text-gray-600 dark:text-gray-400"><strong>Jobs:</strong> {c.completedJobs}</span>
                    <span className="text-gray-600 dark:text-gray-400 truncate"><strong>Exp:</strong> {c.experienceRange}</span>
                  </div>

                  {/* Services */}
                  {c.serviceCategories && c.serviceCategories.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-bold text-green-700 dark:text-green-300 mb-0.5">Services</div>
                      <div className="flex flex-wrap gap-1">
                        {c.serviceCategories.slice(0, 2).map((s: string) => (
                          <span key={s} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-1 py-0.5 rounded text-xs font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Work Types */}
                  {c.workTypes && c.workTypes.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-0.5">Work Types</div>
                      <div className="flex flex-wrap gap-1">
                        {c.workTypes.slice(0, 2).map((w: string) => (
                          <span key={w} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded text-xs">{w}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-0.5 mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400"><strong>Phone:</strong></span>
                      <span className="text-gray-800 dark:text-gray-200 truncate text-right text-xs">{c.mobile}</span>
                    </div>
                    <div className="text-xs flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400"><strong>Email:</strong></span>
                      <span className="text-gray-800 dark:text-gray-200 truncate text-right text-xs">{c.email}</span>
                    </div>
                    <div className="text-xs flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400"><strong>Available:</strong></span>
                      <span className={`font-medium text-xs ${c.availability ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{c.availability ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        !loading && !error && (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-300">No contractors available at the moment.</p>
          </div>
        )
      )}
    </section>
  );
}
