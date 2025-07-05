import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { VideoPlayer } from "../ui/video-player";
import { Loader2 } from "lucide-react";
import { ToasterContext } from "../../helpers/toasterProvider";
import axios from "axios";
import { axiosInstance } from "@/lib/queryClient";
import { useAuth } from "@/apis/auth";

// Define our own Transformation interface temporarily
// to include transformationOptions for the preview panel
interface Transformation {
  id: {
    random: string;
    time: string;
  };
  sourceMediaId: string;
  targetPlatform: string;
  mediaUrl: string;
  thumbnailUrl: string;
  mediaType: string;
  duration: number;
  aspectRatio: string;
  transformationOptions: string;
  createdAt: string;
  publishedAt: string;
  publishedMediaId: string;
  publishStatus: string;
  sourceMediaUrl: string;
  transformedMediaUrl: string;
  itemId: string;
  title: string;
  description: string;
  caption: string;
}

interface PreviewPanelProps {
  transformationId?: number;
  onReset: () => void;
}

export function PreviewPanel({ transformationId, onReset }: PreviewPanelProps) {
  const { showToast } = useContext(ToasterContext);
  const { token } = useAuth();
  const userId = token?.userId;
  const [isLoading, setIsLoading] = useState(false);
  const [transformedMedia, setTransformedMedia] =
    useState<Transformation | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const getMediaTransformations = async (transformationId: number) => {
    try {
      const res = await axiosInstance.get(
        `/MediaTransformation/${transformationId}`
      );
      if (res.status === 200) {
        const firstTransformedMedia = res.data?.items[0];
        if (
          firstTransformedMedia &&
          firstTransformedMedia.transformedMediaUrl !== ""
        ) {
          setTransformedMedia(firstTransformedMedia);
          setIsLoading(false);
        } else {
          setTimeout(() => {
            getMediaTransformations(transformationId);
          }, 2000);
        }
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: "Failed to get media transformations",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (transformationId) {
      setIsLoading(true);
      getMediaTransformations(transformationId);
    }
  }, [transformationId]);

  // TikTok upload API call
  const uploadToTikTok = async (
    userId: string,
    media: { id: string; url: string }[]
  ) => {
    const response = await axiosInstance.post("/TikTok/upload", {
      userId,
      media,
    });
    return response.data;
  };

  const uploadToYouTube = async (
    userId: string,
    channelId: string,
    videos: { filePath: string; title: string; description: string }[]
  ) => {
    const response = await axiosInstance.post("/Youtube/upload-videos", {
      channelId,
      userId,
      videos,
    });
    return response.data;
  };

  const handleDownload = async () => {
    // Check for available media URLs - prefer transformed media over source media
    const mediaUrl = transformedMedia?.transformedMediaUrl;

    if (!mediaUrl) {
      showToast({
        title: "Download Failed",
        message: "No media available for download.",
        type: "error",
      });
      return;
    }
    try {
      setIsLoading(true);
      if (
        mediaUrl.includes("instagram.com") ||
        mediaUrl.includes("cdninstagram.com")
      ) {
        // For Instagram URLs, create a direct download link
        const link = document.createElement("a");
        link.href = mediaUrl;
        link.download = `transformed-${
          transformedMedia?.targetPlatform || "content"
        }-${Date.now()}.mp4`;
        link.target = "_blank";

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast({
          title: "Download Started",
          message:
            "Download link opened. If download doesn't start automatically, right-click and 'Save as'.",
          type: "success",
        });
      } else {
        // For other URLs, try to fetch as blob
        const response = await axiosInstance.get(mediaUrl, {
          responseType: "blob",
        });

        // Create a blob URL
        const blob = new Blob([response.data], { type: "video/mp4" });
        const url = window.URL.createObjectURL(blob);

        // Create download link
        const link = document.createElement("a");
        link.href = url;
        link.download = `transformed-${
          transformedMedia?.targetPlatform || "content"
        }-${Date.now()}.mp4`;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up blob URL
        window.URL.revokeObjectURL(url);

        showToast({
          title: "Download Successful",
          message: "Content has been downloaded successfully.",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Download error:", error);

      // If blob download fails, try direct link approach
      try {
        const link = document.createElement("a");
        link.href = mediaUrl;
        link.download = `transformed-${
          transformedMedia?.targetPlatform || "content"
        }-${Date.now()}.mp4`;
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast({
          title: "Download Started",
          message:
            "Download link opened. If download doesn't start automatically, right-click and 'Save as'.",
          type: "success",
        });
      } catch (fallbackError) {
        console.error("Fallback download error:", fallbackError);
        showToast({
          title: "Download Failed",
          message:
            "Failed to download the content. Please try right-clicking the video and selecting 'Save as'.",
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!transformedMedia || !userId) {
      showToast({
        title: "Upload Failed",
        message: "Missing user or media information.",
        type: "error",
      });
      return;
    }

    setIsUploading(true);
    try {
      if (transformedMedia.targetPlatform === "YouTube") {
        await uploadToYouTube(userId, transformedMedia.itemId, [
          {
            filePath: transformedMedia.transformedMediaUrl,
            title: "Transformed Content",
            description: transformedMedia.caption,
          },
        ]);
        showToast({
          title: "Upload Successful",
          message: "Your video has been uploaded to YouTube.",
          type: "success",
        });
      } else {
        await uploadToTikTok(userId, [
          {
            id: transformedMedia?.itemId,
            url: transformedMedia.transformedMediaUrl,
          },
        ]);
        showToast({
          title: "Upload Successful",
          message: "Your video has been uploaded to TikTok.",
          type: "success",
        });
      }
    } catch (error) {
      showToast({
        title: "Upload Failed",
        message: "There was an error uploading your video.",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
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
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Preview & Export
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : !transformedMedia ? (
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No transformed content
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Transform content to see previews.
            </p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#FF7846]" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Transformation in Progress
            </h3>
            <div className="mt-4 max-w-md mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#FF7846] h-2.5 rounded-full"
                  style={{ width: `${10}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{10}% complete</p>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              {transformedMedia?.targetPlatform === "YouTube"
                ? "Converting your Instagram content for YouTube Shorts..."
                : "Converting your Instagram content for TikTok..."}
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {transformedMedia.targetPlatform === "YouTube"
                  ? "YouTube Shorts"
                  : "TikTok"}{" "}
                Preview
              </label>
              <div className="relative rounded-md overflow-hidden">
                {/* Using a placeholder video since real transformation would require video processing */}
                <VideoPlayer
                  src={transformedMedia.transformedMediaUrl || ""}
                  poster={transformedMedia.thumbnailUrl || undefined}
                  aspectRatio="9:16"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                  <p className="text-sm font-medium truncate">
                    {transformedMedia.mediaType
                      ? transformedMedia.transformationOptions
                        ? `Optimized: ${transformedMedia.mediaType}`
                        : transformedMedia.mediaType
                      : "Transformed Content"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Content Details
              </h4>
              <div className="bg-gray-50 rounded-md p-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Platform:</span>
                  <span className="font-medium">
                    {transformedMedia.targetPlatform}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">
                    {transformedMedia.duration
                      ? `${Math.floor(transformedMedia.duration / 60)}:${(
                          transformedMedia.duration % 60
                        )
                          .toString()
                          .padStart(2, "0")}`
                      : "00:00"}
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Resolution:</span>
                  <span className="font-medium">1080x1920</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Format:</span>
                  <span className="font-medium">MP4</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleUpload}
                className="w-full bg-[#FF7846] hover:bg-[#FF5A2D] text-white"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Uploading to {transformedMedia.targetPlatform}...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
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
                    Upload to {transformedMedia.targetPlatform}
                  </>
                )}
              </Button>

              <Button
                onClick={handleDownload}
                className="w-full bg-secondary-500 hover:bg-secondary-600 text-black"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download Transformed Content
                  </>
                )}
              </Button>

              <Button onClick={onReset} variant="outline" className="w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Create New Transformation
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
