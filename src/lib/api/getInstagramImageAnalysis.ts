// lib/api/getInstagramImageAnalysis.ts

type ImageData = {
    file_name: string;
    object_path: string;
    color_palette: Array<{
        rgb: [number, number, number];
        proportion: number;
    }>;
    gpt4o_analysis: string;
};

type PostAnalyzed = {
    post_id: string;
    caption: string;
    post_type: string;
    images: ImageData[];
};

type GetInstagramImageAnalysisResponse = {
    username: string;
    total_posts_analyzed: number;
    posts_analyzed: PostAnalyzed[];
};

type ApiErrorPayload = {
    error?: string | { detail?: string; message?: string; [key: string]: any };
    detail?: string;
    message?: string;
    availableCookies?: string[];
    requestedCompetitorId?: string;
    [key: string]: any;
};

export async function getInstagramImageAnalysis(competitorId: string): Promise<GetInstagramImageAnalysisResponse> {
    console.log('🚀 getInstagramImageAnalysis iniciada con competitor_id:', competitorId);
    
    try {
        if (!competitorId || typeof competitorId !== 'string' || competitorId.trim() === '') {
            console.error('❌ Competitor ID inválido:', competitorId);
            throw new Error('Competitor ID es requerido y debe ser una cadena válida');
        }

        const url = `/api/socialAnalysis/instagram/imagesAnalysis/getInstagramImageAnalysis?competitor_id=${encodeURIComponent(competitorId.trim())}`;
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
                        errorMessage = `No se encontró análisis de imágenes para el competitor ID "${competitorId}" o el competitor ID no existe`;
                    }

                    // Manejo específico para error 401
                    if (response.status === 401) {
                        errorMessage = `No tienes autorización para acceder al análisis de imágenes de Instagram de este competidor. ${errorMessage}`;
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
        const data: GetInstagramImageAnalysisResponse = await response.json();
        
        const username = data.username || 'N/A';
        const totalPostsAnalyzed = data.total_posts_analyzed || 0;
        const postsAnalyzedCount = data.posts_analyzed?.length || 0;
        
        const topPosts = data.posts_analyzed?.slice(0, 3) || [];
        
        console.log('✅ Datos parseados exitosamente:', {
            competitorId: competitorId,
            username: username,
            totalPostsAnalyzed: totalPostsAnalyzed,
            postsAnalyzedCount: postsAnalyzedCount,
            topPosts: topPosts.map(post => ({
                postId: post.post_id,
                postType: post.post_type,
                hasCaption: !!post.caption,
                imagesCount: post.images?.length || 0,
                hasGpt4Analysis: post.images?.some(img => !!img.gpt4o_analysis) || false
            }))
        });
        
        // Debug log para la estructura de datos
        console.log('🔍 Data structure:', {
            hasUsername: !!data.username,
            hasTotalPostsAnalyzed: typeof data.total_posts_analyzed === 'number',
            hasPostsAnalyzed: !!data.posts_analyzed,
            usernameType: typeof data.username,
            totalPostsAnalyzedType: typeof data.total_posts_analyzed,
            postsAnalyzedType: typeof data.posts_analyzed
        });
        
        // Validación básica de la respuesta
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            console.error('❌ Respuesta no válida:', data);
            throw new Error('La respuesta del servidor no contiene datos de análisis de imágenes válidos');
        }

        // Validación de username
        if (!data.username || typeof data.username !== 'string' || data.username.trim() === '') {
            console.error('❌ username no válido:', data.username);
            throw new Error('El username del competidor no es válido');
        }

        // Validación de total_posts_analyzed
        if (typeof data.total_posts_analyzed !== 'number' || data.total_posts_analyzed < 0) {
            console.error('❌ total_posts_analyzed no válido:', data.total_posts_analyzed);
            throw new Error('El total de posts analizados no es válido');
        }

        // Validación de posts_analyzed
        if (!data.posts_analyzed || !Array.isArray(data.posts_analyzed)) {
            console.error('❌ posts_analyzed no válido:', data.posts_analyzed);
            throw new Error('Los datos de posts analizados no son válidos');
        }

        if (data.posts_analyzed.length === 0) {
            console.error('❌ No se encontraron posts analizados:', data.posts_analyzed);
            throw new Error('No se encontraron posts analizados en la respuesta');
        }

        // Validación de la estructura de cada post analizado
        const invalidPosts = data.posts_analyzed.filter(post => 
            !post ||
            typeof post !== 'object' ||
            typeof post.post_id !== 'string' ||
            typeof post.caption !== 'string' ||
            typeof post.post_type !== 'string' ||
            !Array.isArray(post.images) ||
            post.post_id.trim() === '' ||
            post.post_type.trim() === ''
        );

        if (invalidPosts.length > 0) {
            console.error('❌ Posts inválidos encontrados:', invalidPosts.slice(0, 3));
            throw new Error(`Se encontraron ${invalidPosts.length} posts con estructura inválida`);
        }

        // Validación de la estructura de las imágenes en cada post
        const postsWithInvalidImages = data.posts_analyzed.filter(post => {
            const invalidImages = post.images.filter(image => 
                !image ||
                typeof image !== 'object' ||
                typeof image.file_name !== 'string' ||
                typeof image.object_path !== 'string' ||
                typeof image.gpt4o_analysis !== 'string' ||
                !Array.isArray(image.color_palette) ||
                image.file_name.trim() === '' ||
                image.object_path.trim() === ''
            );
            return invalidImages.length > 0;
        });

        if (postsWithInvalidImages.length > 0) {
            console.error('❌ Posts con imágenes inválidas encontrados:', postsWithInvalidImages.slice(0, 2));
            throw new Error(`Se encontraron ${postsWithInvalidImages.length} posts con imágenes inválidas`);
        }

        // Validación de paletas de colores
        const postsWithInvalidColorPalettes = data.posts_analyzed.filter(post => {
            const invalidColorPalettes = post.images.filter(image => {
                const invalidColors = image.color_palette.filter(color => 
                    !color ||
                    typeof color !== 'object' ||
                    !Array.isArray(color.rgb) ||
                    color.rgb.length !== 3 ||
                    typeof color.proportion !== 'number' ||
                    color.proportion < 0 ||
                    color.proportion > 1 ||
                    !color.rgb.every(value => typeof value === 'number' && value >= 0 && value <= 255)
                );
                return invalidColors.length > 0;
            });
            return invalidColorPalettes.length > 0;
        });

        if (postsWithInvalidColorPalettes.length > 0) {
            console.warn('⚠️ Posts con paletas de colores inválidas encontrados:', postsWithInvalidColorPalettes.length);
        }

        // Validación de consistencia entre total_posts_analyzed y posts_analyzed
        if (data.posts_analyzed.length !== data.total_posts_analyzed) {
            console.warn('⚠️ Inconsistencia en número de posts:', {
                postsAnalyzedFound: data.posts_analyzed.length,
                totalPostsAnalyzedReported: data.total_posts_analyzed
            });
        }

        // Validación de duplicados en post_ids
        const postIds = data.posts_analyzed.map(post => post.post_id);
        const uniquePostIds = new Set(postIds);
        if (postIds.length !== uniquePostIds.size) {
            console.warn('⚠️ Se encontraron post IDs duplicados en posts analizados');
        }

        // Estadísticas adicionales
        const totalImages = data.posts_analyzed.reduce((sum, post) => sum + post.images.length, 0);
        const avgImagesPerPost = data.posts_analyzed.length > 0 ? 
            (totalImages / data.posts_analyzed.length).toFixed(2) : 0;
        const postsWithGptAnalysis = data.posts_analyzed.filter(post => 
            post.images.some(img => img.gpt4o_analysis && img.gpt4o_analysis.trim() !== '')
        ).length;
        const avgCaptionLength = data.posts_analyzed.length > 0 ? 
            (data.posts_analyzed.reduce((sum, post) => sum + post.caption.length, 0) / data.posts_analyzed.length).toFixed(0) : 0;
        const avgGptAnalysisLength = data.posts_analyzed.length > 0 ? 
            (data.posts_analyzed.reduce((sum, post) => {
                const analysisLengths = post.images.reduce((imgSum, img) => imgSum + (img.gpt4o_analysis?.length || 0), 0);
                return sum + analysisLengths;
            }, 0) / totalImages).toFixed(0) : 0;
        const avgColorsPerImage = totalImages > 0 ? 
            (data.posts_analyzed.reduce((sum, post) => {
                const colorsCount = post.images.reduce((imgSum, img) => imgSum + (img.color_palette?.length || 0), 0);
                return sum + colorsCount;
            }, 0) / totalImages).toFixed(1) : 0;

        console.log('📊 Estadísticas del análisis de imágenes:', {
            totalImages,
            avgImagesPerPost,
            postsWithGptAnalysis,
            avgCaptionLength,
            avgGptAnalysisLength,
            avgColorsPerImage
        });

        console.log('✅ getInstagramImageAnalysis completada exitosamente');
        return data;
        
    } catch (error) {
        console.error('💥 Error en getInstagramImageAnalysis:', error);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('La petición se agotó el tiempo de espera. Por favor, intenta de nuevo.');
            }
            throw new Error(error.message || 'Ocurrió un error desconocido al obtener el análisis de imágenes de Instagram.');
        } else {
            throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
        }
    }
}