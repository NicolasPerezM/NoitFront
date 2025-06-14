import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { message, id } = body;

    // Validar que se proporcionen los campos requeridos
    if (!message || !id) {
      return new Response(
        JSON.stringify({ 
          error: "Los campos 'message' e 'id' son requeridos." 
        }),
        { status: 400 }
      );
    }

    const business_id = id;

    // Obtener el token desde las cookies
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
        JSON.stringify({ error: "Token de autenticación no encontrado." }),
        { status: 401 }
      );
    }

    // Llamar al endpoint de business brief chat
    const response = await fetch(
      `https://noit.com.co/api/v1/business-brief/business/${business_id}/brief/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message,
          business_id,
        }),
      }
    );

    const data = await response.json();

    // Si la API de Noit falla, reenviamos el mensaje de error
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: response.status,
      });
    }

    // Retornar la respuesta del chat
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Error al procesar el chat",
        detail: err instanceof Error ? err.message : err,
      }),
      { status: 500 }
    );
  }
};