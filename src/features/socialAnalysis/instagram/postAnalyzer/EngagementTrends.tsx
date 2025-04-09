import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

/**
 * Componente que renderiza la gráfica de tendencias de engagement
 * Recibe por props el array 'trends' con los datos de engagement_trends.
 */

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const chartData = [
  { date: "2025-01-19", engagement: 0.008249507690670073 },
  { date: "2025-01-20", engagement: 0.01250731811166108 },
  { date: "2025-01-21", engagement: 0.010777582628133482 },
  { date: "2025-01-23", engagement: 0.004523923572302943 },
  { date: "2025-01-26", engagement: 0.009979243174197669 },
  { date: "2025-01-27", engagement: 0.007318111661078291 },
  { date: "2025-01-30", engagement: 0.010245356325509606 },
  { date: "2025-02-01", engagement: 0.010112299749853637 },
  { date: "2025-02-03", engagement: 0.004790036723614881 },
]

const EngagementTrends = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencias de Engagement</CardTitle>
      </CardHeader>
      <CardContent>
      </CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#888888" />
            {/* Eje X muestra la fecha del post */}
            <XAxis dataKey="post_date" stroke="#888888" />
            {/* Eje Y muestra la tasa de engagement */}
            <YAxis stroke="#888888" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="engagement_rate"
              stroke="#E81840"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
    </Card>
  );
};

export default EngagementTrends;
