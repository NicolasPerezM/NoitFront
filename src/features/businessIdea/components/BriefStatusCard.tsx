"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText } from "lucide-react";

interface BriefStatusCardProps {
  currentQuestion?: number;
  totalQuestions?: number;
  isCompleted?: boolean;
}

export default function BriefStatusCard({ 
  currentQuestion = 7, 
  totalQuestions = 27, 
  isCompleted = false 
}: BriefStatusCardProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Estado del Business Brief
        </CardTitle>
        <CardDescription>
          Progreso del análisis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progreso General</span>
              <span className="text-sm text-muted-foreground">
                {currentQuestion} de {totalQuestions} completado
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Inicio</span>
              <span>Completado</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Estado:</span>
            <Badge variant={isCompleted ? "default" : "secondary"}>
              {isCompleted ? "Completado" : "En Progreso"}
            </Badge>
          </div>

          {/* Estado del proceso */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Estado del Proceso</h3>
            <p className="text-sm text-muted-foreground">
              Has completado la fase inicial del brief ({currentQuestion} preguntas). 
              Puedes continuar con el chat para completar las {totalQuestions - currentQuestion} preguntas restantes.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 