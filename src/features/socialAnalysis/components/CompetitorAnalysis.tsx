"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Instagram, Linkedin, Facebook, ChevronRight, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import { getCompetitors } from "@/lib/api/getCompetitors"
import { queryClient } from "@/lib/api/queryClient"

interface Platform {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  metrics: string[]
}

const CompetitorAnalysis = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [businessId, setBusinessId] = useState<string>("")

  // Obtener el businessId de la URL en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname
      const segments = pathname.split('/')
      const id = segments[segments.length - 1] // Último segmento de la URL
      console.log('🆔 Business ID obtenido de URL:', id)
      setBusinessId(id)
    }
  }, [])

  // Query para obtener competidores
  const {
    data: competitorsData,
    isLoading: isLoadingCompetitors,
    error: competitorsError,
    refetch: refetchCompetitors
  } = useQuery({
    queryKey: ['competitors', businessId],
    queryFn: () => getCompetitors(businessId),
    enabled: false, // Solo ejecutar cuando se haga click
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
  }, queryClient)

  const platforms: Platform[] = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      description: "Análisis visual y engagement",
      metrics: ["Seguidores", "Engagement Rate", "Stories", "Reels", "Hashtags"],
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      description: "Análisis profesional y networking",
      metrics: ["Conexiones", "Publicaciones", "Artículos", "Comentarios", "Shares"],
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      description: "Análisis de comunidad y alcance",
      metrics: ["Me gusta", "Seguidores", "Comentarios", "Compartidos", "Reacciones"],
    },
  ]

  const handleAnalyzeClick = async (platformId: string) => {
    console.log('🔍 Analizando plataforma:', platformId)
    console.log('🆔 Business ID:', businessId)
    
    if (!businessId) {
      console.error('❌ No se encontró business ID')
      return
    }

    if (platformId === "instagram") {
      // Redirigir a la página de competidores
      window.location.href = `/businessIdeas/businessIdea/${businessId}/competitors`;
      return;
    } else {
      // Para otras plataformas, mostrar mensaje temporal
      console.log(`📱 Análisis de ${platformId} (próximamente)`)
    }
  }

  const getInstagramCompetitors = () => {
    if (!competitorsData?.competitors) return []
    
    return competitorsData.competitors.filter(competitor => 
      competitor.instagram_url && competitor.instagram_url.trim() !== ''
    )
  }

  const PlatformCard = ({ platform }: { platform: Platform }) => {
    const IconComponent = platform.icon
    const isInstagram = platform.id === "instagram"
    const isAnalyzing = selectedPlatform === platform.id && isLoadingCompetitors
    
    // Para Instagram, mostrar competidores si están disponibles
    const instagramCompetitors = isInstagram ? getInstagramCompetitors() : []
    const hasInstagramData = isInstagram && competitorsData && instagramCompetitors.length > 0

    return (
      <Card className="group border border-border/50 hover:shadow-md hover:scale-[1.01] transition-all duration-300 hover:border-primary">
        <CardHeader className="flex items-center gap-4 pb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted/50">
            <IconComponent className="w-6 h-6 text-foreground" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-normal">{platform.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{platform.description}</CardDescription>
            {isInstagram && hasInstagramData && (
              <Badge variant="secondary" className="mt-1 text-xs">
                {instagramCompetitors.length} competidores encontrados
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-4 px-6">
          <div className="mb-4">
            <p className="text-xs text-muted-foreground font-normal uppercase tracking-wide mb-2">Métricas clave</p>
            <ul className="grid grid-cols-2 gap-2 text-sm text-foreground/80">
              {platform.metrics.map((metric, index) => (
                <li key={index} className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  {metric}
                </li>
              ))}
            </ul>
          </div>

          {/* Mostrar competidores de Instagram si están disponibles */}
          {isInstagram && hasInstagramData && (
            <div className="mb-4 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-2">Competidores en Instagram:</p>
              <div className="space-y-1">
                {instagramCompetitors.slice(0, 3).map((competitor) => (
                  <div key={competitor.id} className="flex items-center justify-between text-xs">
                    <span className="font-medium truncate flex-1 mr-2">{competitor.competitor_name}</span>
                    <Badge variant="outline" className="text-xs">
                      {competitor.similarity_score}%
                    </Badge>
                  </div>
                ))}
                {instagramCompetitors.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{instagramCompetitors.length - 3} más...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Mostrar error si hay alguno */}
          {isInstagram && selectedPlatform === "instagram" && competitorsError && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive text-xs">
                <AlertCircle className="w-4 h-4" />
                <span>Error al cargar competidores</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {competitorsError.message}
              </p>
            </div>
          )}

          <Button 
            variant="outline" 
            className="w-full text-sm group-hover:bg-muted/70 transition-colors"
            onClick={() => handleAnalyzeClick(platform.id)}
            disabled={isAnalyzing || !businessId}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                Ver análisis <ChevronRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="bg-background p-8 max-w-7xl mb-4 mx-auto">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-normal text-foreground">Análisis de Competidores</h1>
          {businessId && (
            <p className="text-sm text-muted-foreground mt-2">
              Business ID: {businessId}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {platforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>

        {/* Debug info - remover en producción */}
        {process.env.NODE_ENV === 'development' && competitorsData && (
          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-2">Debug Info:</p>
            <pre className="text-xs text-muted-foreground overflow-auto">
              {JSON.stringify(competitorsData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompetitorAnalysis