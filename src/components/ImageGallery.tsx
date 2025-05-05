
import { Download, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { GeneratedImage } from "@/services/localGpuService";

interface ImageGalleryProps {
  images: GeneratedImage[];
  isLoading: boolean;
}

export function ImageGallery({ images, isLoading }: ImageGalleryProps) {
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  const handleDownload = async (url: string, index: number) => {
    try {
      setDownloadingIndex(index);
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `nvidia-forge-image-${Date.now()}.webp`;
      link.click();
      
      toast.success("Image downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    } finally {
      setDownloadingIndex(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 bg-nvidia-600/20 rounded-full animate-pulse-green"></div>
            <div className="absolute inset-2 bg-nvidia-600/30 rounded-full animate-pulse-green delay-150"></div>
            <div className="absolute inset-4 bg-nvidia-600/40 rounded-full animate-pulse-green delay-300"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-nvidia-600 animate-spin" />
            </div>
          </div>
          <p className="text-lg font-medium">Creating your masterpiece with NVIDIA power...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Generated Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow"
          >
            <div className="relative group">
              <img 
                src={image.imageURL} 
                alt={`Generated image from prompt: ${image.positivePrompt}`}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 hover:bg-white text-black"
                  onClick={() => handleDownload(image.imageURL, index)}
                  disabled={downloadingIndex === index}
                >
                  {downloadingIndex === index ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-2 border-t">
              <p className="text-sm text-muted-foreground line-clamp-2" title={image.positivePrompt}>
                {image.positivePrompt}
              </p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Seed: {image.seed}</span>
                {image.cost && <span>Cost: ${image.cost.toFixed(4)}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
