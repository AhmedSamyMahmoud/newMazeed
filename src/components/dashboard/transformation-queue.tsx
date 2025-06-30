import { useState, useEffect, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Loader2 } from "lucide-react";
import { ToasterContext } from "../../helpers/toasterProvider";
import { axiosInstance } from "@/lib/queryClient";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Transformation {
  jobId: number;
  status: string;
  mediaCount: number;
  estimatedCompletionTime: string;
  targetPlatforms: string[];
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
  const queryClient = useQueryClient();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

  // Get all transformations
  const {
    data: transformations,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/api/transformations", currentPage],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/MediaTransformation?page=${currentPage}&pageSize=${pageSize}`
      );
      return response.data;
    },
  });

  // Get job details when expanded
  const { data: jobDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["/api/MediaTransformation", expandedJobId],
    queryFn: async () => {
      if (!expandedJobId) return null;
      const response = await axiosInstance.get(
        `/MediaTransformation/${expandedJobId}`
      );
      return response.data;
    },
    enabled: !!expandedJobId,
  });

  // Setup polling for in-progress transformations
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (
      transformations?.some(
        (t: Transformation) =>
          t.status === "Pending" ||
          t.status === "processing" ||
          t.status === "queued"
      )
    ) {
      intervalId = setInterval(() => {
        refetch();
        setLastUpdated(new Date());
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [transformations, refetch]);

  // Fetch content items for the transformations
  //   const { data: contentItems = [] } = useQuery({
  //     queryKey: ["/api/content"],
  //     enabled: !isLoading && !!transformations?.length,
  //   });

  // Find content for a specific contentId
  const getContentForTransformation = (contentId: number) => {
    return transformations.find((item: ContentItem) => item.id === contentId);
  };

  // Handle transformation cancel
  const handleCancel = async (id: number) => {
    try {
      await axiosInstance.delete(`/MediaTransformation/${id}`);

      // Invalidate all transformation queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ["/api/transformations"],
      });

      showToast({
        title: "Transformation cancelled",
        message: "The transformation has been removed from the queue.",
        type: "success",
      });
    } catch (error) {
      console.error("Error cancelling transformation:", error);
      showToast({
        title: "Cancellation failed",
        message: "Failed to cancel the transformation. Please try again.",
        type: "error",
      });
    }
  };

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

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleViewClick = (jobId: number) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="bg-gray-50 border-b border-gray-200 flex flex-row justify-between relative items-center px-6 py-5">
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  // Invalidate all transformation queries to refresh the data
                  await queryClient.invalidateQueries({
                    queryKey: ["/api/transformations"],
                  });
                  setLastUpdated(new Date());
                  showToast({
                    title: "Success",
                    message: "Transformations refreshed successfully",
                    type: "success",
                  });
                }}
                className="h-8 w-8"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500 hover:text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refetch transformations</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="absolute right-14 mb-1 text-xs text-gray-500 w-[160px]">
          Last updated: {lastUpdated.toLocaleTimeString()}
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
                    Job ID
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
                    Created At
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
                    transformation.jobId
                  );
                  const isExpanded = expandedJobId === transformation.jobId;
                  return (
                    <>
                      <tr key={transformation.jobId}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {/* <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
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
                              </div> */}
                            <div /* className="ml-4" */>
                              <div className="text-sm font-medium text-gray-900 text-xs">
                                {transformation.jobId}
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
                            {transformation.targetPlatforms.join(", ")}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {transformation.status === "Completed" && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Completed
                            </span>
                          )}
                          {transformation.status === "Pending" && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Processing
                            </span>
                          )}
                          {transformation.status === "queued" && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Queued
                            </span>
                          )}
                          {transformation.status === "Failed" && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4  whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(
                              transformation.createdAt
                            ).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(
                              transformation.createdAt
                            ).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          {transformation.status === "Completed" && (
                            <Button
                              variant="link"
                              className="text-primary-600 hover:text-primary-900 p-0 h-auto"
                              onClick={() =>
                                handleViewClick(transformation.jobId)
                              }
                              style={{ border: "none" }}
                            >
                              {isExpanded ? "Hide" : "View"}
                            </Button>
                          )}
                          {transformation.status === "queued" && (
                            <Button
                              variant="link"
                              className="text-red-600 hover:text-red-900 p-0 h-auto"
                              onClick={() => handleCancel(transformation.jobId)}
                            >
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="px-4 py-4 bg-gray-50">
                            {isLoadingDetails ? (
                              <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                              </div>
                            ) : jobDetails ? (
                              <div className="space-y-6">
                                <div className="space-y-4">
                                  <h4 className="font-medium text-gray-900">
                                    Job Details
                                  </h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Job ID
                                      </p>
                                      <p className="text-sm font-medium">
                                        {jobDetails.jobId}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Status
                                      </p>
                                      <p className="text-sm font-medium">
                                        {jobDetails.status}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Created At
                                      </p>
                                      <p className="text-sm font-medium">
                                        {new Date(
                                          jobDetails.createdAt
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">
                                        Target Platforms
                                      </p>
                                      <p className="text-sm font-medium">
                                        {jobDetails.targetPlatforms?.join(", ")}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h4 className="font-medium text-gray-900">
                                    Transformed Items
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {jobDetails.items?.map((item: any) => (
                                      <div
                                        key={item.itemId}
                                        className="border rounded-lg p-4 space-y-3"
                                      >
                                        <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                                          <img
                                            src={item.thumbnailUrl}
                                            alt="Thumbnail"
                                            className="w-full h-full object-cover"
                                          />
                                          {item.status === "Completed" && (
                                            <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
                                              <a
                                                href={item.transformedMediaUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-yellow-400 hover:text-primary-400"
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  className="h-12 w-12"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                  />
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                  />
                                                </svg>
                                              </a>
                                            </div>
                                          )}
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-900">
                                              {item.targetPlatform}
                                            </span>
                                            <span
                                              className={`px-2 py-1 text-xs rounded-full ${
                                                item.status === "Completed"
                                                  ? "bg-green-100 text-green-800"
                                                  : item.status === "Pending"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : "bg-gray-100 text-gray-800"
                                              }`}
                                            >
                                              {item.status}
                                            </span>
                                          </div>
                                          {item.caption && (
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                              {item.caption}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div>
            Showing page <span className="font-medium">{currentPage}</span>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNextPage}
              disabled={!transformations || transformations.length < pageSize}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
