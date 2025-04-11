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

// Paleta de colores para las emociones
const COLORS = ["hsl(227, 22%, 40%, 0.2)", "hsl(227, 22%, 40%, 0.7)", "hsl(227, 22%, 40%, 0.5)", "hsl(227, 22%, 40%, 0.7)"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="rounded-lg border border-border bg-popover text-foreground p-3 shadow-md backdrop-blur-sm">
        <p className="text-sm font-medium capitalize">{name}</p>
        <p className="text-xs text-muted-foreground">{`Cantidad: ${value}`}</p>
      </div>
    );
  }

  return null;
};

/**
 * DonutChart - Representa un gráfico de dona con los conteos de emociones
 * usando Recharts y ShadCN para un diseño sobrio y moderno.
 */
const DonutChart = ({ emotionData }) => {
  const overallEmotionCounts = emotionData.overall.emotion_counts;

  const chartData = Object.keys(overallEmotionCounts).map((emotion) => ({
    name: emotion,
    value: overallEmotionCounts[emotion],
  }));

  return (
    <Card className="h-full w-full bg-white dark:bg-sidebar border-border shadow-lg rounded-2xl">
      <CardHeader className="relative">
        <CardTitle className="text-xl md:text-2xl font-semibold font-britanica text-foreground">
          Distribución de Emociones
        </CardTitle>
        <InfoPopover>
          <h4 className="font-medium text-sm">Acerca de esta gráfica</h4>
          <p className="text-xs text-muted-foreground">
            Esta gráfica muestra el promedio de engagement por día de la semana.
          </p>
          <p className="text-xs text-muted-foreground">
            El engagement representa el porcentaje de interacciones frente al
            alcance del contenido.
          </p>
        </InfoPopover>
        <CardDescription className="text-sm">
          Esta gráfica muestra la distribución de emociones en los comentarios.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-10rem)]">
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
      </CardContent>
    </Card>
  );
};

export default DonutChart;
