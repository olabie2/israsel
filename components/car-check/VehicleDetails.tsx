"use client";

import { useTranslations } from "next-intl";
import {
    FaInfoCircle,
    FaCalendarAlt,
    FaCogs,
    FaPalette,
    FaTachometerAlt,
    FaDoorOpen,
    FaRoad,
    FaStar,
    FaLeaf,
    FaWrench,
    FaShieldAlt,
} from "react-icons/fa";
import { CarData } from "./types";
import { InfoItem } from "./InfoItem";
import { formatRoadEntry } from "./utils";

type VehicleDetailsProps = {
    vehicleData: CarData;
    translateWithFallback: (category: string, value?: string) => string;
};

export const VehicleDetails = ({ vehicleData, translateWithFallback }: VehicleDetailsProps) => {
    const tCar = useTranslations("CarCheck");

    return (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            <div className="space-y-8 xl:col-span-2">
                <div className="rounded-2xl bg-white shadow-lg">
                    <div className="border-b border-gray-200 p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gray-100 p-2">
                                <FaInfoCircle className="text-xl text-gray-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {tCar("completeVehicleInfoTitle")}
                            </h2>
                        </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <InfoItem
                                label={tCar("manufacturingYear")}
                                value={vehicleData.shnat_yitzur}
                                icon={<FaCalendarAlt />}
                            />
                            <InfoItem
                                label={tCar("modelCode")}
                                value={vehicleData.degem_nm}
                                icon={<FaCogs />}
                            />
                            <InfoItem
                                label={tCar("vehicleColor")}
                                value={translateWithFallback("Color", vehicleData.tzeva_rechev)}
                                icon={<FaPalette />}
                            />
                            <InfoItem
                                label={tCar("engineModel")}
                                value={vehicleData.degem_manoa}
                                icon={<FaCogs />}
                            />
                            <InfoItem
                                label={tCar("engineCapacity")}
                                value={
                                    vehicleData.nefah_manoa
                                        ? tCar("engineCapacityValue", {
                                            value: vehicleData.nefah_manoa,
                                        })
                                        : tCar("unknown")
                                }
                                icon={<FaTachometerAlt />}
                            />
                            <InfoItem
                                label={tCar("horsepower")}
                                value={
                                    vehicleData.koah_sus
                                        ? tCar("horsepowerValue", {
                                            value: vehicleData.koah_sus,
                                        })
                                        : tCar("unknown")
                                }
                                icon={<FaTachometerAlt />}
                            />
                            <InfoItem
                                label={tCar("numberOfDoors")}
                                value={vehicleData.mispar_dlatot}
                                icon={<FaDoorOpen />}
                            />
                            <InfoItem
                                label={tCar("roadEntryDate")}
                                value={formatRoadEntry(vehicleData.moed_aliya_lakvish?.toString() ?? "")}
                                icon={<FaRoad />}
                            />
                            <InfoItem
                                label={tCar("trimLevel")}
                                value={vehicleData.ramat_gimur}
                                icon={<FaStar />}
                            />
                            <InfoItem
                                label={tCar("pollutionGroup")}
                                value={
                                    vehicleData.kvutzat_zihum
                                        ? tCar("pollutionGroupValue", {
                                            group: vehicleData.kvutzat_zihum,
                                        })
                                        : tCar("unknown")
                                }
                                icon={<FaLeaf />}
                            />
                            <InfoItem
                                label={tCar("frontTires")}
                                value={vehicleData.zmig_kidmi}
                                icon={<FaWrench />}
                            />
                            <InfoItem
                                label={tCar("rearTires")}
                                value={vehicleData.zmig_ahori}
                                icon={<FaWrench />}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="rounded-2xl bg-white p-6 shadow-lg">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                        <FaShieldAlt className="text-gray-600" />
                        {tCar("securityInformationTitle")}
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">{tCar("vinNumber")}</p>
                            <p className="rounded bg-gray-100 p-2 font-mono text-sm">
                                {vehicleData.misgeret ?? tCar("unknown")}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{tCar("disabilityAccess")}</p>
                            <p className="font-medium">
                                {vehicleData.ramat_eivzur_betihuty
                                    ? tCar("certified")
                                    : tCar("notApplicable")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
