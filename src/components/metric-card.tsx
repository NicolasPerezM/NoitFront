import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function MetricCard({ title, value, icon: Icon, description, trend, className }: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <CardDescription className="mt-1 text-xs">{description}</CardDescription>}
        {trend && (
          <p className={cn("mt-1 text-xs", trend.isPositive ? "text-emerald-500" : "text-rose-500")}>
            {trend.isPositive ? "+" : "-"}
            {trend.value}% desde el último periodo
          </p>
        )}
      </CardContent>
    </Card>
  )
}