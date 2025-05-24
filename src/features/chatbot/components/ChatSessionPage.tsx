"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/api/queryClient";

import { ChatInput } from "./ChatInput";
import { chatMessage } from "@/lib/api/chatMessage";
import { nextChatMessage } from "@/lib/api/nextChatMessage";

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
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [sessionId2, setSessionId2] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const firstMessageMutation = useMutation(
    {
      mutationFn: chatMessage,
      onSuccess: (data) => {
        const botMessage: ChatMessage = {
          id: crypto.randomUUID(),
          text: data.reply,
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsFirstMessage(false);
        
        if (data.session_id) {
          console.log('Setting session_id_2 from first response:', data.session_id);
          setSessionId2(data.session_id);
        } else {
          console.error('No session_id in first response:', data);
        }
      },
      onError: (error) => {
        console.error('Error in first message:', error);
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          text: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, errorMessage]);
      },
    },
    queryClient
  );

  const nextMessageMutation = useMutation(
    {
      mutationFn: nextChatMessage,
      onSuccess: (data) => {
        const botMessage: ChatMessage = {
          id: crypto.randomUUID(),
          text: data.reply,
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
      },
      onError: (error) => {
        console.error('Error in next message:', error);
        const errorMessage: ChatMessage = {
          id: crypto.randomUUID(),
          text: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, errorMessage]);
      },
    },
    queryClient
  );

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !sessionId) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: trimmed,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (isFirstMessage) {
      console.log('Sending first message with sessionId:', sessionId);
      firstMessageMutation.mutate({ 
        sessionId, 
        message: trimmed, 
        isFirstMessage: true
      });
    } else {
      if (!sessionId2) {
        console.error('No session_id_2 available for next message');
        return;
      }
      
      console.log('Sending next message with:', {
        sessionId,
        session_id_2: sessionId2,
        message: trimmed
      });

      nextMessageMutation.mutate({ 
        sessionId, 
        message: trimmed,
        session_id_2: sessionId2
      });
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  function renderBotMessage(text: string) {
    const suggestionMatch = text.match(
      /\[SUGGESTION_DATA\](.+?)\[\/SUGGESTION_DATA\]/s
    );
    const suggestion = suggestionMatch?.[1]?.trim();

    // Eliminar la sugerencia del texto visible si está duplicada antes del tag
    let cleanText = text
      .replace(/\[SUGGESTION_DATA\].*?\[\/SUGGESTION_DATA\]/s, "")
      .trim();
    if (suggestion && cleanText.includes(suggestion)) {
      cleanText = cleanText.replace(suggestion, "").trim();
    }

    const paragraphs = cleanText.split(/\n{2,}/);

    return (
      <div className="space-y-3 text-md leading-relaxed">
        {paragraphs.map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {para}
          </p>
        ))}
        {suggestion && (
          <div className="mt-4 border border-primary rounded-md bg-primary/5 p-3 text-sm">
            <h4 className="font-semibold mb-1 text-primary">
              Sugerencia de respuesta
            </h4>
            <p className="whitespace-pre-wrap">{suggestion}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="gradient-top-chat" />
      <div className="min-h-[820px] text-foreground text-md flex flex-col max-w-5xl mx-auto px-4 py-8">
        <ScrollArea
          className="flex-grow mt-4 mb-2 h-[300px] rounded-lg p-4"
          ref={containerRef}
        >
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-sm px-4 py-3 shadow rounded-2xl whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-transparent rounded-bl-sm"
                  }`}
                >
                  <CardContent className="p-0">
                    {msg.sender === "bot" ? (
                      renderBotMessage(msg.text)
                    ) : (
                      <p>{msg.text}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="flex items-center gap-2 mt-2">
          <ChatInput
            message={input}
            onMessageChange={setInput}
            onSubmit={handleSend}
            isSending={firstMessageMutation.isPending || nextMessageMutation.isPending}
            isFirstMessage={isFirstMessage}
          />
        </div>
      </div>
    </div>
  );
}
