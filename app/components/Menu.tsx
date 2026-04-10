"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { buildUserDashboardPath } from "@/lib/user-route";
import { useLanguage } from "@/app/context/LanguageContext";
import LanguageSelector from "./LanguageSelector";

const sections = [
  { id: "hero", label: "Home", path: "/" },
  { id: "labours", label: "Labours", path: "/labours" },
  { id: "contractors", label: "Contractors", path: "/contractors" },
  { id: "jobs", label: "Jobs", path: "/jobs" },
  { id: "about", label: "About", path: "/about" },
  { id: "contact", label: "Contact", path: "/contact" },
];

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isHomePage = pathname === "/";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let current = "hero";
    if (pathname === "/") current = "hero";
    else if (pathname.startsWith("/labours")) current = "labours";
    else if (pathname.startsWith("/contractors")) current = "contractors";
    else if (pathname.startsWith("/jobs")) current = "jobs";
    else if (pathname.startsWith("/about")) current = "about";
    else if (pathname.startsWith("/contact")) current = "contact";
    setActive(current);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNavClick = (section: (typeof sections)[0]) => {
    router.push(section.path);
    setOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 w-full bg-white/95 dark:bg-black/90 md:bg-white/80 md:dark:bg-black/80 shadow z-50 md:backdrop-blur flex items-center justify-between p-2 md:px-8 border-b border-black/5 dark:border-white/10"
      style={{
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <img
          src="/images/logo.jpg"
          alt="LabourSampark"
          className="w-35 h-10 rounded-lg"
        />
      </div>
      {/* Hamburger for mobile */}

      <div className="flex items-center md:hidden">
        <div>
          <LanguageSelector compact />
        </div>

        <button
          className=" flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block w-6 h-0.5 bg-blue-700 mb-1 transition-all ${open ? "rotate-45 translate-y-2" : ""}`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-blue-700 mb-1 transition-all ${open ? "opacity-0" : ""}`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-blue-700 transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}
          ></span>
        </button>
      </div>
      {/* Desktop menu */}
      <div className="hidden md:flex gap-8 items-center">
        <ul className="flex gap-8 text-gray-700 dark:text-gray-200 font-medium">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => handleNavClick(section)}
                className={
                  active === section.id
                    ? "text-blue-600 dark:text-blue-300 border-b-2 border-blue-600 dark:border-blue-300 pb-1 cursor-pointer"
                    : "hover:text-blue-600 dark:hover:text-blue-300 cursor-pointer"
                }
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Language Selector */}
        <LanguageSelector compact />

        {/* Login / Dashboard Button */}
        {mounted && user ? (
          <button
            onClick={() => router.push(buildUserDashboardPath(user))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
          >
            Dashboard
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
          >
            Login
          </button>
        )}
      </div>
      {/* Mobile menu overlay for better UX */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
      {/* Mobile menu */}
      {open && (
        <ul className="absolute top-full left-0 w-full bg-white/95 dark:bg-black/95 flex flex-col gap-4 py-6 px-6 text-blue-700 dark:text-blue-200 font-medium md:hidden animate-fade-in z-50 shadow-lg">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => handleNavClick(section)}
                className={
                  active === section.id
                    ? "text-blue-600 dark:text-blue-300 border-b-2 border-blue-600 dark:border-blue-300 pb-1 text-left w-full cursor-pointer"
                    : "hover:text-blue-600 dark:hover:text-blue-300 text-left w-full cursor-pointer"
                }
              >
                {section.label}
              </button>
            </li>
          ))}

          {/* Language Selector for Mobile */}
          <li className="border-t border-gray-300 dark:border-gray-700 pt-4 mt-2">
            <div className="mb-4">
              <LanguageSelector compact />
            </div>
          </li>

          {/* Mobile Login Button */}
          <li className="border-t border-gray-300 dark:border-gray-700 pt-4 mt-2">
            {mounted && user ? (
              <button
                onClick={() => {
                  router.push(buildUserDashboardPath(user));
                  setOpen(false);
                }}
                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push("/login");
                  setOpen(false);
                }}
                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Login / Register
              </button>
            )}
          </li>
        </ul>
      )}
    </nav>
  );
}
