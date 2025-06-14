import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarIcon, LightbulbIcon } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  date: string;
  website_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Función para truncar el texto a un número específico de palabras
  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + "...";
    }
    return text;
  };

  return (
      <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] hover:border hover:border-primary/50 cursor-pointer duration-200 border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <LightbulbIcon className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-lg transition-colors group-hover:text-primary">
              {project.title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {truncateText(project.description, 15)}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center text-xs text-muted-foreground">
          <CalendarIcon className="h-3 w-3 mr-1" />
          {project.date}
        </CardFooter>
      </Card>
  );
}
