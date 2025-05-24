// src/pages/api/chat/chatMessage.ts
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { sessionId, message } = await request.json();

    if (!sessionId || !message) {
      return new Response(JSON.stringify({ error: "Faltan sessionId o message" }), { status: 400 });
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
        { status: 401 }
      );
    }

    const apiResponse = await fetch(`https://noit.com.co/api/v1/business-model/${sessionId}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    const text = await apiResponse.text();

    return new Response(text, {
      status: apiResponse.status,
      headers: {
        "Content-Type": apiResponse.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Error al enviar el mensaje", detail: (err as Error).message }),
      { status: 500 }
    );
  }
};
