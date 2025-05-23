import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

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

    // Llamar al endpoint externo de Noit que inicia la conversación
    const response = await fetch("https://noit.com.co/api/v1/business-idea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Si la API de Noit falla, reenviamos el mensaje de error
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: response.status,
      });
    }

    // Retornar el session_id y el primer mensaje (reply)
    return new Response(
      JSON.stringify({
        session_id: data.id,
        description: data.description,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Error al iniciar el chat",
        detail: err instanceof Error ? err.message : err,
      }),
      { status: 500 }
    );
  }
};
