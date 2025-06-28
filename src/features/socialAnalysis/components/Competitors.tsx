import type React from "react"
import { useQuery } from "@tanstack/react-query"
import { getCompetitors } from "@/lib/api/getCompetitors"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  ExternalLink,
  TrendingUp,
  Users,
  Search,
  X,
} from "lucide-react"
import { queryClient } from "@/lib/api/queryClient"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"

interface CompetitorsProps {
  businessId: string
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

const SocialIcon = ({ platform, url }: { platform: string; url: string | null }) => {
  if (!url) return null

  const getIcon = () => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4" />
      case "facebook":
        return <Facebook className="w-4 h-4" />
      case "linkedin":
        return <Linkedin className="w-4 h-4" />
      case "twitter":
        return <Twitter className="w-4 h-4" />
      case "youtube":
        return <Youtube className="w-4 h-4" />
      case "website":
        return <Globe className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  const getColor = () => {
    switch (platform) {
      case "instagram":
        return "hover:text-destructive hover:bg-destructive/10"
      case "facebook":
        return "hover:text-primary hover:bg-primary/10"
      case "linkedin":
        return "hover:text-primary hover:bg-primary/10"
      case "twitter":
        return "hover:text-primary hover:bg-primary/10"
      case "youtube":
        return "hover:text-destructive hover:bg-destructive/10"
      case "website":
        return "hover:text-primary hover:bg-primary/10"
      default:
        return "hover:text-muted-foreground hover:bg-muted"
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 transition-all duration-200 ${getColor()}`} asChild>
          <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Ver en ${platform}`}>
            {getIcon()}
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Ver en {platform}</p>
      </TooltipContent>
    </Tooltip>
  )
}

const CompetitorCard = ({ competitor, businessId }: { competitor: Competitor; businessId: string }) => {
  const getSimilarityColor = (score: number) => {
    if (score >= 80) return "text-destructive bg-destructive/10 border-destructive/20"
    if (score >= 60) return "text-primary bg-primary/10 border-primary/20"
    if (score >= 40) return "text-secondary bg-secondary/10 border-secondary/20"
    return "text-muted-foreground bg-muted border-muted"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-destructive"
    if (score >= 60) return "bg-primary"
    if (score >= 40) return "bg-secondary"
    return "bg-muted"
  }

  const handleViewDetails = () => {
    // Guardar el businessId en localStorage para que esté disponible en la página de análisis
    if (businessId) {
      localStorage.setItem('currentBusinessId', businessId);
    }
    // Redirigir con el businessId como query parameter
    window.location.href = `/socialAnalysis/instagram/${competitor.id}?business_id=${businessId}`;
  }

  return (
    <Card className="group hover:shadow-md transition-all duration-300 border bg-card hover:bg-accent/50">
      <CardContent className="p-4 max-h-[320px] h-[320px] flex justify-between flex-col">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
              <AvatarImage
                src={`https://www.google.com/s2/favicons?domain=${competitor.website || 'example.com'}&sz=64`}
                alt={competitor.competitor_name}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                {competitor.competitor_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {competitor.competitor_name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={`text-xs font-medium ${getSimilarityColor(competitor.similarity_score)}`}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {competitor.similarity_score}% similar
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{competitor.key_feature}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Similitud</span>
            <span className="font-medium">{competitor.similarity_score}%</span>
          </div>
          <div className="relative">
            <Progress value={competitor.similarity_score} className="h-2 bg-muted" />
            <div
              className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-500 ${getProgressColor(competitor.similarity_score)}`}
              style={{ width: `${competitor.similarity_score}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <TooltipProvider>
            <div className="flex items-center gap-2">
              <SocialIcon platform="website" url={competitor.website} />
              <SocialIcon platform="instagram" url={competitor.instagram_url} />
              <SocialIcon platform="facebook" url={competitor.facebook_url} />
              <SocialIcon platform="linkedin" url={competitor.linkedin_url} />
              <SocialIcon platform="twitter" url={competitor.x_url} />
              <SocialIcon platform="youtube" url={competitor.youtube_url} />
            </div>
          </TooltipProvider>

          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
          >
            Ver detalles
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const Competitors: React.FC<CompetitorsProps> = ({ businessId }) => {
  const [searchQuery, setSearchQuery] = useState("")
  
  const { data, isLoading, error } = useQuery(
    {
      queryKey: ["competitors", businessId],
      queryFn: () => getCompetitors(businessId),
      enabled: !!businessId,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  )

  // Filtrar competidores basado en la búsqueda
  const filteredCompetitors = useMemo(() => {
    if (!data?.competitors) return []
    
    if (!searchQuery.trim()) {
      return data.competitors
    }
    
    return data.competitors.filter((competitor: Competitor) =>
      competitor.competitor_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [data?.competitors, searchQuery])

  // Ordenar por similarity_score descendente
  const sortedCompetitors = useMemo(() => {
    return [...filteredCompetitors].sort((a, b) => b.similarity_score - a.similarity_score)
  }, [filteredCompetitors])

  const clearSearch = () => {
    setSearchQuery("")
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Análisis de Competidores</h2>
            <p className="text-sm text-muted-foreground">Cargando competidores...</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 bg-muted rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24" />
                    <div className="h-3 bg-muted rounded w-16" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
                <div className="h-2 bg-muted rounded mb-4" />
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-6 w-6 bg-muted rounded" />
                    ))}
                  </div>
                  <div className="h-6 bg-muted rounded w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <div className="p-3 bg-destructive/10 rounded-full">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-destructive mb-1">Error al cargar competidores</h3>
              <p className="text-sm text-muted-foreground">No pudimos obtener la información de los competidores</p>
            </div>
            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const competitors = data?.competitors || []

  if (competitors.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="border-muted bg-muted/5">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <div className="p-3 bg-muted/10 rounded-full">
              <Users className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-1">No hay competidores</h3>
              <p className="text-sm text-muted-foreground">No se encontraron competidores para este negocio</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl text-foreground">Análisis de Competidores</h2>
            <p className="text-sm text-muted-foreground">
              {sortedCompetitors.length} de {competitors.length} competidor{competitors.length !== 1 ? "es" : ""} mostrado
              {sortedCompetitors.length !== 1 ? "s" : ""}
              {searchQuery && ` para "${searchQuery}"`}
            </p>
          </div>
        </div>

        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          <TrendingUp className="w-3 h-3 mr-1" />
          Ordenado por similitud
        </Badge>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6 w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar competidores por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {sortedCompetitors.length === 0 && searchQuery ? (
        <Card className="border-muted bg-muted/5">
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <div className="p-3 bg-muted/10 rounded-full">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground mb-1">No se encontraron resultados</h3>
              <p className="text-sm text-muted-foreground">
                No hay competidores que coincidan con "{searchQuery}"
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={clearSearch} className="mt-2">
              Limpiar búsqueda
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCompetitors.map((competitor) => (
            <CompetitorCard key={competitor.id} competitor={competitor} businessId={businessId} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Competitors
