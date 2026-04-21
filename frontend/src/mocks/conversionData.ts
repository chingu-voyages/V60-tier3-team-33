import type { ConversionMetrics, PipelineStage } from "../types/metrics";

//Mock data to see the looks
export const mockMetricsData: ConversionMetrics = {
    totalApplications: 45,
    responseRate: 35,
    appliedToInterview: 20, 
    interviewToOffer: 20,
}

//Mock data to see the looks
export const mockPipelineData: PipelineStage[] = [
    { name: 'No Response', count: 18 },
    { name: 'Rejected', count: 15 },
    { name: 'Redirected', count: 3 },
    { name: 'Interviewing', count: 7 },
    { name: 'Offers', count: 2 },
];