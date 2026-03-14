import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border bg-white shadow-md hover:shadow-lg transition-shadow duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h3 className={`${className}`}>{children}</h3>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`${className}`}>{children}</div>;
}
