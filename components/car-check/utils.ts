// Utility functions for Car Check components
import { OwnershipRecord } from "./types";

export const formatDate = (dateStr?: string): string => {
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

export const formatOwnershipDate = (dateInt?: number): string => {
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

export const formatRoadEntry = (dateStr?: string): string => {
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

export const processOwnershipHistory = (
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

