export type Application = {
  company: string;
  role: string;
  dateApplied: string;
  status: "Applied" | "Interviewed" | "Offer" | "Rejected";
  location: string;
  type: "Full-Time" | "Part-Time" | "Contract" | "Intern";
  workType: "Remote" | "Hybrid" | "Onsite";
  minSalary: number | null;
  maxSalary: number | null;
  notes: string;
  favorite: boolean;
};