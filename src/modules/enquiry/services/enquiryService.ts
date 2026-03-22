import { supabase } from "@/lib/supabase/client";
import { enquirySchema } from "@/lib/validations/enquiry";
import { admissionSchema } from "@/lib/validations/admission";
import { z } from "zod";

// Types derived from Zod
export type EnquiryOutput = z.output<typeof enquirySchema>;
export type AdmissionOutput = z.output<typeof admissionSchema>;

/**
 * 1. CREATE ENQUIRY
 */
export async function createEnquiry(data: EnquiryOutput) {
  const { error } = await supabase.from("enquiries").insert([data]);
  if (error) throw new Error(error.message);
  return { success: true };
}

/**
 * 2. GET ENQUIRIES (Leads only)
 * Updated to exclude archived leads.
 */
export async function getEnquiries() {
  const { data, error } = await supabase
    .from("enquiries")
    .select(`id, student_name, mobile_number, standard, stream, board, enquiry_date, enquiry_taken_by, status`)
    .eq('is_admission', false)
    .neq('status', 'archived') // Filter out archived leads
    .order("enquiry_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * 3. PROCESS ADMISSION
 */
export async function processAdmission(enquiryId: string, data: AdmissionOutput) {
  const { error: updateError } = await supabase
    .from("enquiries")
    .update({
      student_name: data.student_name,
      mobile_number: data.mobile_number,
      standard: data.standard,
      dob: data.dob,
      gender: data.gender,
      mother_name: data.mother_name,
      mother_mobile: data.mother_mobile,
      father_mobile: data.father_mobile,
      subjects: data.subjects,
      batch: data.batch,
      is_admission: true,
      status: 'admitted',
      total_fees_agreed: data.total_fees_agreed,
      discount_amount: data.discount_amount,
      concession_notes: data.concession_notes,
    })
    .eq("id", enquiryId);

  if (updateError) throw new Error(`Update failed: ${updateError.message}`);

  if (data.advance_payment > 0) {
    const { error: paymentError } = await supabase
      .from("payments")
      .insert([{
        enquiry_id: enquiryId,
        amount_paid: data.advance_payment,
        remarks: "Admission Advance Payment",
        payment_date: new Date().toISOString(),
      }]);

    if (paymentError) throw new Error(`Initial payment failed: ${paymentError.message}`);
  }

  return { success: true };
}

/**
 * 4. GET ADMISSIONS (Accounting View)
 * Filters out archived students.
 */
export async function getAdmissions() {
  const { data, error } = await supabase
    .from("enquiries")
    .select(`
      id, student_name, mobile_number, standard, total_fees_agreed, discount_amount, status,
      payments (id, amount_paid, payment_date)
    `)
    .eq("is_admission", true)
    .neq("status", "archived"); // Filter out archived students

  if (error) throw new Error(error.message);

  return data.map((student: any) => {
    const sortedPayments = student.payments?.sort(
      (a: any, b: any) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
    ) || [];

    const totalPaid = sortedPayments.reduce((sum: number, p: any) => sum + p.amount_paid, 0) || 0;
    const netFees = student.total_fees_agreed - (student.discount_amount || 0);
    
    return {
      ...student,
      net_fees: netFees,
      total_paid: totalPaid,
      balance: netFees - totalPaid,
      last_payment_id: sortedPayments[0]?.id || null,
    };
  });
}

/**
 * 5. COLLECT PAYMENT
 */
export async function collectPayment(enquiryId: string, amount: number, remarks: string = "Installment Payment") {
  const { error } = await supabase
    .from("payments")
    .insert([{
      enquiry_id: enquiryId,
      amount_paid: amount,
      remarks: remarks,
      payment_date: new Date().toISOString(),
    }]);

  if (error) throw new Error(`Payment failed: ${error.message}`);
  return { success: true };
}

/**
 * 6. DELETE PAYMENT (Revert transaction)
 */
export async function deletePayment(paymentId: string) {
  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", paymentId);

  if (error) throw new Error(`Reverting payment failed: ${error.message}`);
  return { success: true };
}

/**
 * 7. GET PAYMENT HISTORY
 */
export async function getPaymentHistory(enquiryId: string) {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("enquiry_id", enquiryId)
    .order("payment_date", { ascending: false });

  if (error) throw new Error(`Failed to fetch payment history: ${error.message}`);
  return data;
}

/**
 * 8. ARCHIVE STUDENT (Soft Delete)
 * Marks a student as archived so they are hidden from UI but records remain.
 */
export async function archiveStudent(enquiryId: string) {
  const { error } = await supabase
    .from("enquiries")
    .update({ status: "archived" })
    .eq("id", enquiryId);

  if (error) throw new Error(`Archive failed: ${error.message}`);
  return { success: true };
}

/**
 * 9. PERMANENT DELETE (Hard Delete)
 * Completely removes student and payments (if ON DELETE CASCADE is set in SQL).
 */
export async function hardDeleteStudent(enquiryId: string) {
  const { error } = await supabase
    .from("enquiries")
    .delete()
    .eq("id", enquiryId);

  if (error) throw new Error(`Permanent delete failed: ${error.message}`);
  return { success: true };
}