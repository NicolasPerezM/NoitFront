"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  type PieLabelRenderProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { getInstagramStatistics } from "@/lib/api/getInstagramStatistics";
import { queryClient } from "@/lib/api/queryClient";

// Colores estrictamente del tema global.css
const COLORS: Record<string, string> = {
  Image: "var(--primary)",      // Amarillo/naranja principal
  Sidecar: "var(--primary)",   // Amarillo/naranja principal
  Video: "var(--primary)",     // Amarillo/naranja principal
};

interface PostTypePieChartProps {
  competitorId: string;
}

const PostTypePieChart = ({ competitorId }: PostTypePieChartProps) => {
  const {
    data: instagramData,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["instagramStatistics", competitorId],
      queryFn: () => getInstagramStatistics(competitorId),
      enabled: !!competitorId,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  );

  const distribution = instagramData?.post_type_distribution || null;
  const hasData = distribution && Object.keys(distribution).length > 0;
  const chartData = hasData
    ? Object.entries(distribution).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    value,
  }: PieLabelRenderProps) => {
    // Manejo seguro de undefined
    if (
      typeof cx !== "number" ||
      typeof cy !== "number" ||
      typeof innerRadius !== "number" ||
      typeof outerRadius !== "number"
    )
      return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="var(--foreground)"
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight="bold"
        fontSize={12}
      >
        {value}
      </text>
    );
  };

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col bg-background border border-border">
        <CardHeader className="relative flex-none pb-4">
          <CardTitle className="text-xl" style={{ color: "var(--foreground)" }}>
            Distribución de Tipos de Publicación
          </CardTitle>
          <CardDescription className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Proporción de imágenes, carruseles y videos publicados
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando datos de publicaciones...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex flex-col bg-background border border-border">
        <CardHeader className="relative flex-none pb-4">
          <CardTitle className="text-xl text-foreground">
            Distribución de Tipos de Publicación
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Proporción de imágenes, carruseles y videos publicados
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-destructive font-normal">Error al cargar datos</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "Error desconocido"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col bg-card border border-border">
      <CardHeader className="relative flex-none pb-4">
        <div className="flex justify-between items-center gap-4">
          <CardTitle className="text-xl text-foreground">
            Distribución de Tipos de Publicación
          </CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full top-4 right-4"
                aria-label="Información sobre el gráfico de tipos de publicación"
              >
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-background border border-border" align="end">
              <div className="space-y-2">
                <h4 className="font-normal text-sm text-foreground">Acerca de esta gráfica</h4>
                <p className="text-xs text-muted-foreground">
                  Este gráfico de pastel muestra la proporción de tipos de
                  publicaciones realizadas en el periodo analizado (imágenes,
                  carruseles, videos).
                </p>
                <p className="text-xs text-muted-foreground">
                  Puedes identificar rápidamente qué formato es el más usado y
                  ajustar tu estrategia de contenido si es necesario.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Proporción de imágenes, carruseles y videos publicados
        </CardDescription>
      </CardHeader>
        <CardContent className="flex-1 min-h-0 flex flex-col" style={{ background: "var(--card)" }}>
        {/* Contenedor con altura flexible para el gráfico */}
        <div className="flex-1 min-h-0">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="var(--primary)"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.name] || "var(--primary)"}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  No se encontraron datos de tipos de publicación
                </p>
                <p className="text-xs text-muted-foreground">
                  Competitor ID: {competitorId}
                </p>
                {instagramData && (
                  <p className="text-xs text-muted-foreground">
                    Datos disponibles: {Object.keys(instagramData).join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Leyenda */}
        {hasData && (
        <div className="flex justify-center gap-4 mt-4 flex-wrap flex-none">
          {chartData.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[entry.name] || "var(--primary)" }}
              />
              <span className="text-sm" style={{ color: "var(--foreground)" }}>{entry.name}</span>
            </div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostTypePieChart;
