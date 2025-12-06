"use client";

import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-normal transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";
    
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md",
      outline: "border border-blue-600 bg-transparent text-blue-600",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-sm hover:shadow-md",
      ghost: "hover:bg-gray-100",
      link: "text-blue-600 underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3 text-sm",
      lg: "h-11 px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };

