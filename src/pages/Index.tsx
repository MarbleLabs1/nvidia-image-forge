
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ImageGenerationForm } from "@/components/ImageGenerationForm";
import { ImageGallery } from "@/components/ImageGallery";
import { LocalGpuService, LocalGenerateImageParams, GeneratedImage } from "@/services/localGpuService";
import { toast } from "sonner";
import { ThemeProvider } from "next-themes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Moon, Coffee } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ImageProgress } from "@/components/ImageProgress";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Keyboard } from "lucide-react";

const IndexContent = () => {
  const [localGpuService] = useState(() => new LocalGpuService());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [progress, setProgress] = useState(0);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const initializeGpu = async () => {
      const success = await localGpuService.initialize();
      if (success) {
        setIsInitialized(true);
        toast.success("Local GPU initialized successfully", {
          icon: theme === "dark" ? <Coffee className="h-5 w-5" /> : <Moon className="h-5 w-5" />,
        });
      } else {
        toast.error("Failed to initialize GPU. Make sure you have a compatible NVIDIA GPU and latest drivers installed.");
      }
    };

    initializeGpu();
  }, [localGpuService, theme]);

  // Add keyboard shortcuts
  useKeyboardShortcuts({
    onToggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
  });

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
    return interval;
  };

  const handleGenerateImage = async (params: LocalGenerateImageParams) => {
    if (!isInitialized) {
      toast.error("GPU not initialized");
      return;
    }

    setIsLoading(true);
    const progressInterval = simulateProgress();

    try {
      const result = await localGpuService.generateImage(params);
      setProgress(100);
      
      const newImage = {
        imageURL: URL.createObjectURL(result),
        positivePrompt: params.prompt,
        seed: params.seed,
      };
      
      setGeneratedImages(prev => [newImage, ...prev]);
      toast.success("Image generated successfully!", {
        icon: theme === "dark" ? <Coffee className="h-5 w-5" /> : <Moon className="h-5 w-5" />,
      });
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setIsLoading(false);
      setProgress(0);
    }
  };

  return (
    <>
      <ImageProgress progress={progress} isGenerating={isLoading} />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Coffee className="h-8 w-8 text-primary animate-float" />
                ) : (
                  <Moon className="h-8 w-8 text-primary animate-float" />
                )}
                <h1 className="text-4xl font-bold tracking-tight">
                  {theme === "dark" ? "Brew Image Forge" : "Luna Image Forge"}
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">
                Generate stunning, high-quality images powered by your local NVIDIA GPU
              </p>
              
              {!isInitialized && (
                <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    GPU initialization failed. Please make sure you have a compatible NVIDIA GPU and the latest drivers installed.
                  </AlertDescription>
                </Alert>
              )}
              
              {isInitialized && (
                <Alert className={cn(
                  "border",
                  theme === "dark" ? "border-primary/30 bg-primary/10" : "border-accent/30 bg-accent/10"
                )}>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="flex items-center gap-2">
                    NVIDIA GPU initialized and ready to generate
                    <Badge variant="outline" className={cn(
                      "ml-2 px-2 py-0 text-xs",
                      theme === "dark" ? "bg-primary/20 text-primary-foreground" : "bg-accent/20 text-accent-foreground"
                    )}>
                      Ready
                    </Badge>
                  </AlertDescription>
                </Alert>
              )}

              <Alert className="bg-secondary/30 border-secondary">
                <Keyboard className="h-4 w-4 text-primary" />
                <AlertDescription>
                  <strong>Keyboard shortcuts:</strong> Ctrl/Cmd + Enter to generate, Ctrl/Cmd + D to toggle theme
                </AlertDescription>
              </Alert>
            </div>

            <ImageGenerationForm onSubmit={handleGenerateImage} isLoading={isLoading} />
            <ImageGallery images={generatedImages} isLoading={isLoading} />
          </div>
        </main>
        <footer className="border-t py-6">
          <div className="container px-4">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {theme === "dark" ? "Brew" : "Luna"} Image Forge. Powered by local NVIDIA GPU technology.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

// Main component wrapped with ThemeProvider
const Index = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <IndexContent />
  </ThemeProvider>
);

export default Index;
