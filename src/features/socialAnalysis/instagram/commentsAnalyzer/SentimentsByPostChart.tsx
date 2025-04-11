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
/**
 * Componente que muestra un gráfico de barras apiladas que analiza
 * el sentimiento de los comentarios en cada post. El gráfico utiliza
 * colores para representar el sentimiento Positivo, Neutral y Negativo.
 */
export const SentimentsByPostChart = ({ sentimentsData }) => {
  const processData = (data) => {
    return Object.keys(data.by_post).map((postId) => ({
      postId,
      POS: data.by_post[postId].positive_comments,
      NEU: data.by_post[postId].neutral_comments,
      NEG: data.by_post[postId].negative_comments,
    }));
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl bg-popover p-4 shadow-lg border border-border text-foreground space-y-1 min-w-[160px]">
          <p className="text-sm font-semibold text-muted-foreground">
            Post ID:{" "}
            <span className="text-foreground">{payload[0].payload.postId}</span>
          </p>
          {payload.map((entry, index) => (
            <div
              key={`tooltip-item-${index}`}
              className="flex justify-between text-xs"
            >
              <span className="capitalize">{entry.name}</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartData = processData(sentimentsData);

  return (
    <Card className="bg-white dark:bg-sidebar border-border shadow-md rounded-2xl">
      <CardHeader className="relative">
        <CardTitle className="text-xl md:text-2xl font-britanica font-semibold text-foreground">
          Análisis de Sentimiento por Post
        </CardTitle>
        <CardDescription className="text-sm">
          Esta gráfica muestra el sentimiento de los comentarios en cada post.
        </CardDescription>
        <InfoPopover>
          <h4 className="font-medium text-sm">Acerca de esta gráfica</h4>
          <p className="text-xs text-muted-foreground">
            Esta gráfica muestra el sentimiento de los comentarios en cada post.
          </p>
        </InfoPopover>
      </CardHeader>

      <CardContent className="h-[400px] w-full">
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
              fill="hsl(227, 22%, 40%, 0.7)"
              name="Positivo"
              stroke="hsl(227, 22%, 40%, 0.9)"
            />
            <Bar
              dataKey="NEU"
              stackId="a"
              fill="hsl(227, 22%, 40%, 0.5)"
              name="Neutral"
              stroke="hsl(227, 22%, 40%, 0.7)"
            />
            <Bar
              dataKey="NEG"
              stackId="a"
              fill="hsl(227, 22%, 40%, 0.3)"
              name="Negativo"
              stroke="hsl(227, 22%, 40%, 0.5)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
