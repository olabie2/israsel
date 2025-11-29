"use client";

import { useTranslations } from "next-intl";
import { FaUser, FaCalendarAlt, FaCar, FaInfoCircle } from "react-icons/fa";
import { CarData } from "./types";
import { Badge } from "./Badge";
import { formatOwnershipDate } from "./utils";

type OwnershipHistoryProps = {
    vehicleData: CarData;
    translateWithFallback: (category: string, value?: string) => string;
};

export const OwnershipHistory = ({ vehicleData, translateWithFallback }: OwnershipHistoryProps) => {
    const tCar = useTranslations("CarCheck");

    if (!vehicleData.ownershipHistory || vehicleData.ownershipHistory.length === 0) {
        return null;
    }

    return (
        <div className="rounded-2xl bg-white shadow-lg">
            <div className="border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-2">
                        <FaUser className="text-xl text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                        {tCar("ownershipHistoryTitle")}
                    </h2>
                </div>
            </div>
            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 text-start font-semibold text-gray-700">
                                    {tCar("period")}
                                </th>
                                <th className="px-4 py-3 text-start font-semibold text-gray-700">
                                    {tCar("ownershipType")}
                                </th>
                                <th className="px-4 py-3 text-start font-semibold text-gray-700">
                                    {tCar("date")}
                                </th>
                                <th className="px-4 py-3 text-start font-semibold text-gray-700">
                                    {tCar("status")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicleData.ownershipHistory.map((record, index) => {
                                const ownershipType = translateWithFallback("Ownership", record.baalut);
                                return (
                                    <tr
                                        key={record._id}
                                        className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${index === 0
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                        }`}
                                                >
                                                    {index + 1}
                                                </div>
                                                <span className="font-medium">
                                                    {index === 0
                                                        ? tCar("currentOwnership")
                                                        : tCar("previousOwnership", { index })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className={`rounded p-1 ${ownershipType === "Dealer"
                                                            ? "bg-blue-100"
                                                            : ownershipType === "Private"
                                                                ? "bg-green-100"
                                                                : "bg-gray-100"
                                                        }`}
                                                >
                                                    {ownershipType === "Dealer" ? (
                                                        <FaCar className="text-sm text-blue-600" />
                                                    ) : (
                                                        <FaUser className="text-sm text-green-600" />
                                                    )}
                                                </div>
                                                <span
                                                    className={`font-medium ${ownershipType === "Dealer"
                                                            ? "text-blue-700"
                                                            : ownershipType === "Private"
                                                                ? "text-green-700"
                                                                : "text-gray-700"
                                                        }`}
                                                >
                                                    {ownershipType}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-sm text-gray-400" />
                                                <span className="font-mono text-sm">
                                                    {formatOwnershipDate(record.baalut_dt)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {index === 0 ? (
                                                <Badge type="success">{tCar("activeStatus")}</Badge>
                                            ) : (
                                                <Badge type="info">{tCar("historicalStatus")}</Badge>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-800">
                        <FaInfoCircle className="text-blue-500" />
                        {tCar("ownershipHelpTitle")}
                    </h4>
                    <p className="text-sm text-gray-600">{tCar("ownershipHelpText")}</p>
                </div>
            </div>
        </div>
    );
};
