import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CalendarIcon, LightbulbIcon } from "lucide-react"

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
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer duration-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <LightbulbIcon className="h-4 w-4 text-orange-500" />
          <h3 className="font-medium text-lg transition-colors group-hover:text-orange-500">
            {project.title}
          </h3>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center text-xs text-muted-foreground">
        <CalendarIcon className="h-3 w-3 mr-1" />
        {project.date}
      </CardFooter>
    </Card>
  )
}
