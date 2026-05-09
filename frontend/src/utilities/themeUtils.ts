import type { ApplicationStatus } from "../types/application";

export const getStatusStyles = (status: ApplicationStatus | string) => {
  switch (status) {
    case "interviewing":
    case "screening":
      return "bg-[#D4FA31]/10 text-gray-800 dark:text-[#D4FA31]";
    case "offer_received":
    case "accepted":
      return "bg-green-100 dark:bg-emerald-500/10 text-green-800 dark:text-emerald-400";
    case "rejected":
    case "withdrawn":
      return "bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400";
    default:
      return "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-300";
  }
};
