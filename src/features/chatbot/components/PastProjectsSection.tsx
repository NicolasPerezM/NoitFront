import { Button } from "@/components/ui/button"
import { ProjectCard } from "./ProjectCard"

const pastProjects = [
  {
    id: 1,
    title: "Face It",
    description: "E-commerce para productos de skin care para hombres",
    date: "10 mayo, 2023",
  },
  {
    id: 2,
    title: "Life time ecommerce",
    description: "Servicio ecommerce para venta de productos",
    date: "22 junio, 2023",
  },
  {
    id: 3,
    title: "Plataforma educativa",
    description: "Cursos online para profesionales",
    date: "5 agosto, 2023",
  },
]

export function PastProjectsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-navara">Recientes</h2>
        <Button variant="ghost" size="sm">
          Ver todos
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pastProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
