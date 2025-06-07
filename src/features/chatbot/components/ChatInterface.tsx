"use client";

import { useMutation } from "@tanstack/react-query";
import { WelcomeMessage } from "./WelcomeMessage";
import { PastProjectsSection } from "./PastProjectsSection";
import { businessIdea } from "@/lib/api/businessIdea";
import { queryClient } from "@/lib/api/queryClient";
import { BusinessIdeaModal } from "./BusinessIdeaModal";

export function ChatInterface() {
  const mutation = useMutation(
    {
      mutationFn: businessIdea,
      onSuccess: (data) => {
        console.log("✅ Session ID:", data.session_id);
        window.location.href = `/chat/${data.session_id}`;
      },
      onError: (error: Error) => {
        alert("❌ Error: " + error.message);
      },
    },
    queryClient
  );

  const handleSubmit = (values: { title: string; description: string; url?: string }) => {
    if (mutation.isPending) return;

    mutation.mutate({
      title: values.title,
      description: values.description,
      url: values.url,
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
