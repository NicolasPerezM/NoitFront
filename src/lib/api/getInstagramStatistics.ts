// lib/api/getInstagramStatistics.ts

type TopPost = {
    id: string;
    type: string;
    likesCount: number;
    commentsCount: number;
    timestamp: string;
    caption: string;
    engagement_rate: number;
    total_interactions: number;
    post_date: string;
};

type PostTypeDistribution = {
    [key: string]: number;
};

type EngagementTrend = {
    post_date: string;
    engagement_rate: number;
};

type EngagementByDayOfWeek = {
    [key: string]: number;
};

type GetInstagramStatisticsResponse = {
    total_followers: number;
    total_posts: number;
    total_likes: number;
    total_comments: number;
    avg_likes_per_post: number;
    avg_comments_per_post: number;
    avg_engagement_rate: number;
    top_posts: TopPost[];
    post_type_distribution: PostTypeDistribution;
    engagement_trends: EngagementTrend[];
    engagement_by_day_of_week: EngagementByDayOfWeek;
};

type ApiErrorPayload = {
    error?: string | { detail?: string; message?: string; [key: string]: any };
    detail?: string;
    message?: string;
    availableCookies?: string[];
    requestedCompetitorId?: string;
    [key: string]: any;
};

export async function getInstagramStatistics(competitorId: string): Promise<GetInstagramStatisticsResponse> {
    console.log('🚀 getInstagramStatistics iniciada con competitor_id:', competitorId);
    
    try {
        if (!competitorId || typeof competitorId !== 'string' || competitorId.trim() === '') {
            console.error('❌ Competitor ID inválido:', competitorId);
            throw new Error('Competitor ID es requerido y debe ser una cadena válida');
        }

        const url = `/api/socialAnalysis/instagram/getInstagramStatistics?competitor_id=${encodeURIComponent(competitorId.trim())}`;
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

                    // Si hay información del competitor_id solicitado, agregarla al error
                    if (errorDetails.requestedCompetitorId) {
                        errorMessage += ` (Competitor ID solicitado: ${errorDetails.requestedCompetitorId})`;
                    }

                    // Manejo específico para error 404
                    if (response.status === 404) {
                        errorMessage = `No se encontraron estadísticas de Instagram para el competitor ID "${competitorId}" o el competitor ID no existe`;
                    }

                    // Manejo específico para error 401
                    if (response.status === 401) {
                        errorMessage = `No tienes autorización para acceder a las estadísticas de Instagram de este competidor. ${errorMessage}`;
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
        const data: GetInstagramStatisticsResponse = await response.json();
        console.log('✅ Datos parseados exitosamente:', {
            competitorId: competitorId,
            totalFollowers: data.total_followers,
            totalPosts: data.total_posts,
            avgEngagementRate: data.avg_engagement_rate,
            topPostsLength: data.top_posts?.length || 0
        });
        
        // Validación adicional de la respuesta
        if (typeof data.total_followers !== 'number') {
            console.error('❌ total_followers no válido en respuesta:', data);
            throw new Error('La respuesta del servidor no contiene estadísticas de Instagram válidas');
        }

        if (!data.top_posts || !Array.isArray(data.top_posts)) {
            console.error('❌ top_posts no válidos en respuesta:', data);
            throw new Error('La respuesta del servidor no contiene una lista de top posts válida');
        }

        if (!data.engagement_trends || !Array.isArray(data.engagement_trends)) {
            console.error('❌ engagement_trends no válidos en respuesta:', data);
            throw new Error('La respuesta del servidor no contiene tendencias de engagement válidas');
        }

        // Validación de que cada top post tenga la estructura esperada
        const invalidTopPosts = data.top_posts.filter(post => 
            !post.id || !post.type || typeof post.likesCount !== 'number' || typeof post.engagement_rate !== 'number'
        );

        if (invalidTopPosts.length > 0) {
            console.error('❌ Top posts con estructura inválida:', invalidTopPosts);
            throw new Error(`Se encontraron ${invalidTopPosts.length} top posts con estructura inválida`);
        }

        // Validación de que cada engagement trend tenga la estructura esperada
        const invalidEngagementTrends = data.engagement_trends.filter(trend => 
            !trend.post_date || typeof trend.engagement_rate !== 'number'
        );

        if (invalidEngagementTrends.length > 0) {
            console.error('❌ Engagement trends con estructura inválida:', invalidEngagementTrends);
            throw new Error(`Se encontraron ${invalidEngagementTrends.length} engagement trends con estructura inválida`);
        }

        console.log('✅ getInstagramStatistics completada exitosamente');
        return data;
        
    } catch (error) {
        console.error('💥 Error en getInstagramStatistics:', error);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('La petición se agotó el tiempo de espera. Por favor, intenta de nuevo.');
            }
            throw new Error(error.message || 'Ocurrió un error desconocido al obtener las estadísticas de Instagram.');
        } else {
            throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
        }
    }
}