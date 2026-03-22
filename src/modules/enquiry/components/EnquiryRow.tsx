"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface EnquiryRowProps {
  row: any;
}

export const EnquiryRow = ({ row }: EnquiryRowProps) => {
  const formattedDate = new Date(row.enquiry_date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });

  const statusStyles = row.status === 'pending' 
    ? 'bg-amber-50 text-amber-600 border-amber-100' 
    : 'bg-blue-50 text-blue-600 border-blue-100';

  const admissionQuery = {
    enquiry_id: row.id,
    name: row.student_name,
    phone: row.mobile_number,
    standard: row.standard,
    stream: row.stream,
    board: row.board,
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4">
        <div className="font-semibold text-slate-800">{row.student_name}</div>
        <div className="text-[10px] text-slate-400 md:hidden uppercase tracking-tight">
          {row.standard} • {row.board}
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600 text-sm hidden md:table-cell">
        {row.mobile_number}
      </td>
      <td className="px-6 py-4 text-slate-600 text-sm hidden md:table-cell">
        <span className="font-medium">{row.standard}</span> ({row.board})
      </td>
      <td className="px-6 py-4 text-slate-500 text-sm hidden lg:table-cell">
        {formattedDate}
      </td>
      <td className="px-6 py-4 hidden sm:table-cell">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${statusStyles}`}>
          {row.status || "New"}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <Link href={{ pathname: "/admission/new", query: admissionQuery }}>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-[10px] font-bold border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all uppercase"
          >
            Convert
          </Button>
        </Link>
      </td>
    </tr>
  );
};