"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import InfoPopover from "../../../../components/common/InfoPopover";
import { useQuery } from "@tanstack/react-query";
import { getInstagramCommentsEmotions } from "@/lib/api/getInstagramCommentsEmotions";
import { queryClient } from "@/lib/api/queryClient";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Paleta de colores para las emociones
const COLORS = [
  "hsl(17, 84%, 48%)",
  "hsl(0, 0%, 18%)",
  "hsl(227, 22%, 40%, 0.5)",
  "hsl(227, 22%, 40%, 0.7)"
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="rounded-lg border border-border bg-popover text-foreground p-3">
        <p className="text-sm font-normal capitalize">{name}</p>
        <p className="text-xs font-normal text-muted-foreground">{`Cantidad: ${value}`}</p>
      </div>
    );
  }
  return null;
};

interface OverallEmotionChartProps {
  competitorId: string;
}

const OverallEmotionChart = ({ competitorId }: OverallEmotionChartProps) => {
  const {
    data: emotionData,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["instagramCommentsEmotions", competitorId],
      queryFn: () => getInstagramCommentsEmotions(competitorId),
      enabled: !!competitorId,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  );

  let chartData: { name: string; value: number }[] = [];
  if (emotionData && Array.isArray(emotionData.results)) {
    const sumScores: Record<string, number> = {};
    const countScores: Record<string, number> = {};
    emotionData.results.forEach((comment: any) => {
      if (Array.isArray(comment.scores)) {
        comment.scores.forEach((score: any) => {
          const label = score.label;
          sumScores[label] = (sumScores[label] || 0) + score.score;
          countScores[label] = (countScores[label] || 0) + 1;
        });
      }
    });
    chartData = Object.keys(sumScores).map((name) => ({
      name,
      value: countScores[name] ? sumScores[name] / countScores[name] : 0,
    }));
  }
  const hasData = chartData.length > 0;

  if (isLoading) {
    return (
      <Card className="h-full w-full rounded-2xl bg-background border border-border text-foreground">
        <CardHeader className="relative">
          <Skeleton className="h-7 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
        </CardHeader>
        <CardContent className="h-[calc(100%-10rem)] flex items-center justify-center">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Skeleton className="rounded-full h-48 w-48 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4" />
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

  return (
    <Card className="h-full w-full bg-background border border-border rounded-2xl">
      <CardHeader className="relative">
        <CardTitle className="text-xl md:text-2xl font-normal text-foreground">
          Distribución de Emociones
        </CardTitle>
        <InfoPopover>
          <h4 className="font-normal text-lg">Acerca de esta gráfica</h4>
          <p className="text-sm font-normal text-muted-foreground">
            Esta gráfica muestra la distribución de emociones en los comentarios.
          </p>
        </InfoPopover>
        <CardDescription className="text-base font-normal text-muted-foreground">
          Esta gráfica muestra la distribución de emociones en los comentarios.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-10rem)]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="35%"
                outerRadius="65%"
                startAngle={90}
                endAngle={-270}
                paddingAngle={4}
                label={false}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{
                  fontSize: "0.875rem",
                  paddingTop: "1rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-base font-normal text-muted-foreground">
              No se encontraron datos de emociones
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverallEmotionChart;
