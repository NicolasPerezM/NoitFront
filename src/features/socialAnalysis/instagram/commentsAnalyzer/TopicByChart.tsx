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
  LabelList,
} from "recharts";
import InfoPopover from "../../../../components/common/InfoPopover";
import { useQuery } from "@tanstack/react-query";
import { getInstagramCommentsTopics } from "@/lib/api/getInstagramCommentsTopics";
import { queryClient } from "@/lib/api/queryClient";
import { Loader2 } from "lucide-react";

interface TopicByChartProps {
  competitorId: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { topic, cantidad_comentarios, topWords } = payload[0].payload;
    return (
      <div className="rounded-xl bg-popover p-4 border border-border text-foreground space-y-1 min-w-[200px]">
        <p className="text-sm font-normal text-muted-foreground">Tema</p>
        <p className="text-lg font-normal text-foreground">{topic}</p>
        <div className="h-px bg-border my-1" />
        <p className="text-xs font-normal text-muted-foreground">Cantidad de comentarios</p>
        <p className="text-base font-normal">{cantidad_comentarios}</p>
        <div className="h-px bg-border my-1" />
        <p className="text-xs font-normal text-muted-foreground">Palabras clave</p>
        <p className="text-base font-normal">{topWords.join(", ")}</p>
      </div>
    );
  }
  return null;
};

export default function TopicByChart({ competitorId }: TopicByChartProps) {
  const {
    data: topicsData,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["instagramCommentsTopics", competitorId],
      queryFn: () => getInstagramCommentsTopics(competitorId),
      enabled: !!competitorId,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  );

  // Procesar los datos para la gráfica
  const chartData =
    topicsData && typeof topicsData === "object"
      ? Object.entries(topicsData).map(([topic, data]) => ({
          topic,
          cantidad_comentarios: data.cantidad_comentarios,
          topWords: Object.entries(data.palabras_con_pesos)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([word]) => word),
        }))
      : [];
  const hasData = chartData.length > 0;

  if (isLoading) {
    return (
      <Card className="h-full w-full bg-background border border-border flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    <Card className="h-full w-full rounded-2xl bg-background border border-border text-foreground">
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-normal">
          Temas principales en comentarios
        </CardTitle>
        <CardDescription className="text-base font-normal text-muted-foreground">
          Esta gráfica muestra los temas detectados en los comentarios y la cantidad de comentarios asociados a cada uno.
        </CardDescription>
        <InfoPopover>
          <h4 className="font-normal text-lg">Acerca de esta gráfica</h4>
          <p className="text-sm font-normal text-muted-foreground">
            Cada barra representa un tema detectado en los comentarios. Las palabras clave son las más representativas de cada tema.
          </p>
        </InfoPopover>
      </CardHeader>
      <CardContent className="h-[calc(100%-10rem)]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 20, bottom: 10, left: 40 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="topic" />
              <Bar
                dataKey="cantidad_comentarios"
                fill="var(--primary)"
                stroke="var(--primary)"
              >
                <LabelList
                  dataKey="topWords"
                  position="right"
                  formatter={(words: string[]) => words.join(", ")}
                  fill="var(--foreground)"
                />
              </Bar>
              <Tooltip content={<CustomTooltip />} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-base font-normal text-muted-foreground">
                No se encontraron temas en los comentarios
              </p>
              <p className="text-xs font-normal text-muted-foreground">
                Competitor ID: {competitorId}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 