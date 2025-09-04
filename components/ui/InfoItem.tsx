"use client";
import React, { FC } from "react";

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  priority?: boolean;
}

export const InfoItem: FC<InfoItemProps> = ({
  label,
  value,
  icon,
  priority = false,
}) => (
  <div
    className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
      priority
        ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300"
        : "bg-white border-gray-200 hover:border-gray-300"
    }`}
  >
    <div className="flex items-center gap-3 mb-2">
      <div
        className={`p-2 rounded-lg ${
          priority ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
        }`}
      >
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <div
      className={`text-lg font-semibold ${
        priority ? "text-blue-900" : "text-gray-900"
      }`}
    >
      {value || "-"}
    </div>
  </div>
);