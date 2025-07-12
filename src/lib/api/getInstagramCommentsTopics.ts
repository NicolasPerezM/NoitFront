// lib/api/getInstagramCommentsTopics.ts

type TopicWords = {
    [word: string]: number;
};

type TopicData = {
    palabras_con_pesos: TopicWords;
    cantidad_comentarios: number;
};

type GetInstagramCommentsTopicsResponse = {
    [topicKey: string]: TopicData;
};

type ApiErrorPayload = {
    error?: string | { detail?: string; message?: string; [key: string]: any };
    detail?: string;
    message?: string;
    availableCookies?: string[];
    requestedCompetitorId?: string;
    [key: string]: any;
};

export async function getInstagramCommentsTopics(competitorId: string): Promise<GetInstagramCommentsTopicsResponse> {
    console.log('🚀 getInstagramCommentsTopics iniciada con competitor_id:', competitorId);
    
    try {
        if (!competitorId || typeof competitorId !== 'string' || competitorId.trim() === '') {
            console.error('❌ Competitor ID inválido:', competitorId);
            throw new Error('Competitor ID es requerido y debe ser una cadena válida');
        }

        const url = `/api/socialAnalysis/instagram/commentsAnalysis/getInstagramCommentsTopics?competitor_id=${encodeURIComponent(competitorId.trim())}`;
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
                        errorMessage = `No se encontraron comentarios con análisis de temas para el competitor ID "${competitorId}" o el competitor ID no existe`;
                    }

                    // Manejo específico para error 401
                    if (response.status === 401) {
                        errorMessage = `No tienes autorización para acceder al análisis de temas de comentarios de Instagram de este competidor. ${errorMessage}`;
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
        const data: GetInstagramCommentsTopicsResponse = await response.json();
        
        const topicKeys = Object.keys(data);
        const totalComments = Object.values(data).reduce((sum, topic) => sum + topic.cantidad_comentarios, 0);
        const topicSummary = topicKeys.map(key => ({
            topic: key,
            comments: data[key].cantidad_comentarios,
            topWords: Object.entries(data[key].palabras_con_pesos)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([word]) => word)
        }));

        console.log('✅ Datos parseados exitosamente:', {
            competitorId: competitorId,
            totalTopics: topicKeys.length,
            totalComments: totalComments,
            topicSummary: topicSummary
        });
        
        // Debug log para la estructura de datos
        console.log('🔍 Topic keys:', topicKeys);
        console.log('🔍 typeof data:', typeof data);
        console.log('🔍 data structure sample:', topicKeys.slice(0, 2).map(key => ({
            key,
            structure: {
                palabras_con_pesos: typeof data[key].palabras_con_pesos,
                cantidad_comentarios: typeof data[key].cantidad_comentarios
            }
        })));
        
        // Validación básica de la respuesta
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            console.error('❌ Respuesta no válida:', data);
            throw new Error('La respuesta del servidor no contiene datos de temas válidos');
        }

        if (topicKeys.length === 0) {
            console.error('❌ No se encontraron temas en la respuesta:', data);
            throw new Error('No se encontraron temas en la respuesta del servidor');
        }

        // Validación de que cada tema tenga la estructura esperada
        const invalidTopics = topicKeys.filter(topicKey => {
            const topic = data[topicKey];
            return !topic || 
                   typeof topic !== 'object' ||
                   typeof topic.cantidad_comentarios !== 'number' ||
                   topic.cantidad_comentarios < 0 ||
                   !topic.palabras_con_pesos ||
                   typeof topic.palabras_con_pesos !== 'object' ||
                   Array.isArray(topic.palabras_con_pesos);
        });

        if (invalidTopics.length > 0) {
            console.error(`❌ Temas con estructura inválida:`, invalidTopics.map(key => ({ key, data: data[key] })));
            throw new Error(`Se encontraron ${invalidTopics.length} temas con estructura inválida`);
        }

        // Validación de que cada tema tenga al menos una palabra con peso
        const topicsWithoutWords = topicKeys.filter(topicKey => {
            const topic = data[topicKey];
            return Object.keys(topic.palabras_con_pesos).length === 0;
        });

        if (topicsWithoutWords.length > 0) {
            console.error(`❌ Temas sin palabras:`, topicsWithoutWords);
            throw new Error(`Se encontraron ${topicsWithoutWords.length} temas sin palabras asociadas`);
        }

        // Validación de que los pesos de las palabras sean números válidos
        const topicsWithInvalidWeights = topicKeys.filter(topicKey => {
            const topic = data[topicKey];
            return Object.values(topic.palabras_con_pesos).some(weight => 
                typeof weight !== 'number' || 
                weight < 0 || 
                weight > 1 || 
                isNaN(weight)
            );
        });

        if (topicsWithInvalidWeights.length > 0) {
            console.error(`❌ Temas con pesos inválidos:`, topicsWithInvalidWeights);
            throw new Error(`Se encontraron ${topicsWithInvalidWeights.length} temas con pesos de palabras inválidos`);
        }

        // Validación de que los nombres de temas sigan el patrón esperado
        const invalidTopicNames = topicKeys.filter(topicKey => 
            !topicKey.startsWith('Tema_') || 
            !topicKey.match(/^Tema_\d+$/)
        );

        if (invalidTopicNames.length > 0) {
            console.warn('⚠️ Nombres de temas no siguen el patrón esperado (Tema_N):', invalidTopicNames);
            // Solo advertir, no lanzar error ya que los datos siguen siendo utilizables
        }

        // Validación de que la suma de comentarios sea consistente
        if (totalComments === 0) {
            console.warn('⚠️ No se encontraron comentarios en ningún tema');
            // Solo advertir, no lanzar error
        }

        console.log('✅ getInstagramCommentsTopics completada exitosamente');
        return data;
        
    } catch (error) {
        console.error('💥 Error en getInstagramCommentsTopics:', error);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('La petición se agotó el tiempo de espera. Por favor, intenta de nuevo.');
            }
            throw new Error(error.message || 'Ocurrió un error desconocido al obtener el análisis de temas de comentarios de Instagram.');
        } else {
            throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
        }
    }
}