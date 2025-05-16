interface LoginCredentials {
  email: string;
  password: string;
}

export async function handleLogin(credentials: LoginCredentials): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include"
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.error || "Error al iniciar sesión");
  }

  // Redirigir al dashboard si el login fue exitoso
  window.location.href = "/";
} 