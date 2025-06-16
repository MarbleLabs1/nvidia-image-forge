import { Download, Loader2, Copy, Share, Star, Heart, Info, ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { GeneratedImage } from "@/services/localGpuService";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "./ui/tooltip";
import { ImageZoom } from "./ImageZoom";

interface ImageGalleryProps {
  images: GeneratedImage[];
  isLoading: boolean;
}

export function ImageGallery({ images, isLoading }: ImageGalleryProps) {
  const { theme } = useTheme();
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [favoriteImages, setFavoriteImages] = useState<number[]>([]);
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  const handleDownload = async (url: string, index: number) => {
    try {
      setDownloadingIndex(index);
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${theme === "dark" ? "brew" : "luna"}-forge-image-${Date.now()}.webp`;
      link.click();
      
      toast.success("Image downloaded successfully");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image");
    } finally {
      setDownloadingIndex(null);
    }
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied to clipboard");
  };

  const toggleFavorite = (index: number) => {
    setFavoriteImages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
    
    if (!favoriteImages.includes(index)) {
      toast.success("Added to favorites");
    } else {
      toast("Removed from favorites");
    }
  };

  const handleImageClick = (image: GeneratedImage) => {
    setZoomImage({
      src: image.imageURL,
      alt: `Generated image from prompt: ${image.positivePrompt}`
    });
  };

  const handleZoomDownload = async () => {
    if (zoomImage) {
      const response = await fetch(zoomImage.src);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${theme === "dark" ? "brew" : "luna"}-forge-image-${Date.now()}.webp`;
      link.click();
      toast.success("Image downloaded successfully");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className={cn(
            "relative w-32 h-32",
            theme === "dark" ? "animate-pulse-coffee" : "animate-pulse-moon"
          )}>
            <div className={cn(
              "absolute inset-0 rounded-full",
              theme === "dark" 
                ? "bg-primary/20" 
                : "bg-accent/20"
            )}></div>
            <div className={cn(
              "absolute inset-2 rounded-full",
              theme === "dark" 
                ? "bg-primary/30" 
                : "bg-accent/30"
            )}></div>
            <div className={cn(
              "absolute inset-4 rounded-full",
              theme === "dark" 
                ? "bg-primary/40" 
                : "bg-accent/40"
            )}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className={cn(
                "h-10 w-10 animate-spin",
                theme === "dark" 
                  ? "text-primary" 
                  : "text-accent"
              )} />
            </div>
          </div>
          <p className="text-lg font-medium">
            {theme === "dark"
              ? "Brewing your masterpiece with NVIDIA power..."
              : "Crafting your lunar masterpiece with NVIDIA power..."}
          </p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <ImageZoom
        src={zoomImage?.src || ""}
        alt={zoomImage?.alt || ""}
        isOpen={!!zoomImage}
        onClose={() => setZoomImage(null)}
        onDownload={handleZoomDownload}
      />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Generated Images
          </h2>
          <Badge variant="outline" className="px-3">
            {images.length} {images.length === 1 ? 'image' : 'images'}
          </Badge>
        </div>
        
        {favoriteImages.length > 0 && (
          <Alert className={cn(
            "bg-secondary/30 border-secondary",
            theme === "dark" ? "text-accent-foreground" : "text-accent-foreground"
          )}>
            <Heart className="h-4 w-4 text-primary" />
            <AlertDescription>
              You have {favoriteImages.length} favorite {favoriteImages.length === 1 ? 'image' : 'images'}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={cn(
                "overflow-hidden rounded-lg border bg-card text-card-foreground shadow-lg transition-all hover:shadow-xl cursor-pointer",
                favoriteImages.includes(index) && (
                  theme === "dark" 
                    ? "ring-2 ring-primary" 
                    : "ring-2 ring-accent"
                )
              )}
            >
              <div className="relative group">
                <img 
                  src={image.imageURL} 
                  alt={`Generated image from prompt: ${image.positivePrompt}`}
                  className="w-full h-64 object-cover transition-transform hover:scale-105"
                  loading="lazy"
                  onClick={() => handleImageClick(image)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/90 hover:bg-white text-black"
                            onClick={() => handleDownload(image.imageURL, index)}
                            disabled={downloadingIndex === index}
                          >
                            {downloadingIndex === index ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : (
                              <Download className="h-4 w-4 mr-1" />
                            )}
                            Download
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download this image</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="bg-white/90 hover:bg-white text-black h-8 w-8"
                            onClick={() => toggleFavorite(index)}
                          >
                            <Heart className={cn(
                              "h-4 w-4", 
                              favoriteImages.includes(index) && "fill-red-500 text-red-500"
                            )} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{favoriteImages.includes(index) ? "Remove from favorites" : "Add to favorites"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Image #{images.length - index}</h3>
                  <div className="flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopyPrompt(image.positivePrompt)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy prompt</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2" title={image.positivePrompt}>
                  {image.positivePrompt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <Badge variant="outline" className="text-xs font-normal">
                    Seed: {image.seed || "Random"}
                  </Badge>
                  {image.cost && <Badge variant="outline" className="text-xs font-normal">Cost: ${image.cost.toFixed(4)}</Badge>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
