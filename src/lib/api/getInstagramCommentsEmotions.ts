// lib/api/getInstagramCommentsEmotions.ts

type EmotionScore = {
    label: string;
    score: number;
};

type CommentEmotion = {
    post_id: string;
    db_post_id: string;
    comment_id: string | null;
    comment_text: string;
    owner_username: string | null;
    owner_profile_pic_url: string | null;
    timestamp: string;
    likes_count: number;
    scores: EmotionScore[];
    top_label: string;
};

type GetInstagramCommentsEmotionsResponse = {
    total_comments: number;
    results: CommentEmotion[];
};

type ApiErrorPayload = {
    error?: string | { detail?: string; message?: string; [key: string]: any };
    detail?: string;
    message?: string;
    availableCookies?: string[];
    requestedCompetitorId?: string;
    [key: string]: any;
};

export async function getInstagramCommentsEmotions(competitorId: string): Promise<GetInstagramCommentsEmotionsResponse> {
    console.log('🚀 getInstagramCommentsEmotions iniciada con competitor_id:', competitorId);
    
    try {
        if (!competitorId || typeof competitorId !== 'string' || competitorId.trim() === '') {
            console.error('❌ Competitor ID inválido:', competitorId);
            throw new Error('Competitor ID es requerido y debe ser una cadena válida');
        }

        const url = `/api/socialAnalysis/instagram/commentsAnalysis/getInstagramCommentsEmotions?competitor_id=${encodeURIComponent(competitorId.trim())}`;
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
                        errorMessage = `No se encontraron comentarios con análisis de emociones para el competitor ID "${competitorId}" o el competitor ID no existe`;
                    }

                    // Manejo específico para error 401
                    if (response.status === 401) {
                        errorMessage = `No tienes autorización para acceder al análisis de emociones de comentarios de Instagram de este competidor. ${errorMessage}`;
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
        const data: GetInstagramCommentsEmotionsResponse = await response.json();
        console.log('✅ Datos parseados exitosamente:', {
            competitorId: competitorId,
            totalComments: data.total_comments || 0,
            commentsAnalyzed: data.results?.length || 0,
            emotionDistribution: data.results?.reduce((acc, comment) => {
                const emotion = comment.top_label;
                acc[emotion] = (acc[emotion] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        });
        
        // Debug log para total_comments
        console.log('🔍 total_comments:', data.total_comments);
        console.log('🔍 typeof total_comments:', typeof data.total_comments);
        
        // Debug log para results
        console.log('🔍 results:', data.results);
        console.log('🔍 typeof results:', typeof data.results);
        console.log('🔍 results length:', data.results?.length);
        
        // Validación adicional de la respuesta
        if (typeof data.total_comments !== 'number' || data.total_comments < 0) {
            console.error('❌ total_comments no válido en respuesta:', data);
            throw new Error('La respuesta del servidor no contiene un total de comentarios válido');
        }

        if (!Array.isArray(data.results)) {
            console.error('❌ results no válido en respuesta:', data);
            throw new Error('La respuesta del servidor no contiene resultados válidos');
        }

        // Verificar que results tenga al menos un comentario si total_comments > 0
        if (data.total_comments > 0 && data.results.length === 0) {
            console.error('❌ total_comments indica comentarios pero results está vacío:', data);
            throw new Error('Inconsistencia en datos: se reportan comentarios pero no se encontraron resultados');
        }

        console.log('✅ Estructura de datos válida');

        // Validación de que cada comentario tenga la estructura esperada
        const invalidComments = data.results.filter(comment => 
            !comment.post_id || 
            typeof comment.comment_text !== 'string' || 
            typeof comment.timestamp !== 'string' ||
            typeof comment.likes_count !== 'number' ||
            !Array.isArray(comment.scores) ||
            typeof comment.top_label !== 'string'
        );

        if (invalidComments.length > 0) {
            console.error(`❌ Comentarios con estructura inválida:`, invalidComments);
            throw new Error(`Se encontraron ${invalidComments.length} comentarios con estructura inválida`);
        }

        // Validación de que cada comentario tenga scores válidos
        const invalidScores = data.results.filter(comment => {
            return comment.scores.some(score => 
                typeof score.label !== 'string' || 
                typeof score.score !== 'number' ||
                score.score < 0 || 
                score.score > 1
            );
        });

        if (invalidScores.length > 0) {
            console.error(`❌ Comentarios con scores inválidos:`, invalidScores);
            throw new Error(`Se encontraron ${invalidScores.length} comentarios con scores de emociones inválidos`);
        }

        // Validación de que cada comentario tenga al menos un score
        const commentsWithoutScores = data.results.filter(comment => comment.scores.length === 0);
        if (commentsWithoutScores.length > 0) {
            console.error(`❌ Comentarios sin scores:`, commentsWithoutScores);
            throw new Error(`Se encontraron ${commentsWithoutScores.length} comentarios sin scores de emociones`);
        }

        // Validación de que top_label sea uno de los labels válidos para emociones
        const validLabels = ['others', 'joy', 'sadness', 'anger', 'surprise', 'disgust', 'fear'];
        const invalidTopLabels = data.results.filter(comment => 
            !validLabels.includes(comment.top_label)
        );

        if (invalidTopLabels.length > 0) {
            console.error(`❌ Comentarios con top_label inválido:`, invalidTopLabels);
            throw new Error(`Se encontraron ${invalidTopLabels.length} comentarios con etiquetas de emociones inválidas`);
        }

        // Validación de que top_label coincida con el score más alto
        const topLabelMismatches = data.results.filter(comment => {
            const maxScore = Math.max(...comment.scores.map(s => s.score));
            const topScoreLabel = comment.scores.find(s => s.score === maxScore)?.label;
            return topScoreLabel !== comment.top_label;
        });

        if (topLabelMismatches.length > 0) {
            console.warn('⚠️ Inconsistencias en top_label vs scores:', topLabelMismatches);
            // Solo advertir, no lanzar error ya que los datos siguen siendo utilizables
        }

        console.log('✅ getInstagramCommentsEmotions completada exitosamente');
        return data;
        
    } catch (error) {
        console.error('💥 Error en getInstagramCommentsEmotions:', error);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('La petición se agotó el tiempo de espera. Por favor, intenta de nuevo.');
            }
            throw new Error(error.message || 'Ocurrió un error desconocido al obtener el análisis de emociones de comentarios de Instagram.');
        } else {
            throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
        }
    }
}