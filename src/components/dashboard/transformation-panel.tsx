import { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/queryClient";
import { ToasterContext } from "../../helpers/toasterProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SiYoutube, SiTiktok } from "react-icons/si";
import { axiosInstance } from "@/lib/queryClient";

interface ContentItem {
  Caption: string;
  CommentCount: number;
  DurationInSeconds: number;
  Id: number;
  LikeCount: number;
  MediaType: string;
  MediaUrl: string;
  PlayCount: number;
  PublishedAt: string;
  ThumbnailUrl: string;
}

interface TransformationOptions {
  aspectRatio: boolean;
  autoCaption: boolean;
  branding: boolean;
  optimizeTitles: boolean;
}

interface TransformationPanelProps {
  onTransformSuccess: (transformationId?: number) => void;
  selectedDestination?: "YouTube" | "TikTok";
  selectedContentIds?: number[];
}

export function TransformationPanel({
  onTransformSuccess,
  selectedDestination,
  selectedContentIds,
}: TransformationPanelProps) {
  const { showToast } = useContext(ToasterContext);
  const queryClient = useQueryClient();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [targetPlatform, setTargetPlatform] = useState<"YouTube" | "TikTok">(
    selectedDestination || "YouTube"
  );

  // Effect to update targetPlatform when selectedDestination changes
  useEffect(() => {
    if (selectedDestination) {
      setTargetPlatform(selectedDestination);
    }
  }, [selectedDestination]);

  // Effect to initialize selectedItems from selectedContentIds
  useEffect(() => {
    if (selectedContentIds && selectedContentIds.length > 0) {
      setSelectedItems(selectedContentIds);
    }
  }, [selectedContentIds]);
  const [transformationOptions, setTransformationOptions] =
    useState<TransformationOptions>({
      aspectRatio: true,
      autoCaption: true,
      branding: false,
      optimizeTitles: true,
    });

  // Fetch content items from API
  const { data: contentItems = [], isLoading } = useQuery<ContentItem[]>({
    queryKey: ["/api/content"],
    staleTime: 60000,
  });
  const { data: transformations = [], isLoading: isTransformationsLoading } =
    useQuery<any[]>({
      queryKey: ["/api/transformations"],
      staleTime: 60000,
    });

  // Create transformation mutation
  const transformMutation = useMutation({
    mutationFn: async (data: {
      contentIds: number[];
      options: TransformationOptions;
    }) => {
      console.log(data.contentIds);
      const mediaSources = data.contentIds.map((contentId) => {
        const contentItem = contentItems.find((item) => item.Id === contentId);
        return {
          mediaUrl: contentItem?.MediaUrl,
          thumbnailUrl: contentItem?.ThumbnailUrl,
          mediaType: contentItem?.MediaType,
          platformMediaId: contentItem?.Id,
          caption: contentItem?.Caption,
        };
      });
      const requestBody = {
        mediaSources,
        targetPlatforms: [targetPlatform], // assuming targetPlatform is a string like "YouTube" or "TikTok"
        options: {
          aspectRatio: data.options.aspectRatio ? "9:16" : "original", // adjust as needed
          addWatermark: data.options.branding,
          watermarkContent: "", // replace or make dynamic as needed
          watermarkPosition: "", // replace or make dynamic as needed
          addCaptions: false,
        },
      };

      const response = await axiosInstance.post(
        "/MediaTransformation",
        requestBody
      );

      console.log("Created transformations:", response);
      return response;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(
        ["/api/transformations"],
        [...transformations, response.data]
      );
      onTransformSuccess(response.data.jobId);
      // Get the last created transformation ID for preview
      // if (response) {
      //   const lastTransformation = transformations[transformations.length - 1];
      //   console.log("Using transformation for preview:", lastTransformation);

      //   showToast({
      //     title: "Transformation started",
      //     message:
      //       "Your content is being transformed. You can view progress in the preview panel.",
      //     type: "success",
      //   });

      //   // Pass the latest transformation ID to the success handler
      //   // if (lastTransformation && lastTransformation.id) {
      //   //   console.log("Passing transformation ID to success handler:", lastTransformation.id);
      //   //   onTransformSuccess(lastTransformation.id);
      //   // } else {
      //   //   console.log("No transformation ID found, calling success handler without ID");
      //   //   onTransformSuccess();
      //   // }
      // } else {
      //   console.log(
      //     "No transformations created, calling success handler without ID"
      //   );
      //   onTransformSuccess();
      // }
    },
    onError: (error) => {
      console.error("Transformation error:", error);
      showToast({
        title: "Transformation failed",
        message: "Failed to start transformation. Please try again.",
        type: "error",
      });
    },
  });
  // console.log(isError);

  const handleToggleItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleTransform = () => {
    if (selectedItems.length === 0) {
      showToast({
        title: "No content selected",
        message: "Please select at least one content item to transform.",
        type: "error",
      });
      return;
    }

    transformMutation.mutate({
      contentIds: selectedItems,
      options: transformationOptions,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Card>
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Transform Content
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : contentItems?.length === 0 ? (
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No content imported
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Import content from Instagram to start transforming.
            </p>
          </div>
        ) : (
          <div>
            {contentItems
              .filter(
                (item) =>
                  !selectedContentIds?.length ||
                  selectedContentIds.includes(item.Id)
              )
              .map((item: ContentItem) => (
                <div
                  key={item.Id}
                  className="flex items-center justify-between py-3 border-b border-gray-200"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                      <img
                        src={item.ThumbnailUrl}
                        alt={item.Caption}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          (e.target as HTMLImageElement).src =
                            "https://placehold.co/80x80/gray/white?text=No+Image";
                        }}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.Caption}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatViewCount(item.PlayCount)} views •{" "}
                        {formatDate(item.PublishedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      id={`item-${item.Id}`}
                      checked={selectedItems.includes(item.Id)}
                      onCheckedChange={() => handleToggleItem(item.Id)}
                    />
                  </div>
                </div>
              ))}

            {!selectedDestination && (
              <div className="mt-6 mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Destination Platform
                </h4>

                <RadioGroup
                  value={targetPlatform}
                  onValueChange={(value) =>
                    setTargetPlatform(value as "YouTube" | "TikTok")
                  }
                  className="flex flex-col space-y-4"
                >
                  <div className="flex items-start space-x-4">
                    <RadioGroupItem
                      value="YouTube"
                      id="youtube-shorts"
                      className="mt-1"
                    />
                    <div
                      className="flex-1 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setTargetPlatform("YouTube")}
                    >
                      <div className="flex items-center">
                        <SiYoutube className="h-5 w-5 text-red-600 mr-2" />
                        <Label
                          htmlFor="youtube-shorts"
                          className="font-medium cursor-pointer"
                        >
                          YouTube Shorts
                        </Label>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Optimize your content for YouTube Shorts vertical video
                        format with auto-captions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <RadioGroupItem
                      value="TikTok"
                      id="tiktok"
                      className="mt-1"
                    />
                    <div
                      className="flex-1 border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setTargetPlatform("TikTok")}
                    >
                      <div className="flex items-center">
                        <SiTiktok className="h-5 w-5 text-black mr-2" />
                        <Label
                          htmlFor="tiktok"
                          className="font-medium cursor-pointer"
                        >
                          TikTok
                        </Label>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Optimize your content for TikTok with trending sounds
                        and effects
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {selectedDestination && (
              <div className="mt-6 mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Selected Destination
                </h4>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  {targetPlatform === "YouTube" ? (
                    <SiYoutube className="h-5 w-5 text-red-600 mr-2" />
                  ) : (
                    <SiTiktok className="h-5 w-5 text-black mr-2" />
                  )}
                  <span className="font-medium">{targetPlatform}</span>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Transformation Options
              </h4>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Checkbox
                    id="aspect-ratio"
                    checked={transformationOptions.aspectRatio}
                    onCheckedChange={(checked) =>
                      setTransformationOptions((prev) => ({
                        ...prev,
                        aspectRatio: !!checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="aspect-ratio"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Adjust aspect ratio for {targetPlatform} (9:16)
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="auto-caption"
                    checked={transformationOptions.autoCaption}
                    onCheckedChange={(checked) =>
                      setTransformationOptions((prev) => ({
                        ...prev,
                        autoCaption: !!checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="auto-caption"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Generate auto captions
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="add-branding"
                    checked={transformationOptions.branding}
                    onCheckedChange={(checked) =>
                      setTransformationOptions((prev) => ({
                        ...prev,
                        branding: !!checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="add-branding"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Add branding watermark
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="optimize-titles"
                    checked={transformationOptions.optimizeTitles}
                    onCheckedChange={(checked) =>
                      setTransformationOptions((prev) => ({
                        ...prev,
                        optimizeTitles: !!checked,
                      }))
                    }
                  />
                  <Label
                    htmlFor="optimize-titles"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Optimize titles for{" "}
                    {targetPlatform === "YouTube" ? "YouTube" : "TikTok"}{" "}
                    algorithm
                  </Label>
                </div>
              </div>

              <Button
                onClick={handleTransform}
                className="mt-5 w-full bg-[#FF7846] hover:bg-[#FF5A2D]"
                disabled={
                  transformMutation.isPending || selectedItems.length === 0
                }
              >
                {transformMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Transforming...
                  </>
                ) : (
                  "Transform Selected Content"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
