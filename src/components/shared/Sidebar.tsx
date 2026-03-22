"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react"; // Added NextAuth hooks
import { 
  LayoutDashboard, 
  UserPlus, 
  ClipboardList, 
  Receipt, 
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, enabled: true },
  { name: "Enquiry", href: "/enquiry", icon: ClipboardList, enabled: true },
  { name: "Admission", href: "/admission", icon: UserPlus, enabled: true },
  { name: "Fees", href: "#", icon: Receipt, enabled: false },
];

const SMOOTH_SPRING = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  restDelta: 0.001
} as const;

export const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession(); // Get logged-in user data
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMobile = () => setIsOpenMobile(!isOpenMobile);

  if (!mounted) {
    return <aside className="w-[260px] hidden md:block border-r h-screen bg-white" />;
  }

  return (
    <>
      {/* MOBILE TRIGGER */}
      <button 
        onClick={toggleMobile}
        className="md:hidden fixed bottom-6 right-6 z-[60] p-4 bg-slate-900 text-white rounded-full shadow-2xl active:scale-95 transition-all"
      >
        {isOpenMobile ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpenMobile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobile}
            className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[40]"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? 80 : 260,
          x: typeof window !== "undefined" && window.innerWidth < 768 ? (isOpenMobile ? 0 : -300) : 0 
        }}
        transition={SMOOTH_SPRING}
        className={cn(
          "bg-white h-screen border-r border-slate-200 flex flex-col z-[50] overflow-hidden sticky top-0 left-0",
          "fixed md:sticky"
        )}
      >
        {/* Header */}
        <div className="h-20 flex items-center px-6 justify-between border-b border-slate-50">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-black tracking-tighter text-slate-900"
              >
                Klassmate<span className="text-blue-600">.</span>
              </motion.span>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.enabled ? item.href : "#"}
                onClick={() => setIsOpenMobile(false)}
                className={cn(
                  "flex items-center h-12 rounded-xl text-sm font-semibold transition-colors relative group overflow-hidden",
                  item.enabled ? "text-slate-600 hover:bg-slate-50" : "text-slate-300 cursor-not-allowed",
                  isActive && "text-blue-600 bg-blue-50/50"
                )}
              >
                <div className="min-w-[54px] flex justify-center">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                <AnimatePresence mode="popLayout">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Profile Section */}
        <div className="p-3 border-t border-slate-50 space-y-2">
           {/* Mini Profile Info */}
           <div className={cn(
             "flex items-center gap-3 p-2 rounded-xl transition-all",
             isCollapsed ? "justify-center" : "bg-slate-50"
           )}>
             <div className="h-8 w-8 rounded-lg bg-slate-900 flex-shrink-0 flex items-center justify-center text-white">
               <User size={16} />
             </div>
             {!isCollapsed && (
               <div className="flex-1 overflow-hidden">
                 <p className="text-[11px] font-black text-slate-900 truncate leading-none capitalize">
                   {session?.user?.name || "Admin"}
                 </p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                   {session?.user?.role || "Staff"}
                 </p>
               </div>
             )}
           </div>

           {/* Logout Button */}
           <button 
             onClick={() => signOut({ callbackUrl: '/login' })}
             className="flex items-center w-full h-11 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
           >
              <div className="min-w-[54px] flex justify-center">
                <LogOut size={18} />
              </div>
              {!isCollapsed && <span className="text-xs font-bold uppercase tracking-wider">Logout</span>}
           </button>
        </div>
      </motion.aside>
    </>
  );
};