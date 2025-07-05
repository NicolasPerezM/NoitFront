"use client";

import { useQuery } from "@tanstack/react-query";
import { getInstagramStatistics } from "@/lib/api/getInstagramStatistics";
import { queryClient } from "@/lib/api/queryClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpIcon, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChartTooltip } from "@/components/ui/chart";

// Tipado para props del componente
type EngagementData = {
  day: string;
  rate: number;
};

interface EngagementByDayProps {
  competitorId: string;
}

// Tooltip personalizado para la barra
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload?.length) {
    const rate = payload[0].value;
    return (
      <div className="bg-background border border-border rounded-md p-4">
        <p className="font-normal text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">
          Engagement: {" "}
          <span className="font-normal text-primary">
            {rate ? `${(rate * 100).toFixed(2)}%` : "N/A"}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

// Función auxiliar para encontrar el mejor día
const getBestDay = (data: EngagementData[]) => {
  return data.reduce(
    (max, item) => (item.rate > max.rate ? item : max),
    data[0]
  );
};

// Función para transformar los datos del endpoint al formato requerido
const transformEngagementData = (engagementByDayOfWeek: Record<string, number>): EngagementData[] => {
  console.log('🔍 transformEngagementData - input:', engagementByDayOfWeek);
  
  const dayNames = {
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
    // Agregar también las versiones con primera letra en mayúscula
    Monday: "Lunes",
    Tuesday: "Martes",
    Wednesday: "Miércoles",
    Thursday: "Jueves",
    Friday: "Viernes",
    Saturday: "Sábado",
    Sunday: "Domingo",
  };

  const transformed = Object.entries(engagementByDayOfWeek)
    .filter(([day, rate]) => {
      // Filtrar solo entradas válidas
      const isValid = typeof rate === 'number' && !isNaN(rate) && rate >= 0;
      if (!isValid) {
        console.warn('⚠️ Dato inválido encontrado:', { day, rate });
      }
      return isValid;
    })
    .map(([day, rate]) => {
      // Normalizar el nombre del día (convertir a minúscula para buscar en el mapeo)
      const normalizedDay = day.toLowerCase();
      const spanishDay = dayNames[day as keyof typeof dayNames] || dayNames[normalizedDay as keyof typeof dayNames] || day;
      
      console.log('🔍 transformEngagementData - mapping:', { original: day, normalized: normalizedDay, spanish: spanishDay });
      
      return {
        day: spanishDay,
        rate: rate,
      };
    });

  console.log('🔍 transformEngagementData - output:', transformed);
  return transformed;
};

const EngagementByDay = ({ competitorId }: EngagementByDayProps) => {
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
  console.log('🔍 EngagementByDay - competitorId:', competitorId);
  console.log('🔍 EngagementByDay - instagramData:', instagramData);
  console.log('🔍 EngagementByDay - engagement_by_day_of_week:', instagramData?.engagement_by_day_of_week);
  console.log('🔍 EngagementByDay - typeof engagement_by_day_of_week:', typeof instagramData?.engagement_by_day_of_week);

  // Transformar los datos para la gráfica
  const data = instagramData?.engagement_by_day_of_week 
    ? transformEngagementData(instagramData.engagement_by_day_of_week)
    : [];

  console.log('🔍 EngagementByDay - transformed data:', data);
  console.log('🔍 EngagementByDay - data length:', data.length);

  const isValidData = Array.isArray(data) && data.length > 0;

  console.log('🔍 EngagementByDay - isValidData:', isValidData);

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-4 w-full h-full bg-background border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-foreground">
            Engagement por Día de la Semana
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Tasa de interacción por día
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
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
    console.error('🔍 EngagementByDay - Error:', error);
    return (
      <Card className="p-4 w-full h-full bg-background border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-foreground">
            Engagement por Día de la Semana
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Tasa de interacción por día
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
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

  if (!isValidData) {
    console.log('🔍 EngagementByDay - No valid data, showing empty state');
    console.log('🔍 EngagementByDay - instagramData keys:', instagramData ? Object.keys(instagramData) : 'No data');
    return (
      <Card className="p-4 w-full h-full bg-background border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-foreground">
            Engagement por Día de la Semana
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Tasa de interacción por día
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              No se encontraron datos de engagement por día de la semana
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
        </CardContent>
      </Card>
    );
  }

  const bestDay = getBestDay(data);
  const averageRate =
    data.reduce((sum, item) => sum + item.rate, 0) / data.length;

  return (
    <Card className="w-full h-full bg-card border border-border">
      <CardHeader className="relative pb-4">
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl text-foreground">
              Engagement por Día de la Semana
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Tasa de interacción por día
            </CardDescription>
          </div>
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
            <PopoverContent className="w-80 z-50 bg-background border border-border" align="end">
              <div className="space-y-2">
                <h4 className="font-normal text-sm text-foreground">Acerca de esta gráfica</h4>
                <p className="text-xs text-muted-foreground">
                  Esta gráfica muestra el promedio de engagement por día de la semana.
                </p>
                <p className="text-xs text-muted-foreground">
                  El engagement representa el porcentaje de interacciones frente al alcance del contenido.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent className="h-full w-full flex flex-col items-center justify-center gap-4">
        {/* Estadísticas resumidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 justify-between w-full gap-4 mb-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Mejor día</p>
            <div className="flex items-center mt-2">
              <p className="text-lg text-foreground">
                {bestDay?.day || "N/A"}
              </p>
              {bestDay && (
                <span className="ml-2 text-emerald-500 flex items-center text-xs">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  {((bestDay.rate / averageRate - 1) * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Promedio</p>
            <p className="text-lg text-foreground">
              {(averageRate * 100).toFixed(2)}%
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Total analizado</p>
            <p className="text-lg text-foreground">{data.length} días</p>
          </div>
        </div>

        {/* Gráfica */}
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 16 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                opacity={0.4}
                vertical={false}
              />
              <XAxis
                dataKey="day"
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                width={48}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.15 }}
                content={<CustomTooltip />}
              />
              <Legend
                wrapperStyle={{ paddingTop: 8 }}
                formatter={() => (
                  <span className="text-sm text-foreground">Tasa de engagement</span>
                )}
              />
              <Bar
                dataKey="rate"
                name="Engagement"
                fill="var(--primary)"
                stroke="var(--primary)"
                radius={[4, 4, 0, 0]}
                barSize={32}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementByDay;
