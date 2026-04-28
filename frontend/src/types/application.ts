export type ApplicationStatus = 'applied' | 'screening' | 'interviewing' | 'offer_received' | 'accepted' | 'rejected' | 'withdrawn';

export interface ApplicationExtras {
    url?: string;
    jobNature?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Internship';
    workType?: 'On-site' | 'Hybrid' | 'Remote';
    noSalaryRange?: boolean;
    [key: string]: unknown;
}

export interface Application {
    id: number;
    user_id?: number;
    company_name: string;
    role: string;
    applied_at: string;
    status: ApplicationStatus;
    location?: string;
    notes?: string;
    salary_min?: number;
    salary_max?: number;
    extras?: ApplicationExtras;
    favorite?: boolean
}

export interface PaginatedApplications {
    data: Application[];
    meta: {
        total: number;
        current_page: number;
        per_page: number;
    }
}