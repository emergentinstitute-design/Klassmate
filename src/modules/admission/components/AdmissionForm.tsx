"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User, GraduationCap, Wallet, ArrowRight } from "lucide-react";

import { admissionSchema } from "@/lib/validations/admission";
import { processAdmission } from "@/modules/enquiry/services/enquiryService";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

type AdmissionFormValues = z.infer<typeof admissionSchema>;

export default function AdmissionForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const enquiryId = searchParams.get("enquiry_id");
  const studentName = searchParams.get("name") || "";
  const phone = searchParams.get("phone") || "";
  const standard = searchParams.get("standard") || "";
  const board = searchParams.get("board") || "";
  const stream = searchParams.get("stream") || "";

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema) as Resolver<AdmissionFormValues>,
    defaultValues: {
      student_name: studentName,
      mobile_number: phone,
      standard,
      board: (board as any) || "",
      stream,
      school_college: "",
      medium: "English",
      address: "",
      enquiry_taken_by: "Admin",
      enquiry_date: new Date().toISOString().split("T")[0],
      total_fees_agreed: 0,
      discount_amount: 0,
      advance_payment: 0,
      mother_name: "",
      mother_mobile: "",
      father_mobile: "",
      dob: "",
      gender: "" as any,
      batch: "",
      subjects: "",
    },
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = form;

  const total = watch("total_fees_agreed") || 0;
  const discount = watch("discount_amount") || 0;
  const advance = watch("advance_payment") || 0;
  const finalPayable = total - discount;
  const balance = finalPayable - advance;

  const onSubmit = async (data: AdmissionFormValues) => {
    if (!enquiryId) return toast.error("Missing Enquiry ID");
    const toastId = toast.loading("Finalizing admission...");
    try {
      await processAdmission(enquiryId, data);
      toast.success("Admission confirmed!", { id: toastId });
      router.push("/admission");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error occurred", { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-32 lg:pb-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Left Columns: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Parent & Personal */}
          <Card className="p-5 md:p-6 space-y-6 border-slate-200 shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <User size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Parent Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">Mother's Name</Label>
                <Input {...register("mother_name")} className="h-12 text-base rounded-xl bg-slate-50/50" />
                {errors.mother_name && <p className="text-red-500 text-xs">{errors.mother_name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">Date of Birth</Label>
                <Input type="date" {...register("dob")} className="h-12 text-base rounded-xl bg-slate-50/50" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">Mother's Phone</Label>
                <Input {...register("mother_mobile")} inputMode="tel" className="h-12 text-base rounded-xl bg-slate-50/50" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-semibold text-slate-700">Father's Phone</Label>
                <Input {...register("father_mobile")} inputMode="tel" className="h-12 text-base rounded-xl bg-slate-50/50" />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-sm font-semibold text-slate-700">Gender</Label>
                <select {...register("gender")} className="w-full h-12 px-4 border border-slate-200 rounded-xl bg-slate-50/50 text-base outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Section 2: Academic */}
          <Card className="p-5 md:p-6 space-y-6 border-slate-200 shadow-sm rounded-2xl">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Academic Setup</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input {...register("batch")} placeholder="Assign Batch" className="h-12 rounded-xl" />
              <Input {...register("subjects")} placeholder="Subjects/Modules" className="h-12 rounded-xl" />
            </div>
          </Card>
        </div>

        {/* Right Column: Financial Summary */}
        <div className="lg:relative">
          <Card className="p-6 bg-slate-900 text-white rounded-3xl lg:sticky lg:top-6 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wallet size={80} />
            </div>
            
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              Financials
            </h3>

            <div className="space-y-4 relative z-10">
              <div className="space-y-1.5">
                <Label className="text-slate-400 text-xs uppercase font-bold">Agreed Fees</Label>
                <Input 
                  type="number" 
                  inputMode="decimal"
                  {...register("total_fees_agreed", { valueAsNumber: true })} 
                  className="bg-white/10 border-white/20 text-white h-12 text-lg font-bold placeholder:text-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-400 text-xs uppercase font-bold">Discount</Label>
                  <Input 
                    type="number" 
                    inputMode="decimal"
                    {...register("discount_amount", { valueAsNumber: true })} 
                    className="bg-white/10 border-white/20 text-white h-12 font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-400 text-xs uppercase font-bold">Advance</Label>
                  <Input 
                    type="number" 
                    inputMode="decimal"
                    {...register("advance_payment", { valueAsNumber: true })} 
                    className="bg-white/10 border-white/20 text-white h-12 font-bold"
                  />
                </div>
              </div>

              <hr className="border-white/10 my-6" />

              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Net Payable</span>
                <span className="text-xl font-bold">₹{finalPayable.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pb-4">
                <span className="text-slate-400 font-medium">Balance Due</span>
                <span className="text-2xl font-black text-amber-400">₹{balance.toLocaleString()}</span>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-900/20 hidden lg:flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Processing..." : "Confirm Admission"}
                <ArrowRight size={20} />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-4 lg:hidden z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Balance Due</span>
          <span className="text-xl font-black text-slate-900">₹{balance.toLocaleString()}</span>
        </div>
        <Button 
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-blue-600 text-white h-14 px-8 rounded-2xl font-black flex-1 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          {isSubmitting ? "Saving..." : "Confirm"}
          <ArrowRight size={18} />
        </Button>
      </div>
    </form>
  );
}