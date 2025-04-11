"use client";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
/**
 * Componente que renderiza la gráfica de tendencias de engagement
 * Recibe por props el array 'trends' con los datos de engagement_trends.
 */
const EngagementTrends = ({ trends = [] }) => {
  // Verificamos si trends existe y es un array
  const hasTrends = Array.isArray(trends) && trends.length > 0;

  // Formatea los datos solo si hay datos disponibles
  const formattedData = hasTrends
    ? trends.map((item) => ({
        ...item,
        // Asumiendo que post_date es una string en formato ISO o similar
        formattedDate:
          typeof item.post_date === "string"
            ? format(new Date(item.post_date), "dd MMM", { locale: es })
            : item.post_date,
        // Formatea el valor para mostrarlo como porcentaje
        engagement_rate: item.engagement_rate,
        engagement_percent: (item.engagement_rate * 100).toFixed(2),
      }))
    : [];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="relative flex-none">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-sora">
            Tendencias de Engagement
          </CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full absolute top-4 right-4"
                aria-label="Información sobre tendencias de engagement"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Acerca de esta gráfica</h4>
                <p className="text-xs text-muted-foreground">
                  Esta gráfica muestra la evolución de la tasa de engagement a
                  lo largo del tiempo. La tasa de engagement representa el
                  porcentaje de interacciones (me gusta, comentarios,
                  compartidos) en relación al alcance total del contenido.
                </p>
                <p className="text-xs text-muted-foreground">
                  Un aumento en la línea indica mayor interacción de los
                  usuarios con tu contenido, mientras que una disminución puede
                  indicar menor interés o alcance.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <CardDescription className="text-sm">
          Evolución de la tasa de engagement a lo largo del tiempo
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        {!hasTrends ? (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            No hay datos disponibles para mostrar
          </div>
        ) : (
          <ChartContainer
            config={{
              engagement_rate: {
                label: "Tasa de Engagement",
                color: "hsl(346, 84%, 51%)",
              },
            }}
            className="h-full w-full [&_.recharts-wrapper]:h-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.0} />
                <XAxis
                  dataKey="formattedDate"
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                />
                <YAxis
                  tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                  tick={{ fontSize: 12 }}
                  width={50}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatValue={(value, dataKey) =>
                        dataKey === "engagement_rate"
                          ? `${(value * 100).toFixed(2)}%`
                          : value
                      }
                    />
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="engagement_rate"
                  name="Engagement"
                  fill="hsl(227, 22%, 40%, 0.2)"
                  stroke="hsl(227, 22%, 40%, 0.7)"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EngagementTrends;
