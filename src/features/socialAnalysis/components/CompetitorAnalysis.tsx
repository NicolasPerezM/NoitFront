"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Instagram, Linkedin, Facebook, ChevronRight, TrendingUp } from "lucide-react"

interface Platform {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  metrics: string[]
}

const CompetitorAnalysis = () => {
  const platforms: Platform[] = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      description: "Análisis visual y engagement",
      metrics: ["Seguidores", "Engagement Rate", "Stories", "Reels", "Hashtags"],
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      description: "Análisis profesional y networking",
      metrics: ["Conexiones", "Publicaciones", "Artículos", "Comentarios", "Shares"],
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      description: "Análisis de comunidad y alcance",
      metrics: ["Me gusta", "Seguidores", "Comentarios", "Compartidos", "Reacciones"],
    },
  ]

  const PlatformCard = ({ platform }: { platform: Platform }) => {
    const IconComponent = platform.icon

    return (
      <Card className="group border border-border/50 hover:shadow-md hover:scale-[1.01] transition-all duration-300 hover:border-primary">
        <CardHeader className="flex items-center gap-4 pb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted/50">
            <IconComponent className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-normal">{platform.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{platform.description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-4 px-6">
          <div className="mb-4">
            <p className="text-xs text-muted-foreground font-normal uppercase tracking-wide mb-2">Métricas clave</p>
            <ul className="grid grid-cols-2 gap-2 text-sm text-foreground/80">
              {platform.metrics.map((metric, index) => (
                <li key={index} className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  {metric}
                </li>
              ))}
            </ul>
          </div>
          <Button variant="outline" className="w-full text-sm group-hover:bg-muted/70 transition-colors">
            Ver análisis <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="bg-background p-8 max-w-7xl mb-4 mx-auto">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-normal text-foreground">Análisis de Competidores</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {platforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CompetitorAnalysis
