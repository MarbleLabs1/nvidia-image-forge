
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageZoomProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export function ImageZoom({ src, alt, isOpen, onClose, onDownload }: ImageZoomProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const resetView = () => {
    setZoom(1);
    setRotation(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
        <div className="relative w-full h-full flex flex-col">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button variant="secondary" size="icon" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={handleRotate}>
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={resetView}>
              Reset
            </Button>
            <Button variant="secondary" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-hidden bg-black/90 flex items-center justify-center">
            <img
              src={src}
              alt={alt}
              className={cn(
                "max-w-full max-h-full object-contain transition-transform duration-200 cursor-grab active:cursor-grabbing"
              )}
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
              }}
              draggable={false}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
