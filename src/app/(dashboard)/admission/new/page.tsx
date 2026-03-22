"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

// Validation & Services
import { admissionSchema } from "@/lib/validations/admission";
import { processAdmission } from "@/modules/enquiry/services/enquiryService";

// UI Components
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
export const dynamic = "force-dynamic";

export default function NewAdmissionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract lead data from URL
  const enquiryId = searchParams.get("enquiry_id");
  const studentName = searchParams.get("name") || "";
  const phone = searchParams.get("phone") || "";
  const standard = searchParams.get("standard") || "";
  const board = searchParams.get("board") || "";
  const stream = searchParams.get("stream") || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof admissionSchema>>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      student_name: studentName,
      mobile_number: phone,
      standard,
      board,
      stream,
      school_college: "",
      medium: "English",
      address: "",
      enquiry_taken_by: "Admin",
      enquiry_date: new Date().toISOString().split("T")[0],
      total_fees_agreed: "",
      discount_amount: "0",
      advance_payment: "0",
    },
  });

  // Live calculation logic
  const total = Number(watch("total_fees_agreed") || 0);
  const discount = Number(watch("discount_amount") || 0);
  const advance = Number(watch("advance_payment") || 0);

  const finalPayable = total - discount;
  const balance = finalPayable - advance;

  const onSubmit = async (rawData: z.input<typeof admissionSchema>) => {
    if (!enquiryId) return toast.error("Missing Enquiry ID");

    const toastId = toast.loading("Finalizing admission records...");

    try {
      // Validate and cast types (String -> Number/Date)
      const validatedData = admissionSchema.parse(rawData);

      await processAdmission(enquiryId, validatedData);

      toast.success("Admission confirmed successfully!", { id: toastId });
      router.push("/admission"); // Navigate to the accounts/admission list
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An error occurred during admission", { id: toastId });
    }
  };

  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Finalize Admission</h1>
        <p className="text-slate-500 mt-1">
          Complete the profile for <span className="font-bold text-blue-600 underline">{studentName}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT & CENTER: PERSONAL & ACADEMIC INFO */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="p-6 space-y-6 border-slate-200">
            <div className="flex items-center gap-2 border-b pb-3">
              <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
              <h3 className="text-lg font-bold text-slate-800">Parent & Personal Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label>Mother's Name</Label>
                <Input {...register("mother_name")} placeholder="Full Name" />
                {errors.mother_name && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.mother_name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Date of Birth</Label>
                <Input type="date" {...register("dob")} />
                {errors.dob && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.dob.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Mother's Phone</Label>
                <Input {...register("mother_mobile")} placeholder="10-digit number" />
                {errors.mother_mobile && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.mother_mobile.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Father's Phone</Label>
                <Input {...register("father_mobile")} placeholder="Emergency contact" />
                {errors.father_mobile && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.father_mobile.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Gender</Label>
                <select {...register("gender")} className="w-full h-10 px-3 border border-slate-200 rounded-md text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.gender.message}</p>}
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-6 border-slate-200">
            <div className="flex items-center gap-2 border-b pb-3">
              <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
              <h3 className="text-lg font-bold text-slate-800">Batch & Academic Setup</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label>Assigned Batch</Label>
                <Input {...register("batch")} placeholder="e.g. 10th Standard - Evening" />
                {errors.batch && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.batch.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Subjects</Label>
                <Input {...register("subjects")} placeholder="e.g. Physics, Chemistry, Math" />
                {errors.subjects && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.subjects.message}</p>}
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT SIDE: FINANCIAL SIDEBAR */}
        <div className="space-y-4">
          <Card className="p-6 bg-slate-900 text-white border-none shadow-2xl sticky top-8">
            <h3 className="text-xl font-bold mb-6 text-blue-400 flex items-center gap-2">
              Financial Summary
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Agreed Fees</Label>
                <Input type="number" {...register("total_fees_agreed")} className="bg-slate-800 border-slate-700 text-white font-mono text-lg" />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-400 text-xs uppercase font-bold tracking-wider">Scholarship / Discount</Label>
                <Input type="number" {...register("discount_amount")} className="bg-slate-800 border-slate-700 text-white font-mono" />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 text-sm">Net Course Value:</span>
                <span className="text-xl font-bold text-white">₹{finalPayable.toLocaleString()}</span>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-blue-400 text-xs uppercase font-bold tracking-wider">Advance Payment (Today)</Label>
                <Input type="number" {...register("advance_payment")} className="bg-white text-slate-900 font-bold text-xl h-12" />
              </div>

              <div className="bg-blue-600/10 p-4 rounded-xl border border-blue-500/20 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold text-blue-300">Outstanding Balance</span>
                  <span className={`text-2xl font-black ${balance > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                    ₹{balance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full mt-8 py-7 text-lg font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 transition-all shadow-lg"
            >
              {isSubmitting ? "Finalizing..." : "Confirm Admission"}
            </Button>
          </Card>
          
          <p className="text-[10px] text-slate-400 text-center uppercase tracking-tighter italic">
            * This action will generate a permanent student ID and ledger.
          </p>
        </div>

      </form>
    </main>
  );
}