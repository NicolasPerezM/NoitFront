// lib/api/getBusinessIdea.ts

type Project = {
    id: string;
    title: string;
    description: string;
    website_url: string | null;
    user_id: string;
    date: string; // Fecha formateada para mostrar
    created_at: string;
    updated_at: string;
};

type BusinessIdeaRaw = {
    title: string;
    description: string;
    website_url: string;
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
};

type GetBusinessIdeasResponse = {
    projects: Project[];
};

type ApiErrorPayload = {
    error?: string | { detail?: string; message?: string; [key: string]: any };
    detail?: string;
    message?: string;
    availableCookies?: string[];
    [key: string]: any;
};

export async function getBusinessIdeas(): Promise<GetBusinessIdeasResponse> {
    try {
        const response = await fetch('/api/businessIdea/getBusinessIdea', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            let errorMessage = `Error ${response.status}: ${response.statusText || 'Error desconocido al contactar el servidor'}`;
            let errorDetails: ApiErrorPayload | string | null = null;

            try {
                errorDetails = await response.json();

                if (errorDetails && typeof errorDetails === 'object') {
                    if (typeof errorDetails.error === 'string') {
                        errorMessage = errorDetails.error;
                    } else if (typeof errorDetails.error?.detail === 'string') {
                        errorMessage = errorDetails.error.detail;
                    } else if (typeof errorDetails.error?.message === 'string') {
                        errorMessage = errorDetails.error.message;
                    } else if (typeof errorDetails.detail === 'string') {
                        errorMessage = errorDetails.detail;
                    } else if (typeof errorDetails.message === 'string') {
                        errorMessage = errorDetails.message;
                    } else {
                        errorMessage = `Error del servidor: ${JSON.stringify(errorDetails)}`;
                    }

                    // Si hay información de cookies disponibles, agregarla al error
                    if (errorDetails.availableCookies && Array.isArray(errorDetails.availableCookies)) {
                        errorMessage += ` (Cookies disponibles: ${errorDetails.availableCookies.join(', ')})`;
                    }
                } else if (typeof errorDetails === 'string') {
                    errorMessage = errorDetails;
                }
            } catch (jsonError) {
                try {
                    const textError = await response.text();
                    if (textError) {
                        errorMessage = textError;
                    }
                } catch (textError) {
                    // Mantener el errorMessage base si la lectura de texto falla
                }
            }

            throw new Error(errorMessage);
        }

        const data: GetBusinessIdeasResponse = await response.json();
        console.log('Business ideas response:', data);
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || 'Ocurrió un error desconocido al obtener las ideas de negocio.');
        } else {
            throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
        }
    }
}