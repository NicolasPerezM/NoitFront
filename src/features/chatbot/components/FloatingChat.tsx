"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, X, Maximize2, Minimize2 } from "lucide-react";
import ChatSessionPage from "./ChatSessionPage";
import { cn } from "@/lib/utils";

interface FloatingChatProps {
  sessionId: string;
  isOpen: boolean;
  onToggle: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export default function FloatingChat({
  sessionId,
  isOpen,
  onToggle,
  isMinimized = false,
  onToggleMinimize,
}: FloatingChatProps) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",
        isMinimized ? "w-72 h-16" : "w-96 h-[600px]"
      )}
    >
      <div className="bg-background border rounded-4xl shadow-2xl h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/70 border-b rounded-t-4xl">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm">Business Brief Chat</span>
          </div>

          <div className="flex items-center gap-1">
            {onToggleMinimize && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleMinimize}
                className="h-8 w-8 rounded-full hover:bg-muted"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                title={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 rounded-full hover:bg-destructive/10"
              aria-label="Close chat"
              title="Close chat"
            >
              <X className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="flex-1 overflow-hidden bg-background rounded-b-4xl">
            <ChatSessionPage sessionId={sessionId} />
          </div>
        )}
      </div>
    </div>
  );
}
