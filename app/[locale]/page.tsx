"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { useTranslations, useMessages } from "next-intl";
import Head from "next/head";
import { FaExclamationTriangle } from "react-icons/fa";
import { getAllVehicleData } from "@/lib/carData";
import { CarData, OwnershipRecord, Recall } from "@/components/car-check/types";
import { processOwnershipHistory } from "@/components/car-check/utils";
import { HeroSection } from "@/components/car-check/HeroSection";
import { SearchForm } from "@/components/car-check/SearchForm";
import { VehicleHeader } from "@/components/car-check/VehicleHeader";
import { EssentialInfo } from "@/components/car-check/EssentialInfo";
import { VehicleDetails } from "@/components/car-check/VehicleDetails";
import { OwnershipHistory } from "@/components/car-check/OwnershipHistory";
import { SafetyRecalls } from "@/components/car-check/SafetyRecalls";

export default function CarCheckPage() {
  const [carNumberInput, setCarNumberInput] = useState("");
  const [vehicleData, setVehicleData] = useState<CarData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchAnimation, setSearchAnimation] = useState(false);
  const t = useTranslations("HomePage");
  const tCar = useTranslations("CarCheck");
  const messages = useMessages();

  const translateWithFallback = (category: string, value?: string): string => {
    if (!value) {
      return tCar("unknown");
    }
    const dataTranslations = messages.DataTranslations as Record<
      string,
      Record<string, unknown>
    >;

    const translation = dataTranslations?.[category]?.[value] as
      | string
      | undefined;
    return translation || value;
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    const cleanedInput = carNumberInput.replace(/-/g, "").trim();

    if (cleanedInput === "") {
      setError(tCar("errorEmptyInput"));
      return;
    }

    if (!/^\d{6,8}$/.test(cleanedInput)) {
      setError(tCar("errorInvalidPlate"));
      return;
    }

    setError(null);
    setVehicleData(null);
    setSearchAnimation(true);
    try {
      const data = (await getAllVehicleData(cleanedInput)) as Record<
        string,
        unknown[] | undefined
      >;

      setSearchAnimation(false);
      const primaryInfo =
        data?.LICENSE_PLATE_NUMBERS_OF_PRIVATE_AND_COMMERCIAL_VEHICLES?.[0] ??
        data
          ?.VEHICLES_TAKEN_OFF_THE_ROAD_WITH_FINAL_CANCELLATION_STATUS_LATEST?.[0] ??
        data?.LICENSE_PLATE_NUMBERS_OF_TWO_WHEELED_VEHICLES?.[0] ??
        data?.PERSONAL_IMPORTED_VEHICLES?.[0] ??
        data
          ?.VEHICLES_TAKEN_OFF_THE_ROAD_WITH_FINAL_CANCELLATION_STATUS_2000_TO_2009_INCLUSIVE?.[0] ??
        data
          ?.VEHICLES_TAKEN_OFF_THE_ROAD_WITH_FINAL_CANCELLATION_STATUS_2010_TO_2016_INCLUSIVE?.[0];
      if (primaryInfo) {
        const techInfo = data?.VEHICLE_MANUFACTURERS_AND_MODELS_WLTP?.[0] as
          | Partial<CarData>
          | undefined;
        const ownershipHistoryData = data?.HISTORY_OF_PRIVATE_VEHICLES_2;
        const history1 = data?.HISTORY_OF_PRIVATE_VEHICLES_1?.[0];
        const disabledPermit =
          data?.VEHICLES_WITH_A_DISABLED_PARKING_PERMIT?.[0] ?? false;
        const safetyRecalls =
          data?.VEHICLE_MANUFACTURER_NOTIFICATIONS_RECALL ?? [];
        const isImported = (data?.PERSONAL_IMPORTED_VEHICLES?.length ?? 0) > 0;

        let isActive = true;
        if (
          (data
            ?.VEHICLES_TAKEN_OFF_THE_ROAD_WITH_FINAL_CANCELLATION_STATUS_LATEST
            ?.length ?? 0) > 0 ||
          (data
            ?.VEHICLES_TAKEN_OFF_THE_ROAD_WITH_FINAL_CANCELLATION_STATUS_2000_TO_2009_INCLUSIVE
            ?.length ?? 0) > 0 ||
          (data
            ?.VEHICLES_TAKEN_OFF_THE_ROAD_WITH_FINAL_CANCELLATION_STATUS_2010_TO_2016_INCLUSIVE
            ?.length ?? 0) > 0
        ) {
          isActive = false;
        }

        const sortedOwnershipHistory = processOwnershipHistory(
          (ownershipHistoryData ?? []) as OwnershipRecord[],
          (primaryInfo as CarData)?.baalut
        );
        const combinedData: CarData = {
          ...(primaryInfo as CarData),
          nefah_manoa: techInfo?.nefah_manoa,
          koah_sus: techInfo?.koah_sus,
          mispar_dlatot: techInfo?.mispar_dlatot,
          ownershipHistory: sortedOwnershipHistory,
          history1,
          disabledPermit,
          safetyRecalls: safetyRecalls as Recall[],
          isImported,
          isActive,
        };
        setVehicleData(combinedData);
      } else {
        setError(tCar("errorNotFound", { carNumber: carNumberInput }));
      }
    } catch (err: unknown) {
      setSearchAnimation(false);
      if (err instanceof Error)
        setError(tCar("errorFetching", { message: err.message }));
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch(e as unknown as FormEvent);
  };

  return (
    <>
      <Head>
        <title>{t("landing_title")}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <HeroSection />

      <SearchForm
        carNumberInput={carNumberInput}
        setCarNumberInput={setCarNumberInput}
        onSubmit={handleSearch}
        onKeyPress={handleKeyPress}
        isSearching={searchAnimation}
      />

      <main className="min-h-[400px] bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          {error && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <FaExclamationTriangle className="mx-auto mb-4 text-4xl text-red-500" />
              <p className="font-medium text-red-700">{error}</p>
            </div>
          )}
          {vehicleData && (
            <div className="space-y-8">
              <VehicleHeader
                vehicleData={vehicleData}
                translateWithFallback={translateWithFallback}
              />
              <EssentialInfo
                vehicleData={vehicleData}
                translateWithFallback={translateWithFallback}
              />
              <VehicleDetails
                vehicleData={vehicleData}
                translateWithFallback={translateWithFallback}
              />
              <SafetyRecalls recalls={vehicleData.safetyRecalls} />
              <OwnershipHistory
                vehicleData={vehicleData}
                translateWithFallback={translateWithFallback}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
