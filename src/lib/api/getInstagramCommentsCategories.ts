// lib/api/getInstagramCommentCategories.ts

type CommentData = {
    post_id: string;
    id_comentario: string;
    ownerUsername: string;
    contenido: string;
};

type CategoryCounts = {
    [category: string]: number;
};

type CategorizedComments = {
    [category: string]: CommentData[];
};

type GetInstagramCommentCategoriesResponse = {
    category_counts: CategoryCounts;
    categorized_comments: CategorizedComments;
};

type ApiErrorPayload = {
    error?: string | { detail?: string; message?: string; [key: string]: any };
    detail?: string;
    message?: string;
    availableCookies?: string[];
    requestedCompetitorId?: string;
    [key: string]: any;
};

export async function getInstagramCommentCategories(competitorId: string): Promise<GetInstagramCommentCategoriesResponse> {
    console.log('🚀 getInstagramCommentCategories iniciada con competitor_id:', competitorId);
    
    try {
        if (!competitorId || typeof competitorId !== 'string' || competitorId.trim() === '') {
            console.error('❌ Competitor ID inválido:', competitorId);
            throw new Error('Competitor ID es requerido y debe ser una cadena válida');
        }

        const url = `/api/socialAnalysis/instagram/commentsAnalysis/getInstagramCommentsCategories?competitor_id=${encodeURIComponent(competitorId.trim())}`;
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
                        errorMessage = `No se encontraron categorías de comentarios de Instagram para el competitor ID "${competitorId}" o el competitor ID no existe`;
                    }

                    // Manejo específico para error 401
                    if (response.status === 401) {
                        errorMessage = `No tienes autorización para acceder a las categorías de comentarios de Instagram de este competidor. ${errorMessage}`;
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
        const data: GetInstagramCommentCategoriesResponse = await response.json();
        console.log('✅ Datos parseados exitosamente:', {
            competitorId: competitorId,
            totalCategories: Object.keys(data.category_counts || {}).length,
            totalComments: Object.values(data.category_counts || {}).reduce((sum, count) => sum + count, 0),
            categoriesFound: Object.keys(data.category_counts || {})
        });
        
        // Debug log para category_counts
        console.log('🔍 category_counts:', data.category_counts);
        console.log('🔍 typeof category_counts:', typeof data.category_counts);
        console.log('🔍 category_counts keys:', data.category_counts ? Object.keys(data.category_counts) : 'No keys');
        
        // Debug log para categorized_comments
        console.log('🔍 categorized_comments:', data.categorized_comments);
        console.log('🔍 typeof categorized_comments:', typeof data.categorized_comments);
        console.log('🔍 categorized_comments keys:', data.categorized_comments ? Object.keys(data.categorized_comments) : 'No keys');
        
        // Validación adicional de la respuesta
        if (!data.category_counts || typeof data.category_counts !== 'object') {
            console.error('❌ category_counts no válido en respuesta:', data);
            throw new Error('La respuesta del servidor no contiene conteos de categorías válidos');
        }

        if (!data.categorized_comments || typeof data.categorized_comments !== 'object') {
            console.error('❌ categorized_comments no válido en respuesta:', data);
            throw new Error('La respuesta del servidor no contiene comentarios categorizados válidos');
        }

        // Verificar que category_counts tenga al menos una categoría
        const categoryKeys = Object.keys(data.category_counts);
        if (categoryKeys.length === 0) {
            console.error('❌ category_counts está vacío:', data.category_counts);
            throw new Error('No se encontraron categorías de comentarios para este competidor');
        }

        console.log('✅ category_counts válido con categorías:', categoryKeys);

        // Verificar que categorized_comments tenga al menos una categoría
        const categorizedKeys = Object.keys(data.categorized_comments);
        if (categorizedKeys.length === 0) {
            console.error('❌ categorized_comments está vacío:', data.categorized_comments);
            throw new Error('No se encontraron comentarios categorizados para este competidor');
        }

        console.log('✅ categorized_comments válido con categorías:', categorizedKeys);

        // Validación de que cada categoría en categorized_comments tenga comentarios válidos
        const invalidCategories = [];
        for (const category of categorizedKeys) {
            const comments = data.categorized_comments[category];
            if (!Array.isArray(comments)) {
                invalidCategories.push(category);
                continue;
            }
            
            // Verificar que cada comentario tenga la estructura esperada
            const invalidComments = comments.filter(comment => 
                !comment.post_id || 
                typeof comment.id_comentario !== 'string' || 
                typeof comment.ownerUsername !== 'string' || 
                typeof comment.contenido !== 'string'
            );

            if (invalidComments.length > 0) {
                console.error(`❌ Comentarios con estructura inválida en categoría "${category}":`, invalidComments);
                throw new Error(`Se encontraron ${invalidComments.length} comentarios con estructura inválida en la categoría "${category}"`);
            }
        }

        if (invalidCategories.length > 0) {
            console.error('❌ Categorías con estructura inválida:', invalidCategories);
            throw new Error(`Se encontraron categorías con estructura inválida: ${invalidCategories.join(', ')}`);
        }

        // Validación de consistencia entre category_counts y categorized_comments
        const countMismatches = [];
        for (const category of categoryKeys) {
            const expectedCount = data.category_counts[category];
            const actualCount = data.categorized_comments[category]?.length || 0;
            
            if (expectedCount !== actualCount) {
                countMismatches.push({
                    category,
                    expected: expectedCount,
                    actual: actualCount
                });
            }
        }

        if (countMismatches.length > 0) {
            console.warn('⚠️ Inconsistencias en conteos de categorías:', countMismatches);
            // Solo advertir, no lanzar error ya que los datos siguen siendo utilizables
        }

        console.log('✅ getInstagramCommentCategories completada exitosamente');
        return data;
        
    } catch (error) {
        console.error('💥 Error en getInstagramCommentCategories:', error);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('La petición se agotó el tiempo de espera. Por favor, intenta de nuevo.');
            }
            throw new Error(error.message || 'Ocurrió un error desconocido al obtener las categorías de comentarios de Instagram.');
        } else {
            throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
        }
    }
}