// lib/api/getCompetitors.ts

type Competitor = {
    id: string;
    business_idea_id: string;
    competitor_name: string;
    key_feature: string;
    website: string | null;
    instagram_url: string | null;
    facebook_url: string | null;
    linkedin_url: string | null;
    x_url: string | null;
    youtube_url: string | null;
    tiktok_url: string | null;
    similarity_score: number;
};

type GetCompetitorsResponse = {
    business_id: string;
    competitors: Competitor[];
};

type ApiErrorPayload = {
    error?: string | { detail?: string; message?: string; [key: string]: any };
    detail?: string;
    message?: string;
    availableCookies?: string[];
    requestedBusinessId?: string;
    [key: string]: any;
};

export async function getCompetitors(businessId: string): Promise<GetCompetitorsResponse> {
    console.log('🚀 getCompetitors iniciada con business_id:', businessId);
    
    try {
        if (!businessId || typeof businessId !== 'string' || businessId.trim() === '') {
            console.error('❌ Business ID inválido:', businessId);
            throw new Error('Business ID es requerido y debe ser una cadena válida');
        }

        const url = `/api/businessIdea/getCompetitors?business_id=${encodeURIComponent(businessId.trim())}`;
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

                    // Si hay información del business_id solicitado, agregarla al error
                    if (errorDetails.requestedBusinessId) {
                        errorMessage += ` (Business ID solicitado: ${errorDetails.requestedBusinessId})`;
                    }

                    // Manejo específico para error 404
                    if (response.status === 404) {
                        errorMessage = `No se encontraron competidores para el business ID "${businessId}" o el business ID no existe`;
                    }

                    // Manejo específico para error 401
                    if (response.status === 401) {
                        errorMessage = `No tienes autorización para acceder a los competidores de este business ID. ${errorMessage}`;
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
        const data: GetCompetitorsResponse = await response.json();
        console.log('✅ Datos parseados exitosamente:', {
            businessId: data.business_id,
            competitorsLength: data.competitors?.length || 0
        });
        
        // Validación adicional de la respuesta
        if (!data.competitors || !Array.isArray(data.competitors)) {
            console.error('❌ competitors no válidos en respuesta:', data);
            throw new Error('La respuesta del servidor no contiene una lista de competidores válida');
        }

        if (!data.business_id || data.business_id !== businessId) {
            console.error('❌ Business ID no coincide:', {
                solicitado: businessId,
                recibido: data.business_id
            });
            throw new Error('Los competidores recibidos no coinciden con el Business ID solicitado');
        }

        // Validación de que cada competidor tenga la estructura esperada
        const invalidCompetitors = data.competitors.filter(comp => 
            !comp.id || !comp.competitor_name || typeof comp.similarity_score !== 'number'
        );

        if (invalidCompetitors.length > 0) {
            console.error('❌ Competidores con estructura inválida:', invalidCompetitors);
            throw new Error(`Se encontraron ${invalidCompetitors.length} competidores con estructura inválida`);
        }

        console.log('✅ getCompetitors completada exitosamente');
        return data;
        
    } catch (error) {
        console.error('💥 Error en getCompetitors:', error);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('La petición se agotó el tiempo de espera. Por favor, intenta de nuevo.');
            }
            throw new Error(error.message || 'Ocurrió un error desconocido al obtener los competidores.');
        } else {
            throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
        }
    }
}