"use client";
import React, { useState } from "react";

export default function MainNav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/80 dark:bg-black/80 shadow z-50 backdrop-blur flex items-center justify-between px-4 md:px-8 py-3">
      <div className="flex items-center gap-2">
        <img src="/images/logo.jpg" alt="LabourSampark" className="w-35 h-10 rounded-lg" />
      </div>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
        aria-label="Open menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`block w-6 h-0.5 bg-white mb-1 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white mb-1 transition-all ${open ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-white transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>
      {/* Desktop menu */}
      <ul className="hidden md:flex gap-8 text-gray-700 dark:text-gray-200 font-medium">
        <li><a href="/" className="hover:underline">Home</a></li>
        <li><a href="/labours/all" className="hover:underline">Labours</a></li>
        <li><a href="/contractors/all" className="hover:underline">Contractors</a></li>
        <li><a href="#about" className="hover:underline">About</a></li>
        <li><a href="#contact" className="hover:underline">Contact</a></li>
      </ul>
      {/* Mobile menu */}
      {open && (
        <ul className="absolute top-full left-0 w-full bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-900 dark:to-blue-700 flex flex-col gap-4 py-6 px-6 text-white font-semibold md:hidden animate-fade-in z-50 shadow-lg">
          <li><a href="/" className="hover:underline block py-2" onClick={() => setOpen(false)}>Home</a></li>
          <li><a href="/labours/all" className="hover:underline block py-2" onClick={() => setOpen(false)}>Labours</a></li>
          <li><a href="/contractors/all" className="hover:underline block py-2" onClick={() => setOpen(false)}>Contractors</a></li>
          <li><a href="#about" className="hover:underline block py-2" onClick={() => setOpen(false)}>About</a></li>
          <li><a href="#contact" className="hover:underline block py-2" onClick={() => setOpen(false)}>Contact</a></li>
        </ul>
      )}
    </nav>
  );
}
