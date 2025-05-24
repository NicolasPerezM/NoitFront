import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    console.log('Received request body:', body);

    const { sessionId, message, session_id_2 } = body;

    if (!sessionId || !message || !session_id_2) {
      console.error('Missing required fields:', {
        sessionId: !sessionId,
        message: !message,
        session_id_2: !session_id_2
      });
      
      return new Response(
        JSON.stringify({ 
          error: "Faltan datos requeridos", 
          details: { 
            sessionId: !sessionId, 
            message: !message, 
            session_id_2: !session_id_2 
          } 
        }), 
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Leer token desde cookies
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => {
        const [key, ...v] = c.split("=");
        return [key, decodeURIComponent(v.join("="))];
      })
    );
    const token = cookies.token;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Token de autenticación no encontrado en cookies." }),
        { 
          status: 401,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Usar el sessionId original para el endpoint
    const apiUrl = `https://noit.com.co/api/v1/business-model/${sessionId}/chat`;
    console.log('Making request to external API:', {
      url: apiUrl,
      sessionId,
      session_id_2,
      message,
      token: token.substring(0, 10) + '...' // Solo mostramos parte del token por seguridad
    });

    // Usar el sessionId original para el endpoint
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        message,
        session_id: session_id_2 // Incluir session_id_2 en el body
      }),
    });

    // Obtener el texto de la respuesta
    const text = await apiResponse.text();

    if (!apiResponse.ok) {
      console.error('API Error:', {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        response: text
      });
    }

    // Devolver la respuesta con el mismo formato que chatMessage
    return new Response(text, {
      status: apiResponse.status,
      headers: {
        "Content-Type": apiResponse.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    console.error("Error en nextChatMessage:", err);
    return new Response(
      JSON.stringify({ 
        error: "Error al procesar el mensaje", 
        detail: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};