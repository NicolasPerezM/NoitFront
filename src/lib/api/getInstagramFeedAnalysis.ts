// lib/api/getInstagramFeedAnalysis.ts

type BatchAnalysis = {
    batch_number: number;
    post_ids: string[];
    analysis: string;
    model_used: string;
};

type GlobalAnalysis = {
    summary: string;
    total_posts_analyzed: number;
    total_batches: number;
    model_used: string;
};

type DetailedPost = {
    post_id: string;
    caption: string;
    object_path: string;
};

type GetInstagramFeedAnalysisResponse = {
    global_analysis: GlobalAnalysis;
    batch_analyses: BatchAnalysis[];
    detailed_posts: DetailedPost[];
};

type ApiErrorPayload = {
    error?: string | { detail?: string; message?: string; [key: string]: any };
    detail?: string;
    message?: string;
    availableCookies?: string[];
    requestedCompetitorId?: string;
    [key: string]: any;
};

export async function getInstagramFeedAnalysis(competitorId: string): Promise<GetInstagramFeedAnalysisResponse> {
    console.log('🚀 getInstagramFeedAnalysis iniciada con competitor_id:', competitorId);
    
    try {
        if (!competitorId || typeof competitorId !== 'string' || competitorId.trim() === '') {
            console.error('❌ Competitor ID inválido:', competitorId);
            throw new Error('Competitor ID es requerido y debe ser una cadena válida');
        }

        const url = `/api/socialAnalysis/instagram/imagesAnalysis/getInstagramFeedAnalysis?competitor_id=${encodeURIComponent(competitorId.trim())}`;
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
                        errorMessage = `No se encontró análisis de feed para el competitor ID "${competitorId}" o el competitor ID no existe`;
                    }

                    // Manejo específico para error 401
                    if (response.status === 401) {
                        errorMessage = `No tienes autorización para acceder al análisis de feed de Instagram de este competidor. ${errorMessage}`;
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
        const data: GetInstagramFeedAnalysisResponse = await response.json();
        
        const totalPosts = data.global_analysis?.total_posts_analyzed || 0;
        const totalBatches = data.global_analysis?.total_batches || 0;
        const modelUsed = data.global_analysis?.model_used || 'N/A';
        const batchesCount = data.batch_analyses?.length || 0;
        const detailedPostsCount = data.detailed_posts?.length || 0;
        
        const topBatches = data.batch_analyses?.slice(0, 2) || [];
        
        console.log('✅ Datos parseados exitosamente:', {
            competitorId: competitorId,
            totalPosts: totalPosts,
            totalBatches: totalBatches,
            modelUsed: modelUsed,
            batchesCount: batchesCount,
            detailedPostsCount: detailedPostsCount,
            topBatches: topBatches.map(batch => ({
                batchNumber: batch.batch_number,
                postsCount: batch.post_ids?.length || 0,
                hasAnalysis: !!batch.analysis,
                modelUsed: batch.model_used
            }))
        });
        
        // Debug log para la estructura de datos
        console.log('🔍 Data structure:', {
            hasGlobalAnalysis: !!data.global_analysis,
            hasBatchAnalyses: !!data.batch_analyses,
            hasDetailedPosts: !!data.detailed_posts,
            globalAnalysisType: typeof data.global_analysis,
            batchAnalysesType: typeof data.batch_analyses,
            detailedPostsType: typeof data.detailed_posts
        });
        
        // Validación básica de la respuesta
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            console.error('❌ Respuesta no válida:', data);
            throw new Error('La respuesta del servidor no contiene datos de análisis de feed válidos');
        }

        // Validación de global_analysis
        if (!data.global_analysis || typeof data.global_analysis !== 'object') {
            console.error('❌ global_analysis no válido:', data.global_analysis);
            throw new Error('Los datos de análisis global no son válidos');
        }

        // Validación de batch_analyses
        if (!data.batch_analyses || !Array.isArray(data.batch_analyses)) {
            console.error('❌ batch_analyses no válido:', data.batch_analyses);
            throw new Error('Los datos de análisis por lotes no son válidos');
        }

        if (data.batch_analyses.length === 0) {
            console.error('❌ No se encontraron análisis por lotes:', data.batch_analyses);
            throw new Error('No se encontraron análisis por lotes en la respuesta');
        }

        // Validación de detailed_posts
        if (!data.detailed_posts || !Array.isArray(data.detailed_posts)) {
            console.error('❌ detailed_posts no válido:', data.detailed_posts);
            throw new Error('Los datos de posts detallados no son válidos');
        }

        // Validación de la estructura de global_analysis
        const globalAnalysis = data.global_analysis;
        if (typeof globalAnalysis.summary !== 'string' ||
            typeof globalAnalysis.total_posts_analyzed !== 'number' ||
            typeof globalAnalysis.total_batches !== 'number' ||
            typeof globalAnalysis.model_used !== 'string' ||
            globalAnalysis.total_posts_analyzed < 0 ||
            globalAnalysis.total_batches < 0 ||
            globalAnalysis.summary.trim() === '' ||
            globalAnalysis.model_used.trim() === '') {
            console.error('❌ Estructura de global_analysis inválida:', globalAnalysis);
            throw new Error('La estructura del análisis global no es válida');
        }

        // Validación de la estructura de cada batch_analysis
        const invalidBatches = data.batch_analyses.filter(batch => 
            !batch ||
            typeof batch !== 'object' ||
            typeof batch.batch_number !== 'number' ||
            !Array.isArray(batch.post_ids) ||
            typeof batch.analysis !== 'string' ||
            typeof batch.model_used !== 'string' ||
            batch.batch_number < 0 ||
            batch.post_ids.length === 0 ||
            batch.analysis.trim() === '' ||
            batch.model_used.trim() === ''
        );

        if (invalidBatches.length > 0) {
            console.error('❌ Lotes inválidos encontrados:', invalidBatches.slice(0, 3));
            throw new Error(`Se encontraron ${invalidBatches.length} lotes con estructura inválida`);
        }

        // Validación de la estructura de cada detailed_post
        const invalidPosts = data.detailed_posts.filter(post => 
            !post ||
            typeof post !== 'object' ||
            typeof post.post_id !== 'string' ||
            typeof post.caption !== 'string' ||
            typeof post.object_path !== 'string' ||
            post.post_id.trim() === '' ||
            post.object_path.trim() === ''
        );

        if (invalidPosts.length > 0) {
            console.error('❌ Posts inválidos encontrados:', invalidPosts.slice(0, 3));
            throw new Error(`Se encontraron ${invalidPosts.length} posts con estructura inválida`);
        }

        // Validación de consistencia entre global_analysis y batch_analyses
        if (data.batch_analyses.length !== data.global_analysis.total_batches) {
            console.warn('⚠️ Inconsistencia en número de lotes:', {
                batchesFound: data.batch_analyses.length,
                totalBatchesReported: data.global_analysis.total_batches
            });
        }

        // Validación de consistencia entre posts en lotes y detailed_posts
        const totalPostsInBatches = data.batch_analyses.reduce((sum, batch) => sum + batch.post_ids.length, 0);
        if (totalPostsInBatches !== data.detailed_posts.length) {
            console.warn('⚠️ Inconsistencia en número de posts:', {
                postsInBatches: totalPostsInBatches,
                detailedPostsCount: data.detailed_posts.length
            });
        }

        // Validación de duplicados en post_ids
        const allPostIds = data.batch_analyses.flatMap(batch => batch.post_ids);
        const uniquePostIds = new Set(allPostIds);
        if (allPostIds.length !== uniquePostIds.size) {
            console.warn('⚠️ Se encontraron post IDs duplicados en los lotes');
        }

        // Validación de duplicados en detailed_posts
        const detailedPostIds = data.detailed_posts.map(post => post.post_id);
        const uniqueDetailedPostIds = new Set(detailedPostIds);
        if (detailedPostIds.length !== uniqueDetailedPostIds.size) {
            console.warn('⚠️ Se encontraron post IDs duplicados en posts detallados');
        }

        // Estadísticas adicionales
        const avgPostsPerBatch = data.batch_analyses.length > 0 ? 
            (totalPostsInBatches / data.batch_analyses.length).toFixed(2) : 0;
        const avgAnalysisLength = data.batch_analyses.length > 0 ? 
            (data.batch_analyses.reduce((sum, batch) => sum + batch.analysis.length, 0) / data.batch_analyses.length).toFixed(0) : 0;
        const avgCaptionLength = data.detailed_posts.length > 0 ? 
            (data.detailed_posts.reduce((sum, post) => sum + post.caption.length, 0) / data.detailed_posts.length).toFixed(0) : 0;

        console.log('📊 Estadísticas del análisis de feed:', {
            totalPostsInBatches,
            avgPostsPerBatch,
            avgAnalysisLength,
            avgCaptionLength
        });

        console.log('✅ getInstagramFeedAnalysis completada exitosamente');
        return data;
        
    } catch (error) {
        console.error('💥 Error en getInstagramFeedAnalysis:', error);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('La petición se agotó el tiempo de espera. Por favor, intenta de nuevo.');
            }
            throw new Error(error.message || 'Ocurrió un error desconocido al obtener el análisis de feed de Instagram.');
        } else {
            throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
        }
    }
}