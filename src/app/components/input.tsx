"use client";
import { InputHTMLAttributes, ReactNode } from "react";

import { motion } from "framer-motion";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export function Input({ label, icon, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-300">{label}</label>
      )}

      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 
          focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all
          ${error ? "border-red-500 ring-red-500 focus-within:ring-red-500" : ""}
          ${className}`}
      >
        {icon && <span className="text-gray-400">{icon}</span>}
        <input
          {...props}
          className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
        />
      </div>

      {error && (
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
}
