"use client";

import * as React from "react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", ...props }, ref) => {
    const hasError = className.includes("border-red-500");
    const borderClass = hasError ? "border-red-500 focus-visible:border-red-600 focus-visible:ring-red-200" : "border-gray-300 focus-visible:border-blue-600 focus-visible:ring-blue-200";
    
    return (
      <select
        className={`flex h-10 w-full rounded-lg border-2 ${borderClass} bg-white px-4 py-2 text-base text-gray-900 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${className.replace("border-red-500", "")}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Select.displayName = "Select";

export { Select };

