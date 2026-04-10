"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink 
} from "lucide-react";

export default function Footer() {
  const router = useRouter();
  
  const footerLinks = {
    platform: [
      { label: "Home", path: "/" },
      { label: "Find Labours", path: "/labours" },
      { label: "Find Contractors", path: "/contractors" },
      { label: "About Us", path: "/about" },
      { label: "Contact", path: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", path: "/privacy-policy" },
      { label: "Terms of Service", path: "/terms-of-service" },
      { label: "Refund Policy", path: "/refund-policy" },
    ],
    social: [
      { icon: <Facebook size={18} />, url: "https://facebook.com/laboursampark", label: "Facebook" },
      { icon: <Twitter size={18} />, url: "https://twitter.com/laboursampark", label: "Twitter" },
      { icon: <Instagram size={18} />, url: "https://instagram.com/laboursampark", label: "Instagram" },
      { icon: <Linkedin size={18} />, url: "https://linkedin.com/company/laboursampark", label: "LinkedIn" },
    ]
  };

  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-zinc-900 pt-20 pb-10 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
              <img src="/images/logo.jpg" alt="LabourSampark" className="w-40 h-12 rounded-xl object-cover shadow-sm" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-md leading-relaxed font-medium">
              India's most trusted platform connecting skilled labourers and verified contractors. We believe in direct connections and transparent work.
            </p>
            <div className="flex gap-4">
              {footerLinks.social.map((item, idx) => (
                <a 
                  key={idx} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => router.push(link.path)}
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-800 group-hover:bg-blue-500 transition-colors"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Support & Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link, idx) => (
                <li key={idx}>
                  <button 
                    onClick={() => router.push(link.path)}
                    className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-800 group-hover:bg-blue-500 transition-colors"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Us</div>
                  <a href="mailto:laboursampark@gmail.com" className="text-gray-900 dark:text-white font-bold hover:text-blue-600 transition-colors">
                    laboursampark@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Call Us</div>
                  <a href="tel:+918956271911" className="text-gray-900 dark:text-white font-bold hover:text-green-600 transition-colors">
                    +91 8956271911
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Location</div>
                  <div className="text-gray-900 dark:text-white font-bold">
                    Maharashtra, India
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-10 border-t border-gray-100 dark:border-zinc-900 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-medium text-center lg:text-left">
            © {new Date().getFullYear()} <span className="text-gray-900 dark:text-white font-bold">LabourSampark</span>. All rights reserved. 
            <p className="mt-1 text-xs opacity-75">Operated by NILESH RAJENDRA NISHAD</p>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Platform Status: Online
            </div>
            <div className="h-4 w-px bg-gray-200 dark:bg-zinc-800 hidden sm:block"></div>
            <div className="text-xs font-medium text-gray-400">
              Handcrafted in India 🇮🇳
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
