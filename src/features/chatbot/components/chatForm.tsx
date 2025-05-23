// src/components/ChatInterface.tsx (o la ruta que corresponda)
"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/api/queryClient"; 
import { businessIdea } from "@/lib/api/businessIdea"; 


import { ChatInput } from "./ChatInput"; // Asumo que está en la misma carpeta o ajusta la ruta
import { WelcomeMessage } from "./WelcomeMessage";
import { PastProjectsSection } from "./PastProjectsSection";

// Definimos una estructura para los mensajes del chat
interface ChatMessage {
  id: string; // Para la key en la lista de React
  text: string;
  sender: "user" | "bot";
  sessionId?: string; // Opcional: para guardar el ID de la sesión si es relevante por mensaje
}

export function ChatInterface() {
  const [userInput, setUserInput] = useState(""); // Renombrado de 'message' para claridad
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation<
    BusinessIdeaResponse, // Tipo de dato en onSuccess
    Error,                // Tipo de error en onError
    { title: string; description: string; website_url?: string } // Tipo del input para mutation.mutate
  >(
    {
      mutationFn: businessIdea,
      onSuccess: (data) => { // data es BusinessIdeaResponse
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            id: crypto.randomUUID(),
            text: data.description, // La descripción devuelta por la API
            sender: "bot",
            sessionId: data.id,
          },
        ]);
        console.log("✅ Bot response. Session ID:", data.id);
      },
      onError: (error: Error) => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            id: crypto.randomUUID(),
            text: `❌ Error: ${error.message}`,
            sender: "bot",
          },
        ]);
        console.error("❌ Mutation error:", error.message);
      },
    },
    queryClient // Pasando el queryClient explícitamente
  );

  const handleSendMessage = () => { // Ya no recibe 'msg' como argumento
    const trimmedInput = userInput.trim();
    if (!trimmedInput || mutation.isPending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: trimmedInput,
      sender: "user",
    };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    let generatedTitle = `Chat: ${trimmedInput.substring(0, 30).trim()}`;
    if (trimmedInput.length > 30) {
      generatedTitle += "...";
    }

    mutation.mutate({
      title: generatedTitle,
      description: trimmedInput,
    });

    setUserInput(""); // Limpiar el input del usuario
  };

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-screen py-8 px-4 md:px-0"> {/* Ajuste de altura y padding */}
      <div className="gradient-top-primary" />
      <WelcomeMessage />

      {/* Contenedor de mensajes del chat */}
      <div
        ref={chatContainerRef}
        className="flex-grow space-y-4 overflow-y-auto p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-md my-6 border border-gray-200 dark:border-gray-700" // Estilos mejorados
      >
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2.5 rounded-xl shadow ${ // Ajuste de padding y max-width
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-600" // Estilo para bot
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p> {/* whitespace-pre-wrap para saltos de línea */}
              {msg.sender === "bot" && msg.sessionId && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-75">
                  ID: {msg.sessionId.substring(0, 8)}...
                </p>
              )}
            </div>
          </div>
        ))}
        {mutation.isPending && chatMessages.length > 0 && chatMessages[chatMessages.length - 1].sender === 'user' && ( // Mostrar solo si el último mensaje es del usuario
          <div className="flex justify-start">
            <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2.5 rounded-xl shadow bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-600">
              <p className="text-sm italic">El bot está pensando...</p>
            </div>
          </div>
        )}
      </div>

      {/* El componente ChatInput ahora forma parte de la lógica de ChatInterface */}
      <div className="mt-auto sticky bottom-8"> {/* Fijar input abajo */}
        <ChatInput
          message={userInput}
          onMessageChange={setUserInput}
          onSubmit={handleSendMessage}
          isSending={mutation.isPending}
        />
      </div>
      
      {/* PastProjectsSection podría ir antes o después del área de chat, o incluso fuera del scroll principal */}
      {/* <PastProjectsSection /> */}
      {/* Si PastProjectsSection es largo, quizás quieras que esté fuera del flex-col principal o tenga su propio scroll */}
    </div>
  );
}