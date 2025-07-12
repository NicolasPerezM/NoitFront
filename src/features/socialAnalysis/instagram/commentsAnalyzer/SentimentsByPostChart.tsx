"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { ChartTooltip } from "@/components/ui/chart";

import InfoPopover from "../../../../components/common/InfoPopover";
import { useQuery } from "@tanstack/react-query";
import { getInstagramCommentsSentiments } from "@/lib/api/getInstagramCommentsSentiments";
import { queryClient } from "@/lib/api/queryClient";
import { Loader2 } from "lucide-react";

interface SentimentsByPostChartProps {
  competitorId: string;
}

/**
 * Componente que muestra un gráfico de barras apiladas que analiza
 * el sentimiento de los comentarios en cada post. El gráfico utiliza
 * colores para representar el sentimiento Positivo, Neutral y Negativo.
 */
export const SentimentsByPostChart = ({ competitorId }: SentimentsByPostChartProps) => {
  const {
    data: sentimentsData,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["instagramCommentsSentiments", competitorId],
      queryFn: () => getInstagramCommentsSentiments(competitorId),
      enabled: !!competitorId,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  );

  const processData = (data: any) => {
    if (!data || !Array.isArray(data.results)) return [];
    // Agrupar por post_id y contar los sentimientos
    const grouped: Record<string, { postId: string; POS: number; NEU: number; NEG: number }> = {};
    data.results.forEach((comment: any) => {
      const postId = comment.post_id;
      const label = comment.top_label;
      if (!grouped[postId]) {
        grouped[postId] = { postId, POS: 0, NEU: 0, NEG: 0 };
      }
      if (label === "POS") grouped[postId].POS += 1;
      else if (label === "NEU") grouped[postId].NEU += 1;
      else if (label === "NEG") grouped[postId].NEG += 1;
    });
    return Object.values(grouped);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl bg-popover p-4 border border-border text-foreground space-y-1 min-w-[160px]">
          <p className="text-sm font-normal text-muted-foreground">
            Post ID: <span className="text-foreground">{payload[0].payload.postId}</span>
          </p>
          {payload.map((entry: any, index: number) => (
            <div
              key={`tooltip-item-${index}`}
              className="flex justify-between text-xs"
            >
              <span className="capitalize">{entry.name}</span>
              <span className="font-normal">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartData = processData(sentimentsData);
  const hasData = chartData.length > 0;

  if (isLoading) {
    return (
      <Card className="bg-background border border-border flex items-center justify-center h-full w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-background border border-border flex items-center justify-center h-full w-full">
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
    <Card className="bg-background border border-border rounded-2xl h-full w-full">
      <CardHeader className="relative">
        <CardTitle className="text-xl md:text-2xl font-normal text-foreground">
          Análisis de Sentimiento por Post
        </CardTitle>
        <CardDescription className="text-base font-normal text-muted-foreground">
          Esta gráfica muestra el sentimiento de los comentarios en cada post.
        </CardDescription>
        <InfoPopover>
          <h4 className="font-normal text-lg">Acerca de esta gráfica</h4>
          <p className="text-sm font-normal text-muted-foreground">
            Esta gráfica muestra el sentimiento de los comentarios en cada post.
          </p>
        </InfoPopover>
      </CardHeader>

      <CardContent className="h-[400px] w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis
                dataKey="postId"
                tick={{ fontSize: 12 }}
                width={50}
                axisLine={true}
                tickLine={true}
              />
              <YAxis axisLine={true} tickLine={true} width={50} />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.15 }}
                content={<CustomTooltip />}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "0.75rem",
                  paddingTop: "1rem",
                }}
                iconType="circle"
              />
              <Bar
                dataKey="POS"
                stackId="a"
                fill="var(--primary)"
                name="Positivo"
                stroke=""
              />
              <Bar
                dataKey="NEU"
                stackId="a"
                fill="var(--muted)"
                name="Neutral"
                stroke=""
              />
              <Bar
                dataKey="NEG"
                stackId="a"
                fill="var(--destructive)"
                name="Negativo"
                stroke=""
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-base font-normal text-muted-foreground">
              No se encontraron datos de sentimientos por post
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
