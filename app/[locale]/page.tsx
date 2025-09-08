"use client";
// import _ from "lodash";
// ***** CHANGE 1: Import useMessages *****
import { useTranslations, useMessages } from "next-intl";
import { Loader2 } from "lucide-react";
import React, {
  useState,
  FC,
  FormEvent,
  KeyboardEvent,
  // PropsWithChildren,
} from "react";
import Head from "next/head";
import {
  FaSearch,
  FaStar,
  FaCar,
  FaInfoCircle,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaGasPump,
  FaCogs,
  FaPalette,
  FaUser,
  FaWrench,
  FaLeaf,
  FaRoad,
  FaTachometerAlt,
  FaDoorOpen,
  FaCheckCircle,
  FaGlobe,
  FaWheelchair,
  FaCarCrash,
  FaBolt,
  FaHandPaper,
  FaPuzzlePiece,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import { getAllVehicleData } from "@/lib/carData";
import { constrainedMemory } from "process";

// --- Type Definitions (No changes) ---
type OwnershipRecord = {
  _id: number;
  mispar_rechev: number;
  baalut_dt: number;
  baalut: string;
  rank_mispar_rechev: number;
};
type Recall = {
  _id: number;
  RECALL_ID: number;
  SHNAT_RECALL: number;
  SUG_RECALL: string;
  SUG_TAKALA: string;
  TEUR_TAKALA: string;
  OFEN_TIKUN: string;
};
type CarData = {
  _id: number;
  mispar_rechev: number;
  tozeret_cd?: number;
  sug_degem?: string;
  tozeret_nm?: string;
  degem_cd?: number;
  degem_nm?: string;
  ramat_gimur?: string;
  ramat_eivzur_betihuty?: number | null;
  kvutzat_zihum?: number;
  shnat_yitzur?: number;
  degem_manoa?: string;
  mivchan_acharon_dt?: string;
  tokef_dt?: string;
  baalut?: string;
  misgeret?: string;
  tzeva_cd?: number;
  tzeva_rechev?: string;
  zmig_kidmi?: string;
  zmig_ahori?: string;
  sug_delek_nm?: string;
  horaat_rishum?: number | null;
  moed_aliya_lakvish?: string;
  kinuy_mishari?: string;
  nefah_manoa?: number;
  koah_sus?: number;
  mispar_dlatot?: number;
  ownershipHistory?: OwnershipRecord[];
  history1?: unknown;
  gapam_ind?: number;
  kilometer_test_aharon?: number;
  mispar_manoa?: string;
  mkoriut_nm?: string;
  rank_mispar_rechev?: number;
  rishum_rishon_dt?: string;
  shinui_mivne_ind?: number;
  shinui_zmig_ind?: number;
  shnui_zeva_ind?: number;
  disabledPermit?: boolean | object;
  safetyRecalls?: Recall[];
  isImported?: boolean;
  isActive?: boolean;
  bitul_dt?: string | null | Date;
};

// --- Helper Functions (No changes) ---
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "Unknown";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    console.log(e);
    return dateStr;
  }
};
const formatOwnershipDate = (dateInt?: number): string => {
  if (!dateInt) return "Unknown";
  const dateStr = String(dateInt);
  const year = dateStr.slice(0, 4);
  const month = parseInt(dateStr.slice(4, 6), 10);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (month >= 1 && month <= 12) {
    return `${monthNames[month - 1]} ${year}`;
  }
  return dateStr;
};
const formatRoadEntry = (dateStr?: string): string => {
  if (!dateStr || !dateStr?.includes("-")) return dateStr || "Unknown";
  const [year, month] = dateStr?.split("-");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
};
const processOwnershipHistory = (
  history: OwnershipRecord[],
  currentOwnershipType?: string
): OwnershipRecord[] => {
  if (!history || history.length === 0) return [];
  const sortedHistory = [...history].sort((a, b) => {
    if (a.baalut_dt !== b.baalut_dt) return b.baalut_dt - a.baalut_dt;
    if (currentOwnershipType) {
      const aIsCurrent = a.baalut === currentOwnershipType;
      const bIsCurrent = b.baalut === currentOwnershipType;
      if (aIsCurrent && !bIsCurrent) return -1;
      if (!aIsCurrent && bIsCurrent) return 1;
    }
    return a._id - b._id;
  });
  return sortedHistory;
};

