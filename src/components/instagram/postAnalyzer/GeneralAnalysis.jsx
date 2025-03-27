"use client"
import React from "react"
import { BarChart2, Hash, TrendingUp, Lightbulb } from "lucide-react"

/**
 * Componente que muestra el análisis general del feed, incluyendo métricas,
 * gráficos de engagement y de hashtags, y tendencias y sugerencias.
 */
export default function generalAnalysis({ posts, totalLikes, totalComments, totalShares, avgEngagement, topHashtags, bestPost }) {
  return (
    <div className="bg-theme-light dark:bg-theme-dark rounded-xl border-t-1 border-b-1 border-theme-light dark:border-theme-primary shadow-sm p-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-theme-white hover:bg-theme-analogous transition delay-30 dark:bg-theme-darkest shadow-xl p-4 rounded-lg text-theme-darkest dark:text-theme-light dark:hover:text-theme-darkest">
          <div className="text-sm mb-1 font-medium">Total Likes</div>
          <div className="text-3xl font-bold">{totalLikes}</div>
        </div>
        <div className="bg-theme-white dark:bg-theme-darkest hover:bg-theme-complementary shadow-xl p-4 rounded-lg text-theme-darkest dark:text-theme-light dark:hover:text-theme-darkest">
          <div className="text-sm mb-1 font-medium ">Total Comentarios</div>
          <div className="text-3xl font-bold ">{totalComments}</div>
        </div>
        <div className="bg-theme-white dark:bg-theme-darkest hover:bg-theme-split shadow-xl p-4 rounded-lg text-theme-darkest dark:text-theme-light dark:hover:text-theme-darkest">
          <div className="text-sm mb-1 font-medium">Tiempo de Respuesta</div>
          <div className="text-2xl font-bold ">{totalShares}</div>
        </div>
        <div className="bg-theme-white dark:bg-theme-darkest hover:bg-theme-split-two shadow-xl p-4 rounded-lg text-theme-darkest dark:text-theme-light dark:hover:text-theme-darkest overflow-hidden">
          <div className="text-sm  font-medium mb-1">Engagement Promedio</div>
          <div className="text-2xl font-bold ">{avgEngagement}%</div>
        </div>
      </div>
    </div>
  )
}
