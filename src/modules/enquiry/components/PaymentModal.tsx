"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center z-[100] p-0 md:p-4">
      {/* Mobile-friendly: Slides up from bottom on small screens, centered on large */}
      <Card className="w-full max-w-md p-6 shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300 rounded-t-2xl md:rounded-xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Record Fee Collection</h2>
          <p className="text-sm text-slate-500">
            For <span className="font-bold text-blue-600">{student.student_name}</span>
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Due Balance</p>
              <p className="text-xl font-black text-amber-600">₹{student.balance.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Net Fees</p>
              <p className="text-sm font-bold text-slate-700">₹{netFees.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-700 font-semibold">Amount to Collect (₹)</Label>
            <Input 
              id="amount"
              type="number" 
              autoFocus
              placeholder="0" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg font-bold h-12"
              max={student.balance}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="success"
              className="flex-1"
              disabled={isSubmitting || !amount || Number(amount) <= 0}
            >
              {isSubmitting ? "Saving..." : "Confirm"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};