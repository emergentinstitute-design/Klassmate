"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquirySchema } from "@/lib/validations/enquiry";
import { toast } from "sonner";

// Service
import { createEnquiry } from "../services/enquiryService";

// UI Components
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";

export default function EnquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ IMPORTANT: use z.input (NOT z.infer)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof enquirySchema>>({
    resolver: zodResolver(enquirySchema),

    // ✅ RAW INPUT DEFAULTS (strings for form)
    defaultValues: {
      student_name: "",
      school_college: "",
      stream: "",
      standard: "",
      board: "",
      medium: "English",
      mobile_number: "",
      address: "",
      previous_percentage: "", // ✅ string (important)
      enquiry_taken_by: "",
      remarks: "",
      enquiry_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    },
  });

  // ✅ IMPORTANT: raw input type here
  const onSubmit: SubmitHandler<z.input<typeof enquirySchema>> = async (rawData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Saving enquiry to database...");

    try {
      // ✅ FINAL PARSE (THIS FIXES EVERYTHING)
      const data = enquirySchema.parse(rawData);

      await createEnquiry(data);

      toast.success("Enquiry registered successfully!", { id: toastId });
      setIsSuccess(true);
      reset();

      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error: any) {
      toast.error(error.message || "Failed to save. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <p className="text-sm font-medium">
            ✨ Student data has been synchronized with the ERP.
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="text-green-500 hover:text-green-700"
          >
            ✕
          </button>
        </div>
      )}

      <Card className="p-8 shadow-md border-slate-200 bg-white">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          
          {/* Student Profile */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Student Profile</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="student_name">Student Name</Label>
                <Input id="student_name" {...register("student_name")} />
                {errors.student_name && <p className="text-red-500 text-xs">{errors.student_name.message}</p>}
              </div>

              <div>
                <Label htmlFor="school_college">School / College</Label>
                <Input id="school_college" {...register("school_college")} />
                {errors.school_college && <p className="text-red-500 text-xs">{errors.school_college.message}</p>}
              </div>

              <div>
                <Label htmlFor="standard">Standard</Label>
                <Input id="standard" {...register("standard")} />
              </div>

              <div>
                <Label htmlFor="board">Board</Label>
                <Input id="board" {...register("board")} />
              </div>

              <div>
                <Label htmlFor="stream">Stream</Label>
                <Input id="stream" {...register("stream")} />
              </div>

              <div>
                <Label htmlFor="medium">Medium</Label>
                <Input id="medium" {...register("medium")} />
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Contact Info</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="mobile_number">Mobile Number</Label>
                <Input id="mobile_number" {...register("mobile_number")} />
                {errors.mobile_number && <p className="text-red-500 text-xs">{errors.mobile_number.message}</p>}
              </div>

              <div>
                <Label htmlFor="previous_percentage">Previous %</Label>
                <Input type="number" id="previous_percentage" {...register("previous_percentage")} />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address")} />
              </div>
            </div>
          </section>

          {/* Office */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Office Use</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="enquiry_taken_by">Counselor</Label>
                <Input id="enquiry_taken_by" {...register("enquiry_taken_by")} />
              </div>

              <div>
                <Label htmlFor="enquiry_date">Date</Label>
                <Input type="date" id="enquiry_date" {...register("enquiry_date")} />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input id="remarks" {...register("remarks")} />
              </div>
            </div>
          </section>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Submit Enquiry"}
          </Button>
        </form>
      </Card>
    </div>
  );
}