"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowUpIcon, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Tipado para props del componente
type EngagementData = {
  day: string
  rate: number
}

interface EngagementByDayProps {
  data?: EngagementData[]
}

// Tooltip personalizado para la barra
const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload?.length) {
    const rate = payload[0].value
    return (
      <div className="bg-background border border-border rounded-md shadow-md p-3">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          Engagement: <span className="font-medium text-primary">{(rate * 100).toFixed(2)}%</span>
        </p>
      </div>
    )
  }
  return null
}

// Función auxiliar para encontrar el mejor día
const getBestDay = (data: EngagementData[]) => {
  return data.reduce((max, item) => (item.rate > max.rate ? item : max), data[0])
}

const EngagementByDay = ({ data = [] }: EngagementByDayProps) => {
  const isValidData = Array.isArray(data) && data.length > 0

  if (!isValidData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement por Día de la Semana</CardTitle>
          <CardDescription>No hay datos disponibles</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No se encontraron datos para mostrar</p>
        </CardContent>
      </Card>
    )
  }

  const bestDay = getBestDay(data)
  const averageRate = data.reduce((sum, item) => sum + item.rate, 0) / data.length

  return (
    <Card>
      <CardHeader className="relative">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Engagement por Día de la Semana</CardTitle>
            <CardDescription>Tasa de interacción por día</CardDescription>
          </div>
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
            <PopoverContent className="w-80 z-50" align="end">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Acerca de esta gráfica</h4>
                <p className="text-xs text-muted-foreground">
                  Esta gráfica muestra el promedio de engagement por día de la semana.
                </p>
                <p className="text-xs text-muted-foreground">
                  El engagement representa el porcentaje de interacciones frente al alcance del contenido.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent>
        {/* Estadísticas resumidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/20 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Mejor día</p>
            <div className="flex items-center mt-1">
              <p className="text-lg font-medium">{bestDay?.day || "N/A"}</p>
              {bestDay && (
                <span className="ml-2 text-emerald-500 flex items-center text-xs">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  {((bestDay.rate / averageRate - 1) * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          <div className="bg-muted/20 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Promedio</p>
            <p className="text-lg font-medium">{(averageRate * 100).toFixed(2)}%</p>
          </div>

          <div className="bg-muted/20 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Total analizado</p>
            <p className="text-lg font-medium">{data.length} días</p>
          </div>
        </div>

        {/* Gráfica */}
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} vertical={false} />
              <XAxis
                dataKey="day"
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                formatter={() => <span className="text-sm">Tasa de engagement</span>}
              />
              <Bar
                dataKey="rate"
                name="Engagement"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                barSize={40}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default EngagementByDay
