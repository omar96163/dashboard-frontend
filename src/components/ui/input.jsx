import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 focus-visible:border-black transition-all disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
