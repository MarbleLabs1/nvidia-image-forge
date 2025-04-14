
import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <header className={cn("border-b bg-background", className)}>
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-md bg-nvidia-600 p-1">
            <ImageIcon className="h-6 w-6 text-white" />
          </div>
          <span className="font-semibold text-xl">NVIDIA Image Forge</span>
        </Link>
      </div>
    </header>
  );
}
