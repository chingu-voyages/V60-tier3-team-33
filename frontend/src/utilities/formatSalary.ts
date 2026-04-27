export const formatSalary = (salary?: number | null) => {
  if (salary == null) return "Not listed";

  return `${salary / 1000}k`;
};
