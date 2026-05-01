import type { AnalyticsResponse, InsightsResponse } from "../types/metrics";
import { MetricCard } from "./MetricCard";

type InsightsOverviewTypes = {
    insights: InsightsResponse
    analytics: AnalyticsResponse
}
function InsightsOverview({insights, analytics}: InsightsOverviewTypes) {
    
    const avgResponseDays =
    insights.avg_response_time && insights.avg_response_time.length > 0
      ? Math.round(
          insights.avg_response_time.reduce((acc, curr) => acc + curr.days, 0) /
            insights.avg_response_time.length,
        )
      : 0;
  
    return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                
        <MetricCard
          title="Applied → Interview"
          value={`${analytics.conversions.applied_to_interview_percent}%`}
          subtext={`${analytics.counts.interview_applications} of ${analytics.counts.total_applications}`}
        />
        <MetricCard
          title="Interview → Offer"
          value={`${analytics.conversions.interview_to_offer_percent}%`}
          subtext={`${analytics.counts.offer_applications} offers`}
        />
        <MetricCard
          title="Response Rate"
          value={`${analytics.conversions.response_rate_percent}%`}
          subtext="of applications"
        />
        <MetricCard
          title="Avg Response Time"
          value={`${avgResponseDays}d`}
          subtext="to first response"
        />
      </div>
  )
}

export default InsightsOverview