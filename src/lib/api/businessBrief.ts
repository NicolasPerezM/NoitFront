// Tipos para la función businessBrief
export interface BusinessBriefRequest {
  message: string;
  id: string;
  session_id?: string; // Opcional para la primera llamada
}

export interface BusinessBriefResponse {
  session_id: string;
  reply: string;
  suggestion_answer: string;
  suggestion_response: string;
  current_question_index: number;
  total_questions: number;
  session_finished: boolean;
  answer_recorded: boolean;
  previous_action_confirmation: string;
  llm_model_used: string;
  response_was_refined: string | null;
  refined_answer: string | null;
  used_suggestion_as_base: string | null;
  was_affirmative_to_suggestion: string | null;
  etapa1_completed: string | null;
  business_model_mapping: string | null;
  mapping_success: string | null;
}

export interface BusinessBriefError {
  error: string;
  detail?: string;
}

/**
 * Función para enviar mensajes al chat de business brief
 * @param data - Objeto con message e id del negocio
 * @returns Promise con la respuesta del chat
 */
export const businessBrief = async (
  data: BusinessBriefRequest
): Promise<BusinessBriefResponse> => {
  const response = await fetch('/api/brief/businessBrief', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData: BusinessBriefError = await response.json();
    throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};