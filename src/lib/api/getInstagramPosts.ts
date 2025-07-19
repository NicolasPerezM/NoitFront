// lib/api/getInstagramPosts.ts

type InstagramPost = {
    inputUrl: string;
    id: string;
    type: string; // "Image", "Sidecar", etc.
    shortCode: string;
    caption: string;
    hashtags: string[];
    mentions: string[];
    url: string;
    commentsCount: number;
    firstComment: string;
    latestComments: {
        id: string;
        text: string;
        ownerUsername: string;
        ownerProfilePicUrl: string;
        timestamp: string;
        repliesCount: number;
        replies: any[];
        likesCount: number;
        owner: {
            id: string;
            is_verified: boolean;
            profile_pic_url: string;
            username: string;
        };
    }[];
    dimensionsHeight: number;
    dimensionsWidth: number;
    displayUrl: string;
    images: string[];
    alt: string;
    likesCount: number;
    timestamp: string;
    childPosts: {
        id: string;
        type: string;
        shortCode: string;
        caption: string;
        hashtags: string[];
        mentions: string[];
        url: string;
        commentsCount: number;
        firstComment: string;
        latestComments: any[];
        dimensionsHeight: number;
        dimensionsWidth: number;
        displayUrl: string;
        images: string[];
        alt: string;
        likesCount: number | null;
        timestamp: string | null;
        childPosts: any[];
        ownerId: string | null;
    }[];
    ownerFullName: string;
    ownerUsername: string;
    ownerId: string;
    isSponsored: boolean;
    isCommentsDisabled: boolean;
};

type PostsMetadata = {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    postsWithHashtags: number;
    postsWithImages: number;
    competitorId: string;
    timestamp: string;
};

