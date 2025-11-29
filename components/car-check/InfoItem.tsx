import { FC } from "react";
import { InfoItemProps } from "./types";

export const InfoItem: FC<InfoItemProps> = ({
    label,
    value,
    icon,
    priority = false,
}) => (
    <div
        className={`rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${priority
                ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-300"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
    >
        <div className="mb-2 flex items-center gap-3">
            <div
                className={`rounded-lg p-2 ${priority ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                    }`}
            >
                {icon}
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700">{label}</span>
        </div>
        <div
            className={`text-base sm:text-lg font-semibold ${priority ? "text-blue-900" : "text-gray-900"
                }`}
        >
            {value || "Unknown"}
        </div>
    </div>
);
