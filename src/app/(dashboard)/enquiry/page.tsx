"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getEnquiries } from "@/modules/enquiry/services/enquiryService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EnquiryRow } from "@/modules/enquiry/components/EnquiryRow";

export default function EnquiryDashboardPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getEnquiries();
        setEnquiries(data || []);
      } catch (error) {
        console.error("Failed to load enquiries");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Enquiry Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Manage leads and potential admissions.</p>
        </div>
        <Link href="/enquiry/new" className="w-full sm:w-auto">
          <Button variant="primary" className="w-full sm:px-8 shadow-md">
            + Add New
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-sm bg-white">
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Class/Board</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoading && enquiries.map((row) => (
                <EnquiryRow key={row.id} row={row} />
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE LIST VIEW (Safe from <tbody> errors) */}
        <div className="md:hidden divide-y divide-slate-100">
          {!isLoading && enquiries.map((row) => (
            <div key={row.id} className="p-4 active:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-900">{row.student_name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                    {row.standard} • {row.board}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                  row.status === 'pending' 
                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                    : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {row.status || "New"}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-slate-600">
                  <span className="font-medium">Contact:</span> {row.mobile_number}
                </div>
                <Link href={{ 
                  pathname: "/admission/new", 
                  query: { 
                    enquiry_id: row.id, 
                    name: row.student_name,
                    phone: row.mobile_number,
                    standard: row.standard,
                    board: row.board
                  } 
                }}>
                  <Button size="sm" className="h-8 px-4 text-[11px] font-bold uppercase bg-blue-600">
                    Convert
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Loading & Empty States */}
        {isLoading && (
          <div className="p-12 text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Enquiries...</p>
          </div>
        )}

        {!isLoading && enquiries.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400">No active enquiries found.</p>
            <Link href="/enquiry/new" className="text-blue-600 font-bold text-sm hover:underline">
              Create your first lead →
            </Link>
          </div>
        )}
      </Card>
    </main>
  );
}