export interface OverviewResponse {
    total_count: number;
    by_status: {
        applied: number;
        screening: number;
        interviewing: number;
        offer_received: number;
        accepted: number;
        rejected: number;
        withdrawn: number;
    };
    velocity: {
        this_week: number;
        this_month: number;
    };
    recent_applications: Array<{
        id: number;
        company_name: string;
        status: string;
    }>;
}

export interface AnalyticsResponse {
    counts: {
        total_applications: number;
        interview_applications: number;
        offer_applications: number;
    };
    conversions: {
        applied_to_interview_percent: number;
        interview_to_offer_percent: number;
        response_rate_percent: number;
    };
}

export interface MetricCardProps {
    title: string;
    value: string | number;
    subtext?: string;
}

export interface InsightsResponse {
    applications_trend: Array<{ label: string; total: number; interviewed: number }>;
    top_job_titles: Array<{ name: string; count: number }>;
    avg_response_time: Array<{ label: string; days: number }>;
}