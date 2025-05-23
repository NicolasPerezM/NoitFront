// src/lib/api/businessModel.ts

export async function getNextQuestion(session_id: string): Promise<{ reply: string }> {
    const res = await fetch(`/api/chat/next-question?session_id=${session_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!res.ok) {
      throw new Error('Error al obtener la siguiente pregunta');
    }
  
    return await res.json();
  }
  
  export async function sendAnswer(session_id: string, answer: string): Promise<{ reply: string }> {
    const res = await fetch(`/api/chat/send-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id, answer }),
    });
  
    if (!res.ok) {
      throw new Error('Error al enviar la respuesta');
    }
  
    return await res.json();
  }
  