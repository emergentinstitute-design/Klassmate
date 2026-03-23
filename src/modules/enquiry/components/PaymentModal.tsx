"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { X, CreditCard, ArrowUpRight } from "lucide-react";

interface PaymentModalProps {
  student: any;
  amount: string;
  setAmount: (val: string) => void;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PaymentModal = ({ 
  student, amount, setAmount, isSubmitting, onClose, onSubmit 
}: PaymentModalProps) => {
  const netFees = student.net_fees ?? (student.total_fees_agreed - (student.discount_amount || 0));

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-end md:items-center justify-center z-[100] p-0 md:p-4 transition-all">
      
      {/* Click outside to close (Mobile backdrop) */}
      <div className="absolute inset-0" onClick={onClose} />

      <Card className="relative w-full max-w-md p-6 pb-10 md:pb-6 shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300 rounded-t-[2.5rem] md:rounded-2xl border-none md:border border-slate-200 bg-white">
        
        {/* Mobile Grabber Handle */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden" />

        {/* Header with Close Button */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Collect Fees</h2>
            <p className="text-sm font-medium text-slate-500">
              Student: <span className="text-blue-600">{student.student_name}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* Fee Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
              <p className="text-[10px] uppercase font-bold text-amber-600 mb-1">Due Balance</p>
              <p className="text-lg font-black text-amber-700">₹{student.balance.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Fees</p>
              <p className="text-lg font-black text-slate-700">₹{netFees.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <Label htmlFor="amount" className="text-slate-800 font-bold text-sm">Amount to Collect</Label>
              {/* Quick Action: Pay Full */}
              <button 
                type="button"
                onClick={() => setAmount(student.balance.toString())}
                className="text-[11px] font-bold text-blue-600 uppercase hover:underline"
              >
                Pay Full Amount
              </button>
            </div>
            
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                <span className="font-bold text-lg">₹</span>
              </div>
              <Input 
                id="amount"
                type="number" 
                inputMode="decimal" // Triggers numeric keyboard on mobile
                autoFocus
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-xl font-bold h-14 rounded-xl border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                max={student.balance}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse md:flex-row gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="h-14 md:h-12 flex-1 rounded-xl border-slate-200 font-bold text-slate-500 hover:bg-slate-50" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="h-14 md:h-12 flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
              disabled={isSubmitting || !amount || Number(amount) <= 0}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ArrowUpRight size={18} />
                  <span>Confirm Payment</span>
                </div>
              )}
            </Button>
          </div>
        </form>

        {/* Safe Area Spacer for iOS Home Bar */}
        <div className="h-4 md:hidden" />
      </Card>
    </div>
  );
};