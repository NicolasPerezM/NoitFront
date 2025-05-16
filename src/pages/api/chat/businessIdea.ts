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

    // Llamar a la API externa con el token
    const response = await fetch("https://noit.com.co/api/v1/business-idea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Error al iniciar la sesión", detail: err }),
      { status: 500 }
    );
  }
};
