export const formatDate = (date: any, style: "short" | "long") => {

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: style,
    day: "numeric",
  });

  return formattedDate;
};
