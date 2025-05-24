type NextChatMessageInput = {
  sessionId: string;
  message: string;
  session_id_2: string;
};

type NextChatMessageResponse = {
  reply: string;
  current_question_index: number;
  total_questions: number;
  session_finished: boolean;
  [key: string]: any;
};

type ApiErrorPayload = {
  error?: string | { detail?: string; message?: string; [key: string]: any };
  detail?: string;
  message?: string;
  [key: string]: any;
};

export async function nextChatMessage(input: NextChatMessageInput): Promise<NextChatMessageResponse> {
  try {
    console.log('Sending next message with:', {
      sessionId: input.sessionId,
      session_id_2: input.session_id_2,
      message: input.message
    });

    const response = await fetch('/api/chat/nextChatMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText || 'Error desconocido al contactar el servidor'}`;
      let errorDetails: ApiErrorPayload | string | null = null;

      try {
        errorDetails = await response.json();

        if (errorDetails && typeof errorDetails === 'object') {
          if (typeof errorDetails.error === 'string') {
            errorMessage = errorDetails.error;
          } else if (typeof errorDetails.error?.detail === 'string') {
            errorMessage = errorDetails.error.detail;
          } else if (typeof errorDetails.error?.message === 'string') {
            errorMessage = errorDetails.error.message;
          } else if (typeof errorDetails.detail === 'string') {
            errorMessage = errorDetails.detail;
          } else if (typeof errorDetails.message === 'string') {
            errorMessage = errorDetails.message;
          } else {
            errorMessage = `Error del servidor: ${JSON.stringify(errorDetails)}`;
          }
        } else if (typeof errorDetails === 'string') {
          errorMessage = errorDetails;
        }
      } catch (jsonError) {
        try {
          const textError = await response.text();
          if (textError) {
            errorMessage = textError;
          }
        } catch (textError) {
          // Mantener el errorMessage base si la lectura de texto falla
        }
      }

      throw new Error(errorMessage);
    }

    const data: NextChatMessageResponse = await response.json();
    console.log('Next message response:', data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Ocurrió un error desconocido en la petición.');
    } else {
      throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
    }
  }
} 