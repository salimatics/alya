"use client";

import { FiCheckCircle, FiX } from "react-icons/fi";

interface SuccessToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export default function SuccessToast({ show, message, onClose }: SuccessToastProps) {
  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 shadow-lg fade-in slide-in-from-top-2">
        <div className="flex items-center gap-3">
          <FiCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-800 font-normal text-sm">
              Transaction saved successfully!
            </p>
            <p className="text-xs text-green-700 mt-1">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-green-600 hover:text-green-700 cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

