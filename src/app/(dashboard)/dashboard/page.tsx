"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { 
  ClipboardList, 
  UserPlus, 
  Users, 
  ArrowRight, 
  LayoutDashboard,
  Loader2
} from "lucide-react";
// Import the same service used in your Admissions page
import { getAdmissions } from "@/modules/enquiry/services/enquiryService";

export default function DashboardPage() {
  const [studentCount, setStudentCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getAdmissions();
        setStudentCount(data?.length || 0);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        setStudentCount(0);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <LayoutDashboard size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Emergent Institute</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            Admin Overview
          </h1>
          <p className="text-sm text-slate-500">
            Manage your institution's growth and operations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Enquiry Card */}
        <Card className="p-6 hover:shadow-lg hover:border-blue-500/50 transition-all group relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <ClipboardList size={26} />
            </div>
            <ArrowRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
          </div>
          
          <div className="mt-5 relative z-10">
            <h3 className="font-bold text-xl text-slate-800">Enquiries</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Track lead funnel and parent follow-ups.
            </p>
          </div>

          <Link href="/enquiry" className="mt-8 block relative z-10">
            <Button variant="primary" className="w-full shadow-md">
              Open Enquiries
            </Button>
          </Link>

          <div className="absolute -right-4 -bottom-4 text-blue-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <ClipboardList size={120} />
          </div>
        </Card>

        {/* Admission Card */}
        <Card className="p-6 hover:shadow-lg hover:border-emerald-500/50 transition-all group relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <UserPlus size={26} />
            </div>
            <ArrowRight size={20} className="text-slate-300 group-hover:text-emerald-500 transition-transform group-hover:translate-x-1" />
          </div>

          <div className="mt-5 relative z-10">
            <h3 className="font-bold text-xl text-slate-800">Admissions</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Manage enrollments and fee collection.
            </p>
          </div>

          <Link href="/admission" className="mt-8 block relative z-10">
            <Button variant="outline" className="w-full border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-bold">
              Go to Admissions
            </Button>
          </Link>

          <div className="absolute -right-4 -bottom-4 text-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <UserPlus size={120} />
          </div>
        </Card>

        {/* Live Statistics Card */}
        <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl shadow-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Live Status</span>
              </div>
              <Users size={18} className="text-slate-500" />
            </div>

            <div className="mt-10">
              {isLoading ? (
                <Loader2 className="h-10 w-10 animate-spin text-slate-500" />
              ) : (
                <h4 className="text-4xl md:text-5xl font-black tracking-tight">
                  {studentCount}
                </h4>
              )}
              <p className="text-sm text-slate-400 mt-1 font-medium">Total Active Students</p>
            </div>
          </div>

          <div className="pt-6">
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Status: Active</p>
            </div>
          </div>
        </Card>

      </div>
    </main>
  );
}