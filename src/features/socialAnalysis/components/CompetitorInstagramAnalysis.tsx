"use client"

import type React from "react"
import { useQuery } from "@tanstack/react-query"
import { getInstagramStatistics } from "@/lib/api/getInstagramStatistics"
import { getCompetitors } from "@/lib/api/getCompetitors"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  Instagram,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Share2,
  ArrowLeft,
  ExternalLink,
  Calendar,
  BarChart3,
  Target,
  Zap,
  Trophy,
  Clock,
} from "lucide-react"
import { queryClient } from "@/lib/api/queryClient"
import { useEffect, useState } from "react"
import EngagementByDay from "../instagram/postAnalyzer/EngagementByDay"
import EngagementTrends from "../instagram/postAnalyzer/EngagementTrends.tsx"
import PostTypePieChart from "../instagram/postAnalyzer/PostTypePieChart"

interface CompetitorInstagramAnalysisProps {
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

const CompetitorInstagramAnalysis: React.FC<CompetitorInstagramAnalysisProps> = ({ competitorId }) => {
  const [businessId, setBusinessId] = useState<string>("")

  // Obtener el businessId de la URL
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

  const handleGoBack = () => {
    window.history.back()
  }

  const formatEngagementRate = (rate: number) => {
    return (rate * 100).toFixed(2)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toLocaleString()
  }

  // Loading state
  if (!businessId || isLoadingCompetitors || isLoadingInstagram) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Instagram className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="font-normal text-2xl">Analizando Instagram</h3>
                <p className="text-muted-foreground text-base max-w-md font-normal">
                  {!businessId
                    ? "Obteniendo información..."
                    : isLoadingCompetitors
                      ? "Cargando competidor..."
                      : "Procesando estadísticas..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error states
  if (competitorsError || instagramError || !competitor || !instagramData) {
    const errorMessage = competitorsError
      ? "Error al cargar competidor"
      : instagramError
        ? "Error al cargar estadísticas"
        : !competitor
          ? "Competidor no encontrado"
          : "No hay datos disponibles"

    const errorDescription = competitorsError
      ? "No pudimos obtener la información del competidor"
      : instagramError
        ? "No pudimos obtener las estadísticas de Instagram"
        : !competitor
          ? `No se encontró el competidor con ID: ${competitorId}`
          : "No se encontraron estadísticas de Instagram para este competidor"

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[70vh]">
            <Card className="w-full max-w-lg border-0 shadow-lg">
              <CardContent className="flex flex-col items-center gap-8 py-16">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="font-normal text-2xl">{errorMessage}</h3>
                  <p className="text-muted-foreground text-base max-w-sm leading-relaxed font-normal">{errorDescription}</p>
                </div>
                <Button onClick={handleGoBack} variant="outline" className="gap-2 font-normal">
                  <ArrowLeft className="w-4 h-4" />
                  Volver
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const dayNames = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-2 py-8">
        {/* Main Content */}
        <div className="space-y-10">
          {/* Key Metrics Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-primary rounded-full" />
              <h2 className="text-2xl font-normal">Métricas Principales</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs font-normal">
                      Total
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-normal tracking-tight">{formatNumber(instagramData.total_followers)}</p>
                    <p className="text-base text-muted-foreground font-normal">Seguidores</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <Heart className="w-6 h-6 text-secondary" />
                    </div>
                    <Badge variant="outline" className="text-xs font-normal">
                      Promedio
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-normal tracking-tight">
                      {formatEngagementRate(instagramData.avg_engagement_rate)}%
                    </p>
                    <p className="text-base text-muted-foreground font-normal">Engagement</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-muted/10 rounded-xl flex items-center justify-center group-hover:bg-muted/20 transition-colors">
                      <MessageCircle className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <Badge variant="outline" className="text-xs font-normal">
                      Total
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-normal tracking-tight">{formatNumber(instagramData.total_posts)}</p>
                    <p className="text-base text-muted-foreground font-normal">Posts</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Zap className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <Badge variant="outline" className="text-xs font-normal">
                      Total
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-normal tracking-tight">
                      {formatNumber(instagramData.total_likes + instagramData.total_comments)}
                    </p>
                    <p className="text-base text-muted-foreground font-normal">Interacciones</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Analytics Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-primary rounded-full" />
              <h2 className="text-2xl font-normal">Análisis Detallado</h2>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Post Averages */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-normal">Promedios por Post</CardTitle>
                      <CardDescription className="text-base font-normal">Métricas promedio de rendimiento</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-secondary rounded-full" />
                        <span className="text-base font-normal">Likes promedio</span>
                      </div>
                      <p className="text-2xl font-normal">{formatNumber(Math.round(instagramData.avg_likes_per_post))}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-base font-normal">Comentarios promedio</span>
                      </div>
                      <p className="text-2xl font-normal">{formatNumber(Math.round(instagramData.avg_comments_per_post))}</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-base text-muted-foreground font-normal">Total de likes</span>
                      <span className="font-normal">{formatNumber(instagramData.total_likes)}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-base text-muted-foreground font-normal">Total de comentarios</span>
                      <span className="font-normal">{formatNumber(instagramData.total_comments)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Post Type Distribution */}
              <div className="min-h-[400px]">
                <PostTypePieChart competitorId={competitorId} />
              </div>
            </div>
          </section>

          {/* Engagement Analytics Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-primary rounded-full" />
              <h2 className="text-2xl font-normal">Análisis de Engagement</h2>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="min-h-[400px]">
                <EngagementByDay competitorId={competitorId} />
              </div>
              <div className="min-h-[400px]">
                <EngagementTrends competitorId={competitorId} />
              </div>
            </div>
          </section>

          {/* Top Posts Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-primary rounded-full" />
              <h2 className="text-2xl font-normal">Top Posts</h2>
            </div>
            
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-normal">Mejores Publicaciones</CardTitle>
                    <CardDescription className="text-base font-normal">Posts con mayor engagement y rendimiento</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {instagramData.top_posts.slice(0, 5).map((post, index) => (
                    <div key={post.id} className="group">
                      <div className="flex items-center gap-4 p-5 rounded-xl border bg-card/50 hover:bg-card hover:shadow-sm transition-all duration-200">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-base font-normal text-primary">#{index + 1}</span>
                          </div>
                          <div className="space-y-1">
                            <p className="font-normal text-base capitalize">{post.type}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground font-normal">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.post_date).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex-1" />

                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-secondary" />
                            <span className="text-base font-normal">{formatNumber(post.likesCount)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-primary" />
                            <span className="text-base font-normal">{formatNumber(post.commentsCount)}</span>
                          </div>
                          <Badge variant="secondary" className="gap-1 px-3 py-1 font-normal">
                            <TrendingUp className="w-3 h-3" />
                            {formatEngagementRate(post.engagement_rate)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

export default CompetitorInstagramAnalysis