import React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for merging classes

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    
    // Base Styles: Smooth transitions and focus rings
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2";

    // Variant Styles: Hover & Shadow effects
    const variants = {
      primary: "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-blue-200 hover:shadow-lg focus:ring-blue-500",
      outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm focus:ring-slate-200",
      ghost: "text-slate-600 hover:bg-slate-100 active:bg-slate-200",
      danger: "bg-red-500 text-white shadow-sm hover:bg-red-600 hover:shadow-red-200 hover:shadow-lg focus:ring-red-500",
      success: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow-emerald-200 hover:shadow-lg focus:ring-emerald-500",
    };

    // Size Styles
    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm",
      lg: "h-13 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";