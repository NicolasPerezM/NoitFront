interface BusinessIdeaPayload {
  title: string;
  description: string;
  url?: string;
}

export async function postBusinessIdea(payload: BusinessIdeaPayload) {
  const res = await fetch("/api/businessIdea/postBusinessIdea", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include"
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(typeof data === 'object' ? JSON.stringify(data) : data?.error || "Error al enviar el mensaje");
  }

  return data;
}