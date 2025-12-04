"use client";

import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, ...props }, ref) => {
    const hasError = className.includes("border-red-500");
    const borderClass = hasError ? "border-red-500 focus-visible:border-red-600 focus-visible:ring-red-200" : "border-gray-300 focus-visible:border-blue-600 focus-visible:ring-blue-200";
    
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-lg border-2 ${borderClass} bg-white px-4 py-2 text-base text-gray-900 transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${className.replace("border-red-500", "")}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };

