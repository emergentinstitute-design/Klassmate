    import React from "react";
    import EnquiryForm from "@/modules/enquiry/components/EnquiryForm";

    export const metadata = {
    title: "New Enquiry | Klassmate",
    description: "Register a new student enquiry",
    };

    export default function EnquiryPage() {
    return (
        <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            New Enquiry
            </h1>
            <p className="text-slate-500 mt-2">
            Fill in the details below to register a new student interest.
            </p>
        </div>

        {/* Form Section */}
        <section className="animate-in fade-in duration-500">
            <EnquiryForm />
        </section>
        </main>
    );
    }