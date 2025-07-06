"use client";

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
  CartesianGrid,
  LabelList,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import InfoPopover from "../../../../components/common/InfoPopover";
import { useQuery } from "@tanstack/react-query";
import { getInstagramCommentCategories } from "@/lib/api/getInstagramCommentsCategories";
import { queryClient } from "@/lib/api/queryClient";
import { Loader2 } from "lucide-react";

interface CategoryByChartProps {
  competitorId: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { category, count } = payload[0].payload;
    return (
      <div className="rounded-xl bg-popover p-4 border border-border text-foreground space-y-1 min-w-[180px]">
        <p className="text-sm font-semibold text-muted-foreground">Categoría</p>
        <p className="text-base font-medium text-foreground">{category}</p>
        <div className="h-px bg-border my-1" />
        <p className="text-xs text-muted-foreground">Cantidad de comentarios</p>
        <p className="text-sm font-semibold">{count}</p>
      </div>
    );
  }
  return null;
};

export default function CategoryByChart({ competitorId }: CategoryByChartProps) {
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["instagramCommentsCategories", competitorId],
      queryFn: () => getInstagramCommentCategories(competitorId),
      enabled: !!competitorId,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  );

  // Esperamos que la respuesta sea un objeto con category_counts
  const chartData = categoriesData && categoriesData.category_counts
    ? Object.entries(categoriesData.category_counts).map(([category, count]) => ({
        category,
        count,
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
          <p className="text-sm text-muted-foreground">
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
          Distribución de Categorías de Comentarios
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Esta gráfica muestra la distribución de categorías de comentarios en
          el perfil de Instagram.
        </CardDescription>
        <InfoPopover>
          <h4 className="font-normal text-sm">Acerca de esta gráfica</h4>
          <p className="text-xs text-muted-foreground">
            Esta gráfica muestra la distribución de categorías de comentarios en
            el perfil de Instagram.
          </p>
          <p className="text-xs text-muted-foreground">
            La categoría de un comentario se determina según el contenido del
            comentario y el contexto del perfil.
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
              <YAxis type="category" dataKey="category" />
              <Bar
                dataKey="count"
                fill="var(--primary)"
                stroke="var(--primary)"
              >
                <LabelList
                  dataKey="count"
                  position="right"
                  fill="var(--foreground)"
                />
              </Bar>
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.15 }}
                content={<CustomTooltip />}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                No se encontraron datos de categorías de comentarios
              </p>
              <p className="text-xs text-muted-foreground">
                Competitor ID: {competitorId}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
