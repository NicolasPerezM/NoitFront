import type { APIRoute } from 'astro';

export function GET({ request, params }: Parameters<APIRoute>[0]) {
  return (async () => {
    try {
      console.log('🔍 Iniciando petición a Instagram feed analysis...');
      
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
      const apiUrl = `https://noit.com.co/api/v1/analyze-competitors/instagram-image-analyzer/feed-analysis/${competitorId}`;
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
      
      // Verificar que la respuesta tenga la estructura esperada para feed analysis
      if (!data || typeof data !== 'object') {
        console.log('⚠️ La respuesta no tiene la estructura esperada:', typeof data);
        return new Response(
          JSON.stringify({ 
            error: 'Formato de respuesta inesperado',
            receivedData: data,
            expectedStructure: 'Se esperaba un objeto con global_analysis, batch_analyses y detailed_posts'
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Validar estructura específica del feed analysis
      if (!data.global_analysis || !data.batch_analyses || !Array.isArray(data.batch_analyses)) {
        console.log('⚠️ Estructura de feed analysis incompleta. Global analysis:', !!data.global_analysis, 'Batch analyses:', !!data.batch_analyses);
        return new Response(
          JSON.stringify({ 
            error: 'Estructura de feed analysis incompleta',
            receivedKeys: Object.keys(data),
            expectedKeys: ['global_analysis', 'batch_analyses', 'detailed_posts']
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      console.log('✅ Análisis de feed de Instagram obtenido exitosamente');
      
      // Log adicional para debug de feed analysis
      const { global_analysis, batch_analyses, detailed_posts } = data;
      console.log('📊 Estadísticas del análisis de feed:');
      console.log('  - Total de posts analizados:', global_analysis?.total_posts_analyzed || 0);
      console.log('  - Total de lotes:', global_analysis?.total_batches || 0);
      console.log('  - Modelo usado:', global_analysis?.model_used || 'N/A');
      console.log('  - Lotes de análisis:', batch_analyses?.length || 0);
      console.log('  - Posts detallados:', detailed_posts?.length || 0);
      
      // Mostrar información de los primeros lotes analizados
      if (batch_analyses && batch_analyses.length > 0) {
        console.log('📝 Primeros lotes analizados:');
        batch_analyses.slice(0, 2).forEach((batch: any, index: number) => {
          console.log(`  Lote ${batch.batch_number || index + 1}:`);
          console.log(`     - Posts en el lote: ${batch.post_ids?.length || 0}`);
          console.log(`     - Modelo usado: ${batch.model_used || 'N/A'}`);
          console.log(`     - Análisis disponible: ${batch.analysis ? 'Sí' : 'No'}`);
        });
      }
      
      // Mostrar información de los posts detallados
      if (detailed_posts && detailed_posts.length > 0) {
        console.log('📱 Primeros posts detallados:');
        detailed_posts.slice(0, 3).forEach((post: any, index: number) => {
          console.log(`  ${index + 1}. Post ID: ${post.post_id || 'Sin ID'}`);
          console.log(`     - Caption disponible: ${post.caption ? 'Sí' : 'No'}`);
          console.log(`     - Imagen disponible: ${post.object_path ? 'Sí' : 'No'}`);
        });
      }
      
      // Calcular estadísticas adicionales
      const totalPostsInBatches = batch_analyses?.reduce((sum: number, batch: any) => 
        sum + (batch.post_ids?.length || 0), 0) || 0;
      console.log('📈 Total de posts en lotes:', totalPostsInBatches);

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