import type { ApplicationStatus } from "../types/application";

export const getStatusStyles = (status: ApplicationStatus | string) => {
  switch (status) {
    case "interviewing":
    case "screening":
      return "bg-[#D4FA31]/10 text-gray-800 dark:text-[#D4FA31] border-gray-300 dark:border-[#D4FA31]/20";
    case "offer_received":
    case "accepted":
      return "bg-green-100 dark:bg-emerald-500/10 text-green-800 dark:text-emerald-400 border-green-200 dark:border-emerald-500/20";
    case "rejected":
    case "withdrawn":
      return "bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400 border-red-200 dark:border-red-500/20";
    default:
      return "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-300 border-gray-200 dark:border-zinc-700";
  }
};
