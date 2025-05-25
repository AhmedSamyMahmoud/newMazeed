import { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Loader2 } from "lucide-react";
import { ToasterContext } from "../../helpers/toasterProvider";

interface Transformation {
  id: number;
  contentId: number;
  targetPlatform: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  outputUrl?: string;
  createdAt: string;
}

interface ContentItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  duration: number;
  sourceType: string;
}

interface TransformationQueueProps {
  onSelectTransformation: (transformationId: number) => void;
}

export function TransformationQueue({
  onSelectTransformation,
}: TransformationQueueProps) {
  const { showToast } = useContext(ToasterContext);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Get all transformations
  const {
    data: transformations,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/api/transformations"],
  });

  // Setup polling for in-progress transformations
//   useEffect(() => {
//     let intervalId: NodeJS.Timeout;

//     if (
//       transformations?.some((t: Transformation) => t.status === "processing")
//     ) {
//       intervalId = setInterval(() => {
//         refetch();
//         setLastUpdated(new Date());
//       }, 5000); // Poll every 5 seconds
//     }

//     return () => {
//       if (intervalId) clearInterval(intervalId);
//     };
//   }, [transformations, refetch]);

  // Fetch content items for the transformations
//   const { data: contentItems = [] } = useQuery({
//     queryKey: ["/api/content"],
//     enabled: !isLoading && !!transformations?.length,
//   });

  // Find content for a specific contentId
//   const getContentForTransformation = (contentId: number) => {
//     return contentItems.find((item: ContentItem) => item.id === contentId);
//   };

  // Handle transformation cancel
  //   const handleCancel = async (id: number) => {
  //     try {
  //       await apiRequest("DELETE", `/api/transformations/${id}`);
  //       refetch();
  //       toast({
  //         title: "Transformation cancelled",
  //         description: "The transformation has been removed from the queue."
  //       });
  //     } catch (error) {
  //       console.error("Error cancelling transformation:", error);
  //       toast({
  //         title: "Cancellation failed",
  //         description: "Failed to cancel the transformation. Please try again.",
  //         variant: "destructive",
  //       });
  //     }
  //   };

  // Format date/time
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  // Format duration
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m:${secs.toString().padStart(2, "0")}s`;
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b border-gray-200 flex flex-row justify-between items-center px-6 py-5">
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Transformation Queue
        </CardTitle>
        <span className="text-sm text-gray-500">
          Last updated: {formatTimeAgo(lastUpdated.toISOString())}
        </span>
      </CardHeader>
      <CardContent className="px-6 py-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : !transformations?.length ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">
              No transformations in the queue.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Content
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Source
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Target
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transformations.map((transformation: Transformation) => {
                  const content = getContentForTransformation(
                    transformation.contentId
                  );
                  return (
                    <tr key={transformation.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                            <img
                              src={
                                content?.thumbnailUrl ||
                                "https://placehold.co/80x80/gray/white?text=No+Image"
                              }
                              alt={content?.title || "Content thumbnail"}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "https://placehold.co/80x80/gray/white?text=No+Image";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {content?.title ||
                                `Content #${transformation.contentId}`}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDuration(content?.duration)} duration
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {content?.sourceType || "Instagram"}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transformation.targetPlatform}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {transformation.status === "completed" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        )}
                        {transformation.status === "processing" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Processing
                          </span>
                        )}
                        {transformation.status === "queued" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Queued
                          </span>
                        )}
                        {transformation.status === "failed" && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {transformation.status === "completed" && (
                          <Button
                            variant="link"
                            className="text-primary-600 hover:text-primary-900 p-0 h-auto"
                            onClick={() =>
                              onSelectTransformation(transformation.id)
                            }
                          >
                            View
                          </Button>
                        )}
                        {transformation.status === "processing" && (
                          <Progress
                            value={transformation.progress}
                            className="w-20 h-2.5"
                          />
                        )}
                        {transformation.status === "queued" && (
                          <Button
                            variant="link"
                            className="text-red-600 hover:text-red-900 p-0 h-auto"
                            // onClick={() => handleCancel(transformation.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
