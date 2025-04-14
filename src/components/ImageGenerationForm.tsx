
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { LocalGenerateImageParams } from "@/services/localGpuService";

const SIZE_OPTIONS = [
  { value: "512x512", label: "512 × 512" },
  { value: "768x768", label: "768 × 768" },
];

interface ImageGenerationFormProps {
  onSubmit: (params: LocalGenerateImageParams) => void;
  isLoading: boolean;
}

export function ImageGenerationForm({ onSubmit, isLoading }: ImageGenerationFormProps) {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [size, setSize] = useState("512x512");
  const [steps, setSteps] = useState(20);
  const [seed, setSeed] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const [width, height] = size.split("x").map(Number);
    const params: LocalGenerateImageParams = {
      prompt: prompt.trim(),
      negativePrompt: negativePrompt.trim() || undefined,
      numSteps: steps,
      seed: seed ? parseInt(seed) : undefined,
      width,
      height,
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

          <div className="space-y-2">
            <Label htmlFor="negativePrompt">Negative Prompt (Optional)</Label>
            <Textarea 
              id="negativePrompt"
              placeholder="Describe what you don't want in the image..."
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="min-h-24 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="steps">Generation Steps (4-50)</Label>
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
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seed">Seed (Optional)</Label>
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
            <Label htmlFor="size">Size</Label>
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full border rounded-md p-2"
            >
              {SIZE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
