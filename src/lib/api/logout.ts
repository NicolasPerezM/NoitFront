export const handleLogout = async () => {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.error || "Error al cerrar sesión");
    }

    // Redirigir al login después de cerrar sesión
    window.location.href = "/login";
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error inesperado al cerrar sesión");
  }
}; 