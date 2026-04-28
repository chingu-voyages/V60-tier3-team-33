export const formatDate = (date: string | Date, style: "short" | "long") => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: style,
    day: "numeric",
  });

  return formattedDate;
};
