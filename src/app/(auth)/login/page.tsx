"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      toast.success("Authentication successful");
      router.push("/admission");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-4">
      {/* Brand Header */}
      <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 text-white shadow-lg mb-4">
          <ShieldCheck size={32} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Emergent <span className="text-blue-600">Institute</span>
        </h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
          By Klassmate<span className="text-blue-600">.</span>
        </p>
      </div>

      <Card className="w-full max-w-md p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-slate-200/60 bg-white/80 backdrop-blur-sm rounded-3xl">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-sm text-slate-500 mt-1">Enter your administrative credentials to continue.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
              Admin Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                placeholder="name@klassmate.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
              />
              <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Remember for 15 days</span>
            </label>
          </div>

          <Button 
            type="submit" 
            className="w-full py-7 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-[0.98]" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                <span>Authenticating...</span>
              </div>
            ) : (
              "Secure Sign In"
            )}
          </Button>
        </form>
      </Card>

      {/* Footer Support */}
      <p className="mt-8 text-xs text-slate-400 font-medium">
        Trouble logging in? Contact <span className="text-slate-600 underline cursor-pointer">System Admin</span>
      </p>
    </div>
  );
}