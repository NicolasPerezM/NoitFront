"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Send, Lightbulb, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { businessBrief } from "@/lib/api/businessBrief";
import { queryClient } from "@/lib/api/queryClient";
import { useState, useRef, useEffect } from "react";

// Componente para renderizar contenido con estilo similar a Claude
const MessageContent = ({ content }: { content: string }) => {
  const formatContent = (text: string) => {
    // Dividir el texto en líneas
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentElement: string[] = [];
    let listItems: string[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';

    const flushCurrentElement = () => {
      if (currentElement.length > 0) {
        const content = currentElement.join('\n');
        elements.push(
          <p key={elements.length} className="mb-4 leading-relaxed">
            {formatInlineElements(content)}
          </p>
        );
        currentElement = [];
      }
    };

    const flushListItems = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} className="mb-4 space-y-2 list-disc list-inside">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed pl-2">
                {formatInlineElements(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Detectar bloques de código
      if (trimmedLine.startsWith('```')) {
        if (inCodeBlock) {
          // Cerrar bloque de código
          elements.push(
            <pre key={elements.length} className="bg-muted rounded-lg p-4 mb-4 overflow-x-auto">
              <code className={`text-sm ${codeLanguage ? `language-${codeLanguage}` : ''}`}>
                {currentElement.join('\n')}
              </code>
            </pre>
          );
          currentElement = [];
          inCodeBlock = false;
          codeLanguage = '';
        } else {
          // Abrir bloque de código
          flushCurrentElement();
          flushListItems();
          inCodeBlock = true;
          codeLanguage = trimmedLine.slice(3);
        }
        return;
      }

      if (inCodeBlock) {
        currentElement.push(line);
        return;
      }

      // Detectar encabezados
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**') && trimmedLine.length > 4) {
        flushCurrentElement();
        flushListItems();
        const headerText = trimmedLine.slice(2, -2);
        elements.push(
          <h3 key={elements.length} className="text-lg font-semibold mb-3 mt-6">
            {headerText}
          </h3>
        );
        return;
      }

      // Detectar listas con números
      if (/^\d+\.\s/.test(trimmedLine)) {
        flushCurrentElement();
        if (listItems.length === 0) {
          flushListItems();
        }
        const itemText = trimmedLine.replace(/^\d+\.\s/, '');
        if (listItems.length === 0) {
          elements.push(
            <ol key={elements.length} className="mb-4 space-y-2 list-decimal list-inside">
              <li className="leading-relaxed pl-2">
                {formatInlineElements(itemText)}
              </li>
            </ol>
          );
        }
        return;
      }

      // Detectar listas con viñetas
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        flushCurrentElement();
        const itemText = trimmedLine.replace(/^[-•]\s/, '');
        listItems.push(itemText);
        return;
      }

      // Líneas vacías
      if (trimmedLine === '') {
        if (currentElement.length > 0) {
          flushCurrentElement();
        }
        flushListItems();
        return;
      }

      // Texto normal
      flushListItems();
      currentElement.push(line);
    });

    // Flush elementos restantes
    flushCurrentElement();
    flushListItems();

    return elements;
  };

  const formatInlineElements = (text: string) => {
    // Procesar elementos inline como **bold**, *italic*, `code`
    const parts = [];
    let currentIndex = 0;
    
    // Regex para encontrar patrones de formato
    const patterns = [
      { regex: /\*\*(.*?)\*\*/g, component: (match: string, content: string) => <strong key={currentIndex++} className="font-semibold">{content}</strong> },
      { regex: /\*(.*?)\*/g, component: (match: string, content: string) => <em key={currentIndex++} className="italic">{content}</em> },
      { regex: /`([^`]+)`/g, component: (match: string, content: string) => <code key={currentIndex++} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{content}</code> },
    ];

    let remainingText = text;
    let processedText = '';
    
    // Procesar cada patrón
    patterns.forEach(({ regex, component }) => {
      const newParts = [];
      let lastIndex = 0;
      let match;
      
      while ((match = regex.exec(remainingText)) !== null) {
        // Agregar texto antes del match
        if (match.index > lastIndex) {
          newParts.push(remainingText.slice(lastIndex, match.index));
        }
        
        // Agregar el componente formateado
        newParts.push(component(match[0], match[1]));
        lastIndex = match.index + match[0].length;
      }
      
      // Agregar texto restante
      if (lastIndex < remainingText.length) {
        newParts.push(remainingText.slice(lastIndex));
      }
      
      remainingText = newParts.map(part => typeof part === 'string' ? part : '').join('');
      parts.push(...newParts.filter(part => typeof part !== 'string' || part !== ''));
    });

    // Si no hay elementos formateados, devolver el texto original
    if (parts.length === 0) {
      return text;
    }

    // Combinar texto y elementos formateados
    const finalParts = [];
    let textParts = text.split(/(\*\*.*?\*\*|\*.*?\*|`[^`]+`)/);
    
    textParts.forEach((part, index) => {
      if (part.match(/\*\*.*?\*\*/)) {
        finalParts.push(<strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>);
      } else if (part.match(/\*.*?\*/)) {
        finalParts.push(<em key={index} className="italic">{part.slice(1, -1)}</em>);
      } else if (part.match(/`[^`]+`/)) {
        finalParts.push(<code key={index} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{part.slice(1, -1)}</code>);
      } else if (part) {
        finalParts.push(part);
      }
    });

    return finalParts.length > 1 ? finalParts : text;
  };

  return <div className="space-y-0">{formatContent(content)}</div>;
};

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
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<string>('');
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
      
      // Verificar si current_question_index es 7 para redirigir
      if (data.current_question_index === 7) {
        console.log('Redirigiendo a business brief page - current_question_index:', data.current_question_index);
        // Redirigir a la nueva página con el session_id como parámetro
        window.location.href = `/businessBrief?sessionId=${data.session_id}`;
        return; // Salir temprano para evitar agregar el mensaje
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

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    // Agregar el mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Preparar los datos para la mutación
    const mutationData = {
      message: textToSend,
      id: businessIdeaId, // ID de la idea de negocio
      ...(chatSessionId && { session_id: chatSessionId }) // session_id de la conversación
    };

    console.log('Enviando mensaje con datos:', mutationData);

    // Enviar al endpoint
    mutation.mutate(mutationData);

    // Limpiar el input solo si no se pasó un mensaje específico
    if (!messageText) {
      setInputMessage('');
    }
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

  const openSuggestionModal = (suggestion: string) => {
    setCurrentSuggestion(suggestion);
    setModalOpen(true);
  };

  const sendSuggestionResponse = (suggestionText: string) => {
    handleSendMessage(suggestionText);
  };

  return (
    <div className="h-[820px] bg-background mt-8 text-foreground flex flex-col">
      {/* Chat Content */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full min-h-0">
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
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <MessageContent content={message.content} />
                      </div>
                      
                      {/* Botón de bombilla para suggestion_answer */}
                      {message.suggestion_answer && (
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 gap-2 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors border border-border"
                            onClick={() => openSuggestionModal(message.suggestion_answer!)}
                          >
                            <Lightbulb className="w-4 h-4" />
                            <span className="text-sm font-medium">¿Cómo responder?</span>
                          </Button>
                        </div>
                      )}
                      
                      {/* Mostrar suggestion_response si existe */}
                      {message.suggestion_response && (
                        <div className="mt-4 p-4 bg-accent/50 rounded-lg border border-border/50 hover:bg-accent/60 transition-colors group cursor-pointer"
                             onClick={() => sendSuggestionResponse(message.suggestion_response!)}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium">
                                Respuesta sugerida
                              </span>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-xs text-muted-foreground">
                                Click para enviar
                              </span>
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <MessageContent content={message.suggestion_response} />
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
                    onClick={() => handleSendMessage()}
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

      {/* Modal para mostrar suggestion_answer */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Sugerencia de respuesta
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <MessageContent content={currentSuggestion} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}