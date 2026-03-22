"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  getAdmissions, 
  collectPayment, 
  deletePayment,
  archiveStudent,
  hardDeleteStudent 
} from "@/modules/enquiry/services/enquiryService";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { PaymentModal } from "@/modules/enquiry/components/PaymentModal";
import { 
  RotateCcw, 
  UserPlus, 
  IndianRupee, 
  Users, 
  Trash2, 
  Archive 
} from "lucide-react";

export default function AdmissionsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getAdmissions();
      setStudents(data || []);
    } catch (error) {
      toast.error("Failed to load admissions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !paymentAmount) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Recording payment...");
    try {
      await collectPayment(selectedStudent.id, Number(paymentAmount));
      toast.success("Payment recorded!", { id: toastId });
      setSelectedStudent(null);
      setPaymentAmount("");
      await loadData();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevertPayment = async (studentName: string, paymentId: string) => {
    if (!confirm(`Are you sure you want to revert the last payment for ${studentName}?`)) return;

    const toastId = toast.loading("Reverting payment...");
    try {
      await deletePayment(paymentId);
      toast.success("Payment reverted and balance updated", { id: toastId });
      await loadData();
    } catch (error: any) {
      toast.error("Failed to revert payment", { id: toastId });
    }
  };

  const handleArchive = async (id: string, name: string) => {
    if (!confirm(`Archive ${name}? This hides the student from the list but keeps their data in the database.`)) return;
    
    const toastId = toast.loading("Archiving...");
    try {
      await archiveStudent(id);
      toast.success("Student archived successfully", { id: toastId });
      await loadData();
    } catch (error) {
      toast.error("Failed to archive student", { id: toastId });
    }
  };

  const handleHardDelete = async (student: any) => {
    const isConfirmed = confirm(
      `CRITICAL WARNING: Permanently delete ${student.student_name}?\n\n` +
      `This will wipe ALL records and ₹${student.total_paid.toLocaleString()} in payments.\n` +
      `THIS ACTION CANNOT BE UNDONE.`
    );
    
    if (!isConfirmed) return;

    const toastId = toast.loading("Purging all records...");
    try {
      await hardDeleteStudent(student.id);
      toast.success("Student and financial records deleted", { id: toastId });
      await loadData();
    } catch (error) {
      toast.error("Permanent deletion failed", { id: toastId });
    }
  };

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Admissions</h1>
          <p className="text-sm text-slate-500 font-medium">Manage student financial records and fee collections.</p>
        </div>
        <Link href="/enquiry" className="w-full sm:w-auto">
          <Button variant="primary" className="w-full flex items-center justify-center gap-2">
            <UserPlus size={18} />
            New Admission
          </Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { 
            label: "Total Students", 
            val: students.length, 
            color: "border-l-blue-600", 
            icon: <Users size={16} className="text-blue-600"/> 
          },
          { 
            label: "Collected", 
            val: `₹${students.reduce((sum, s) => sum + s.total_paid, 0).toLocaleString()}`, 
            color: "border-l-emerald-600", 
            icon: <IndianRupee size={16} className="text-emerald-600"/> 
          },
          { 
            label: "Pending", 
            val: `₹${students.reduce((sum, s) => sum + (s.balance || 0), 0).toLocaleString()}`, 
            color: "border-l-amber-500", 
            icon: <RotateCcw size={16} className="text-amber-500"/> 
          },
        ].map((stat, i) => (
          <Card key={i} className={`p-5 border-l-4 shadow-sm hover:shadow-md transition-shadow ${stat.color}`}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
              {stat.icon}
            </div>
            <h2 className="text-2xl font-black mt-1 text-slate-900">{stat.val}</h2>
          </Card>
        ))}
      </div>

      {/* Admissions Table */}
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-[11px] font-bold text-slate-500 uppercase">
                <th className="px-4 md:px-6 py-4">Student</th>
                <th className="px-4 md:px-6 py-4 text-right hidden md:table-cell">Net Fees</th>
                <th className="px-4 md:px-6 py-4 text-right">Balance</th>
                <th className="px-4 md:px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="text-sm hover:bg-slate-50/50 transition-colors group">
                  <td className="px-4 md:px-6 py-4">
                    <div className="font-bold text-slate-900 leading-tight">{student.student_name}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">{student.standard}</div>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right font-mono hidden md:table-cell text-slate-600">
                    ₹{student.net_fees?.toLocaleString()}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right font-mono font-bold">
                    <span className={student.balance > 0 ? "text-amber-600" : "text-emerald-600"}>
                      ₹{student.balance.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center justify-end gap-1 md:gap-2">
                      {/* Revert Icon */}
                      {student.last_payment_id && (
                        <button
                          onClick={() => handleRevertPayment(student.student_name, student.last_payment_id)}
                          className="p-1.5 text-slate-300 hover:text-amber-600 transition-colors"
                          title="Revert Last Payment"
                        >
                          <RotateCcw size={15} />
                        </button>
                      )}

                      {/* Archive Icon */}
                      <button
                        onClick={() => handleArchive(student.id, student.student_name)}
                        className="p-1.5 text-slate-300 hover:text-blue-600 transition-colors"
                        title="Archive Student"
                      >
                        <Archive size={15} />
                      </button>

                      {/* Hard Delete Icon */}
                      <button
                        onClick={() => handleHardDelete(student)}
                        className="p-1.5 text-slate-300 hover:text-red-600 transition-colors"
                        title="Permanent Delete"
                      >
                        <Trash2 size={15} />
                      </button>

                      <Button 
                        size="sm" 
                        variant={student.balance <= 0 ? "outline" : "primary"}
                        className="h-8 text-[11px] font-bold ml-2"
                        onClick={() => setSelectedStudent(student)}
                        disabled={student.balance <= 0}
                      >
                        {student.balance <= 0 ? "Fully Paid" : "Collect"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      {selectedStudent && (
        <PaymentModal 
          student={selectedStudent}
          amount={paymentAmount}
          setAmount={setPaymentAmount}
          isSubmitting={isSubmitting}
          onClose={() => setSelectedStudent(null)}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </main>
  );
}