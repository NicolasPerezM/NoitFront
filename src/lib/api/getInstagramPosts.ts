// lib/api/getInstagramPosts.ts

type InstagramPost = {
    id: string;
    type: string;
    shortCode: string;
    caption: string;
    hashtags: string[];
    mentions: string[];
    url: string;
    commentsCount: number;
    firstComment: string | null;
    latestComments: InstagramComment[];
    inputUrl?: string;
    timestamp?: string;
};

type InstagramComment = {
    id: string;
    text: string;
    ownerUsername: string;
    ownerProfilePicUrl: string;
    timestamp: string;
    repliesCount: number;
    replies: InstagramReply[];
    likesCount: number;
    owner: {
        id: string;
        is_verified: boolean;
        profile_pic_url: string;
        username: string;
    };
};

type InstagramReply = {
    id: string;
    text: string;
    ownerUsername: string;
    ownerProfilePicUrl: string;
    timestamp: string;
    repliesCount: number;
    replies: InstagramReply[];
    likesCount: number;
    owner: {
        id: string;
        is_verified: boolean;
        profile_pic_url: string;
        username: string;
    };
};

type PostStatistics = {
    totalComments: number;
    postsWithComments: number;
    postsByType: Record<string, number>;
};

type GetInstagramPostsResponse = {
    success: boolean;
    totalPosts: number;
    posts: InstagramPost[];
    statistics: PostStatistics;
    timestamp: string;
};

type ApiErrorPayload = {
    error?: string | { detail?: string; message?: string; [key: string]: any };
    detail?: string;
    message?: string;
    availableCookies?: string[];
    requestedCompetitorId?: string;
    [key: string]: any;
};

