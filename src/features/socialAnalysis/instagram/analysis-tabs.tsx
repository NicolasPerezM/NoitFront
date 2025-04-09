"use client";

import type React from "react";

import { useState } from "react";
import {
  ChartArea,
  ImageUp,
  GalleryThumbnails,
  MessageCircleMore,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnalysisTabsProps {
  defaultValue?: string;
  className?: string;
  children?: {
    [key: string]: React.ReactNode;
  };
}

export function AnalysisTabs({
  defaultValue = "general",
  className,
  children,
}: AnalysisTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const isMobile = useIsMobile();

  const tabs = [
    {
      id: "general",
      label: "Análisis General",
      icon: ChartArea,
    },
    {
      id: "feed",
      label: "Análisis del Feed",
      icon: ImageUp,
    },
    {
      id: "posts",
      label: "Análisis de Posts",
      icon: GalleryThumbnails,
    },
    {
      id: "comments",
      label: "Análisis de Comentarios",
      icon: MessageCircleMore,
    },
  ];

  return (
    <Tabs
      defaultValue={defaultValue}
      value={activeTab}
      onValueChange={setActiveTab}
      className={cn("w-full", className)}
    >
      <TabsList className="w-full grid grid-cols-4 h-14 bg-background border rounded-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "flex items-center justify-center gap-2 rounded-md transition-all data-[state=active]:bg-primary/10 data-[state=active]:text-theme-dark data-[state=active]:shadow-sm",
                "text-sm font-medium"
              )}
            >
              <Icon className="h-4 w-4" />
              {!isMobile && <span>{tab.label}</span>}
              {isMobile && <span className="sr-only">{tab.label}</span>}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          {children?.[tab.id]}
        </TabsContent>
      ))}
    </Tabs>
  );
}
