
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Sparkles, Loader2 } from "lucide-react";

interface ImageProgressProps {
  progress: number;
  isGenerating: boolean;
}

export function ImageProgress({ progress, isGenerating }: ImageProgressProps) {
  const { theme } = useTheme();

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className={cn(
        "bg-card border rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl",
        theme === "dark" ? "bg-card/95" : "bg-card/95"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-primary animate-spin" />
            <Loader2 className="h-4 w-4 text-primary absolute top-1 left-1 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold">
            {theme === "dark" ? "Brewing Your Image..." : "Crafting Your Lunar Vision..."}
          </h3>
        </div>
        
        <Progress value={progress} className="mb-3" />
        
        <p className="text-sm text-muted-foreground text-center">
          {progress < 25 && "Initializing NVIDIA GPU..."}
          {progress >= 25 && progress < 50 && "Processing your prompt..."}
          {progress >= 50 && progress < 75 && "Generating pixel by pixel..."}
          {progress >= 75 && "Finalizing your masterpiece..."}
        </p>
      </div>
    </div>
  );
}
