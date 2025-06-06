import { useState } from "react";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { TransformationQueue } from "@/components/dashboard/transformation-queue";
import { PerformanceInsights } from "../../components/dashboard/performance-insights";
import { TransformationWorkflow } from "../../components/dashboard/transformation-workflow";
import { withAuthManager } from "../../HOCs/authManager";

const Home = () => {
  const [contentImported, setContentImported] = useState(false);
  const [contentTransformed, setContentTransformed] = useState(false);
  const [selectedTransformationId, setSelectedTransformationId] = useState<
    number | undefined
  >(undefined);

  const handleImportSuccess = () => {
    setContentImported(true);
  };

  const handleTransformSuccess = (transformationId?: number) => {
    setContentTransformed(true);

    // If a transformation ID is provided, select it for display
    if (transformationId) {
      setSelectedTransformationId(transformationId);
    }
  };

  const handleSelectTransformation = (transformationId: number) => {
    setSelectedTransformationId(transformationId);
    setContentTransformed(true);
  };

  const handleReset = () => {
    setSelectedTransformationId(undefined);
    setContentTransformed(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Content Transformer
            </h1>
            <p className="max-w-2xl mx-auto text-gray-600 text-lg">
              Transform your best-performing content across platforms to
              maximize revenue without extra creation work.
            </p>
          </div>

          <TransformationWorkflow
            onImportSuccess={handleImportSuccess}
            onTransformSuccess={handleTransformSuccess}
            onSelectTransformation={handleSelectTransformation}
            selectedTransformationId={selectedTransformationId}
            onReset={handleReset}
          />

          <div className="space-y-8 mt-12">
            <TransformationQueue
              onSelectTransformation={handleSelectTransformation}
            />
            <PerformanceInsights />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default withAuthManager(Home);
