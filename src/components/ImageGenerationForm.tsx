
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { GenerateImageParams } from "@/services/runwareService";

const MODEL_OPTIONS = [
  { value: "runware:100@1", label: "Flow Match (Fast)" },
  { value: "sdxl:6@1", label: "SDXL (High Quality)" },
];

const SIZE_OPTIONS = [
  { value: "512x512", label: "512 × 512" },
  { value: "768x768", label: "768 × 768" },
  { value: "1024x1024", label: "1024 × 1024 (Default)" },
  { value: "1280x720", label: "1280 × 720 (16:9)" },
  { value: "720x1280", label: "720 × 1280 (9:16)" },
];

const SCHEDULER_OPTIONS = [
  { value: "FlowMatchEulerDiscreteScheduler", label: "Flow Match Euler (Default)" },
  { value: "DDIMScheduler", label: "DDIM" },
  { value: "DPMSolverMultistepScheduler", label: "DPM-Solver" },
  { value: "EulerDiscreteScheduler", label: "Euler" },
];

interface ImageGenerationFormProps {
  onSubmit: (params: GenerateImageParams) => void;
  isLoading: boolean;
}

export function ImageGenerationForm({ onSubmit, isLoading }: ImageGenerationFormProps) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("runware:100@1");
  const [size, setSize] = useState("1024x1024");
  const [cfgScale, setCfgScale] = useState(1);
  const [seed, setSeed] = useState("");
  const [scheduler, setScheduler] = useState("FlowMatchEulerDiscreteScheduler");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    // Parse width and height from the size string
    const [width, height] = size.split("x").map(Number);
    
    const params: GenerateImageParams = {
      positivePrompt: prompt,
      model,
      width,
      height,
      CFGScale: cfgScale,
      scheduler,
      seed: seed ? seed : undefined,
    };
    
    onSubmit(params);
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="Describe the image you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-24 resize-none"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {MODEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cfgScale">Guidance Scale (1-20)</Label>
              <div className="pt-2">
                <Slider
                  id="cfgScale"
                  min={1}
                  max={20}
                  step={0.1}
                  value={[cfgScale]}
                  onValueChange={(value) => setCfgScale(value[0])}
                  className="py-4"
                />
              </div>
              <div className="text-sm text-muted-foreground text-center">
                {cfgScale} — {cfgScale < 5 ? "Low" : cfgScale < 10 ? "Medium" : "High"} adherence to prompt
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seed">
                Seed (Optional)
              </Label>
              <Input
                id="seed"
                type="text"
                placeholder="Random seed"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
              />
              <div className="text-sm text-muted-foreground">
                Leave empty for random results
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scheduler">Scheduler</Label>
            <Select value={scheduler} onValueChange={setScheduler}>
              <SelectTrigger id="scheduler">
                <SelectValue placeholder="Select scheduler" />
              </SelectTrigger>
              <SelectContent>
                {SCHEDULER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-nvidia-600 hover:bg-nvidia-700 flex gap-2 items-center"
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
