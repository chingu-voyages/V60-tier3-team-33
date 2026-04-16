export interface ConversionMetrics {
    totalApplications: number;
    responseRate: number;
    appliedToInterview: number;
    interviewToOffer: number;
}

export interface MetricCardProps {
    title: string;
    percentage: number;
    tooltipText: string;
}

export interface PipelineStage {
    name: string;
    count: number;
}