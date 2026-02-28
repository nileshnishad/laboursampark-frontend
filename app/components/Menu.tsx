"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const sections = [
  { id: "hero", label: "Home" },
  { id: "labours", label: "Labours" },
  { id: "contractors", label: "Contractors" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Menu() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let current = "hero";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80) {
            current = section.id;
          }
        }
      }
      setActive(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 dark:bg-black/80 shadow z-50 backdrop-blur flex items-center justify-between px-4 md:px-8 py-3">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/images/logo.jpg" alt="LabourSampark" className="w-35 h-10 rounded-lg" />
      </div>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
        aria-label="Open menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`block w-6 h-0.5 bg-blue-700 mb-1 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-blue-700 mb-1 transition-all ${open ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-blue-700 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>
      {/* Desktop menu */}
      <div className="hidden md:flex gap-8 items-center">
        <ul className="flex gap-8 text-gray-700 dark:text-gray-200 font-medium">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={
                  active === section.id
                    ? "text-blue-600 dark:text-blue-300 border-b-2 border-blue-600 dark:border-blue-300 pb-1"
                    : "hover:text-blue-600 dark:hover:text-blue-300"
                }
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
        
        {/* Login / Dashboard Button */}
        {user ? (
          <button
            onClick={() => router.push(`/user/${user.username}/${user.userType}`)}
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
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)}></div>
      )}
      {/* Mobile menu */}
      {open && (
        <ul className="absolute top-full left-0 w-full bg-white/95 dark:bg-black/95 flex flex-col gap-4 py-6 px-6 text-blue-700 dark:text-blue-200 font-medium md:hidden animate-fade-in z-50 shadow-lg">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={
                  active === section.id
                    ? "text-blue-600 dark:text-blue-300 border-b-2 border-blue-600 dark:border-blue-300 pb-1"
                    : "hover:text-blue-600 dark:hover:text-blue-300"
                }
                onClick={() => setOpen(false)}
              >
                {section.label}
              </a>
            </li>
          ))}
          {/* Mobile Login Button */}
          <li className="border-t border-gray-300 dark:border-gray-700 pt-4 mt-2">
            {user ? (
              <button
                onClick={() => {
                  router.push(`/user/${user.username}/${user.userType}`);
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
