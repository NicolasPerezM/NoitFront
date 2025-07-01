import { useQuery } from "@tanstack/react-query"
import { getInstagramStatistics } from "@/lib/api/getInstagramStatistics"
import { getCompetitors } from "@/lib/api/getCompetitors"
import { 
  Verified, 
  Users, 
  Image, 
  TrendingUp, 
  Loader2, 
  AlertCircle, 
  Instagram, 
  ExternalLink,
  Target 
} from "lucide-react"
import { queryClient } from "@/lib/api/queryClient"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface InstagramHeaderProps {
  competitorId: string
}

interface Competitor {
  id: string
  business_idea_id: string
  competitor_name: string
  key_feature: string
  website: string | null
  instagram_url: string | null
  facebook_url: string | null
  linkedin_url: string | null
  x_url: string | null
  youtube_url: string | null
  tiktok_url: string | null
  similarity_score: number
}

export default function InstagramHeader({ competitorId }: InstagramHeaderProps) {
  const [businessId, setBusinessId] = useState<string>("")

  // Obtener el businessId de la URL (mismo código que el archivo original)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname
      const segments = pathname.split("/").filter((segment) => segment !== "")

      let extractedBusinessId = ""

      if (segments[0] === "socialAnalysis") {
        const urlParams = new URLSearchParams(window.location.search)
        const businessIdFromQuery = urlParams.get("business_id")
        if (businessIdFromQuery) {
          extractedBusinessId = businessIdFromQuery
        } else {
          const storedBusinessId = localStorage.getItem("currentBusinessId")
          if (storedBusinessId) {
            extractedBusinessId = storedBusinessId
          }
        }
      } else if (segments[0] === "businessIdeas" && segments[1] === "businessIdea") {
        extractedBusinessId = segments[2]
      }

      if (extractedBusinessId) {
        setBusinessId(extractedBusinessId)
      }
    }
  }, [])

  // Query para obtener competidores
  const {
    data: competitorsData,
    isLoading: isLoadingCompetitors,
    error: competitorsError,
  } = useQuery(
    {
      queryKey: ["competitors", businessId],
      queryFn: () => getCompetitors(businessId),
      enabled: !!businessId,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  )

  const competitor = competitorsData?.competitors?.find((c: Competitor) => c.id === competitorId)

  // Query para obtener estadísticas de Instagram
  const {
    data: instagramData,
    isLoading: isLoadingInstagram,
    error: instagramError,
  } = useQuery(
    {
      queryKey: ["instagramStatistics", competitor?.id],
      queryFn: () => getInstagramStatistics(competitor!.id),
      enabled: !!competitor?.id,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  )

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toLocaleString()
  }

  const formatEngagementRate = (rate: number) => {
    return (rate * 100).toFixed(2)
  }

  // Loading state
  if (!businessId || isLoadingCompetitors || isLoadingInstagram) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-r from-card via-card to-muted/5">
        <CardContent className="p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-muted-foreground text-lg">Cargando datos de Instagram...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Error states
  if (competitorsError || instagramError || !competitor || !instagramData) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-r from-card via-card to-muted/5">
        <CardContent className="p-8">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="w-6 h-6" />
            <span className="text-lg">Error al cargar datos de Instagram</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-card via-card to-muted/5">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
          {/* Avatar y Badge de Instagram */}
          <div className="relative flex-shrink-0">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage
                src={`https://www.google.com/s2/favicons?domain=${competitor.website || "example.com"}&sz=128`}
                alt={competitor.competitor_name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-2xl">
                {competitor.competitor_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Instagram className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>

          {/* Información Principal */}
          <div className="flex-1 text-center lg:text-left space-y-4">
            {/* Nombre y Descripción */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{competitor.competitor_name}</h1>
              <p className="text-muted-foreground text-lg mt-2">{competitor.key_feature}</p>
            </div>

            {/* Badges y Acciones */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Badge variant="secondary" className="gap-2 px-3 py-1">
                <Target className="w-3 h-3" />
                {competitor.similarity_score}% similar
              </Badge>

              {competitor.instagram_url && (
                <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
                  <a href={competitor.instagram_url} target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-4 h-4" />
                    Ver perfil
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}
            </div>

            {/* Estadísticas de Instagram */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 pt-4">
              <div className="flex flex-col items-center lg:items-start space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Users className="h-4 w-4" />
                  <span>Seguidores</span>
                </div>
                <div className="font-bold text-xl tracking-tight">
                  {formatNumber(instagramData.total_followers)}
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Image className="h-4 w-4" />
                  <span>Posts</span>
                </div>
                <div className="font-bold text-xl tracking-tight">
                  {formatNumber(instagramData.total_posts)}
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>Engagement</span>
                </div>
                <div className="font-bold text-xl tracking-tight">
                  {formatEngagementRate(instagramData.avg_engagement_rate)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}