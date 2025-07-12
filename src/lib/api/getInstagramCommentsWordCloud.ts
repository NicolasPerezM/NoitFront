// lib/api/getInstagramCommentsWordCloud.ts

type WordFrequency = {
    word: string;
    frequency: number;
    relative_frequency: number;
};

type WordCloudMetadata = {
    username: string;
    total_words: number;
    unique_words: number;
    top_words_count: number;
    generated_at: string;
};

type GetInstagramCommentsWordCloudResponse = {
    metadata: WordCloudMetadata;
    word_frequencies: {
        [word: string]: number;
    };
    word_frequencies_list: WordFrequency[];
};

type ApiErrorPayload = {
    error?: string | { detail?: string; message?: string; [key: string]: any };
    detail?: string;
    message?: string;
    availableCookies?: string[];
    requestedCompetitorId?: string;
    [key: string]: any;
};

export async function getInstagramCommentsWordCloud(competitorId: string): Promise<GetInstagramCommentsWordCloudResponse> {
    console.log('🚀 getInstagramCommentsWordCloud iniciada con competitor_id:', competitorId);
    
    try {
        if (!competitorId || typeof competitorId !== 'string' || competitorId.trim() === '') {
            console.error('❌ Competitor ID inválido:', competitorId);
            throw new Error('Competitor ID es requerido y debe ser una cadena válida');
        }

        const url = `/api/socialAnalysis/instagram/commentsAnalysis/getInstagramCommentsWordCloud?competitor_id=${encodeURIComponent(competitorId.trim())}`;
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
                        errorMessage = `No se encontraron comentarios con análisis de wordcloud para el competitor ID "${competitorId}" o el competitor ID no existe`;
                    }

                    // Manejo específico para error 401
                    if (response.status === 401) {
                        errorMessage = `No tienes autorización para acceder al análisis de wordcloud de comentarios de Instagram de este competidor. ${errorMessage}`;
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
        const data: GetInstagramCommentsWordCloudResponse = await response.json();
        
        const totalWords = data.metadata?.total_words || 0;
        const uniqueWords = data.metadata?.unique_words || 0;
        const topWordsCount = data.metadata?.top_words_count || 0;
        const wordFrequenciesCount = Object.keys(data.word_frequencies || {}).length;
        const wordFrequenciesListCount = data.word_frequencies_list?.length || 0;
        
        const topWords = data.word_frequencies_list?.slice(0, 5) || [];
        
        console.log('✅ Datos parseados exitosamente:', {
            competitorId: competitorId,
            username: data.metadata?.username || 'N/A',
            totalWords: totalWords,
            uniqueWords: uniqueWords,
            topWordsCount: topWordsCount,
            wordFrequenciesCount: wordFrequenciesCount,
            wordFrequenciesListCount: wordFrequenciesListCount,
            generatedAt: data.metadata?.generated_at || 'N/A',
            topWords: topWords.map(w => `${w.word}: ${w.frequency}`)
        });
        
        // Debug log para la estructura de datos
        console.log('🔍 Metadata keys:', Object.keys(data.metadata || {}));
        console.log('🔍 typeof data:', typeof data);
        console.log('🔍 data structure:', {
            hasMetadata: !!data.metadata,
            hasWordFrequencies: !!data.word_frequencies,
            hasWordFrequenciesList: !!data.word_frequencies_list,
            metadataType: typeof data.metadata,
            wordFrequenciesType: typeof data.word_frequencies,
            wordFrequenciesListType: typeof data.word_frequencies_list
        });
        
        // Validación básica de la respuesta
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            console.error('❌ Respuesta no válida:', data);
            throw new Error('La respuesta del servidor no contiene datos de wordcloud válidos');
        }

        // Validación de metadata
        if (!data.metadata || typeof data.metadata !== 'object') {
            console.error('❌ Metadata no válida:', data.metadata);
            throw new Error('Los metadatos del wordcloud no son válidos');
        }

        // Validación de campos requeridos en metadata
        const requiredMetadataFields = ['username', 'total_words', 'unique_words', 'top_words_count', 'generated_at'];
        const missingMetadataFields = requiredMetadataFields.filter(field => 
            data.metadata[field as keyof WordCloudMetadata] === undefined || 
            data.metadata[field as keyof WordCloudMetadata] === null
        );

        if (missingMetadataFields.length > 0) {
            console.error('❌ Campos faltantes en metadata:', missingMetadataFields);
            throw new Error(`Faltan campos requeridos en metadata: ${missingMetadataFields.join(', ')}`);
        }

        // Validación de tipos en metadata
        if (typeof data.metadata.username !== 'string' ||
            typeof data.metadata.total_words !== 'number' ||
            typeof data.metadata.unique_words !== 'number' ||
            typeof data.metadata.top_words_count !== 'number' ||
            typeof data.metadata.generated_at !== 'string') {
            console.error('❌ Tipos incorrectos en metadata:', {
                username: typeof data.metadata.username,
                total_words: typeof data.metadata.total_words,
                unique_words: typeof data.metadata.unique_words,
                top_words_count: typeof data.metadata.top_words_count,
                generated_at: typeof data.metadata.generated_at
            });
            throw new Error('Los tipos de datos en metadata no son válidos');
        }

        // Validación de word_frequencies
        if (!data.word_frequencies || typeof data.word_frequencies !== 'object' || Array.isArray(data.word_frequencies)) {
            console.error('❌ word_frequencies no válido:', data.word_frequencies);
            throw new Error('Las frecuencias de palabras no son válidas');
        }

        if (Object.keys(data.word_frequencies).length === 0) {
            console.error('❌ No se encontraron frecuencias de palabras:', data.word_frequencies);
            throw new Error('No se encontraron frecuencias de palabras en la respuesta');
        }

        // Validación de word_frequencies_list
        if (!data.word_frequencies_list || !Array.isArray(data.word_frequencies_list)) {
            console.error('❌ word_frequencies_list no válido:', data.word_frequencies_list);
            throw new Error('La lista de frecuencias de palabras no es válida');
        }

        if (data.word_frequencies_list.length === 0) {
            console.error('❌ Lista de frecuencias de palabras vacía:', data.word_frequencies_list);
            throw new Error('La lista de frecuencias de palabras está vacía');
        }

        // Validación de la estructura de cada elemento en word_frequencies_list
        const invalidFrequencyItems = data.word_frequencies_list.filter(item => 
            !item ||
            typeof item !== 'object' ||
            typeof item.word !== 'string' ||
            typeof item.frequency !== 'number' ||
            typeof item.relative_frequency !== 'number' ||
            item.frequency < 0 ||
            item.relative_frequency < 0 ||
            item.relative_frequency > 1 ||
            isNaN(item.frequency) ||
            isNaN(item.relative_frequency)
        );

        if (invalidFrequencyItems.length > 0) {
            console.error('❌ Elementos inválidos en word_frequencies_list:', invalidFrequencyItems.slice(0, 5));
            throw new Error(`Se encontraron ${invalidFrequencyItems.length} elementos inválidos en la lista de frecuencias`);
        }

        // Validación de consistencia entre word_frequencies y word_frequencies_list
        const wordFrequenciesKeys = Object.keys(data.word_frequencies);
        const wordFrequenciesListWords = data.word_frequencies_list.map(item => item.word);
        
        const missingInList = wordFrequenciesKeys.filter(word => !wordFrequenciesListWords.includes(word));
        const missingInDict = wordFrequenciesListWords.filter(word => !wordFrequenciesKeys.includes(word));

        if (missingInList.length > 0 || missingInDict.length > 0) {
            console.warn('⚠️ Inconsistencia entre word_frequencies y word_frequencies_list:', {
                missingInList: missingInList.slice(0, 5),
                missingInDict: missingInDict.slice(0, 5)
            });
            // Solo advertir, no lanzar error ya que los datos siguen siendo utilizables
        }

        // Validación de números en metadata
        if (data.metadata.total_words < 0 || 
            data.metadata.unique_words < 0 || 
            data.metadata.top_words_count < 0) {
            console.error('❌ Números negativos en metadata:', {
                total_words: data.metadata.total_words,
                unique_words: data.metadata.unique_words,
                top_words_count: data.metadata.top_words_count
            });
            throw new Error('Los números en metadata no pueden ser negativos');
        }

        // Validación de coherencia en los números
        if (data.metadata.unique_words > data.metadata.total_words) {
            console.warn('⚠️ Palabras únicas mayor que total de palabras:', {
                unique_words: data.metadata.unique_words,
                total_words: data.metadata.total_words
            });
        }

        // Validación de que la fecha sea válida
        const generatedDate = new Date(data.metadata.generated_at);
        if (isNaN(generatedDate.getTime())) {
            console.warn('⚠️ Fecha de generación inválida:', data.metadata.generated_at);
        }

        console.log('✅ getInstagramCommentsWordCloud completada exitosamente');
        return data;
        
    } catch (error) {
        console.error('💥 Error en getInstagramCommentsWordCloud:', error);
        
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('La petición se agotó el tiempo de espera. Por favor, intenta de nuevo.');
            }
            throw new Error(error.message || 'Ocurrió un error desconocido al obtener el análisis de wordcloud de comentarios de Instagram.');
        } else {
            throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
        }
    }
}