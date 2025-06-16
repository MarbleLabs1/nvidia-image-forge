
import { useEffect } from "react";

interface KeyboardShortcuts {
  onGenerate?: () => void;
  onToggleTheme?: () => void;
  onClearForm?: () => void;
}

export function useKeyboardShortcuts({ onGenerate, onToggleTheme, onClearForm }: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to generate
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        onGenerate?.();
      }
      
      // Cmd/Ctrl + D to toggle theme
      if ((event.metaKey || event.ctrlKey) && event.key === "d") {
        event.preventDefault();
        onToggleTheme?.();
      }
      
      // Cmd/Ctrl + R to clear form
      if ((event.metaKey || event.ctrlKey) && event.key === "r") {
        event.preventDefault();
        onClearForm?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onGenerate, onToggleTheme, onClearForm]);
}
