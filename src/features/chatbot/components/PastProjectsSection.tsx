"use client";

import { Button } from "@/components/ui/button"
import { ProjectCard } from "./ProjectCard"
import { useQuery } from "@tanstack/react-query"
import { getBusinessIdeas } from "@/lib/api/getBusinessIdeas"
import { queryClient } from "@/lib/api/queryClient"

export function PastProjectsSection() {
  const { 
    data: allProjects = [], 
    isLoading: loading, 
    error 
  } = useQuery(
    {
      queryKey: ['businessIdeas'],
      queryFn: async () => {
        const data = await getBusinessIdeas()
        return data.projects || []
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    },
    queryClient
  )

  // Obtener solo las 3 ideas más recientes
  const recentProjects = allProjects
    .sort((a, b) => {
      // Asume que las ideas tienen un campo 'createdAt' o 'date'
      // Ajusta el nombre del campo según tu estructura de datos
      const dateA = new Date(a.createdAt || a.date || a.timestamp)
      const dateB = new Date(b.createdAt || b.date || b.timestamp)
      return dateB - dateA // Orden descendente (más reciente primero)
    })
    .slice(0, 3) // Tomar solo los primeros 3

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recientes</h2>
          <Button variant="ghost" size="sm">
            Ver todos
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recientes</h2>
          <Button variant="ghost" size="sm">
            Ver todos
          </Button>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">Error al cargar los proyectos: {error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl">Recientes</h2>
        <Button variant="outline" size="sm">
          Ver todos
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recentProjects.length > 0 ? (
          recentProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No hay proyectos recientes</p>
          </div>
        )}
      </div>
    </div>
  )
}