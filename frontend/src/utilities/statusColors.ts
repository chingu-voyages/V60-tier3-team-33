// color selector based on applicatoin status
  export const statusColors = {
    total: { text: "text-gray-600", bg: "bg-gray-600/20", dot: "bg-gray-600" },
    Applied: {
      text: "text-blue-500",
      bg: "bg-blue-500/20",
      dot: "bg-blue-500",
    },
    Interviewed: {
      text: "text-purple-500",
      bg: "bg-purple-500/20",
      dot: "bg-purple-500",
    },
    Offer: {
      text: "text-green-500",
      bg: "bg-green-500/20",
      dot: "bg-green-500",
    },
    Rejected: { text: "text-red-500", bg: "bg-red-500/20", dot: "bg-red-500" },
    favorites: { text: "text-yellow-500", bg: "bg-yellow-500/20", dot: "bg-yellow-500" },
};

export type StatusKey = keyof typeof statusColors;