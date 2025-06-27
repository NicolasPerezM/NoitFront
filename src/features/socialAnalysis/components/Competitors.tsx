import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getCompetitors } from "@/lib/api/getCompetitors";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Instagram } from "lucide-react";
import { queryClient } from "@/lib/api/queryClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CompetitorsProps {
  businessId: string;
}

const Competitors: React.FC<CompetitorsProps> = ({ businessId }) => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["competitors", businessId],
    queryFn: () => getCompetitors(businessId),
    enabled: !!businessId,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  }, queryClient);

  if (isLoading) {
    return (
      <Card className="w-full bg-background/80 shadow-md animate-pulse">
        <CardContent className="flex items-center gap-3 py-8 justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-base text-muted-foreground font-medium">Cargando competidores...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full bg-background/80 shadow-md">
        <CardContent className="flex items-center gap-3 py-8 justify-center">
          <AlertCircle className="w-6 h-6 text-destructive" />
          <span className="text-base text-destructive font-medium">Error al cargar competidores</span>
        </CardContent>
      </Card>
    );
  }

  const instagramCompetitors = data?.competitors?.filter(
    (c: any) => c.instagram_url && c.instagram_url.trim() !== ""
  ) || [];

  if (instagramCompetitors.length === 0) {
    return (
      <Card className="w-full bg-background/80 shadow-md">
        <CardContent className="flex items-center gap-2 py-8 justify-center">
          <Instagram className="w-5 h-5 text-muted-foreground" />
          <span className="text-muted-foreground">No se encontraron competidores de Instagram para este negocio.</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-background/80 shadow-lg border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Instagram className="w-6 h-6 text-[#E1306C]" />
        <CardTitle className="text-lg font-semibold tracking-tight">
          Competidores en Instagram
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-muted">
          <TooltipProvider>
            {instagramCompetitors.map((competitor: any) => (
              <li
                key={competitor.id}
                className="flex items-center justify-between py-3 group hover:bg-muted/60 rounded-md transition-colors px-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-9 w-9 border">
                    {competitor.instagram_profile_pic ? (
                      <AvatarImage src={competitor.instagram_profile_pic} alt={competitor.competitor_name} />
                    ) : (
                      <AvatarFallback>
                        {competitor.competitor_name?.slice(0, 2).toUpperCase() || "IG"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={competitor.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-foreground hover:underline truncate block max-w-[180px] sm:max-w-[260px]"
                        >
                          {competitor.competitor_name}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>{competitor.competitor_name}</span>
                      </TooltipContent>
                    </Tooltip>
                    <span className="block text-xs text-muted-foreground truncate max-w-[180px] sm:max-w-[260px]">
                      @{competitor.instagram_handle || competitor.competitor_name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-1 font-semibold bg-primary/10 text-primary border-primary/20"
                  >
                    {competitor.similarity_score}%
                  </Badge>
                  <Button
                    asChild
                    size="icon"
                    variant="ghost"
                    className="ml-1 hover:bg-primary/10"
                  >
                    <a
                      href={competitor.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver perfil de ${competitor.competitor_name} en Instagram`}
                    >
                      <Instagram className="w-5 h-5 text-[#E1306C] group-hover:scale-110 transition-transform" />
                    </a>
                  </Button>
                </div>
              </li>
            ))}
          </TooltipProvider>
        </ul>
      </CardContent>
    </Card>
  );
};

export default Competitors;