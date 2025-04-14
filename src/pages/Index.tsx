
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ImageGenerationForm } from "@/components/ImageGenerationForm";
import { ImageGallery } from "@/components/ImageGallery";
import { LocalGpuService, LocalGenerateImageParams } from "@/services/localGpuService";
import { toast } from "sonner";

interface GeneratedImage {
  imageURL: string;
  positivePrompt: string;
  seed?: number;
}

const Index = () => {
  const [localGpuService] = useState(() => new LocalGpuService());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  useEffect(() => {
    const initializeGpu = async () => {
      const success = await localGpuService.initialize();
      if (success) {
        setIsInitialized(true);
        toast.success("Local GPU initialized successfully");
      } else {
        toast.error("Failed to initialize GPU. Make sure you have a compatible NVIDIA GPU and latest drivers installed.");
      }
    };

    initializeGpu();
  }, [localGpuService]);

  const handleGenerateImage = async (params: LocalGenerateImageParams) => {
    if (!isInitialized) {
      toast.error("GPU not initialized");
      return;
    }

    setIsLoading(true);

    try {
      const result = await localGpuService.generateImage(params);
      const newImage = {
        imageURL: URL.createObjectURL(result),
        positivePrompt: params.prompt,
        seed: params.seed,
      };
      
      setGeneratedImages(prev => [newImage, ...prev]);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold tracking-tight">NVIDIA Image Forge</h1>
            <p className="text-muted-foreground text-lg">
              Generate stunning, high-quality images powered by your local NVIDIA GPU
            </p>
          </div>

          <ImageGenerationForm onSubmit={handleGenerateImage} isLoading={isLoading} />
          <ImageGallery images={generatedImages} isLoading={isLoading} />
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container px-4">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NVIDIA Image Forge. Powered by local NVIDIA GPU technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
