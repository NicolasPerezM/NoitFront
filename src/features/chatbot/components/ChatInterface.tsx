"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChatInput } from "./ChatInput";
import { WelcomeMessage } from "./WelcomeMessage";
import { PastProjectsSection } from "./PastProjectsSection";
import { businessIdea } from "@/lib/api/businessIdea";
import { queryClient } from "@/lib/api/queryClient";

export function ChatInterface() {
  const [message, setMessage] = useState("");

  const mutation = useMutation(
    {
      mutationFn: businessIdea,
      onSuccess: (data) => {
        console.log("✅ Session ID:", data.id);
        window.location.href = `/chat/${data.id}`;
      },
      onError: (error: Error) => {
        alert("❌ Error: " + error.message);
      },
    },
    queryClient
  );

  const handleSendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed || mutation.isPending) return;

    const title = `Chat: ${trimmed.slice(0, 30)}${trimmed.length > 30 ? "..." : ""}`;

    mutation.mutate({
      title,
      description: trimmed,
    });

    setMessage("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12">
      <div className="gradient-top-primary" />
      <WelcomeMessage />
      <ChatInput
        message={message}
        onMessageChange={setMessage}
        onSubmit={handleSendMessage}
        isSending={mutation.isPending}
      />
      <PastProjectsSection />
    </div>
  );
}