type GetInstagramPostsResponse = {
    posts: InstagramPost[];
    metadata: PostsMetadata;
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
        
        const totalPosts = data.metadata?.totalPosts || data.posts?.length || 0;
        const totalLikes = data.metadata?.totalLikes || 0;
        const totalComments = data.metadata?.totalComments || 0;
        const postsWithHashtags = data.metadata?.postsWithHashtags || 0;
        const postsWithImages = data.metadata?.postsWithImages || 0;
        
        const topPosts = data.posts?.slice(0, 3) || [];
        
        console.log('✅ Datos parseados exitosamente:', {
            competitorId: competitorId,
            totalPosts: totalPosts,
            totalLikes: totalLikes,
            totalComments: totalComments,
            postsWithHashtags: postsWithHashtags,
            postsWithImages: postsWithImages,
            topPosts: topPosts.map(post => ({
                shortCode: post.shortCode,
                type: post.type,
                likes: post.likesCount || 0,
                comments: post.commentsCount || 0,
                hashtags: post.hashtags?.length || 0,
                images: post.images?.length || 0
            }))
        });
        
        // Debug log para la estructura de datos
        console.log('🔍 Data structure:', {
            hasPosts: !!data.posts,
            hasMetadata: !!data.metadata,
            postsType: typeof data.posts,
            metadataType: typeof data.metadata,
            postsLength: data.posts?.length || 0
        });
        
        // Validación básica de la respuesta
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            console.error('❌ Respuesta no válida:', data);
            throw new Error('La respuesta del servidor no contiene datos de posts válidos');
        }

        // Validación de posts
        if (!data.posts || !Array.isArray(data.posts)) {
            console.error('❌ posts no válido:', data.posts);
            throw new Error('Los datos de posts no son válidos');
        }

        if (data.posts.length === 0) {
            console.warn('⚠️ No se encontraron posts:', data.posts);
            // No es un error, puede ser que simplemente no haya posts
        }

        // Validación de metadata (opcional pero recomendada)
        if (!data.metadata || typeof data.metadata !== 'object') {
            console.warn('⚠️ metadata no válida o ausente:', data.metadata);
            // Crear metadata básica si no existe
            data.metadata = {
                totalPosts: data.posts.length,
                totalLikes: data.posts.reduce((sum, post) => sum + (post.likesCount || 0), 0),
                totalComments: data.posts.reduce((sum, post) => sum + (post.commentsCount || 0), 0),
                postsWithHashtags: data.posts.filter(post => post.hashtags && post.hashtags.length > 0).length,
                postsWithImages: data.posts.filter(post => post.images && post.images.length > 0).length,
                competitorId: competitorId,
                timestamp: new Date().toISOString()
            };
        }

        // Validación de la estructura de cada post (solo verificar campos esenciales)
        const invalidPosts = data.posts.filter(post => 
            !post ||
            typeof post !== 'object' ||
            typeof post.id !== 'string' ||
            typeof post.shortCode !== 'string' ||
            typeof post.type !== 'string' ||
            typeof post.url !== 'string' ||
            post.id.trim() === '' ||
            post.shortCode.trim() === '' ||
            post.type.trim() === '' ||
            post.url.trim() === ''
        );

        if (invalidPosts.length > 0) {
            console.error('❌ Posts inválidos encontrados:', invalidPosts.slice(0, 3));
            throw new Error(`Se encontraron ${invalidPosts.length} posts con estructura inválida`);
        }

        // Validación de arrays dentro de cada post
        const postsWithInvalidArrays = data.posts.filter(post => {
            return !Array.isArray(post.hashtags) ||
                   !Array.isArray(post.mentions) ||
                   !Array.isArray(post.images) ||
                   !Array.isArray(post.latestComments) ||
                   !Array.isArray(post.childPosts);
        });

        if (postsWithInvalidArrays.length > 0) {
            console.error('❌ Posts con arrays inválidos:', postsWithInvalidArrays.slice(0, 3));
            throw new Error(`Se encontraron ${postsWithInvalidArrays.length} posts con arrays inválidos`);
        }

        // Validación de tipos de datos numéricos
        const postsWithInvalidNumbers = data.posts.filter(post => {
            return typeof post.likesCount !== 'number' ||
                   typeof post.commentsCount !== 'number' ||
                   typeof post.dimensionsHeight !== 'number' ||
                   typeof post.dimensionsWidth !== 'number' ||
                   isNaN(post.likesCount) ||
                   isNaN(post.commentsCount) ||
                   isNaN(post.dimensionsHeight) ||
                   isNaN(post.dimensionsWidth) ||
                   post.likesCount < 0 ||
                   post.commentsCount < 0 ||
                   post.dimensionsHeight <= 0 ||
                   post.dimensionsWidth <= 0;
        });

        if (postsWithInvalidNumbers.length > 0) {
            console.error('❌ Posts con números inválidos:', postsWithInvalidNumbers.slice(0, 3));
            throw new Error(`Se encontraron ${postsWithInvalidNumbers.length} posts con valores numéricos inválidos`);
        }

        // Validación de fechas
        const postsWithInvalidDates = data.posts.filter(post => {
            if (!post.timestamp || typeof post.timestamp !== 'string') return true;
            const date = new Date(post.timestamp);
            return isNaN(date.getTime());
        });

        if (postsWithInvalidDates.length > 0) {
            console.warn('⚠️ Posts con fechas inválidas:', postsWithInvalidDates.length);
        }

        // Validación de duplicados en shortCode
        const shortCodes = data.posts.map(post => post.shortCode);
        const uniqueShortCodes = new Set(shortCodes);
        if (shortCodes.length !== uniqueShortCodes.size) {
            console.warn('⚠️ Se encontraron shortCodes duplicados');
        }

        // Estadísticas adicionales
        const postTypes = [...new Set(data.posts.map(post => post.type))];
        const avgEngagement = data.posts.length > 0 ? 
            (data.posts.reduce((sum, post) => sum + (post.likesCount || 0) + (post.commentsCount || 0), 0) / data.posts.length).toFixed(2) : 0;
        const postsWithCaptions = data.posts.filter(post => post.caption && post.caption.trim() !== '').length;

        console.log('📊 Estadísticas de posts:', {
            postTypes,
            avgEngagement,
            postsWithCaptions
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