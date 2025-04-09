"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { MetricCard } from "@/components/metric-card";
import { ThumbsUp, MessageSquare, Timer, BarChart3 } from "lucide-react"

/**
 * Componente que muestra el análisis general del feed, incluyendo métricas,
 * gráficos de engagement y de hashtags, y tendencias y sugerencias.
 */
export default function generalAnalysis({
  posts,
  totalLikes,
  totalComments,
  totalShares,
  avgEngagement,
  topHashtags,
  bestPost,
}) {
  return (
    
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Likes Totales" value="564" icon={ThumbsUp} trend={{ value: 12, isPositive: true }} />

        <MetricCard
          title="Comentarios Totales"
          value="81"
          icon={MessageSquare}
          trend={{ value: 8, isPositive: true }}
        />

        <MetricCard
          title="Tiempo de Respuesta"
          value="30s"
          icon={Timer}
          trend={{ value: 5, isPositive: false }}
          description="Promedio de tiempo de respuesta"
        />

        <MetricCard title="Engagement Promedio" value="0.08" icon={BarChart3} trend={{ value: 3, isPositive: true }} />
      </div>
  );
}
