"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
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
import { HashIcon as Hashtag } from "lucide-react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// Tipado para los posts esperados
type Post = {
  hashtags?: string[];
};

interface HashtagsChartProps {
  posts?: Post[];
}

const HashtagsChart = ({ posts = [] }: HashtagsChartProps) => {
  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="relative">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-2xl font-sora">
              <Hashtag className="h-5 w-5" />
              Hashtags Más Utilizados
            </CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full absolute top-4 right-4"
                  aria-label="Información sobre hashtags"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 z-50" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    Acerca de esta gráfica
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Esta gráfica muestra los hashtags más utilizados en tus
                    publicaciones, ordenados por frecuencia de aparición.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Analiza qué hashtags están funcionando y si están alineados
                    con tus objetivos de contenido.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>

        <CardContent className="text-center py-8 text-muted-foreground">
          No hay datos de posts disponibles
        </CardContent>
      </Card>
    );
  }

  // Contador de hashtags en minúscula para agrupar correctamente
  const hashtagCounts: Record<string, number> = {};
  posts.forEach((post) => {
    post.hashtags?.forEach((tag) => {
      const lower = tag.toLowerCase();
      hashtagCounts[lower] = (hashtagCounts[lower] || 0) + 1;
    });
  });

  // Convertir a arreglo y ordenar por frecuencia descendente
  const data = Object.entries(hashtagCounts)
    .map(([hashtag, count]) => ({ hashtag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  if (data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hashtag className="h-5 w-5" />
            Hashtags Más Utilizados
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          No se encontraron hashtags en los posts
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="relative flex-none">
      <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-xl font-sora">
              <Hashtag className="h-5 w-5" />
              Hashtags Más Utilizados
            </CardTitle>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full absolute top-4 right-4"
                  aria-label="Información sobre hashtags"
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 z-50" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    Acerca de esta gráfica
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Esta gráfica muestra los hashtags más utilizados en tus
                    publicaciones, ordenados por frecuencia de aparición.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Analiza qué hashtags están funcionando y si están alineados
                    con tus objetivos de contenido.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        <CardDescription>
          Los {data.length} hashtags más frecuentes en tus publicaciones
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-x-auto">
        <ChartContainer
          config={{
            count: {
              label: "Frecuencia",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-full min-w-[600px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 24 }}
              barCategoryGap={8}
            >
              <XAxis
                dataKey="hashtag"
                tickLine={true}
                axisLine={true}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `#${value}`}
                angle={-45}
                textAnchor="end"
                height={60}
                stroke="var(--border)"
              />
              <YAxis
                tickLine={true}
                axisLine={true}
                tick={{ fontSize: 12 }}
                tickCount={5}
                stroke="var(--border)"
              />
              <Bar
                dataKey="count"
                fill="hsl(227, 22%, 40%, 0.2)"
                stroke="hsl(227, 22%, 40%, 0.7)"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
              <ChartTooltip
                cursor={{ fill: "var(--muted)", opacity: 0.15 }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `#${label}`}
                    formatter={(value) => [`${value} usos`, "Frecuencia"]}
                  />
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HashtagsChart;
