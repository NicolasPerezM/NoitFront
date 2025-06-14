"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { businessBrief } from "@/lib/api/businessBrief";
import { queryClient } from "@/lib/api/queryClient";
import { useState, useRef, useEffect } from "react";

interface ChatSessionPageProps {
  sessionId: string; // Este es el ID de la idea de negocio
}

interface Message {
  id: string;
  content: string;
  suggestion_answer?: string;
  suggestion_response?: string;
  isBot: boolean;
  timestamp: Date;
}

export default function ChatSessionPage({ sessionId: businessIdeaId }: ChatSessionPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy NOIT, ¿Quieres empezar el proceso de brief?',
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mutation para enviar mensajes al endpoint
  const mutation = useMutation({
    mutationFn: (data: { message: string; id: string; session_id?: string }) => {
      console.log('Enviando mensaje con datos:', data);
      return businessBrief(data);
    },
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      console.log('Respuesta recibida:', data);
      // Guardar el session_id de la respuesta para futuras llamadas
      if (data.session_id) {
        console.log('Guardando chat session_id:', data.session_id);
        setChatSessionId(data.session_id);
      }
      
      // Agregar la respuesta del bot con toda la información estructurada
      const botMessage: Message = {
        id: Date.now().toString() + '_bot',
        content: data.reply || 'Lo siento, no pude procesar tu mensaje.',
        suggestion_answer: data.suggestion_answer,
        suggestion_response: data.suggestion_response,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error en el chat:', error);
      
      // Agregar mensaje de error del bot
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  }, queryClient);

  // Auto-scroll al final cuando se agregan nuevos mensajes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    // Agregar el mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Preparar los datos para la mutación
    const mutationData = {
      message: inputMessage.trim(),
      id: businessIdeaId, // ID de la idea de negocio
      ...(chatSessionId && { session_id: chatSessionId }) // session_id de la conversación
    };

    console.log('Enviando mensaje con datos:', mutationData);

    // Enviar al endpoint
    mutation.mutate(mutationData);

    // Limpiar el input
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStop = () => {
    // Implementar lógica para detener la generación si es necesario
    setIsLoading(false);
  };

  return (
    <div className="h-[800px] bg-background text-foreground flex flex-col">
      {/* Chat Content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full min-h-0">
        {/* Messages Area con altura fija y scroll */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full px-6 py-8" ref={scrollAreaRef}>
            <div className="space-y-8">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    message.isBot 
                      ? 'bg-muted' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {message.isBot ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 text-muted-foreground"
                      >
                        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                        <path d="M8.5 8.5v.01" />
                        <path d="M16 15.5v.01" />
                        <path d="M12 12v.01" />
                        <path d="M11 17v.01" />
                        <path d="M7 14v.01" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 space-y-4">
                    <div className={`space-y-4 leading-relaxed ${
                      message.isBot ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Mostrar suggestion_answer si existe */}
                      {message.suggestion_answer && (
                        <div className="mt-4 p-4 bg-accent border border-border rounded-lg">
                          <div className="text-accent-foreground whitespace-pre-wrap">
                            {message.suggestion_answer}
                          </div>
                        </div>
                      )}
                      
                      {/* Mostrar suggestion_response si existe */}
                      {message.suggestion_response && (
                        <div className="mt-4 p-4 bg-secondary border border-border rounded-lg">
                          <div className="text-sm font-medium text-secondary-foreground mb-2">
                            💡 Respuesta sugerida:
                          </div>
                          <div className="text-secondary-foreground/80 whitespace-pre-wrap">
                            {message.suggestion_response}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4 text-muted-foreground animate-spin"
                    >
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <p>Escribiendo...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="flex-shrink-0 border-t border-border px-6 py-4">
          <div className="relative">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe tu mensaje..."
                  className="pr-20 py-3 rounded-lg resize-none min-h-[48px]"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button className="text-muted-foreground hover:text-foreground p-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                  </button>
                  <Button 
                    size="sm" 
                    className="rounded-md px-3 py-1.5 h-8"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-end mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-md px-3 py-1.5 h-8 text-xs items-end"
                  onClick={handleStop}
                >
                  Stop
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex-shrink-0 px-6 pb-4">
          <p className="text-xs text-muted-foreground text-center">
            NOIT puede cometer errores. Por Favor usar con discreción.
          </p>
        </div>
      </div>
    </div>
  );
}