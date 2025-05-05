
import { cn } from "@/lib/utils";
import { Image as ImageIcon, Moon, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "next-themes";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const { theme } = useTheme();
  
  return (
    <header className={cn("border-b bg-background sticky top-0 z-50", className)}>
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className={cn(
            "rounded-md p-1.5",
            theme === "dark" ? "bg-primary" : "bg-primary"
          )}>
            {theme === "dark" ? (
              <Coffee className="h-5 w-5 text-primary-foreground" />
            ) : (
              <Moon className="h-5 w-5 text-primary-foreground" />
            )}
          </div>
          <span className="font-semibold text-xl">
            {theme === "dark" ? "Brew Image Forge" : "Luna Image Forge"}
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
