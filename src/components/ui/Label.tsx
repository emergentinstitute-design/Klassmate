import React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ children, className, ...props }: LabelProps) {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  );
}