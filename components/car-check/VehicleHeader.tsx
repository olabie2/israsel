"use client";

import { useTranslations } from "next-intl";
import { FaCar, FaExclamationCircle, FaCheckCircle, FaGlobe, FaWheelchair, FaTimesCircle } from "react-icons/fa";
import { CarData } from "./types";
import { Badge } from "./Badge";
import { formatDate } from "./utils";

type VehicleHeaderProps = {
    vehicleData: CarData;
    translateWithFallback: (category: string, value?: string) => string;
};

export const VehicleHeader = ({ vehicleData, translateWithFallback }: VehicleHeaderProps) => {
    const tCar = useTranslations("CarCheck");

    const getVehicleBadges = () => {
        const badges = [];
        if (vehicleData?.disabledPermit) {
            badges.push(
                <Badge key="disabled" type="info">
                    <FaWheelchair className="inline w-3 h-3 me-1" />
                    {tCar("disabledPermitBadge")}
                </Badge>
            );
        }
        if (vehicleData?.isImported) {
            badges.push(
                <Badge key="imported" type="warning">
                    <FaGlobe className="inline w-3 h-3 me-1" />
                    {tCar("importedBadge")}
                </Badge>
            );
        }
        if (vehicleData?.isActive) {
            badges.push(
                <Badge key="active" type="success">
                    <FaCheckCircle className="inline w-3 h-3 me-1" />
                    {tCar("activeBadge")}
                </Badge>
            );
        } else {
            badges.push(
                <Badge key="inactive" type="danger">
                    <FaTimesCircle className="inline w-3 h-3 me-1" />
                    {tCar("inactiveBadge")}
                </Badge>
            );
        }
        return badges;
    };

    return (
        <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                    <div className="mb-4 flex items-center gap-4">
                        <div className="rounded-xl bg-blue-100 p-3">
                            <FaCar className="text-3xl text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {translateWithFallback("Manufacturer", vehicleData.tozeret_nm)}{" "}
                                {vehicleData.kinuy_mishari || ""}
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600">
                                {vehicleData.shnat_yitzur || tCar("unknown")} •{" "}
                                {translateWithFallback("ModelType", vehicleData.sug_degem)}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">{getVehicleBadges()}</div>
                    {!vehicleData?.isActive && (
                        <div className="mt-10">
                            <p className="text-red-600">
                                <FaExclamationCircle className="inline w-4 h-4 me-2" />
                                <strong>{tCar("inactiveVehicleWarningStrong")}</strong> —{" "}
                                {tCar("inactiveVehicleWarning")}
                            </p>
                            <p className="mt-2  text-gray-400">
                                {tCar("cancellationDate")}:{" "}
                                {typeof vehicleData?.bitul_dt == "string"
                                    ? formatDate(vehicleData?.bitul_dt)
                                    : ""}
                            </p>
                        </div>
                    )}
                </div>
                <div className="text-right">
                    <p className="mb-1 text-sm text-gray-500">{tCar("vehicleNumberLabel")}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{vehicleData.mispar_rechev}</p>
                </div>
            </div>
        </div>
    );
};
