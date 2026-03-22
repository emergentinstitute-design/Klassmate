"use client";

import React from "react";
import Image from "next/image";
import { User, Bell, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; // Import NextAuth hooks

export const Topbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession(); // Access the logged-in user's data

  // Clean Page Title Logic
  const pathParts = pathname.split("/").filter(Boolean);
  const pageTitle =
    pathParts.length === 0
      ? "Overview"
      : pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1);

  return (
    <header className="h-16 md:h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md px-4 md:px-8 grid grid-cols-3 items-center sticky top-0 z-30 transition-all">
      
      {/* LEFT SIDE: Branding */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="relative h-9 w-9 md:h-12 md:w-12 flex-shrink-0 overflow-hidden rounded-lg md:rounded-xl shadow-sm border border-slate-50 bg-white">
          <Image
            src="/logo.avif"
            alt="Emergent Institute Logo"
            fill
            sizes="(max-width: 768px) 36px, 48px"
            className="object-contain p-1"
            priority
          />
        </div>

        <div className="hidden sm:block">
          <h2 className="text-xs md:text-sm font-black text-slate-900 leading-none tracking-tight uppercase">
            Emergent
          </h2>
          <p className="text-[9px] md:text-[10px] font-bold text-blue-600 uppercase tracking-[0.15em] mt-0.5 md:mt-1">
            Institute
          </p>
        </div>
      </div>

      {/* CENTER: Highlighted Page Title */}
      <div className="flex justify-center">
        <div className="bg-slate-900 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full shadow-sm">
          <span className="text-xs md:text-sm font-bold tracking-wide uppercase">
            {pageTitle}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: Notifications & Dynamic Profile */}
      <div className="flex items-center justify-end gap-2 md:gap-5">
        <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all group hidden md:block">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-blue-600 rounded-full border-2 border-white ring-2 ring-blue-50" />
        </button>

        <div className="flex items-center gap-2 md:gap-3 group">
          <div className="text-right hidden sm:block">
            {/* Displaying Real User Name */}
            <p className="text-[11px] font-black text-slate-900 leading-none capitalize transition-colors">
              {session?.user?.name || "Loading..."}
            </p>
            {/* Displaying Real Role */}
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-tighter">
              {session?.user?.role || "User"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* User Initial Avatar */}
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm border border-slate-800">
              <User 
                className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" 
                strokeWidth={2.5} 
              />
            </div>

            {/* Logout Button */}
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};