export async function getInstagramPosts(competitorId: string): Promise<GetInstagramPostsResponse> {
    console.log('🚀 getInstagramPosts iniciada con competitor_id:', competitorId);
    
    try {
        if (!competitorId || typeof competitorId !== 'string' || competitorId.trim() === '') {
            console.error('❌ Competitor ID inválido:', competitorId);
            throw new Error('Competitor ID es requerido y debe ser una cadena válida');
        }

        const url = `/api/socialAnalysis/instagram/imagesAnalysis/getInstagramPosts?competitor_id=${encodeURIComponent(competitorId.trim())}`;
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
                        errorMessage = `No se encontraron posts para el competitor ID "${competitorId}" o el competitor ID no existe`;
                    }

                    // Manejo específico para error 401
                    if (response.status === 401) {
                        errorMessage = `No tienes autorización para acceder a los posts de Instagram de este competidor. ${errorMessage}`;
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
        const data: GetInstagramPostsResponse = await response.json();
        console.log('✅ Datos parseados exitosamente:', {
            competitorId: competitorId,
            totalPosts: data.totalPosts || 0,
            success: data.success,
            postsByType: data.statistics?.postsByType || {},
            totalComments: data.statistics?.totalComments || 0
        });
        
        // Debug logs para validación
        console.log('🔍 success:', data.success);
        console.log('🔍 typeof success:', typeof data.success);
        console.log('🔍 totalPosts:', data.totalPosts);
        console.log('🔍 typeof totalPosts:', typeof data.totalPosts);
        console.log('🔍 posts:', data.posts);
        console.log('🔍 typeof posts:', typeof data.posts);
        console.log('🔍 posts length:', data.posts?.length);
        console.log('🔍 statistics:', data.statistics);
        
        // Validación de la respuesta
        if (typeof data.success !== 'boolean') {
            console.error('❌ success no válido en respuesta:', data);
            throw new Error('La respuesta del servidor no contiene un estado de éxito válido');
        }

        if (!data.success) {
            console.error('❌ Respuesta indica fallo:', data);
            throw new Error('El servidor reportó un fallo en el procesamiento de posts');
        }

        if (typeof data.totalPosts !== 'number' || data.totalPosts < 0) {
            console.error('❌ totalPosts no válido en respuesta:', data);
            throw new Error('La respuesta del servidor no contiene un total de posts válido');
        }

        if (!Array.isArray(data.posts)) {
            console.error('❌ posts no válido en respuesta:', data);
            throw new Error('La respuesta del servidor no contiene posts válidos');
        }

        // Verificar que posts tenga la longitud esperada
        if (data.totalPosts !== data.posts.length) {
            console.warn('⚠️ Inconsistencia entre totalPosts y posts.length:', {
                totalPosts: data.totalPosts,
                postsLength: data.posts.length
            });
        }

        // Verificar que statistics sea válido
        if (!data.statistics || typeof data.statistics !== 'object') {
            console.error('❌ statistics no válido en respuesta:', data);
            throw new Error('La respuesta del servidor no contiene estadísticas válidas');
        }

        if (typeof data.statistics.totalComments !== 'number' || data.statistics.totalComments < 0) {
            console.error('❌ totalComments en statistics no válido:', data.statistics);
            throw new Error('Las estadísticas no contienen un total de comentarios válido');
        }

        console.log('✅ Estructura de datos válida');

        // Validación de que cada post tenga la estructura esperada
        const invalidPosts = data.posts.filter(post => 
            !post.id || 
            typeof post.id !== 'string' ||
            !post.type || 
            typeof post.type !== 'string' ||
            typeof post.shortCode !== 'string' ||
            typeof post.caption !== 'string' ||
            !Array.isArray(post.hashtags) ||
            !Array.isArray(post.mentions) ||
            typeof post.url !== 'string' ||
            typeof post.commentsCount !== 'number' ||
            !Array.isArray(post.latestComments)
        );

        if (invalidPosts.length > 0) {
            console.error(`❌ Posts con estructura inválida:`, invalidPosts.slice(0, 3)); // Solo mostrar los primeros 3
            throw new Error(`Se encontraron ${invalidPosts.length} posts con estructura inválida`);
        }

        // Validación de comentarios en cada post
        const postsWithInvalidComments = data.posts.filter(post => {
            return post.latestComments.some(comment => 
                !comment.id ||
                typeof comment.id !== 'string' ||
                typeof comment.text !== 'string' ||
                typeof comment.ownerUsername !== 'string' ||
                typeof comment.timestamp !== 'string' ||
                typeof comment.likesCount !== 'number' ||
                !Array.isArray(comment.replies) ||
                !comment.owner ||
                typeof comment.owner.username !== 'string'
            );
        });

        if (postsWithInvalidComments.length > 0) {
            console.warn(`⚠️ Posts con comentarios de estructura inválida:`, postsWithInvalidComments.length);
            // Solo advertir, no lanzar error ya que los posts principales siguen siendo utilizables
        }

        // Validar tipos de post conocidos
        const knownPostTypes = ['Sidecar', 'Video', 'Image', 'Reel', 'Story'];
        const unknownPostTypes = data.posts.filter(post => 
            !knownPostTypes.includes(post.type)
        );

        if (unknownPostTypes.length > 0) {
            const uniqueUnknownTypes = [...new Set(unknownPostTypes.map(p => p.type))];
            console.warn('⚠️ Tipos de post desconocidos encontrados:', uniqueUnknownTypes);
            // Solo advertir, no lanzar error
        }

        // Validar URLs de posts
        const postsWithInvalidUrls = data.posts.filter(post => {
            if (!post.url) return false;
            try {
                new URL(post.url);
                return false;
            } catch {
                return true;
            }
        });

        if (postsWithInvalidUrls.length > 0) {
            console.warn(`⚠️ Posts con URLs inválidas:`, postsWithInvalidUrls.length);
            // Solo advertir, no lanzar error
        }

        // Log de estadísticas finales
        console.log('📊 Estadísticas de posts procesados:', {
            totalPosts: data.totalPosts,
            totalComments: data.statistics.totalComments,
            postsWithComments: data.statistics.postsWithComments,
            postsByType: data.statistics.postsByType,
            averageCommentsPerPost: data.totalPosts > 0 ? (data.statistics.totalComments / data.totalPosts).toFixed(2) : 0
        });

        console.log('✅ getInstagramPosts completada exitosamente');
        return data;
        
    } catch (error) {
        console.error('💥 Error en getInstagramPosts:', error);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('La petición se agotó el tiempo de espera. Por favor, intenta de nuevo.');
            }
            throw new Error(error.message || 'Ocurrió un error desconocido al obtener los posts de Instagram.');
        } else {
            throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
        }
    }
}