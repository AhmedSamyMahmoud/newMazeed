import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

export function PerformanceInsights() {
  // Fetch performance data
  // const { data: performanceData, isLoading } = useQuery({
  //   queryKey: ['/api/performance'],
  // });

  const performanceData = {
    totalTransformations: 28,
    avgViewIncrease: 32,
    estimatedRevenueBoost: 1245,
    platformComparison: [
      { platform: "Instagram", views: 145000, engagement: 4.2 },
      { platform: "YouTube Shorts", views: 210000, engagement: 5.8 },
      { platform: "TikTok", views: 180000, engagement: 6.1 },
    ],
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Performance Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-5">
        {!performanceData ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : !performanceData ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">
              No performance data available.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Total Transformations
                </h4>
                <div className="text-2xl font-bold text-primary-600">
                  {performanceData.totalTransformations}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ↑ 14% from last month
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Avg. View Increase
                </h4>
                <div className="text-2xl font-bold text-secondary-500">
                  +{performanceData.avgViewIncrease}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Across all platforms
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-500 mb-2">
                  Estimated Revenue Boost
                </h4>
                <div className="text-2xl font-bold text-green-600">
                  ${performanceData.estimatedRevenueBoost}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ↑ 22% from previous content
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Platform Performance Comparison
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performanceData.platformComparison}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis yAxisId="left" orientation="left" stroke="#3f83f8" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#ff7a00"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="views"
                      name="Views"
                      fill="#3f83f8"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="engagement"
                      name="Engagement"
                      fill="#ff7a00"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="text-right">
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View detailed analytics
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
