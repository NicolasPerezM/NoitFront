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
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryByChartProps {
  competitorId: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { category, count } = payload[0].payload;
    return (
      <div className="rounded-xl bg-popover p-4 border border-border text-foreground space-y-1 min-w-[180px]">
        <p className="text-sm font-normal text-muted-foreground">Categoría</p>
        <p className="text-lg font-normal text-foreground">{category}</p>
        <div className="h-px bg-border my-1" />
        <p className="text-xs font-normal text-muted-foreground">Cantidad de comentarios</p>
        <p className="text-base font-normal">{count}</p>
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

  // DEBUG: Imprimir la respuesta y el error
  console.log("categoriesData", categoriesData);
  console.log("error", error);

  // Limpieza y validación de datos
  let chartData: { category: string; count: number }[] = [];
  let invalidCategories: string[] = [];

  if (categoriesData && categoriesData.category_counts) {
    chartData = Object.entries(categoriesData.category_counts)
      .filter(([category, count]) => typeof count === "number" && !isNaN(count))
      .map(([category, count]) => ({ category, count }));
  }

  // Validar y normalizar comentarios categorizados (si existen)
  let invalidCommentCategories: string[] = [];
  let ignoredCommentsCount = 0;
  if (categoriesData && categoriesData.categorized_comments) {
    for (const [cat, comments] of Object.entries(categoriesData.categorized_comments)) {
      // Filtrar solo los que tengan contenido válido
      const validComments = (comments as any[]).filter(
        (c) => typeof c === "object" && typeof c.contenido === "string"
      );
      ignoredCommentsCount += (comments as any[]).length - validComments.length;
      // Normalizar los comentarios para que tengan todos los campos
      (categoriesData.categorized_comments as any)[cat] = validComments.map((c) => ({
        post_id: c.post_id || "",
        id_comentario: c.id_comentario || "",
        ownerUsername: c.ownerUsername || "",
        contenido: c.contenido || "",
      }));
      if (validComments.length < (comments as any[]).length) {
        invalidCommentCategories.push(cat);
      }
    }
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

  return (
    <Card className="h-full w-full rounded-2xl bg-background border border-border text-foreground">
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-normal">
          Distribución de Categorías de Comentarios
        </CardTitle>
        <CardDescription className="text-base font-normal text-muted-foreground">
          Esta gráfica muestra la distribución de categorías de comentarios en
          el perfil de Instagram.
        </CardDescription>
        <InfoPopover>
          <h4 className="font-normal text-lg">Acerca de esta gráfica</h4>
          <p className="text-sm font-normal text-muted-foreground">
            Esta gráfica muestra la distribución de categorías de comentarios en
            el perfil de Instagram.
          </p>
          <p className="text-sm font-normal text-muted-foreground">
            La categoría de un comentario se determina según el contenido del
            comentario y el contexto del perfil.
          </p>
        </InfoPopover>
      </CardHeader>
      <CardContent className="h-[calc(100%-10rem)]">
        {/* Mostrar advertencia si hay categorías con comentarios inválidos */}
        {invalidCommentCategories.length > 0 && (
          <div className="mb-2 p-2 rounded bg-yellow-100 text-yellow-800 text-xs">
            Se ignoraron {ignoredCommentsCount} comentarios con estructura inválida en las categorías: {invalidCommentCategories.join(", ")}
          </div>
        )}
        {hasData ? (
          <ResponsiveContainer width="100%" height={Math.max(320, chartData.length * 48)}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 40, bottom: 20, left: 120 }}
              barCategoryGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--muted)" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 14, fill: "var(--muted-foreground)", fontWeight:400  }}
              />
              <YAxis
                type="category"
                dataKey="category"
                axisLine={false}
                tickLine={false}
                width={120}
                tick={{ fontSize: 16, fill: "var(--foreground)", fontWeight: 600 }}
              />
              <Bar
                dataKey="count"
                fill="var(--primary)"
                stroke="var(--primary)"
                radius={[2, 2, 2, 2]}
                minPointSize={2}
              >
                <LabelList
                  dataKey="count"
                  position="right"
                  fill="var(--foreground)"
                  fontSize={15}
                  fontWeight={700}
                  formatter={(value) => value}
                />
              </Bar>
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.15 }}
                content={<CustomTooltip />}
                wrapperStyle={{ fontSize: 15, fontWeight: 500, color: "var(--foreground)" }}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-base font-normal text-muted-foreground">
                No se encontraron datos de categorías de comentarios
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
