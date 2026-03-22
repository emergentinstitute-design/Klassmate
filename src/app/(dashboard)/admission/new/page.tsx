import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import AdmissionForm from "@/modules/admission/components/AdmissionForm";

export const dynamic = "force-dynamic";

export default function NewAdmissionPage() {
  return (
    <main className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Finalize Admission</h1>
        <p className="text-slate-500 mt-1">Complete the enrollment process for the selected student.</p>
      </div>

      <Suspense 
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-slate-500 font-medium">Preparing Admission Form...</p>
          </div>
        }
      >
        <AdmissionForm />
      </Suspense>
    </main>
  );
}