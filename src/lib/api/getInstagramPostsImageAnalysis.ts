// lib/api/getInstagramPostsImageAnalysis.ts

type ColorPalette = {
    rgb: [number, number, number];
    proportion: number;
};

type ImageAnalysis = {
    file_name: string;
    gpt4o_analysis: string;
    color_palette: ColorPalette[];
};

type GetInstagramPostsImageAnalysisResponse = {
    images_analyzed: ImageAnalysis[];
    total_images: number;
    analysis_timestamp: string;
};

type ApiErrorPayload = {
    error?: string | { detail?: string; message?: string; [key: string]: any };
    detail?: string;
    message?: string;
    availableCookies?: string[];
    requestedCompetitorId?: string;
    [key: string]: any;
};

export async function getInstagramPostsImageAnalysis(competitorId: string): Promise<GetInstagramPostsImageAnalysisResponse> {
    console.log('🚀 getInstagramPostsImageAnalysis iniciada con competitor_id:', competitorId);
    
    try {
        if (!competitorId || typeof competitorId !== 'string' || competitorId.trim() === '') {
            console.error('❌ Competitor ID inválido:', competitorId);
            throw new Error('Competitor ID es requerido y debe ser una cadena válida');
        }

        const url = `/api/socialAnalysis/instagram/imagesAnalysis/getInstagramPostsImageAnalysis?competitor_id=${encodeURIComponent(competitorId.trim())}`;
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
                        errorMessage = `No se encontraron imágenes con análisis para el competitor ID "${competitorId}" o el competitor ID no existe`;
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
        const data: GetInstagramPostsImageAnalysisResponse = await response.json();
        
        const totalImages = data.total_images || 0;
        const analyzedImages = data.images_analyzed?.length || 0;
        const analysisTimestamp = data.analysis_timestamp || 'N/A';
        
        const topImages = data.images_analyzed?.slice(0, 3) || [];
        
        console.log('✅ Datos parseados exitosamente:', {
            competitorId: competitorId,
            totalImages: totalImages,
            analyzedImages: analyzedImages,
            analysisTimestamp: analysisTimestamp,
            topImages: topImages.map(img => ({
                fileName: img.file_name,
                hasAnalysis: !!img.gpt4o_analysis,
                colorsCount: img.color_palette?.length || 0
            }))
        });
        
        // Debug log para la estructura de datos
        console.log('🔍 Data structure:', {
            hasImagesAnalyzed: !!data.images_analyzed,
            hasTotalImages: !!data.total_images,
            hasAnalysisTimestamp: !!data.analysis_timestamp,
            imagesAnalyzedType: typeof data.images_analyzed,
            totalImagesType: typeof data.total_images,
            analysisTimestampType: typeof data.analysis_timestamp
        });
        
        // Validación básica de la respuesta
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            console.error('❌ Respuesta no válida:', data);
            throw new Error('La respuesta del servidor no contiene datos de análisis de imágenes válidos');
        }

        // Validación de images_analyzed
        if (!data.images_analyzed || !Array.isArray(data.images_analyzed)) {
            console.error('❌ images_analyzed no válido:', data.images_analyzed);
            throw new Error('Los datos de imágenes analizadas no son válidos');
        }

        if (data.images_analyzed.length === 0) {
            console.error('❌ No se encontraron imágenes analizadas:', data.images_analyzed);
            throw new Error('No se encontraron imágenes analizadas en la respuesta');
        }

        // Validación de total_images
        if (typeof data.total_images !== 'number' || data.total_images < 0) {
            console.error('❌ total_images no válido:', data.total_images);
            throw new Error('El total de imágenes no es válido');
        }

        // Validación de analysis_timestamp
        if (!data.analysis_timestamp || typeof data.analysis_timestamp !== 'string') {
            console.error('❌ analysis_timestamp no válido:', data.analysis_timestamp);
            throw new Error('El timestamp del análisis no es válido');
        }

        // Validación de que la fecha sea válida
        const analysisDate = new Date(data.analysis_timestamp);
        if (isNaN(analysisDate.getTime())) {
            console.warn('⚠️ Fecha de análisis inválida:', data.analysis_timestamp);
        }

        // Validación de la estructura de cada imagen analizada
        const invalidImages = data.images_analyzed.filter(image => 
            !image ||
            typeof image !== 'object' ||
            typeof image.file_name !== 'string' ||
            typeof image.gpt4o_analysis !== 'string' ||
            !Array.isArray(image.color_palette) ||
            image.file_name.trim() === '' ||
            image.gpt4o_analysis.trim() === ''
        );

        if (invalidImages.length > 0) {
            console.error('❌ Imágenes inválidas encontradas:', invalidImages.slice(0, 3));
            throw new Error(`Se encontraron ${invalidImages.length} imágenes con estructura inválida`);
        }

        // Validación de color_palette para cada imagen
        const imagesWithInvalidColors = data.images_analyzed.filter(image => {
            return image.color_palette.some(color => 
                !color ||
                typeof color !== 'object' ||
                !Array.isArray(color.rgb) ||
                color.rgb.length !== 3 ||
                typeof color.proportion !== 'number' ||
                color.rgb.some(value => typeof value !== 'number' || value < 0 || value > 255) ||
                color.proportion < 0 ||
                color.proportion > 1 ||
                isNaN(color.proportion)
            );
        });

        if (imagesWithInvalidColors.length > 0) {
            console.error('❌ Imágenes con colores inválidos:', imagesWithInvalidColors.slice(0, 3));
            throw new Error(`Se encontraron ${imagesWithInvalidColors.length} imágenes con paletas de colores inválidas`);
        }

        // Validación de consistencia entre total_images y images_analyzed
        if (data.images_analyzed.length > data.total_images) {
            console.warn('⚠️ Más imágenes analizadas que el total:', {
                analyzed: data.images_analyzed.length,
                total: data.total_images
            });
        }

        // Validación de duplicados en file_name
        const fileNames = data.images_analyzed.map(img => img.file_name);
        const uniqueFileNames = new Set(fileNames);
        if (fileNames.length !== uniqueFileNames.size) {
            console.warn('⚠️ Se encontraron nombres de archivo duplicados');
        }

        // Estadísticas adicionales
        const totalColors = data.images_analyzed.reduce((sum, img) => sum + img.color_palette.length, 0);
        const avgColorsPerImage = data.images_analyzed.length > 0 ? (totalColors / data.images_analyzed.length).toFixed(2) : 0;
        const avgAnalysisLength = data.images_analyzed.length > 0 ? 
            (data.images_analyzed.reduce((sum, img) => sum + img.gpt4o_analysis.length, 0) / data.images_analyzed.length).toFixed(0) : 0;

        console.log('📊 Estadísticas del análisis:', {
            totalColors,
            avgColorsPerImage,
            avgAnalysisLength
        });

        console.log('✅ getInstagramPostsImageAnalysis completada exitosamente');
        return data;
        
    } catch (error) {
        console.error('💥 Error en getInstagramPostsImageAnalysis:', error);
        
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