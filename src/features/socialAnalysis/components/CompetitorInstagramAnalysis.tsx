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
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Instagram className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Analizando Instagram</h3>
                <p className="text-muted-foreground text-sm">
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
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md border-0 shadow-lg">
              <CardContent className="flex flex-col items-center gap-6 py-12">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-semibold text-xl">{errorMessage}</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">{errorDescription}</p>
                </div>
                <Button variant="outline" onClick={handleGoBack} className="gap-2 bg-transparent">
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

  // Utilidades para colores del tema shadcn
  // Usamos solo clases de Tailwind que correspondan a variables del tema shadcn (ej: bg-primary, text-primary, bg-secondary, text-secondary, bg-muted, text-muted-foreground, bg-destructive, etc)
  // No usamos colores directos como bg-blue-500, text-pink-600, etc

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="gap-2 hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Análisis de Instagram</span>
          </div>
        </div>

        {/* Competitor Header Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-card via-card to-muted/5">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                  <AvatarImage
                    src={`https://www.google.com/s2/favicons?domain=${competitor.website || "example.com"}&sz=128`}
                    alt={competitor.competitor_name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-xl">
                    {competitor.competitor_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Instagram className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{competitor.competitor_name}</h1>
                  <p className="text-muted-foreground text-lg mt-2">{competitor.key_feature}</p>
                </div>

                <div className="flex items-center gap-3">
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="outline" className="text-xs">
                  Total
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">{formatNumber(instagramData.total_followers)}</p>
                <p className="text-sm text-muted-foreground">Seguidores</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                  <Heart className="w-6 h-6 text-secondary" />
                </div>
                <Badge variant="outline" className="text-xs">
                  Promedio
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">
                  {formatEngagementRate(instagramData.avg_engagement_rate)}%
                </p>
                <p className="text-sm text-muted-foreground">Engagement</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-muted/10 rounded-xl flex items-center justify-center group-hover:bg-muted/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-muted-foreground" />
                </div>
                <Badge variant="outline" className="text-xs">
                  Total
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">{formatNumber(instagramData.total_posts)}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Zap className="w-6 h-6 text-accent-foreground" />
                </div>
                <Badge variant="outline" className="text-xs">
                  Total
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">
                  {formatNumber(instagramData.total_likes + instagramData.total_comments)}
                </p>
                <p className="text-sm text-muted-foreground">Interacciones</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Post Averages */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Promedios por Post</CardTitle>
                  <CardDescription>Métricas promedio de rendimiento</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium">Likes promedio</span>
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(Math.round(instagramData.avg_likes_per_post))}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Comentarios promedio</span>
                  </div>
                  <p className="text-2xl font-bold">{formatNumber(Math.round(instagramData.avg_comments_per_post))}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total de likes</span>
                  <span className="font-semibold">{formatNumber(instagramData.total_likes)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total de comentarios</span>
                  <span className="font-semibold">{formatNumber(instagramData.total_comments)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post Type Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Tipos de Contenido</CardTitle>
                  <CardDescription>Distribución de formatos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(instagramData.post_type_distribution).map(([type, count]) => {
                const percentage = (count / instagramData.total_posts) * 100
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{count}</span>
                        <Badge variant="outline" className="text-xs">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Top Posts */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Top Posts</CardTitle>
                <CardDescription>Publicaciones con mayor engagement</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {instagramData.top_posts.slice(0, 5).map((post, index) => (
                <div key={post.id} className="group">
                  <div className="flex items-center gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium capitalize">{post.type}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium">{formatNumber(post.likesCount)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{formatNumber(post.commentsCount)}</span>
                      </div>
                      <Badge variant="secondary" className="gap-1">
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

        {/* Weekly Engagement */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl">Engagement Semanal</CardTitle>
                <CardDescription>Rendimiento por día de la semana</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(instagramData.engagement_by_day_of_week).map(([day, engagement]) => {
                const engagementPercentage = engagement * 100
                const maxEngagement = Math.max(...Object.values(instagramData.engagement_by_day_of_week)) * 100
                const relativePercentage = (engagementPercentage / maxEngagement) * 100

                return (
                  <div key={day} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{dayNames[day as keyof typeof dayNames] || day}</span>
                      <Badge variant="outline" className="text-xs">
                        {engagementPercentage.toFixed(2)}%
                      </Badge>
                    </div>
                    <Progress value={relativePercentage} className="h-3" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CompetitorInstagramAnalysis
