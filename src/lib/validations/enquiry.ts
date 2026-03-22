import { z } from "zod";

export const enquirySchema = z.object({
  // Student Details
  student_name: z.string().min(2, "Student name must be at least 2 characters"),
  school_college: z.string().min(1, "School/College name is required"),
  stream: z.string().min(1, "Please select a stream"),
  standard: z.string().min(1, "Please select a standard"),
  board: z.string().min(1, "Please select a board"),
  medium: z.string().min(1, "Please select a medium"),

  // Contact Details
  mobile_number: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  address: z.string().min(5, "Address must be at least 5 characters long"),

  // Academic Info
  previous_percentage: z.coerce
    .number()
    .min(0, "Must be at least 0")
    .max(100, "Must be 100 or less"),

  // Admin Info
  enquiry_taken_by: z.string().min(1, "Admin name is required"),
  enquiry_date: z.coerce.date(),

  // Optional
  remarks: z.string().optional().nullable().transform((val) => val || null),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;