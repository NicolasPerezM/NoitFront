import type { APIRoute } from 'astro';

export function GET({ request, params }: Parameters<APIRoute>[0]) {
  return (async () => {
    try {
      console.log('🔍 Iniciando petición a Instagram image analysis report...');
      
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
      const apiUrl = `https://noit.com.co/api/v1/analyze-competitors/instagram-image-analyzer/image-analysis-report/${competitorId}`;
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
      
      // Verificar que la respuesta tenga la estructura esperada para image analysis report
      if (!data || typeof data !== 'object') {
        console.log('⚠️ La respuesta no tiene la estructura esperada:', typeof data);
        return new Response(
          JSON.stringify({ 
            error: 'Formato de respuesta inesperado',
            receivedData: data,
            expectedStructure: 'Se esperaba un objeto con username, total_posts_analyzed y posts_analyzed'
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Validar estructura específica del image analysis report
      if (!data.username || !data.posts_analyzed || !Array.isArray(data.posts_analyzed)) {
        console.log('⚠️ Estructura de image analysis report incompleta. Username:', !!data.username, 'Posts analyzed:', !!data.posts_analyzed);
        return new Response(
          JSON.stringify({ 
            error: 'Estructura de image analysis report incompleta',
            receivedKeys: Object.keys(data),
            expectedKeys: ['username', 'total_posts_analyzed', 'posts_analyzed']
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Filtrar imágenes inválidas y posts sin imágenes válidas
      if (data.posts_analyzed && Array.isArray(data.posts_analyzed)) {
        data.posts_analyzed = data.posts_analyzed
          .map((post: any) => ({
            ...post,
            images: Array.isArray(post.images)
              ? post.images.filter((img: any) =>
                  img &&
                  typeof img === 'object' &&
                  typeof img.file_name === 'string' && img.file_name.trim() !== '' &&
                  typeof img.object_path === 'string' && img.object_path.trim() !== '' &&
                  typeof img.gpt4o_analysis === 'string' &&
                  Array.isArray(img.color_palette)
                )
              : [],
          }))
          .filter((post: any) => post.images.length > 0);
      }

      console.log('✅ Reporte de análisis de imágenes de Instagram obtenido exitosamente');
      
      // Log adicional para debug de image analysis report
      const { username, total_posts_analyzed, posts_analyzed } = data;
      console.log('📊 Estadísticas del reporte de análisis de imágenes:');
      console.log('  - Username:', username || 'N/A');
      console.log('  - Total de posts analizados:', total_posts_analyzed || 0);
      console.log('  - Posts con análisis:', posts_analyzed?.length || 0);
      
      // Mostrar información de los primeros posts analizados
      if (posts_analyzed && posts_analyzed.length > 0) {
        console.log('📱 Primeros posts analizados:');
        posts_analyzed.slice(0, 3).forEach((post: any, index: number) => {
          console.log(`  ${index + 1}. Post ID: ${post.post_id || 'Sin ID'}`);
          console.log(`     - Tipo: ${post.post_type || 'N/A'}`);
          console.log(`     - Caption disponible: ${post.caption ? 'Sí' : 'No'}`);
          console.log(`     - Imágenes: ${post.images?.length || 0}`);
          
          // Mostrar información de la primera imagen si existe
          if (post.images && post.images.length > 0) {
            const firstImage = post.images[0];
            console.log(`     - Primera imagen: ${firstImage.file_name || 'Sin nombre'}`);
            console.log(`     - Análisis GPT-4V disponible: ${firstImage.gpt4o_analysis ? 'Sí' : 'No'}`);
            console.log(`     - Paleta de colores: ${firstImage.color_palette?.length || 0} colores`);
          }
        });
      }
      
      // Calcular estadísticas adicionales
      const totalImagesAnalyzed = posts_analyzed?.reduce((sum: number, post: any) => 
        sum + (post.images?.length || 0), 0) || 0;
      console.log('📸 Total de imágenes analizadas:', totalImagesAnalyzed);

      // Contar posts con análisis GPT-4V
      const postsWithGptAnalysis = posts_analyzed?.filter((post: any) => 
        post.images?.some((img: any) => img.gpt4o_analysis)
      ).length || 0;
      console.log('🤖 Posts con análisis GPT-4V:', postsWithGptAnalysis);

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