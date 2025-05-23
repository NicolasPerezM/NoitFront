// src/pages/chat/[session_id].tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { getNextQuestion, sendAnswer } from "@/lib/api/businessModel";
import { getFirstChatMessage } from "@/lib/api/chatMessage";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
}

interface ChatSessionPageProps {
  sessionId: string;
}

export default function ChatSessionPage({ sessionId }: ChatSessionPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      text: "¿Quieres definir tu modelo de negocio?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !sessionId) return;

    console.log('Enviando mensaje:', trimmed);
    console.log('SessionId:', sessionId);
    console.log('Es primera interacción:', isFirstInteraction);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: trimmed,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (isFirstInteraction) {
      console.log('Llamando a getFirstChatMessage...');
      getFirstChatMessage(sessionId)
        .then((data) => {
          console.log('Respuesta de getFirstChatMessage:', data);
          const botMessage: ChatMessage = {
            id: crypto.randomUUID(),
            text: data.message,
            sender: "bot",
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsFirstInteraction(false);
        })
        .catch((error) => {
          console.error('Error en getFirstChatMessage:', error);
          // Mostrar mensaje de error al usuario
          const errorMessage: ChatMessage = {
            id: crypto.randomUUID(),
            text: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
            sender: "bot",
          };
          setMessages((prev) => [...prev, errorMessage]);
        });
    } else {
      sendAnswer(sessionId, trimmed).then((data) => {
        const botMessage: ChatMessage = {
          id: crypto.randomUUID(),
          text: data.reply,
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      });
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen px-6 py-10 flex flex-col gap-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Chat de Sesión</h1>
      <Separator />
      <ScrollArea className="flex-grow border rounded-md p-4 h-[400px]" ref={containerRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <Card
                className={`max-w-md p-3 shadow-md rounded-lg text-sm whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-muted-foreground rounded-bl-none"
                }`}
              >
                <CardContent className="p-0">
                  <p>{msg.text}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <ChatInput
          message={input}
          onMessageChange={setInput}
          onSubmit={handleSend}
          isSending={false}
        />
      </form>
    </div>
  );
}
