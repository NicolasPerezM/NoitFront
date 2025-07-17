import type { APIRoute } from 'astro';

export function GET({ request, params }: Parameters<APIRoute>[0]) {
  return (async () => {
    try {
      console.log('🔍 Iniciando petición a Instagram image analysis...');
      
      // Obtener el competitor_id de los parámetros de la URL o query string
      const url = new URL(request.url);
      const competitorId = url.searchParams.get('competitor_id');
      
      console.log('🆔 Competitor ID:', competitorId);
      
      if (!competitorId) {
        console.log('❌ Competitor ID no proporcionado');
        return new Response(
          JSON.stringify({ 
            error: 'Competitor ID es requerido. Usa ?competitor_id=tu_id en la URL' 
          }), 
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Obtener las cookies del request
      const cookieHeader = request.headers.get('cookie');
      console.log('📋 Cookie header:', cookieHeader);
      
      if (!cookieHeader) {
        console.log('❌ No se encontraron cookies');
        return new Response(
          JSON.stringify({ 
            error: 'No se encontraron cookies. Asegúrate de estar autenticado.' 
          }), 
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Parsear las cookies
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
          acc[name] = decodeURIComponent(value);
        }
        return acc;
      }, {} as Record<string, string>);

      const token = cookies.token;
      console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
      console.log('📝 Cookies disponibles:', Object.keys(cookies));

      if (!token) {
        return new Response(
          JSON.stringify({ 
            error: 'Token de autenticación no encontrado',
            availableCookies: Object.keys(cookies),
            message: 'Por favor, inicia sesión nuevamente'
          }), 
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      console.log('🚀 Haciendo petición a API externa...');
      
      // Hacer fetch al endpoint externo con el competitor_id
      const apiUrl = `https://noit.com.co/api/v1/analyze-competitors/instagram-image-analyzer/posts-image-analysis/${competitorId}`;
      console.log('📡 URL de API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Astro-Server/1.0',
        },
      });

      console.log('📡 Respuesta de API externa:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error de API externa:', errorText);
        
        return new Response(
          JSON.stringify({ 
            error: `Error del servidor externo: ${response.status} ${response.statusText}`,
            details: errorText,
            tokenPresent: !!token,
            requestedCompetitorId: competitorId
          }), 
          { 
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      const data = await response.json();
      console.log('✅ Datos recibidos para competitor_id:', competitorId);
      
      // Verificar que la respuesta tenga la estructura esperada para image analysis
      if (!data || typeof data !== 'object') {
        console.log('⚠️ La respuesta no tiene la estructura esperada:', typeof data);
        return new Response(
          JSON.stringify({ 
            error: 'Formato de respuesta inesperado',
            receivedData: data,
            expectedStructure: 'Se esperaba un objeto con images_analyzed, total_images y analysis_timestamp'
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Validar estructura específica del image analysis
      if (!data.images_analyzed || !Array.isArray(data.images_analyzed)) {
        console.log('⚠️ Estructura de image analysis incompleta. Images analyzed:', !!data.images_analyzed);
        return new Response(
          JSON.stringify({ 
            error: 'Estructura de image analysis incompleta',
            receivedKeys: Object.keys(data),
            expectedKeys: ['images_analyzed', 'total_images', 'analysis_timestamp']
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      console.log('✅ Análisis de imágenes de Instagram obtenido exitosamente');
      
      // Log adicional para debug de image analysis
      const { images_analyzed, total_images, analysis_timestamp } = data;
      console.log('📊 Estadísticas del análisis de imágenes:');
      console.log('  - Total de imágenes:', total_images || 0);
      console.log('  - Imágenes analizadas:', images_analyzed?.length || 0);
      console.log('  - Timestamp del análisis:', analysis_timestamp || 'N/A');
      
      // Mostrar información de las primeras imágenes analizadas
      if (images_analyzed && images_analyzed.length > 0) {
        console.log('🖼️ Primeras imágenes analizadas:');
        images_analyzed.slice(0, 3).forEach((image: any, index: number) => {
          console.log(`  ${index + 1}. ${image.file_name || 'Sin nombre'}`);
          console.log(`     - Colores dominantes: ${image.color_palette?.length || 0} colores`);
          console.log(`     - Análisis disponible: ${image.gpt4o_analysis ? 'Sí' : 'No'}`);
        });
      }
      
      // Calcular estadísticas adicionales
      const totalColorsAnalyzed = images_analyzed?.reduce((sum: number, img: any) => 
        sum + (img.color_palette?.length || 0), 0) || 0;
      console.log('🎨 Total de colores analizados:', totalColorsAnalyzed);

      // Devolver los datos tal como vienen de la API externa
      return new Response(
        JSON.stringify(data), 
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );

    } catch (error) {
      console.error('💥 Error en API route:', error);
      
      return new Response(
        JSON.stringify({ 
          error: 'Error interno del servidor',
          details: error instanceof Error ? error.message : 'Error desconocido',
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  })();
}