import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBusinessIdea } from "@/lib/api/getBusinessIdea";
import { queryClient } from "@/lib/api/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import FloatingChat from "../chatbot/components/FloatingChat";
import BriefStatusCard from "./components/BriefStatusCard";

export function BusinessIdeaDetail({ id }: { id: string }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  console.log('🔍 BusinessIdeaDetail renderizado con ID:', id);
  console.log('🔍 ID válido?', !!id && id.trim() !== '');

  // Debug del queryClient
  console.log('🔧 QueryClient disponible?', !!queryClient);

  // Obtener el sessionId de la URL si existe, o usar el id del negocio por defecto
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionIdFromUrl = urlParams.get('sessionId');
      if (sessionIdFromUrl) {
        setSessionId(sessionIdFromUrl);
        setIsChatOpen(true); // Abrir el chat automáticamente si hay sessionId en la URL
      } else {
        // Si no hay sessionId en la URL, usar el id del negocio como sessionId por defecto
        setSessionId(id);
      }
    }
  }, [id]);

  const queryConfig = {
    queryKey: ["businessIdea", id],
    queryFn: async () => {
      console.log('🚀 Ejecutando queryFn para ID:', id);
      try {
        const response = await getBusinessIdea(id);
        console.log('✅ Respuesta de getBusinessIdea:', response);
        return response.businessIdea;
      } catch (err) {
        console.error('❌ Error en queryFn:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id && id.trim() !== '',
    retry: 1,
  };

  console.log('⚙️ Query config:', {
    queryKey: queryConfig.queryKey,
    enabled: queryConfig.enabled,
    hasQueryFn: !!queryConfig.queryFn
  });

  const { data, isLoading, error, status } = useQuery(queryConfig, queryClient);

  console.log('📊 Query state:', { 
    isLoading, 
    error: error?.message, 
    hasData: !!data,
    status 
  });

  const toggleChat = () => {
    console.log('🔄 Toggle chat - isChatOpen:', isChatOpen, 'sessionId:', sessionId);
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setIsChatMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  if (isLoading) return <div className="text-foreground">Cargando idea de negocio...</div>;
  
  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return (
      <div className="text-destructive">
        <p>Error al cargar la idea de negocio:</p>
        <p className="text-sm">{errorMessage}</p>
      </div>
    );
  }
  
  if (!data) {
    return <div className="text-foreground">No se encontró la idea de negocio.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header con información del brief */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">{data.title}</h1>
            <p className="text-muted-foreground">Business Brief - Análisis completo de tu idea de negocio</p>
          </div>
          
          {/* Chat Button */}
          <Button
            onClick={toggleChat}
            className="flex items-center gap-2"
            variant="outline"
          >
            <MessageCircle className="w-4 h-4" />
            {isChatOpen ? 'Cerrar Chat' : 'Abrir Chat'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información principal de la idea de negocio */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Idea de Negocio</CardTitle>
              <CardDescription>Información básica de tu proyecto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Descripción</h3>
                  <p className="text-muted-foreground leading-relaxed">{data.description}</p>
                </div>

                {data.website_url && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Sitio Web</h3>
                    <a 
                      href={data.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 underline break-all"
                    >
                      {data.website_url}
                    </a>
                  </div>
                )}

                <div className="border-t border-border pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-semibold">Fecha de creación:</span>
                      <p>{data.date}</p>
                    </div>
                    <div>
                      <span className="font-semibold">ID:</span>
                      <p className="font-mono text-xs break-all">{data.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estado del Brief */}
        <div className="lg:col-span-1">
          <BriefStatusCard 
            currentQuestion={7}
            totalQuestions={27}
            isCompleted={false}
          />
        </div>
      </div>

      {/* Floating Chat - Siempre renderizar si hay sessionId */}
      {sessionId && (
        <FloatingChat
          sessionId={sessionId}
          isOpen={isChatOpen}
          onToggle={toggleChat}
          isMinimized={isChatMinimized}
          onToggleMinimize={toggleMinimize}
        />
      )}
    </div>
  );
}