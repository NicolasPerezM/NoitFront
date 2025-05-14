import type { APIRoute } from "astro";

export const prerender = false; 

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    const upstreamData = new URLSearchParams();
    upstreamData.append("username", email); // FastAPI normalmente usa "username"
    upstreamData.append("password", password);

    const res = await fetch("https://noit.com.co/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: upstreamData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      return new Response(JSON.stringify({ error: errorText }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const token = data.access_token;

    if (!token) {
      return new Response(JSON.stringify({ error: "No se recibió token" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      sameSite: "lax",
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Error en /api/login:", err);
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
