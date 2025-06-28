import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getInstagramStatistics } from "@/lib/api/getInstagramStatistics";
import { getCompetitors } from "@/lib/api/getCompetitors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, 
  AlertCircle, 
  Instagram, 
  TrendingUp, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2,
  ArrowLeft,
  ExternalLink
} from "lucide-react";
import { queryClient } from "@/lib/api/queryClient";
import { useEffect, useState } from "react";

interface CompetitorInstagramAnalysisProps {
  competitorId: string; // Este es el ID de la URL, no el competitor_id real
}

interface Competitor {
  id: string;
  business_idea_id: string;
  competitor_name: string;
  key_feature: string;
  website: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  x_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  similarity_score: number;
}

const CompetitorInstagramAnalysis: React.FC<CompetitorInstagramAnalysisProps> = ({ competitorId }) => {
  const [businessId, setBusinessId] = useState<string>("");

  console.log('🔧 CompetitorInstagramAnalysis renderizado con competitorId:', competitorId);

  // Obtener el businessId de la URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const search = window.location.search;
      console.log('🔍 Pathname completo:', pathname);
      console.log('🔍 Search params:', search);
      
      // La URL puede ser:
      // /socialAnalysis/instagram/[competitorId] 
      // o
      // /businessIdeas/businessIdea/[businessId]/competitors/[competitorId]
      
      const segments = pathname.split('/').filter(segment => segment !== '');
      console.log('🔍 Segmentos de URL:', segments);
      
      // Buscar el businessId en diferentes posiciones posibles
      let extractedBusinessId = '';
      
      // Opción 1: Si estamos en la ruta de socialAnalysis, necesitamos obtener el businessId de otra manera
      if (segments[0] === 'socialAnalysis') {
        console.log('📍 Estamos en la ruta de socialAnalysis');
        // Para esta ruta, necesitamos obtener el businessId del localStorage o de una query param
        const urlParams = new URLSearchParams(window.location.search);
        const businessIdFromQuery = urlParams.get('business_id');
        if (businessIdFromQuery) {
          extractedBusinessId = businessIdFromQuery;
          console.log('🆔 Business ID obtenido de query param:', extractedBusinessId);
        } else {
          // Intentar obtener del localStorage
          const storedBusinessId = localStorage.getItem('currentBusinessId');
          if (storedBusinessId) {
            extractedBusinessId = storedBusinessId;
            console.log('🆔 Business ID obtenido del localStorage:', extractedBusinessId);
          } else {
            console.error('❌ No se pudo obtener el businessId');
          }
        }
      } else if (segments[0] === 'businessIdeas' && segments[1] === 'businessIdea') {
        // Opción 2: Ruta tradicional de businessIdeas
        extractedBusinessId = segments[2];
        console.log('🆔 Business ID extraído de businessIdeas:', extractedBusinessId);
      }
      
      if (extractedBusinessId) {
        console.log('✅ Business ID final:', extractedBusinessId);
        setBusinessId(extractedBusinessId);
      } else {
        console.error('❌ No se pudo extraer el businessId de la URL:', pathname);
      }
    }
  }, []);

  console.log('🔧 Estado actual - businessId:', businessId);

  // Primero obtenemos todos los competidores para encontrar el competidor específico
  const { 
    data: competitorsData, 
    isLoading: isLoadingCompetitors, 
    error: competitorsError 
  } = useQuery({
    queryKey: ["competitors", businessId],
    queryFn: () => getCompetitors(businessId),
    enabled: !!businessId, // Solo ejecutar si tenemos el businessId
    retry: 2,
    staleTime: 5 * 60 * 1000,
  }, queryClient);

  console.log('🔧 Query competitors - isLoading:', isLoadingCompetitors, 'error:', competitorsError, 'data:', !!competitorsData);

  // Encontrar el competidor específico usando el ID de la URL
  const competitor = competitorsData?.competitors?.find((c: Competitor) => c.id === competitorId);
  console.log('🔧 Competidor encontrado:', !!competitor, 'competitorId buscado:', competitorId);

  // Ahora obtenemos las estadísticas de Instagram usando el competitor_id correcto
  const { 
    data: instagramData, 
    isLoading: isLoadingInstagram, 
    error: instagramError 
  } = useQuery({
    queryKey: ["instagramStatistics", competitor?.id],
    queryFn: () => getInstagramStatistics(competitor!.id),
    enabled: !!competitor?.id, // Solo ejecutar si tenemos el competidor
    retry: 2,
    staleTime: 5 * 60 * 1000,
  }, queryClient);

  console.log('🔧 Query instagram - isLoading:', isLoadingInstagram, 'error:', instagramError, 'data:', !!instagramData);

  const handleGoBack = () => {
    window.history.back();
  };

  // Función helper para convertir engagement rate a porcentaje
  const formatEngagementRate = (rate: number) => {
    return (rate * 100).toFixed(2);
  };

  // Estados de loading combinados
  if (!businessId) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="p-3 bg-destructive/10 rounded-full">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-destructive mb-1">Error: Business ID no encontrado</h3>
            <p className="text-sm text-muted-foreground">
              No se pudo obtener el Business ID necesario para cargar los competidores. 
              Asegúrate de acceder desde la página de competidores.
            </p>
          </div>
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingCompetitors || isLoadingInstagram) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">
            {isLoadingCompetitors ? "Cargando competidor..." : "Cargando estadísticas de Instagram..."}
          </span>
        </div>
      </div>
    );
  }

  // Errores
  if (competitorsError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="p-3 bg-destructive/10 rounded-full">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-destructive mb-1">Error al cargar competidor</h3>
            <p className="text-sm text-muted-foreground">
              {competitorsError instanceof Error ? competitorsError.message : 'No pudimos obtener la información del competidor'}
            </p>
          </div>
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (instagramError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="p-3 bg-destructive/10 rounded-full">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-destructive mb-1">Error al cargar estadísticas</h3>
            <p className="text-sm text-muted-foreground">
              {instagramError instanceof Error ? instagramError.message : 'No pudimos obtener las estadísticas de Instagram'}
            </p>
          </div>
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Competidor no encontrado
  if (!competitor) {
    return (
      <Card className="border-muted bg-muted/5">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="p-3 bg-muted/10 rounded-full">
            <AlertCircle className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-1">Competidor no encontrado</h3>
            <p className="text-sm text-muted-foreground">No se encontró el competidor con ID: {competitorId}</p>
          </div>
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </CardContent>
      </Card>
    );
  }

  // No hay datos de Instagram
  if (!instagramData) {
    return (
      <Card className="border-muted bg-muted/5">
        <CardContent className="flex flex-col items-center gap-4 py-12">
          <div className="p-3 bg-muted/10 rounded-full">
            <AlertCircle className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-1">No hay datos disponibles</h3>
            <p className="text-sm text-muted-foreground">No se encontraron estadísticas de Instagram para este competidor</p>
          </div>
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información del competidor */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleGoBack} className="mr-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
              <AvatarImage
                src={`https://www.google.com/s2/favicons?domain=${competitor.website || 'example.com'}&sz=64`}
                alt={competitor.competitor_name}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-lg">
                {competitor.competitor_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{competitor.competitor_name}</CardTitle>
              <CardDescription className="text-base mt-2">{competitor.key_feature}</CardDescription>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {competitor.similarity_score}% similar
                </Badge>
                {competitor.instagram_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={competitor.instagram_url} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-4 h-4 mr-2" />
                      Ver Instagram
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Seguidores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {instagramData.total_followers.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Total de seguidores</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-destructive" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatEngagementRate(instagramData.avg_engagement_rate)}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">Promedio general</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {instagramData.total_posts.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Total de publicaciones</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 className="w-5 h-5 text-secondary" />
              Interacciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {(instagramData.total_likes + instagramData.total_comments).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">Likes + comentarios</div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Promedios por Post</CardTitle>
            <CardDescription>Métricas promedio por publicación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Likes promedio</span>
                <span className="font-medium">{Math.round(instagramData.avg_likes_per_post).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Comentarios promedio</span>
                <span className="font-medium">{Math.round(instagramData.avg_comments_per_post).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total de likes</span>
                <span className="font-medium">{instagramData.total_likes.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total de comentarios</span>
                <span className="font-medium">{instagramData.total_comments.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Tipos de Post</CardTitle>
            <CardDescription>Tipos de contenido publicados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(instagramData.post_type_distribution).map(([type, count]) => {
                const percentage = (count / instagramData.total_posts) * 100;
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{type}</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={percentage} 
                        className="w-20 h-2" 
                      />
                      <span className="text-xs text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Posts</CardTitle>
          <CardDescription>Publicaciones con mayor engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {instagramData.top_posts.slice(0, 5).map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 flex items-center justify-center p-0">
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{post.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.post_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {post.likesCount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {post.commentsCount.toLocaleString()}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {formatEngagementRate(post.engagement_rate)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement por día de la semana */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement por Día de la Semana</CardTitle>
          <CardDescription>Rendimiento según el día</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(instagramData.engagement_by_day_of_week).map(([day, engagement]) => {
              const engagementPercentage = engagement * 100;
              return (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{day}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={engagementPercentage} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground">
                      {engagementPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitorInstagramAnalysis;