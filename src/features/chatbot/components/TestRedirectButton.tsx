"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { businessBrief } from "@/lib/api/businessBrief";
import { queryClient } from "@/lib/api/queryClient";
import { useBusinessBriefRedirect } from "@/hooks/useBusinessBriefRedirect";

interface TestRedirectButtonProps {
  businessIdeaId: string;
  sessionId?: string;
}

export default function TestRedirectButton({ businessIdeaId, sessionId }: TestRedirectButtonProps) {
  const mutation = useMutation({
    mutationFn: (data: { message: string; id: string; session_id?: string }) => {
      console.log('Enviando mensaje de prueba con datos:', data);
      return businessBrief(data);
    },
    onSuccess: (data) => {
      console.log('Respuesta de prueba recibida:', data);
    },
    onError: (error) => {
      console.error('Error en la prueba:', error);
    }
  }, queryClient);

  // Usar el hook para manejar la redirección
  useBusinessBriefRedirect({
    data: mutation.data,
    isLoading: mutation.isPending,
    businessId: businessIdeaId
  });

  const handleTestRedirect = () => {
    const testData = {
      message: "Test message for redirect",
      id: businessIdeaId,
      ...(sessionId && { session_id: sessionId })
    };

    console.log('Iniciando prueba de redirección con datos:', testData);
    mutation.mutate(testData);
  };

  return (
    <Button
      onClick={handleTestRedirect}
      variant="outline"
      size="sm"
      disabled={mutation.isPending}
      className="text-xs"
    >
      {mutation.isPending ? 'Probando...' : 'Probar Redirección (Q7)'}
    </Button>
  );
} 