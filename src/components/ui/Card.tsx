import React from "react";
import { cn } from "@/lib/utils"; // Ensure this import exists
export const Card = ({ children, title, className }: { children: React.ReactNode; title?: string; className?: string }) => (
  <div className={cn("bg-[var(--color-app-card)] border border-[var(--color-app-border)] shadow-[var(--shadow-soft)] rounded-[var(--radius-app)] p-6", className)}>
    {title && <h3 className="text-lg font-bold mb-4 text-[var(--color-app-text-main)]">{title}</h3>}
    {children}
  </div>
);