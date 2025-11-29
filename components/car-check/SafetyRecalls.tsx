"use client";

import { FC } from "react";
import { useTranslations, useMessages } from "next-intl";
import {
    FaExclamationTriangle,
    FaCheckCircle,
    FaCalendarAlt,
    FaWrench,
    FaShieldAlt,
    FaInfoCircle,
    FaCarCrash,
    FaHandPaper,
    FaCogs,
    FaBolt,
    FaPuzzlePiece,
} from "react-icons/fa";
import { Recall } from "./types";
import { Badge } from "./Badge";

type SafetyRecallsProps = {
    recalls?: Recall[];
};

export const SafetyRecalls: FC<SafetyRecallsProps> = ({ recalls }) => {
    const t = useTranslations("CarCheck");
    const messages = useMessages();

    if (!recalls || recalls.length === 0) {
        return null;
    }

    const translateWithFallback = (category: string, value?: string): string => {
        if (!value) {
            return t("unknown");
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
                        className={`rounded-lg p-2 ${hasRecalls ? "bg-red-100" : "bg-green-100"
                            }`}
                    >
                        <FaExclamationTriangle
                            className={`text-xl ${hasRecalls ? "text-red-600" : "text-green-600"
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
                                                {translateWithFallback("ProblemTypes", recall.SUG_TAKALA)}
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
                                                {translateWithFallback("RepairMethods", recall.OFEN_TIKUN)}
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
