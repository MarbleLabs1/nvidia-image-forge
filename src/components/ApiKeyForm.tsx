
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

interface ApiKeyFormProps {
  onSubmit: (apiKey: string) => void;
}

export function ApiKeyForm({ onSubmit }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Enter API Key</CardTitle>
        <CardDescription className="text-center">
          To generate images, you'll need a Runware API key
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Runware API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span>Your API key is stored locally and never transmitted to our servers</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-nvidia-600 hover:bg-nvidia-700">
            Connect API
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
