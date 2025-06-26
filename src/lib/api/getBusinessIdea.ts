// lib/api/getBusinessIdea.ts

type BusinessIdea = {
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

type GetBusinessIdeaResponse = {
    businessIdea: BusinessIdea;
};

type ApiErrorPayload = {
    error?: string | { detail?: string; message?: string; [key: string]: any };
    detail?: string;
    message?: string;
    availableCookies?: string[];
    [key: string]: any;
};

export async function getBusinessIdea(id: string): Promise<GetBusinessIdeaResponse> {
    console.log('🚀 getBusinessIdea iniciada con ID:', id);
    
    try {
        if (!id || typeof id !== 'string' || id.trim() === '') {
            console.error('❌ ID inválido:', id);
            throw new Error('ID de la idea de negocio es requerido y debe ser una cadena válida');
        }

        const url = `/api/businessIdea/${encodeURIComponent(id.trim())}`;
        console.log('📡 Haciendo fetch a:', url);
        
        // Agregar timeout para evitar peticiones colgadas
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log('📡 Respuesta recibida:', response.status, response.statusText);

        if (!response.ok) {
            console.error('❌ Respuesta no OK:', response.status, response.statusText);
            
            let errorMessage = `Error ${response.status}: ${response.statusText || 'Error desconocido al contactar el servidor'}`;
            let errorDetails: ApiErrorPayload | string | null = null;

            try {
                const contentType = response.headers.get('content-type');
                console.log('📋 Content-Type de error:', contentType);
                
                if (contentType && contentType.includes('application/json')) {
                    errorDetails = await response.json();
                    console.log('📋 Error details JSON:', errorDetails);
                } else {
                    errorDetails = await response.text();
                    console.log('📋 Error details Text:', errorDetails);
                }

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

                    // Manejo específico para error 404
                    if (response.status === 404) {
                        errorMessage = `La idea de negocio con ID "${id}" no fue encontrada`;
                    }
                } else if (typeof errorDetails === 'string') {
                    errorMessage = errorDetails;
                }
            } catch (parseError) {
                console.error('❌ Error parseando respuesta de error:', parseError);
                // Mantener el errorMessage base si hay error parseando
            }

            throw new Error(errorMessage);
        }

        console.log('✅ Respuesta OK, parseando JSON...');
        const data: GetBusinessIdeaResponse = await response.json();
        console.log('✅ Datos parseados exitosamente:', {
            hasBusinessIdea: !!data.businessIdea,
            businessIdeaId: data.businessIdea?.id,
            businessIdeaTitle: data.businessIdea?.title
        });
        
        // Validación adicional de la respuesta
        if (!data.businessIdea || typeof data.businessIdea !== 'object') {
            console.error('❌ businessIdea no válida en respuesta:', data);
            throw new Error('La respuesta del servidor no contiene una idea de negocio válida');
        }

        if (!data.businessIdea.id || data.businessIdea.id !== id) {
            console.error('❌ ID no coincide:', {
                solicitado: id,
                recibido: data.businessIdea.id
            });
            throw new Error('La idea de negocio recibida no coincide con el ID solicitado');
        }

        console.log('✅ getBusinessIdea completada exitosamente');
        return data;
        
    } catch (error) {
        console.error('💥 Error en getBusinessIdea:', error);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('La petición se agotó el tiempo de espera. Por favor, intenta de nuevo.');
            }
            throw new Error(error.message || 'Ocurrió un error desconocido al obtener la idea de negocio.');
        } else {
            throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
        }
    }
}