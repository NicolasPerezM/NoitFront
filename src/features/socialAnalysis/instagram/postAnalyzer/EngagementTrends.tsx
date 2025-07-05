"use client";
import { useQuery } from "@tanstack/react-query";
import { getInstagramStatistics } from "@/lib/api/getInstagramStatistics";
import { queryClient } from "@/lib/api/queryClient";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EngagementTrendsProps {
  competitorId: string;
}

/**
 * Componente que renderiza la gráfica de tendencias de engagement
 * Consume el endpoint getInstagramStatistics para obtener los datos de engagement_trends.
 */
const EngagementTrends = ({ competitorId }: EngagementTrendsProps) => {
  // Query para obtener estadísticas de Instagram
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

  // Debug logs para entender qué datos estamos recibiendo
  console.log('🔍 EngagementTrends - competitorId:', competitorId);
  console.log('🔍 EngagementTrends - instagramData:', instagramData);
  console.log('🔍 EngagementTrends - engagement_trends:', instagramData?.engagement_trends);

  // Verificamos si trends existe y es un array
  const trends = instagramData?.engagement_trends || [];
  const hasTrends = Array.isArray(trends) && trends.length > 0;

  console.log('🔍 EngagementTrends - trends:', trends);
  console.log('🔍 EngagementTrends - hasTrends:', hasTrends);

  // Formatea los datos solo si hay datos disponibles
  const formattedData = hasTrends
    ? trends.map((item) => ({
        ...item,
        // Asumiendo que post_date es una string en formato ISO o similar
        formattedDate:
          typeof item.post_date === "string"
            ? format(new Date(item.post_date), "dd MMM", { locale: es })
            : item.post_date,
        // Formatea el valor para mostrarlo como porcentaje
        engagement_rate: item.engagement_rate,
        engagement_percent: (item.engagement_rate * 100).toFixed(2),
      }))
    : [];

  console.log('🔍 EngagementTrends - formattedData:', formattedData);

  // Loading state
  if (isLoading) {
    return (
      <Card className="h-full flex flex-col bg-background border border-border">
        <CardHeader className="relative flex-none pb-4">
          <CardTitle className="text-xl text-foreground">
            Tendencias de Engagement
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Evolución de la tasa de engagement a lo largo del tiempo
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando datos de engagement...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    console.error('🔍 EngagementTrends - Error:', error);
    return (
      <Card className="h-full flex flex-col bg-background border border-border">
        <CardHeader className="relative flex-none pb-4">
          <CardTitle className="text-xl text-foreground">
            Tendencias de Engagement
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Evolución de la tasa de engagement a lo largo del tiempo
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
            Tendencias de Engagement
          </CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full top-4 right-4"
                aria-label="Información sobre tendencias de engagement"
              >
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-background border border-border" align="end">
              <div className="space-y-2">
                <h4 className="font-normal text-sm text-foreground">Acerca de esta gráfica</h4>
                <p className="text-xs text-muted-foreground">
                  Esta gráfica muestra la evolución de la tasa de engagement a
                  lo largo del tiempo. La tasa de engagement representa el
                  porcentaje de interacciones (me gusta, comentarios,
                  compartidos) en relación al alcance total del contenido.
                </p>
                <p className="text-xs text-muted-foreground">
                  Un aumento en la línea indica mayor interacción de los
                  usuarios con tu contenido, mientras que una disminución puede
                  indicar menor interés o alcance.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Evolución de la tasa de engagement a lo largo del tiempo
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        {!hasTrends ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                No se encontraron datos de tendencias de engagement
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
        ) : (
          <ChartContainer
            config={{
              engagement_rate: {
                label: "Tasa de Engagement",
                color: "var(--primary)",
              },
            }}
            className="h-full w-full [&_.recharts-wrapper]:h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedData}
                margin={{ top: 8, right: 8, left: 0, bottom: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis
                  dataKey="formattedDate"
                  tick={{ fontSize: 12 }}
                  tickMargin={8}
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <YAxis
                  tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                  tick={{ fontSize: 12 }}
                  width={48}
                  stroke="var(--muted-foreground)"
                  tickLine={false}
                  axisLine={{ stroke: "var(--border)" }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatValue={(value, dataKey) =>
                        dataKey === "engagement_rate"
                          ? `${(value * 100).toFixed(2)}%`
                          : value
                      }
                    />
                  }
                />
                <Legend 
                  wrapperStyle={{ paddingTop: 8 }}
                  formatter={() => (
                    <span className="text-sm text-foreground">Tasa de engagement</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="engagement_rate"
                  name="Engagement"
                  fill="var(--primary)"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, fill: "var(--primary)" }}
                  activeDot={{ r: 6, strokeWidth: 2, fill: "var(--primary)" }}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EngagementTrends;
