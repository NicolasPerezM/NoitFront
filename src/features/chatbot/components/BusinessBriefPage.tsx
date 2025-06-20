"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import FloatingChat from "./FloatingChat";
import TestRedirectButton from "./TestRedirectButton";

interface BusinessBriefPageProps {
  sessionId?: string;
}

export default function BusinessBriefPage({ sessionId }: BusinessBriefPageProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(sessionId || null);

  // Obtener el sessionId de la URL si no se proporciona como prop
  useEffect(() => {
    if (!sessionId && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionIdFromUrl = urlParams.get('sessionId');
      if (sessionIdFromUrl) {
        setChatSessionId(sessionIdFromUrl);
      }
    }
  }, [sessionId]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setIsChatMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Business Brief</h1>
            <p className="text-muted-foreground mt-2">
              Análisis completo de tu idea de negocio
            </p>
          </div>
          
          {/* Chat Button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleChat}
              className="flex items-center gap-2"
              variant="outline"
            >
              <MessageCircle className="w-4 h-4" />
              {isChatOpen ? 'Cerrar Chat' : 'Abrir Chat'}
            </Button>
            
            {/* Botón de prueba - solo mostrar en desarrollo */}
            {process.env.NODE_ENV === 'development' && chatSessionId && (
              <TestRedirectButton 
                businessIdeaId={chatSessionId} 
                sessionId={chatSessionId}
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resumen del Brief */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Brief</CardTitle>
              <CardDescription>
                Información clave de tu idea de negocio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Estado del Proceso</h3>
                  <p className="text-sm text-muted-foreground">
                    Has completado la fase inicial del brief. Ahora puedes revisar los detalles
                    y continuar con el chat para obtener más información específica.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">7</div>
                    <div className="text-sm text-muted-foreground">Preguntas Completadas</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/10 rounded-lg">
                    <div className="text-2xl font-bold text-secondary-foreground">✓</div>
                    <div className="text-sm text-muted-foreground">Fase Inicial Completada</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximos Pasos */}
          <Card>
            <CardHeader>
              <CardTitle>Próximos Pasos</CardTitle>
              <CardDescription>
                Acciones recomendadas para continuar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Revisar Respuestas</h4>
                    <p className="text-sm text-muted-foreground">
                      Revisa las respuestas proporcionadas en el chat
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Continuar Conversación</h4>
                    <p className="text-sm text-muted-foreground">
                      Usa el chat para obtener más detalles específicos
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Generar Documento</h4>
                    <p className="text-sm text-muted-foreground">
                      Solicita la generación del documento final
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Área de Contenido Principal */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Detalles del Business Brief</CardTitle>
            <CardDescription>
              Aquí se mostrará el contenido detallado del brief cuando esté disponible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Contenido en Desarrollo</h3>
              <p className="text-muted-foreground">
                El contenido detallado del business brief se generará basándose en las respuestas del chat.
                Usa el botón de chat para continuar la conversación y obtener más información.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Chat */}
      {chatSessionId && (
        <FloatingChat
          sessionId={chatSessionId}
          isOpen={isChatOpen}
          onToggle={toggleChat}
          isMinimized={isChatMinimized}
          onToggleMinimize={toggleMinimize}
        />
      )}
    </div>
  );
}