"use client"

import { Search, MoreHorizontal, Calendar, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { getBusinessIdeas } from "@/lib/api/getBusinessIdeas"
import { queryClient } from "@/lib/api/queryClient"
import { useState, useMemo } from "react"
import { BusinessIdeaModal } from "../chatbot/components/BusinessIdeaModal"

// Tipo para las ideas de negocio que coincide con la API
interface BusinessIdea {
  id: string
  title: string
  description: string
  website_url: string | null
  user_id: string
  date: string
  created_at: string
  updated_at: string
}

// Componente Skeleton para las tarjetas
function BusinessIdeaCardSkeleton() {
  return (
    <Card className="group">
      <CardHeader className="relative">
        <div className="absolute top-4 right-4">
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full rounded-md" />
      </CardContent>
      <CardFooter className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </CardFooter>
    </Card>
  )
}

export default function BusinessIdeasPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const {
    data: allProjects = [],
    isLoading,
    error,
  } = useQuery<BusinessIdea[]>(
    {
      queryKey: ["businessIdeas"],
      queryFn: async () => {
        const data = await getBusinessIdeas();
        return data.projects || [];
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    },
    queryClient
  );

  // Filtrar proyectos basado en la búsqueda
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return allProjects;
    
    const query = searchQuery.toLowerCase().trim();
    return allProjects.filter(project => 
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.user_id.toLowerCase().includes(query)
    );
  }, [allProjects, searchQuery]);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <span className="text-destructive">Error al cargar las ideas de negocio</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        {/* Barra de búsqueda */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar una idea..."
            className="pl-10 bg-muted border-input text-foreground placeholder:text-muted-foreground focus:border-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Encabezado de proyectos */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl">Todas tus Ideas de Negocio</h1>
          <BusinessIdeaModal/>

        </div>

        {/* Grid de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Mostrar skeletons mientras carga
            Array.from({ length: 6 }).map((_, index) => (
              <BusinessIdeaCardSkeleton key={index} />
            ))
          ) : (
            // Mostrar proyectos cuando ya están cargados
            filteredProjects.map((project) => (
              <Card key={project.id} className="group transition-all hover:shadow-lg hover:scale-[1.02] hover:border hover:border-primary/50 cursor-pointer duration-200 border">
                <CardHeader className="relative">
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer">
                          Explorar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive cursor-pointer">
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-xl font-normal">{project.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-normal">
                      <Calendar className="w-3 h-3 mr-1" />
                      {project.date}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Sin vista previa disponible</span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                      {project.user_id.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {project.user_id}
                  </span>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* Mensaje cuando no hay ideas */}
        {!isLoading && filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <span className="text-muted-foreground text-lg mb-2">
              {searchQuery ? "No se encontraron ideas que coincidan con tu búsqueda" : "No tienes ideas de negocio aún"}
            </span>
            <span className="text-muted-foreground text-sm">
              {searchQuery ? "Intenta con otros términos de búsqueda" : "Crea tu primera idea para comenzar"}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}