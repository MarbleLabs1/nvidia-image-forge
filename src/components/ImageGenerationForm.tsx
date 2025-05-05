
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Loader2, 
  Sparkles, 
  ImageIcon, 
  AlertTriangle, 
  Wand2, 
  Shuffle, 
  Sliders, 
  CheckCircle, 
  SlidersHorizontal, 
  Info
} from "lucide-react";
import { LocalGenerateImageParams } from "@/services/localGpuService";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SIZE_OPTIONS = [
  { value: "512x512", label: "512 × 512" },
  { value: "768x768", label: "768 × 768" },
];

interface ImageGenerationFormProps {
  onSubmit: (params: LocalGenerateImageParams) => void;
  isLoading: boolean;
}

export function ImageGenerationForm({ onSubmit, isLoading }: ImageGenerationFormProps) {
  const { theme } = useTheme();
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [size, setSize] = useState("512x512");
  const [steps, setSteps] = useState(20);
  const [seed, setSeed] = useState("");
  const [hasRandomSeed, setHasRandomSeed] = useState(true);
  
  const handleRandomize = () => {
    const randomSeed = Math.floor(Math.random() * 999999999);
    setSeed(randomSeed.toString());
    setHasRandomSeed(false);
  };
  
  const handleClearSeed = () => {
    setSeed("");
    setHasRandomSeed(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const [width, height] = size.split("x").map(Number);
    const params: LocalGenerateImageParams = {
      prompt: prompt.trim(),
      negativePrompt: negativePrompt.trim() || undefined,
      numSteps: steps,
      seed: hasRandomSeed ? undefined : (seed ? parseInt(seed) : undefined),
      width,
      height,
    };

    onSubmit(params);
  };

  return (
    <Card className="mb-6 overflow-hidden border shadow-lg">
      <div className={cn(
        "py-2 px-6 flex items-center justify-between border-b",
        theme === "dark" ? "bg-secondary/50" : "bg-secondary/50"
      )}>
        <div className="flex items-center space-x-2">
          <Wand2 className={cn(
            "h-5 w-5",
            theme === "dark" ? "text-primary" : "text-primary"
          )} />
          <h3 className="text-lg font-medium">Image Generator</h3>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <ImageIcon className="h-3 w-3" />
          <span>Local GPU</span>
        </Badge>
      </div>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt" className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Prompt
            </Label>
            <Textarea
              id="prompt"
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-24 resize-none"
              required
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Negative Prompt (Optional)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Textarea 
                    id="negativePrompt"
                    placeholder="Describe what you don't want in the image..."
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    className="min-h-20 resize-none"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="steps" className="flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-primary" />
                Generation Steps (4-50)
              </Label>
              <div className="pt-2">
                <Slider
                  id="steps"
                  min={4}
                  max={50}
                  step={1}
                  value={[steps]}
                  onValueChange={(value) => setSteps(value[0])}
                  className="py-4"
                />
              </div>
              <div className="text-sm text-muted-foreground text-center">
                {steps} steps
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 inline-block ml-1.5 cursor-help text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-60 text-xs">Higher step count produces better quality but takes longer. 20-30 steps is a good balance.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seed" className="flex items-center gap-1.5">
                <Shuffle className="h-4 w-4 text-primary" />
                Seed (Optional)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="seed"
                  type="text"
                  placeholder="Random seed"
                  value={seed}
                  onChange={(e) => {
                    setSeed(e.target.value);
                    setHasRandomSeed(false);
                  }}
                  className="flex-1"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={handleRandomize}
                      >
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate random seed</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={handleClearSeed}
                      >
                        {hasRandomSeed ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{hasRandomSeed ? "Using random seed" : "Clear to use random seed"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-sm text-muted-foreground">
                {hasRandomSeed ? "Using random seed for variety" : "Fixed seed for reproducible results"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size" className="flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Size
            </Label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {SIZE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Alert className={cn(
            "bg-secondary/30 border-secondary",
            theme === "dark" ? "text-accent-foreground" : "text-accent-foreground"
          )}>
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription>
              Generation is performed locally using your NVIDIA GPU power
            </AlertDescription>
          </Alert>

          <Button 
            type="submit" 
            className={cn(
              "w-full flex gap-2 items-center",
              theme === "dark" 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
