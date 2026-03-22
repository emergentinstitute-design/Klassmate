import { z } from "zod";
import { enquirySchema } from "./enquiry";

export const admissionSchema = enquirySchema.partial().extend({
  // --- Personal & Parent Details ---
  
  // 🔥 FIX: Date of Birth as string for HTML5 input compatibility
  dob: z.string().min(1, "Date of Birth is required"),

  gender: z
    .string()
    .min(1, "Please select a gender")
    .refine((val) => ["Male", "Female", "Other"].includes(val), {
      message: "Invalid gender selected",
    }),

  mother_name: z.string().min(2, "Mother's name is required"),

  mother_mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid 10-digit mobile number"),

  father_mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid 10-digit mobile number"),

  // --- Academic & Batch Info ---
  subjects: z.string().min(1, "Please list the subjects"),
  batch: z.string().min(1, "Batch assignment is required"),

  // --- Financial Details ---
  total_fees_agreed: z.coerce
    .number()
    .min(1, "Total fees must be greater than 0"),

  discount_amount: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .default(0),

  advance_payment: z.coerce
    .number()
    .min(0, "Advance payment cannot be negative"),

  concession_notes: z.string().optional().nullable(),
  
  // --- Override Enquiry Fields ---

  // 🔥 FIX: Change date from z.date() to z.string() 
  // This prevents the conflict between the string from the form and the Date object in the base schema
  enquiry_date: z.string().optional().nullable(),

  // Re-confirming these are required even though they are pre-filled
  student_name: z.string().min(2, "Student name is required"),
  mobile_number: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  standard: z.string().min(1, "Standard is required"),
  
  // Ensure address and other base fields don't block submission if not in the form
  address: z.string().optional().nullable(),
  school_college: z.string().optional().nullable(),
  medium: z.string().optional().nullable(),
  stream: z.string().optional().nullable(),
  board: z.string().optional().nullable(),
});

export type AdmissionFormValues = z.infer<typeof admissionSchema>;