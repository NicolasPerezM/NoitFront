import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import InfoPopover from "../../../../components/common/InfoPopover";
import { useQuery } from "@tanstack/react-query";
import { getInstagramPostsImageAnalysis } from "@/lib/api/getInstagramPostsImageAnalysis";
import { queryClient } from "@/lib/api/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ImageAnalysisChartProps {
  competitorId: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value, payload: data } = payload[0];
    return (
      <div className="rounded-xl bg-popover p-4 border border-border text-foreground space-y-1 min-w-[200px]">
        <p className="text-sm font-normal text-muted-foreground">Color</p>
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: `rgb(${data.rgb.join(',')})` }}
          />
          <p className="text-lg font-normal text-foreground">{name}</p>
        </div>
        <div className="h-px bg-border my-1" />
        <p className="text-xs font-normal text-muted-foreground">Proporción</p>
        <p className="text-base font-normal">{(value * 100).toFixed(1)}%</p>
        <p className="text-xs font-normal text-muted-foreground">RGB</p>
        <p className="text-base font-normal">{data.rgb.join(', ')}</p>
      </div>
    );
  }
  return null;
};

export default function ImageAnalysisChart({ competitorId }: ImageAnalysisChartProps) {
  const {
    data: imageAnalysisData,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["instagramPostsImageAnalysis", competitorId],
      queryFn: () => getInstagramPostsImageAnalysis(competitorId),
      enabled: !!competitorId,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  );

  // Procesar datos para gráficas
  const colorPaletteData = React.useMemo(() => {
    if (!imageAnalysisData?.images_analyzed) return [];
    
    const colorCounts: Record<string, { count: number; rgb: number[]; proportion: number }> = {};
    
    imageAnalysisData.images_analyzed.forEach(image => {
      image.color_palette.forEach(color => {
        const rgbKey = color.rgb.join(',');
        if (!colorCounts[rgbKey]) {
          colorCounts[rgbKey] = {
            count: 0,
            rgb: color.rgb,
            proportion: 0
          };
        }
        colorCounts[rgbKey].count += 1;
        colorCounts[rgbKey].proportion += color.proportion;
      });
    });

    return Object.entries(colorCounts)
      .map(([key, data]) => ({
        name: `Color ${key}`,
        value: data.proportion / imageAnalysisData.images_analyzed.length,
        count: data.count,
        rgb: data.rgb,
        rgbKey: key
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 colores
  }, [imageAnalysisData]);

  const analysisStats = React.useMemo(() => {
    if (!imageAnalysisData?.images_analyzed) return null;
    
    const totalColors = imageAnalysisData.images_analyzed.reduce(
      (sum, img) => sum + img.color_palette.length, 
      0
    );
    const avgColorsPerImage = totalColors / imageAnalysisData.images_analyzed.length;
    const avgAnalysisLength = imageAnalysisData.images_analyzed.reduce(
      (sum, img) => sum + img.gpt4o_analysis.length, 
      0
    ) / imageAnalysisData.images_analyzed.length;

    return {
      totalImages: imageAnalysisData.total_images,
      analyzedImages: imageAnalysisData.images_analyzed.length,
      totalColors,
      avgColorsPerImage: avgColorsPerImage.toFixed(1),
      avgAnalysisLength: Math.round(avgAnalysisLength),
      analysisTimestamp: imageAnalysisData.analysis_timestamp
    };
  }, [imageAnalysisData]);

  if (isLoading) {
    return (
      <Card className="h-full w-full rounded-2xl bg-background border border-border text-foreground">
        <CardHeader className="relative">
          <Skeleton className="h-7 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
        </CardHeader>
        <CardContent className="h-[calc(100%-10rem)] flex items-center justify-center">
          <div className="w-full h-full flex flex-col gap-4">
            <Skeleton className="h-8 w-5/6 mx-auto" />
            <Skeleton className="h-8 w-4/6 mx-auto" />
            <Skeleton className="h-8 w-3/6 mx-auto" />
            <Skeleton className="h-8 w-2/6 mx-auto" />
            <Skeleton className="h-8 w-1/6 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full w-full bg-background border border-border flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-destructive font-normal">Error al cargar datos</p>
          <p className="text-sm font-normal text-muted-foreground">
            {error instanceof Error ? error.message : "Error desconocido"}
          </p>
        </div>
      </Card>
    );
  }

  if (!imageAnalysisData || !analysisStats) {
    return (
      <Card className="h-full w-full bg-background border border-border flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-base font-normal text-muted-foreground">
            No se encontraron datos de análisis de imágenes
          </p>
          <p className="text-xs font-normal text-muted-foreground">
            Competitor ID: {competitorId}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <Card className="rounded-2xl bg-background border border-border text-foreground">
        <CardHeader>
          <CardTitle className="text-2xl font-normal">
            Análisis de Imágenes de Posts
          </CardTitle>
          <CardDescription className="text-base font-normal text-muted-foreground">
            Análisis completo de imágenes usando GPT-4 Vision y paletas de colores
          </CardDescription>
          <InfoPopover>
            <h4 className="font-normal text-lg">Acerca de este análisis</h4>
            <p className="text-sm font-normal text-muted-foreground">
              Este análisis incluye descripción detallada de cada imagen usando GPT-4 Vision 
              y extracción de paletas de colores dominantes.
            </p>
          </InfoPopover>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">{analysisStats.totalImages}</p>
              <p className="text-sm text-muted-foreground">Total de imágenes</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">{analysisStats.analyzedImages}</p>
              <p className="text-sm text-muted-foreground">Analizadas</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">{analysisStats.avgColorsPerImage}</p>
              <p className="text-sm text-muted-foreground">Colores promedio</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">{analysisStats.avgAnalysisLength}</p>
              <p className="text-sm text-muted-foreground">Caracteres análisis</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Badge variant="outline" className="text-xs">
              Analizado: {new Date(analysisStats.analysisTimestamp).toLocaleDateString()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Gráfica de colores dominantes */}
      <Card className="rounded-2xl bg-background border border-border text-foreground">
        <CardHeader>
          <CardTitle className="text-xl font-normal">
            Paleta de Colores Dominantes
          </CardTitle>
          <CardDescription className="text-base font-normal text-muted-foreground">
            Distribución de los colores más frecuentes en todas las imágenes
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          {colorPaletteData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={colorPaletteData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="30%"
                  outerRadius="70%"
                  paddingAngle={2}
                >
                  {colorPaletteData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`rgb(${entry.rgb.join(',')})`}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No hay datos de colores disponibles</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de análisis detallados */}
      <Card className="rounded-2xl bg-background border border-border text-foreground">
        <CardHeader>
          <CardTitle className="text-xl font-normal">
            Análisis Detallado por Imagen
          </CardTitle>
          <CardDescription className="text-base font-normal text-muted-foreground">
            Descripción y paleta de colores de cada imagen analizada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6 max-h-[600px] overflow-y-auto">
            {imageAnalysisData.images_analyzed.map((image, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">{image.file_name}</h4>
                  <Badge variant="secondary">
                    {image.color_palette.length} colores
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Análisis GPT-4 Vision:</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {image.gpt4o_analysis}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Paleta de colores:</p>
                  <div className="flex flex-wrap gap-2">
                    {image.color_palette.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="flex items-center gap-2 p-2 rounded border"
                        style={{ backgroundColor: `rgb(${color.rgb.join(',')})` }}
                      >
                        <div className="w-4 h-4 rounded border border-white/20" />
                        <span className="text-xs font-medium text-white drop-shadow">
                          {(color.proportion * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 