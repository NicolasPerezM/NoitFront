import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  date: string
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer">
      <CardContent className="p-4">
        <h3 className="font-medium text-lg">{project.title}</h3>
        <p className="text-muted-foreground text-sm mt-1">{project.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center text-xs text-muted-foreground">
        <CalendarIcon className="h-3 w-3 mr-1" />
        {project.date}
      </CardFooter>
    </Card>
  )
}
