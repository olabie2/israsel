"use client";

import { useTranslations } from "next-intl";
import { FaCalendarAlt, FaRoad, FaGasPump, FaUser, FaStar } from "react-icons/fa";
import { CarData } from "./types";
import { InfoItem } from "./InfoItem";
import { formatDate } from "./utils";

type EssentialInfoProps = {
    vehicleData: CarData;
    translateWithFallback: (category: string, value?: string) => string;
};

export const EssentialInfo = ({ vehicleData, translateWithFallback }: EssentialInfoProps) => {
    const tCar = useTranslations("CarCheck");

    return (
        <div className="rounded-2xl border-l-4 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3">
                    <FaStar className="text-2xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-blue-900">
                    {tCar("essentialInformationTitle")}
                </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <InfoItem
                    label={tCar("lastTestDate")}
                    value={formatDate(vehicleData.mivchan_acharon_dt)}
                    icon={<FaCalendarAlt />}
                    priority={true}
                />

                <InfoItem
                    label={tCar("kilometers")}
                    value={
                        (
                            vehicleData.history1 as {
                                kilometer_test_aharon?: number;
                            }
                        )?.kilometer_test_aharon?.toLocaleString() ?? tCar("unknown")
                    }
                    icon={<FaRoad />}
                    priority={true}
                />
                <InfoItem
                    label={tCar("validUntil")}
                    value={formatDate(vehicleData.tokef_dt)}
                    icon={<FaCalendarAlt />}
                    priority={true}
                />
                <InfoItem
                    label={tCar("fuelType")}
                    value={translateWithFallback("Fuel", vehicleData.sug_delek_nm)}
                    icon={<FaGasPump />}
                    priority={true}
                />
                <InfoItem
                    label={tCar("ownership")}
                    value={translateWithFallback("Ownership", vehicleData.baalut)}
                    icon={<FaUser />}
                    priority={true}
                />
            </div>
        </div>
    );
};
