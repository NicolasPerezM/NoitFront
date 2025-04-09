"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ThumbsUp,
  MessageSquareMore,
  FolderSync,
  ChartNetwork,
} from "lucide-react";

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
    <div className="">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-theme-white transition delay-30 dark:bg-card shadow-xl p-4 rounded-lg text-theme-darkest dark:text-theme-light">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-md">Likes Totales</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="text-4xl font-sora font-bold">{totalLikes}</div>
            <ThumbsUp className="w-7 h-7 lg:w-9 lg:h-9 ml-2 text-theme-gray" />
          </CardContent>
        </Card>
        <Card className="bg-theme-white transition delay-30 dark:bg-theme-darkest shadow-xl p-4 rounded-lg text-theme-darkest dark:text-theme-light">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-md">Comentarios Totales</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="text-4xl font-sora font-bold">{totalComments}</div>
            <MessageSquareMore className="w-9 h-9 ml-2 text-theme-gray" />
          </CardContent>
        </Card>
        <Card className="bg-theme-white transition delay-30 dark:bg-theme-darkest shadow-xl p-4 rounded-lg text-theme-darkest dark:text-theme-light">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-md">Tiempo de Respuesta</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="text-4xl font-sora font-bold">30s</div>
            <FolderSync className="w-9 h-9 ml-2 text-theme-gray" />
          </CardContent>
        </Card>
        <Card className="bg-theme-white transition delay-30 dark:bg-theme-darkest shadow-xl p-4 rounded-lg text-theme-darkest dark:text-theme-light">
          <CardHeader className="flex flex-row items-center">
            <CardTitle className="text-md">Engagement Promedio</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="text-4xl font-sora font-bold">0.08</div>
            <ChartNetwork className="w-9 h-9 ml-2 text-theme-gray" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
