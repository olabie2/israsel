"use client";
import React, { FC } from "react";

export const Badge: FC<{
  type: "success" | "warning" | "info" | "danger";
  children: React.ReactNode;
}> = ({ type, children }) => {
  const colors = {
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    danger: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[type]}`}
    >
      {children}
    </span>
  );
};