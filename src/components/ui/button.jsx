import React from "react";

export function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "default",
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default:
      "bg-black text-white hover:bg-gray-800 active:scale-95 h-10 px-4 py-2 shadow-sm",
    outline:
      "border border-gray-300 bg-white text-black hover:bg-gray-50 active:scale-95 h-10 px-4 py-2 shadow-sm",
    ghost: "hover:bg-gray-100 text-gray-700 h-10 px-4 py-2",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
