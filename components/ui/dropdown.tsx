"use client";

import * as React from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

export interface DropdownOption {
  value: string | number;
  label: string;
}

export interface DropdownProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
}

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  error = false,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const borderClass = error
    ? "border-red-500 focus-within:border-red-600"
    : "border-gray-300 focus-within:border-blue-600";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex h-10 w-full items-center justify-between rounded-md border ${borderClass} bg-white px-4 py-2 text-sm text-gray-900 transition-all duration-200 focus-within:outline-none focus-within:ring-2 ${
          error ? "focus-within:ring-red-200" : "focus-within:ring-blue-200"
        } disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer`}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FiChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">No options available</div>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <FiCheck className="w-4 h-4 text-blue-600" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

