import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./Label"; // Import the Label here

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <Label>{label}</Label>}
        <input
          ref={ref}
          className={cn(
            "w-full px-3 py-2.5 bg-white border border-[var(--color-app-border)] rounded-[var(--radius-app)] text-sm transition-all outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]/10 focus:border-[var(--color-brand-primary)] placeholder:text-[var(--color-app-text-muted)]/50",
            error && "border-red-500 focus:ring-red-500/10 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };