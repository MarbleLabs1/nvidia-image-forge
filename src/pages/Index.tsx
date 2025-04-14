
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ApiKeyForm } from "@/components/ApiKeyForm";
import { ImageGenerationForm } from "@/components/ImageGenerationForm";
import { ImageGallery } from "@/components/ImageGallery";
import { GenerateImageParams, GeneratedImage, RunwareService } from "@/services/runwareService";
import { toast } from "sonner";

const Index = () => {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem("runware_api_key")
  );
  const [runwareService, setRunwareService] = useState<RunwareService | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const handleApiKeySubmit = (key: string) => {
    try {
      localStorage.setItem("runware_api_key", key);
      setApiKey(key);
      const service = new RunwareService(key);
      setRunwareService(service);
      toast.success("API key connected successfully");
    } catch (error) {
      console.error("Error initializing Runware service:", error);
      toast.error("Failed to initialize service with provided API key");
    }
  };

  const handleGenerateImage = async (params: GenerateImageParams) => {
    if (!runwareService) {
      toast.error("API service not initialized");
      return;
    }

    setIsLoading(true);

    try {
      const generatedImage = await runwareService.generateImage(params);
      setGeneratedImages(prevImages => [generatedImage, ...prevImages]);
      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Image generation failed:", error);
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
              Generate stunning, high-quality images powered by NVIDIA GPU technology
            </p>
          </div>

          {!apiKey ? (
            <ApiKeyForm onSubmit={handleApiKeySubmit} />
          ) : (
            <>
              <ImageGenerationForm onSubmit={handleGenerateImage} isLoading={isLoading} />
              <ImageGallery images={generatedImages} isLoading={isLoading} />
            </>
          )}
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container px-4">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} NVIDIA Image Forge. Powered by NVIDIA GPU technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
