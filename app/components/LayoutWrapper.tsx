"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Menu from "./Menu";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define routes where header and footer should not be shown
  const hideHeaderFooter = 
    pathname === "/login" || 
    pathname === "/register" || 
    pathname?.startsWith("/reset-password");

  if (hideHeaderFooter) {
    return (
      <main className="flex-grow min-h-screen bg-zinc-50 dark:bg-black">
        {children}
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Menu />
      <main className="flex-grow min-h-screen bg-zinc-50 dark:bg-black pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
