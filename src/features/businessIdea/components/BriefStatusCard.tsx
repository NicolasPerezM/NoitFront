"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-2xl font-normal">
          <FileText className="w-5 h-5" />
          Estado del Business Brief
        </CardTitle>
        <CardDescription className="text-lg font-normal">
          Progreso del análisis
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-0">
              <span className="text-base font-normal">Progreso General</span>
              <span className="text-base text-muted-foreground font-normal">
                {currentQuestion} de {totalQuestions} completado
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-0 font-normal">
              <span>Inicio</span>
              <span>Completado</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-4">
            <span className="text-base font-normal">Estado:</span>
            <Badge variant={isCompleted ? "default" : "secondary"} className="font-normal">
              {isCompleted ? "Completado" : "En Progreso"}
            </Badge>
          </div>

          {/* Estado del proceso */}
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-normal mb-4">Estado del Proceso</h3>
            <p className="text-base text-muted-foreground font-normal">
              Has completado la fase inicial del brief ({currentQuestion} preguntas). 
              Puedes continuar con el chat para completar las {totalQuestions - currentQuestion} preguntas restantes.
            </p>
          </div>
        </div>
        {/* Botón para acceder al chat */}
        <div className="flex justify-center mt-4 w-full">
          <Button variant="default" className="w-full font-normal text-base">
            Continuar con el proceso de brief
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 