// --- Reusable UI Components (No changes) ---
// const Tooltip: FC<PropsWithChildren<{ text: string }>> = ({
//   text,
//   children,
// }) => (
//   <div className="group relative inline-block">
//     {" "}
//     {children}{" "}
//     <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none">
//       {" "}
//       {text}{" "}
//       <div className="absolute top-full left-1/2 -translate-x-1/2 transform border-4 border-transparent border-t-gray-900"></div>{" "}
//     </div>{" "}
//   </div>
// );
interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  priority?: boolean;
}
const InfoItem: FC<InfoItemProps> = ({
  label,
  value,
  icon,
  priority = false,
}) => (
  <div
    className={`rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
      priority
        ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-300"
        : "border-gray-200 bg-white hover:border-gray-300"
    }`}
  >
    {" "}
    <div className="mb-2 flex items-center gap-3">
      {" "}
      <div
        className={`rounded-lg p-2 ${
          priority ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
        }`}
      >
        {" "}
        {icon}{" "}
      </div>{" "}
      <span className="text-sm font-medium text-gray-700">{label}</span>{" "}
    </div>{" "}
    <div
      className={`text-lg font-semibold ${
        priority ? "text-blue-900" : "text-gray-900"
      }`}
    >
      {" "}
      {value || "Unknown"}{" "}
    </div>{" "}
  </div>
);
const Badge: FC<{
  type: "success" | "warning" | "info" | "danger";
  children: React.ReactNode;
}> = ({ type, children }) => {
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

// --- SafetyRecalls Component ---
const SafetyRecalls: FC<{ recalls?: Recall[] }> = ({ recalls }) => {
  const t = useTranslations("CarCheck");
  // ***** CHANGE 2: Get all messages for manual lookup *****
  const messages = useMessages();

  // ***** CHANGE 3: The new, robust translation function for this component *****
  const translateWithFallback = (category: string, value?: string): string => {
    if (!value) {
      return t("unknown");
    }
    // Safely access the nested translation object.
    const dataTranslations = messages.DataTranslations as Record<
      string,
      Record<string, unknown>
    >;

    const translation = dataTranslations?.[category]?.[value] as
      | string
      | undefined;
    // If translation exists, return it. Otherwise, return the original value.
    return translation || value;
  };

  const getRecallTypeDetails = (sug_recall: string) => {
    const translatedText = translateWithFallback("RecallTypes", sug_recall);
    switch (sug_recall) {
      case "תקלה סידרתית בטיחותית":
        return {
          text: translatedText,
          icon: <FaShieldAlt />,
          type: "danger" as const,
        };
      case "קמפיין שרות טכני":
        return {
          text: translatedText,
          icon: <FaWrench />,
          type: "info" as const,
        };
      default:
        return {
          text: t("recallNotification"),
          icon: <FaInfoCircle />,
          type: "warning" as const,
        };
    }
  };

  const getProblemTypeIcon = (sug_takala: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "כריות אוויר": <FaCarCrash />,
      בלמים: <FaHandPaper />,
      "מנוע ומערכותיו": <FaCogs />,
      "חשמל אליקטרוניקה ומיזוג": <FaBolt />,
      אביזרים: <FaPuzzlePiece />,
    };
    return iconMap[sug_takala] || <FaCogs />;
  };

  const sortedRecalls = recalls
    ? [...recalls].sort((a, b) => b.SHNAT_RECALL - a.SHNAT_RECALL)
    : [];
  const hasRecalls = sortedRecalls.length > 0;

  return (
    <div className="rounded-2xl bg-white shadow-lg">
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-lg p-2 ${
              hasRecalls ? "bg-red-100" : "bg-green-100"
            }`}
          >
            <FaExclamationTriangle
              className={`text-xl ${
                hasRecalls ? "text-red-600" : "text-green-600"
              }`}
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {t("safetyRecallsTitle")}
          </h2>
        </div>
      </div>
      {hasRecalls ? (
        <div className="max-h-[600px] overflow-y-auto p-6">
          <div className="space-y-4">
            {sortedRecalls.map((recall) => {
              const recallType = getRecallTypeDetails(recall.SUG_RECALL);
              const problemIcon = getProblemTypeIcon(recall.SUG_TAKALA);
              return (
                <div
                  key={recall._id}
                  className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-all hover:border-gray-300 hover:bg-gray-50"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>
                        {t("recallYear")}: {recall.SHNAT_RECALL || t("unknown")}
                      </span>
                    </div>
                    <Badge type={recallType.type}>
                      <span className="flex items-center gap-1.5">
                        {recallType.icon} {recallType.text}
                      </span>
                    </Badge>
                  </div>
                  <div className="mb-4 flex items-start gap-4">
                    <div className="mt-1 text-2xl text-gray-500">
                      {problemIcon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {translateWithFallback(
                          "ProblemTypes",
                          recall.SUG_TAKALA
                        )}
                      </h4>
                      <p className="mt-1 text-sm text-gray-700">
                        {recall.TEUR_TAKALA || t("noDescription")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-gray-200 pt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaWrench className="text-gray-400" />
                      <strong>{t("recommendedFix")}:</strong>{" "}
                      <span>
                        {translateWithFallback(
                          "RepairMethods",
                          recall.OFEN_TIKUN
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center">
            <FaCheckCircle className="text-5xl text-green-500" />
            <p className="mt-4 text-lg font-semibold text-gray-800">
              {t("noActiveRecalls")}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {t("noOutstandingRecalls")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Page Component ---
export default function CarCheckPage() {
  const [carNumberInput, setCarNumberInput] = useState("");
  const [vehicleData, setVehicleData] = useState<CarData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchAnimation, setSearchAnimation] = useState(false);
  const t = useTranslations("HomePage");
  const tCar = useTranslations("CarCheck");

  // ***** CHANGE 4: Get all messages for manual lookup *****
  const messages = useMessages();

  // ***** CHANGE 5: The new, robust translation function for the main page *****
  const translateWithFallback = (category: string, value?: string): string => {
    if (!value) {
      return tCar("unknown");
    }
    // Safely access the nested translation object.
    const dataTranslations = messages.DataTranslations as Record<
      string,
      Record<string, unknown>
    >;

    const translation = dataTranslations?.[category]?.[value] as
      | string
      | undefined;
    // If translation exists, return it. Otherwise, return the original value.
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

    setSearched(true);
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
  const getVehicleBadges = (data: CarData) => {
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
    <>
      <Head>
        <title>{t("landing_title")}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/186171-877288383-poster.webp"
        >
          <source src="/186171-877288383-small.webm" type="video/webm" />
          <source src="/186171-877288383_small.mp4" type="video/mp4" />
          <source src="/186171-877288383.mp4" type="video/mp4" />
          {t("videoTagNotSupported")}
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <h1 className="mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            {t("landing_title")}
          </h1>
          <p className="font-light text-gray-200 text-xl md:text-2xl">
            {t("landing_description")}
          </p>
        </div>
      </div>
      <div className="bg-white py-12">
        <div className="mx-auto max-w-2xl px-4">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label
                htmlFor="carNumber"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                {tCar("vehicleNumberLabel")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="carNumber"
                  value={carNumberInput}
                  onChange={(e) => setCarNumberInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={tCar("vehicleNumberPlaceholder")}
                  maxLength={8}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  aria-label="Vehicle Number Input"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={searchAnimation}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {searchAnimation ? (
                <>
                  <div className="flex items-center">
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    {tCar("searching")}
                  </div>
                </>
              ) : (
                <>
                  <FaSearch className="me-2" /> {tCar("searchVehicleButton")}
                </>
              )}
            </button>
          </form>
          <p className="mt-4 text-center text-sm font-medium text-blue-600">
            {tCar("searchHint")}
          </p>
        </div>
      </div>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          {error && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <FaExclamationTriangle className="mx-auto mb-4 text-4xl text-red-500" />
              <p className="font-medium text-red-700">{error}</p>
            </div>
          )}
          {vehicleData && (
            <div className="space-y-8">
              <div className="rounded-2xl bg-white p-8 shadow-lg">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="rounded-xl bg-blue-100 p-3">
                        <FaCar className="text-3xl text-blue-600" />
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                          {translateWithFallback(
                            "Manufacturer",
                            vehicleData.tozeret_nm
                          )}{" "}
                          {vehicleData.kinuy_mishari || ""}
                        </h1>
                        <p className="text-lg text-gray-600">
                          {vehicleData.shnat_yitzur || tCar("unknown")} •{" "}
                          {translateWithFallback(
                            "ModelType",
                            vehicleData.sug_degem
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {getVehicleBadges(vehicleData)}
                    </div>
                    {!vehicleData?.isActive && (
                      <div className="mt-10">
                        <p className="text-red-600">
                          <FaExclamationCircle className="inline w-4 h-4 me-2" />
                          <strong>
                            {tCar("inactiveVehicleWarningStrong")}
                          </strong>{" "}
                          — {tCar("inactiveVehicleWarning")}
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
                    <p className="mb-1 text-sm text-gray-500">
                      {tCar("vehicleNumberLabel")}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {vehicleData.mispar_rechev}
                    </p>
                  </div>
                </div>
              </div>
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
                      )?.kilometer_test_aharon?.toLocaleString() ??
                      tCar("unknown")
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
                    value={translateWithFallback(
                      "Fuel",
                      vehicleData.sug_delek_nm
                    )}
                    icon={<FaGasPump />}
                    priority={true}
                  />
                  <InfoItem
                    label={tCar("ownership")}
                    value={translateWithFallback(
                      "Ownership",
                      vehicleData.baalut
                    )}
                    icon={<FaUser />}
                    priority={true}
                  />
                </div>
              </div>
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
                          value={translateWithFallback(
                            "Color",
                            vehicleData.tzeva_rechev
                          )}
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
                          value={formatRoadEntry(
                            vehicleData.moed_aliya_lakvish?.toString() ?? ""
                          )}
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
                        <p className="text-sm text-gray-500">
                          {tCar("vinNumber")}
                        </p>
                        <p className="rounded bg-gray-100 p-2 font-mono text-sm">
                          {vehicleData.misgeret ?? tCar("unknown")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {tCar("disabilityAccess")}
                        </p>
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
              <SafetyRecalls recalls={vehicleData.safetyRecalls} />
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
                  {vehicleData.ownershipHistory &&
                  vehicleData.ownershipHistory.length > 0 ? (
                    <>
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
                            {vehicleData.ownershipHistory.map(
                              (record, index) => {
                                const ownershipType = translateWithFallback(
                                  "Ownership",
                                  record.baalut
                                );
                                return (
                                  <tr
                                    key={record._id}
                                    className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                                  >
                                    <td className="px-4 py-4">
                                      <div className="flex items-center gap-3">
                                        <div
                                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                            index === 0
                                              ? "bg-green-100 text-green-700"
                                              : "bg-gray-100 text-gray-600"
                                          }`}
                                        >
                                          {index + 1}
                                        </div>
                                        <span className="font-medium">
                                          {index === 0
                                            ? tCar("currentOwnership")
                                            : tCar("previousOwnership", {
                                                index,
                                              })}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-4">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={`rounded p-1 ${
                                            ownershipType === "Dealer"
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
                                          className={`font-medium ${
                                            ownershipType === "Dealer"
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
                                          {formatOwnershipDate(
                                            record.baalut_dt
                                          )}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-4">
                                      {index === 0 ? (
                                        <Badge type="success">
                                          {tCar("activeStatus")}
                                        </Badge>
                                      ) : (
                                        <Badge type="info">
                                          {tCar("historicalStatus")}
                                        </Badge>
                                      )}
                                    </td>
                                  </tr>
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-6 rounded-lg bg-gray-50 p-4">
                        <h4 className="mb-2 flex items-center gap-2 font-semibold text-gray-800">
                          <FaInfoCircle className="text-blue-500" />
                          {tCar("ownershipHelpTitle")}
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <strong>{tCar("ownershipHelpDealerTitle")}:</strong>{" "}
                            {tCar("ownershipHelpDealerDesc")}
                          </p>
                          <p>
                            <strong>{tCar("ownershipHelpPrivateTitle")}</strong>{" "}
                            {tCar("ownershipHelpPrivateDesc")}
                          </p>
                          <p>
                            <strong>{tCar("ownershipHelpLeaseTitle")}:</strong>{" "}
                            {tCar("ownershipHelpLeaseDesc")}
                          </p>
                          <p>
                            <strong>
                              {tCar("ownershipHelpDateFormatTitle")}
                            </strong>{" "}
                            {tCar("ownershipHelpDateFormatDesc")}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-8 text-center">
                      <FaInfoCircle className="text-4xl text-blue-500" />
                      <p className="mt-3 font-semibold text-gray-800">
                        {tCar("noOwnershipHistory")}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {tCar("noOwnershipHistoryDesc")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
