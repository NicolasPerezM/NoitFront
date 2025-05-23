type ChatMessageResponse = {
  message: string;
  session_id: string;
};

export async function getFirstChatMessage(session_id: string): Promise<ChatMessageResponse> {
  try {
    const response = await fetch(`https://noit.com.co/api/v1/business-model/${session_id}/chat`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener el primer mensaje del chat');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error inesperado al obtener el primer mensaje del chat');
  }
} 