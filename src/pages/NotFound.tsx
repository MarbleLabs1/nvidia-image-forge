
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-nvidia-600">404</h1>
        <p className="text-2xl font-medium mt-4 mb-8">Oops! This page couldn't be rendered</p>
        <p className="text-muted-foreground mb-8">
          It seems the GPU couldn't generate this particular page.
        </p>
        <Button asChild className="bg-nvidia-600 hover:bg-nvidia-700">
          <Link to="/">Return to Generator</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
