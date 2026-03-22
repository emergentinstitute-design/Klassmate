"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
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

// Infer type
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

  // ✅ FIXED FORM SETUP
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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  // Calculations
  const total = watch("total_fees_agreed") || 0;
  const discount = watch("discount_amount") || 0;
  const advance = watch("advance_payment") || 0;

  const finalPayable = total - discount;
  const balance = finalPayable - advance;

  // ✅ FIXED SUBMIT HANDLER
  const onSubmit = async (data: AdmissionFormValues) => {
    if (!enquiryId) return toast.error("Missing Enquiry ID");

    const toastId = toast.loading("Finalizing admission records...");

    try {
      await processAdmission(enquiryId, data);
      toast.success("Admission confirmed successfully!", { id: toastId });
      router.push("/admission");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "An error occurred during admission", { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6 space-y-6 border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 border-b pb-3">
            <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
            <h3 className="text-lg font-bold text-slate-800">Parent & Personal Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label>Mother's Name</Label>
              <Input {...register("mother_name")} />
              {errors.mother_name && <p className="text-red-500 text-[10px]">{errors.mother_name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Date of Birth</Label>
              <Input type="date" {...register("dob")} />
              {errors.dob && <p className="text-red-500 text-[10px]">{errors.dob.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Mother's Phone</Label>
              <Input {...register("mother_mobile")} />
              {errors.mother_mobile && <p className="text-red-500 text-[10px]">{errors.mother_mobile.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Father's Phone</Label>
              <Input {...register("father_mobile")} />
              {errors.father_mobile && <p className="text-red-500 text-[10px]">{errors.father_mobile.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Gender</Label>
              <select {...register("gender")} className="w-full h-10 px-3 border border-slate-200 rounded-md">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-[10px]">{errors.gender.message}</p>}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6 border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 border-b pb-3">
            <div className="w-1.5 h-5 bg-blue-600 rounded-full" />
            <h3 className="text-lg font-bold text-slate-800">Batch & Academic Setup</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input {...register("batch")} placeholder="Batch" />
            <Input {...register("subjects")} placeholder="Subjects" />
          </div>
        </Card>
      </div>

      <div>
        <Card className="p-6 bg-slate-900 text-white">
          <h3 className="text-xl font-bold mb-4">Financial Summary</h3>

          <Input type="number" {...register("total_fees_agreed", { valueAsNumber: true })} />
          <Input type="number" {...register("discount_amount", { valueAsNumber: true })} />
          <Input type="number" {...register("advance_payment", { valueAsNumber: true })} />

          <p>Final: ₹{finalPayable}</p>
          <p>Balance: ₹{balance}</p>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Confirm Admission"}
          </Button>
        </Card>
      </div>
    </form>
  );
}