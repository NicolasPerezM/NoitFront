"use client";

import { useMutation } from "@tanstack/react-query";
import { WelcomeMessage } from "./WelcomeMessage";
import { PastProjectsSection } from "./PastProjectsSection";
import { postBusinessIdea } from "@/lib/api/postBusinessIdea";
import { queryClient } from "@/lib/api/queryClient";
import { BusinessIdeaModal } from "./BusinessIdeaModal";

export function ChatInterface() {
  const mutation = useMutation(
    {
      mutationFn: postBusinessIdea,
      onSuccess: (data) => {
        console.log("✅ Business idea created:", data);
        queryClient.invalidateQueries({ queryKey: ['businessIdeas'] });
        // Redirigir al usuario a la página de chat con el sessionId
        if (data.session_id) {
          window.location.href = `/chat/${data.session_id}`;
        } else {
          console.error("No session_id in response:", data);
        }
      },
      onError: (error: Error) => {
        console.error("❌ Error creating business idea:", error);
        alert("Error al crear la idea de negocio: " + error.message);
      },
    },
    queryClient
  );

  const handleSubmit = (values: { title: string; description: string; url?: string }) => {
    if (mutation.isPending) return;

    mutation.mutate({
      title: values.title,
      description: values.description,
      url: values.url
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12">
      <div className="gradient-top-primary" />
      <WelcomeMessage />
      <div className="flex justify-center">
        <BusinessIdeaModal onSubmit={handleSubmit} />
      </div>
      <PastProjectsSection />
    </div>
  );
}
