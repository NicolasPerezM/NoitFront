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

const data = [
  { category: "Comentario positivo", count: 58 },
  { category: "Pregunta", count: 34 },
  { category: "Testimonio", count: 22 },
  { category: "Sugerencia", count: 15 },
  { category: "Queja", count: 8 },
  { category: "Confusión", count: 5 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { category, count } = payload[0].payload;
    return (
      <div className="rounded-xl bg-popover p-4 shadow-lg border border-border text-foreground space-y-1 min-w-[180px]">
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

export default function CategoryBarChart() {
  return (
    <Card className="h-full w-full rounded-2xl shadow-md bg-white dark:bg-sidebar text-foreground">
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-britanica font-semibold">
          Distribución de Categorías de Comentarios
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Esta gráfica muestra la distribución de categorías de comentarios en
          el perfil de Instagram.
        </CardDescription>
        <InfoPopover>
          <h4 className="font-medium text-sm">Acerca de esta gráfica</h4>
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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 20, bottom: 10, left: 40 }}
          >
            <XAxis type="number" />
            <YAxis type="category" dataKey="category" />

            <Bar
              dataKey="count"
              fill="hsl(227, 22%, 40%, 0.3)"
              stroke="hsl(227, 22%, 40%, 0.7)"
              
            >
              <LabelList
                dataKey="count"
                position="right"
                fill="hsl(227, 22%, 40%, 1)"
              />
            </Bar>
            <ChartTooltip
              cursor={{ fill: "var(--muted)", opacity: 0.15 }}
              content={<CustomTooltip />}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
