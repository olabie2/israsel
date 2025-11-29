import { FC } from "react";

type BadgeProps = {
    type: "success" | "warning" | "info" | "danger";
    children: React.ReactNode;
};

export const Badge: FC<BadgeProps> = ({ type, children }) => {
    const colors = {
        success: "border-green-200 bg-green-100 text-green-800",
        warning: "border-yellow-200 bg-yellow-100 text-yellow-800",
        info: "border-blue-200 bg-blue-100 text-blue-800",
        danger: "border-red-200 bg-red-100 text-red-800",
    };

    return (
        <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${colors[type]}`}
        >
            {children}
        </span>
    );
};
