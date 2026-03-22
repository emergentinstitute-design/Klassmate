import { redirect } from "next/navigation";

export default function RootPage() {
  // Since the Middleware ensures the user is logged in before reaching here,
  // we can safely redirect them to the main dashboard view.
  redirect("/dashboard"); 
}