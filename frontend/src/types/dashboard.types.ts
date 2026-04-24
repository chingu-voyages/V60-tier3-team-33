export type Application = {
  id: number;
  company_name: string;
  role: string;
  applied_at: string;
  status: "Applied" | "Interviewed" | "Offer" | "Rejected";
  location: string;
  type: "Full-Time" | "Part-Time" | "Contract" | "Intern";
  workType: "Remote" | "Hybrid" | "Onsite";
  salary_min: number | null;
  salary_max: number | null;
  notes: string;
  favorite: boolean;
};