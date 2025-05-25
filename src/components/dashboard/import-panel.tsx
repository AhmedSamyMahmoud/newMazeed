import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { ToasterContext } from "../../helpers/toasterProvider";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2, Import } from "lucide-react";
import { SiInstagram } from "react-icons/si";
import { useAuth } from "../../apis/auth";

interface ImportFormValues {
  contentType: string;
  dateRange: string;
  contentCount: string;
  performanceSort: string;
}

interface ImportPanelProps {
  onImportSuccess: () => void;
}

export function ImportPanel({ onImportSuccess }: ImportPanelProps) {
  const { showToast } = useContext(ToasterContext);
  const queryClient = useQueryClient();
  const [importing, setImporting] = useState(false);
  const { token } = useAuth();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ImportFormValues>({
    defaultValues: {
      contentType: "Reels",
      dateRange: "Last 30 days",
      contentCount: "10 most recent",
      performanceSort: "Most recent",
    },
  });

  const importMutation = useMutation({
    mutationFn: async (data: ImportFormValues) => {
      try {
        const response = await apiRequest(
          "GET",
          `https://api.mazeed.ai/api/Instagram/connect?user_id=${token.userId}`
        );
        return response.json();
      } catch (error) {
        console.error("API error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      showToast({
        title: "Content imported successfully",
        message:
          "Your Instagram content has been imported and is ready for transformation.",
        type: "success",
      });
      onImportSuccess();
      setImporting(false);
    },
    onError: (error) => {
      console.error("Import error:", error);
      showToast({
        title: "Import failed",
        message: "Failed to import content from Instagram. Please try again.",
        type: "error",
      });
      setImporting(false);
    },
  });

  const onSubmit = (data: ImportFormValues) => {
    setImporting(true);
    importMutation.mutate(data);
  };

  // Handle select changes
  const handleSelectChange = (name: keyof ImportFormValues, value: string) => {
    setValue(name, value);
  };

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-4">
          <SiInstagram className="text-pink-600 w-8 h-8" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Connect Your Instagram Account
        </h3>
        <p className="text-base text-gray-500 mb-6">
          Let's start by connecting to your Instagram account. We'll import your
          10 most recent reels automatically.
        </p>

        <Card className="w-full bg-gray-50 border border-gray-200 p-6 mb-4">
          <CardContent className="p-0">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <SiInstagram className="text-pink-600 w-5 h-5 mr-2" />
                  <span className="font-medium">Instagram</span>
                </div>
                <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Ready to Connect
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  We'll automatically import:
                </p>
                <ul className="text-sm text-gray-600 list-disc list-inside pl-2 space-y-1">
                  <li>Your 10 most recent Instagram reels</li>
                  <li>Sorted by most recent first</li>
                  <li>Including views, engagement data & thumbnails</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  After connecting, you'll be able to import older content or
                  apply different filters.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="hidden">
          {/* Hidden form fields with defaults */}
          <Select
            defaultValue={watch("contentType")}
            onValueChange={(value) => handleSelectChange("contentType", value)}
          >
            <SelectTrigger id="content-type">
              <SelectValue />
            </SelectTrigger>
          </Select>

          <Select
            defaultValue={watch("dateRange")}
            onValueChange={(value) => handleSelectChange("dateRange", value)}
          >
            <SelectTrigger id="date-range">
              <SelectValue />
            </SelectTrigger>
          </Select>

          <Select
            defaultValue={watch("contentCount")}
            onValueChange={(value) => handleSelectChange("contentCount", value)}
          >
            <SelectTrigger id="content-count">
              <SelectValue />
            </SelectTrigger>
          </Select>

          <Select
            defaultValue={watch("performanceSort")}
            onValueChange={(value) =>
              handleSelectChange("performanceSort", value)
            }
          >
            <SelectTrigger id="performance-sort">
              <SelectValue />
            </SelectTrigger>
          </Select>
        </div>

        <div className="mt-4 max-w-md mx-auto space-y-4">
          <Button
            type="submit"
            className="w-full bg-[#FF7846] hover:bg-[#FF5A2D] transition-colors py-6 text-lg"
            disabled={importing}
          >
            {importing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting to Instagram...
              </>
            ) : (
              <>
                <SiInstagram className="mr-2 h-5 w-5" />
                Connect Instagram Account
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">
              Already using Instagram? You can connect now and customize import
              options later
            </p>
            <Button
              type="button"
              variant="link"
              className="text-[#FF7846] hover:text-[#FF5A2D] transition-colors"
              onClick={() => {
                // Show hidden advanced options logic could go here
                showToast({
                  title: "Import options",
                  message:
                    "You'll be able to select older content after connecting your Instagram account",
                  type: "info",
                });
              }}
            >
              Need to import older reels or specific content?
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
