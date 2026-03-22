import { redirect } from "next/navigation";

export default function RootPage() {
  // If your file is at src/app/(dashboard)/dashboard/page.tsx
  // The URL is simply "/dashboard"
  redirect("/dashboard"); 
}