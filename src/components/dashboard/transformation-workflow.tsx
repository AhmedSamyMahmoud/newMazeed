import { useState, useEffect, useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImportPanel } from "./import-panel";
import { ContentSelection } from "./content-selection";
import { TransformationPanel } from "./transformation-panel";
import { PreviewPanel } from "./preview-panel";
import { SiInstagram, SiYoutube, SiTiktok } from "react-icons/si";
import { ArrowRight, Check } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/queryClient";
import { useAuth } from "@/apis/auth";
import { ToasterContext } from "@/helpers/toasterProvider";

interface Transformation {
  id: number;
  contentId: number;
  targetPlatform: string;
  status: 'queued' | 'Pending' | 'completed' | 'failed';
  progress: number;
  outputUrl?: string;
  transformationOptions?: {
    aspectRatio: boolean;
    autoCaption: boolean;
    branding: boolean;
    optimizeTitles: boolean;
  };
  createdAt: string;
}

interface TransformationWorkflowProps {
  onImportSuccess: () => void;
  onTransformSuccess: (transformationId?: number) => void;
  onSelectTransformation: (id: number) => void;
  selectedTransformationId?: number;
  onReset: () => void;
}

export function TransformationWorkflow({
  onImportSuccess,
  onTransformSuccess,
  onSelectTransformation,
  selectedTransformationId,
  onReset
}: TransformationWorkflowProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [lastCompletedStep, setLastCompletedStep] = useState(0);
  const [selectedContentIds, setSelectedContentIds] = useState<number[]>([]);
  const { token } = useAuth();
  // Custom reset handler that will go back to content selection (step 2)
  const handleResetAndGoBack = () => {
    // First call the parent's onReset to clear the transformation selection
    onReset();
    // Then set the active step back to content selection
    setActiveStep(2);
  };
  const [platformConnections, setPlatformConnections] = useState<{youtube: boolean, tiktok: boolean}>({
    youtube: false,
    tiktok: false
  });
  const [selectedDestination, setSelectedDestination] = useState<"YouTube" | "TikTok" | null>(null);
  
  // Fetch transformations to auto-select completed ones
  const { data: transformations = [] } = useQuery<Transformation[]>({
    queryKey: ['/api/MediaTransformation'],
    // queryFn: async () => {
    //   // const response = await fetch('/api/MediaTransformation');
    //   const response = await axiosInstance.get('/MediaTransformation?page=1&pageSize=10');
    //   if (response.status !== 200) {
    //     throw new Error('Failed to fetch transformations');
    //   }
    //   return response.data;
    // },
    // refetchInterval: 1000 // Check for updates every second to make progress updates more responsive
  });

  const queryClient = useQueryClient();
  const { showToast } = useContext(ToasterContext);

  useEffect(() => {
    localStorage.removeItem("instagramAccountIds");
    localStorage.removeItem("instagramReels");
    localStorage.removeItem("instagram_auth_data");
    queryClient.removeQueries({ queryKey: ["/api/content"] });
    setActiveStep(1);
    setLastCompletedStep(0);
    setSelectedContentIds([]);
  }, []);

  // Auto-select the latest transformation (in-progress or completed) for preview if none is selected
  useEffect(() => {
    // console.log(">>>>transformations", transformations, "selectedTransformationId", selectedTransformationId);
    if (activeStep === 4 && !selectedTransformationId && transformations.length > 0) {
      // First try to find any processing transformations
      const processingTransformations = transformations.filter(t => t.status === "Pending");
      
      if (processingTransformations.length > 0) {
        // Select the most recent processing transformation to show progress
        const latestProcessing = processingTransformations[processingTransformations.length - 1];
        onSelectTransformation(latestProcessing.id);
      } else {
        // If no processing transformations, look for completed ones
        const completedTransformations = transformations.filter(t => t.status === 'completed');
        if (completedTransformations.length > 0) {
          const latestCompleted = completedTransformations[completedTransformations.length - 1];
          onSelectTransformation(latestCompleted.id);
        }
      }
    }
  }, [transformations, activeStep, selectedTransformationId, onSelectTransformation]);
  
  const handleStepClick = (step: number) => {
    // Otherwise, only allow going back to previous steps
    if (step <= activeStep ||  lastCompletedStep + 1 >= step) {
      setActiveStep(step);
    }
    if (selectedTransformationId) {
      onReset()
    }
  };
  
  const handleContinue = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    }
  };
  
  const handleImportSuccess = () => {
    setLastCompletedStep(1);
    onImportSuccess();
    handleContinue(); // Move to content selection step
  };
  
  const handleContentSelection = (selectedIds: number[]) => {
    localStorage.setItem("selectedContentIds", JSON.stringify(selectedIds));
    setSelectedContentIds(selectedIds);
    handleContinue(); // Move directly to platform selection step
  };
  
  const handlePlatformConnect = (platform: "youtube" | "tiktok", isConnected: boolean) => {
    setPlatformConnections(prev => ({...prev, [platform]: isConnected}));
  };
  
  const handleDestinationSelect = (platform: "YouTube" | "TikTok", contentIds: number[]) => {
    setSelectedDestination(platform);
    setSelectedContentIds(contentIds);
    handleContinue(); // Move to transformation step
  };

  const handleYouTubeConnect = async () => {
      try {
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
  
        const popup = window.open(
          `https://api.mazeed.ai/api/Youtube/connect?user_id=${token.userId}`,
          "Instagram Authentication",
          `width=${width},height=${height},left=${left},top=${top}`
        );
  
        // Check if popup was blocked
        if (!popup || popup.closed || typeof popup.closed === "undefined") {
          throw new Error(
            "Popup was blocked. Please allow popups for this site."
          );
        }
  
        // Start checking if popup is closed
        const checkPopupClosed = setInterval(() => {
          if (!popup || popup.closed) {
            clearInterval(checkPopupClosed);
            setPlatformConnections(prev => ({...prev, youtube: true}));
          }
        }, 1000);
      } catch (err) {
        console.error("Error opening popup:", err);
      }
    };

  const handleTikTokConnect = async () => {
    try {
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
  
      const popup = window.open(
        `https://api.mazeed.ai/api/TikTok/connect?user_id=${token.userId}`,
        "Instagram Authentication",
        `width=${width},height=${height},left=${left},top=${top}`
      );
      if (!popup || popup.closed || typeof popup.closed === "undefined") {
        throw new Error(
          "Popup was blocked. Please allow popups for this site."
        );
      }
      const checkPopupClosed = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(checkPopupClosed);
          setPlatformConnections(prev => ({...prev, tiktok: true}));
        }
      }, 1000);
    } catch (err) {
      console.error("Error opening popup:", err);
    }
  };

  return (
    <div className="mb-8">
      {/* Step indicators */}
      <div className="flex items-center justify-between max-w-5xl mx-auto mb-8 relative">
        {/* Connecting lines */}
        <div className="absolute top-5 left-0 right-0 flex justify-between px-10 pointer-events-none">
          {[1, 2, 3].map((step) => (
            <div
              key={`line-${step}`}
              style={{
                width: step === 1 ? '80%' : '100%',
              }}
              className={`h-0.5 w-full ${
                step < activeStep || lastCompletedStep >= step + 1
                  ? 'bg-[#FF7846]'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Step indicators */}
        {[1, 2, 3, 4].map((step) => (
          <div 
            key={step} 
            className="flex flex-col items-center cursor-pointer relative z-10"
            onClick={() => handleStepClick(step)}
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                step === activeStep 
                  ? 'bg-[#FF7846] text-white border-[#FF7846]' 
                  : step < activeStep || lastCompletedStep + 1 >= step
                    ? 'bg-white text-[#FF7846] border-[#FF7846]' 
                    : 'bg-white text-gray-400 border-gray-200'
              }`}
            >
              {step < activeStep ? <Check className="w-5 h-5" /> : step}
            </div>
            <span 
              className={`mt-2 text-sm font-medium ${
                step <= activeStep || lastCompletedStep + 1 >= step ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {step === 1 ? 'Import' : 
               step === 2 ? 'Select Content' : 
               step === 3 ? 'Choose Platform' : 
                'Transform'}
            </span>
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card className="border border-gray-100 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {activeStep === 1 && (
            <div className="p-6">
              <ImportPanel onImportSuccess={handleImportSuccess} />
            </div>
          )}
          
          {activeStep === 2 && (
            <div className="p-6">
              <ContentSelection onContinue={handleContentSelection} />
            </div>
          )}

          {activeStep === 3 && (
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-6 text-gray-900">Select Destination Platform</h3>
                <p className="text-gray-600 mb-6">
                  Select where to publish your transformed content. Connect your account before selecting a platform.
                </p>
              </div>
              <div className="space-y-6">
                {/* YouTube Platform Card */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
                        <SiYoutube className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">YouTube</h3>
                        <p className="text-xs text-gray-500">Destination for YouTube Shorts</p>
                      </div>
                    </div>
                    {platformConnections.youtube ? (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Connected</span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">Not connected</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="outline" 
                      className={`flex-1 ${
                        platformConnections.youtube 
                          ? "border-gray-300 text-gray-500" 
                          : "border-red-600 text-red-600 hover:bg-red-50"
                      }`}
                      disabled={platformConnections.youtube}
                      onClick={handleYouTubeConnect}
                    >
                      <SiYoutube className="mr-2 h-4 w-4" />
                      {platformConnections.youtube ? "Connected" : "Connect YouTube"}
                    </Button>
                    
                    {platformConnections.youtube ? (
                      <Button 
                        className="flex-1 bg-[#FF7846] hover:bg-[#FF5A2D]"
                        onClick={() => handleDestinationSelect("YouTube", selectedContentIds)}
                      >
                        Select as Destination
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1"
                        variant="outline"
                        disabled
                      >
                        Connect YouTube first
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* TikTok Platform Card */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                        <SiTiktok className="h-6 w-6 text-black" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">TikTok</h3>
                        <p className="text-xs text-gray-500">Destination for TikTok videos</p>
                      </div>
                    </div>
                    {platformConnections.tiktok ? (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Connected</span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">Not connected</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="outline" 
                      className={`flex-1 ${
                        platformConnections.tiktok 
                          ? "border-gray-300 text-gray-500" 
                          : "border-black text-black hover:bg-gray-50"
                      }`}
                      disabled={platformConnections.tiktok}
                      onClick={handleTikTokConnect}
                    >
                      <SiTiktok className="mr-2 h-4 w-4" />
                      {platformConnections.tiktok ? "Connected" : "Connect TikTok"}
                    </Button>
                    
                    {platformConnections.tiktok ? (
                      <Button 
                        className="flex-1 bg-[#FF7846] hover:bg-[#FF5A2D]"
                        onClick={() => handleDestinationSelect("TikTok", selectedContentIds)}
                      >
                        Select as Destination
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1"
                        variant="outline"
                        disabled
                      >
                        Connect TikTok first
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setActiveStep(2)}>
                  Back
                </Button>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-6 border-r border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <SiInstagram className="w-4 h-4 text-pink-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    {selectedDestination === "YouTube" ? (
                      <SiYoutube className="w-4 h-4 text-red-600" />
                    ) : (
                      <SiTiktok className="w-4 h-4 text-black" />
                    )}
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    {selectedDestination === "YouTube" ? 'Instagram → YouTube' : 'Instagram → TikTok'}
                  </h3>
                </div>
                <div className="mb-4 text-sm">
                  <span className="text-gray-500">Selected content: </span>
                  <span className="font-medium">{selectedContentIds.length} items</span>
                </div>
                <TransformationPanel 
                  onTransformSuccess={onTransformSuccess} 
                  selectedDestination={selectedDestination as "YouTube" | "TikTok"} 
                  selectedContentIds={selectedContentIds}
                />
              </div>
              
              <div className="p-6 bg-gray-50">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Preview</h3>
                <PreviewPanel transformationId={selectedTransformationId} onReset={handleResetAndGoBack} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}