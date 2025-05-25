import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImportPanel } from "./import-panel";
import { ContentSelection } from "./content-selection";
import { TransformationPanel } from "./transformation-panel";
import { PreviewPanel } from "./preview-panel";
import { SiInstagram, SiYoutube, SiTiktok } from "react-icons/si";
import { ArrowRight, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Transformation {
  id: number;
  contentId: number;
  targetPlatform: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
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
  const [importDone, setImportDone] = useState(false);
  const [selectedContentIds, setSelectedContentIds] = useState<number[]>([]);
  
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
  const [selectedDestination, setSelectedDestination] = useState<"YouTube Shorts" | "TikTok" | null>(null);
  
  // Fetch transformations to auto-select completed ones
  const { data: transformations = [] } = useQuery<Transformation[]>({
    queryKey: ['/api/transformations'],
    // refetchInterval: 1000 // Check for updates every second to make progress updates more responsive
  });
  
  // Auto-select the latest transformation (in-progress or completed) for preview if none is selected
  useEffect(() => {
    if (activeStep === 4 && !selectedTransformationId && transformations.length > 0) {
      // First try to find any processing transformations
      const processingTransformations = transformations.filter(t => t.status === 'processing');
      
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
    if (step <= activeStep) {
      setActiveStep(step);
    }
  };
  
  const handleContinue = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    }
  };
  
  const handleImportSuccess = () => {
    setImportDone(true);
    onImportSuccess();
    handleContinue(); // Move to content selection step
  };
  
  const handleContentSelection = (selectedIds: number[]) => {
    setSelectedContentIds(selectedIds);
    handleContinue(); // Move directly to platform selection step
  };
  
  const handlePlatformConnect = (platform: "youtube" | "tiktok", isConnected: boolean) => {
    setPlatformConnections(prev => ({...prev, [platform]: isConnected}));
  };
  
  const handleDestinationSelect = (platform: "YouTube Shorts" | "TikTok", contentIds: number[]) => {
    setSelectedDestination(platform);
    setSelectedContentIds(contentIds);
    handleContinue(); // Move to transformation step
  };

  return (
    <div className="mb-8">
      {/* Step indicators */}
      <div className="flex items-center justify-between max-w-5xl mx-auto mb-8">
        {[1, 2, 3, 4].map((step) => (
          <div 
            key={step} 
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleStepClick(step)}
          >
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                step === activeStep 
                  ? 'bg-[#FF7846] text-white border-[#FF7846]' 
                  : step < activeStep 
                    ? 'bg-white text-[#FF7846] border-[#FF7846]' 
                    : 'bg-white text-gray-400 border-gray-200'
              }`}
            >
              {step < activeStep ? <Check className="w-5 h-5" /> : step}
            </div>
            <span 
              className={`mt-2 text-sm font-medium ${
                step <= activeStep ? 'text-gray-900' : 'text-gray-400'
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
                      onClick={() => handlePlatformConnect("youtube", true)}
                    >
                      <SiYoutube className="mr-2 h-4 w-4" />
                      {platformConnections.youtube ? "Connected" : "Connect YouTube"}
                    </Button>
                    
                    {platformConnections.youtube ? (
                      <Button 
                        className="flex-1 bg-[#FF7846] hover:bg-[#FF5A2D]"
                        onClick={() => handleDestinationSelect("YouTube Shorts", selectedContentIds)}
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
                      onClick={() => handlePlatformConnect("tiktok", true)}
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
                    {selectedDestination === "YouTube Shorts" ? (
                      <SiYoutube className="w-4 h-4 text-red-600" />
                    ) : (
                      <SiTiktok className="w-4 h-4 text-black" />
                    )}
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    {selectedDestination === "YouTube Shorts" ? 'Instagram → YouTube Shorts' : 'Instagram → TikTok'}
                  </h3>
                </div>
                <div className="mb-4 text-sm">
                  <span className="text-gray-500">Selected content: </span>
                  <span className="font-medium">{selectedContentIds.length} items</span>
                </div>
                <TransformationPanel 
                  onTransformSuccess={onTransformSuccess} 
                  selectedDestination={selectedDestination as "YouTube Shorts" | "TikTok"} 
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