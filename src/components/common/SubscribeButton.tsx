import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface SubscribeButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function SubscribeButton({
  variant = "default",
  size = "default",
  className,
}: SubscribeButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => {
        // Add subscription logic here
        console.log("Subscribe clicked");
      }}
    >
      <Sparkles className="ml-2 h-4 w-4" />
      Suscribirse
    </Button>
  );
} 