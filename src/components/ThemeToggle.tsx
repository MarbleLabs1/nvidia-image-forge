
import { Moon, Coffee, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for component to be mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className={cn("flex gap-2", className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme("light")}
              className={cn(
                "border-0 hover:bg-secondary transition-all",
                theme === "light" ? 
                  "bg-secondary text-primary animate-pulse-moon" : 
                  "bg-background text-muted-foreground"
              )}
            >
              <Moon className="h-5 w-5" />
              <span className="sr-only">Moon theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Moon theme</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme("dark")}
              className={cn(
                "border-0 hover:bg-secondary transition-all",
                theme === "dark" ? 
                  "bg-secondary text-primary animate-pulse-coffee" : 
                  "bg-background text-muted-foreground"
              )}
            >
              <Coffee className="h-5 w-5" />
              <span className="sr-only">Coffee theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Coffee theme</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme("system")}
              className={cn(
                "border-0 hover:bg-secondary transition-all",
                theme === "system" ? 
                  "bg-secondary text-primary" : 
                  "bg-background text-muted-foreground"
              )}
            >
              <SunMoon className="h-5 w-5" />
              <span className="sr-only">System theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>System theme</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
