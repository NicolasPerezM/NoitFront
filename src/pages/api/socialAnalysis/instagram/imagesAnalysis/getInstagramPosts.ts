import type { APIRoute } from 'astro';

export function GET({ request, params }: Parameters<APIRoute>[0]) {
  return (async () => {
    try {
      console.log('🔍 Iniciando petición a Instagram posts...');
      
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
      const apiUrl = `https://noit.com.co/api/v1/analyze-competitors/instagram-image-analyzer/img-posts/${competitorId}`;
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
      
      // Verificar que la respuesta sea un array de posts
      if (!Array.isArray(data)) {
        console.log('⚠️ La respuesta no es un array:', typeof data);
        return new Response(
          JSON.stringify({ 
            error: 'Formato de respuesta inesperado',
            receivedData: data,
            expectedStructure: 'Se esperaba un array de posts de Instagram'
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Validar estructura de los posts
      if (data.length === 0) {
        console.log('⚠️ No se encontraron posts para este competidor');
        return new Response(
          JSON.stringify({ 
            posts: [],
            message: 'No se encontraron posts para este competidor',
            competitorId
          }), 
          { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Validar estructura del primer post para asegurar que sea válida
      const firstPost = data[0];
      const requiredFields = ['id', 'type', 'shortCode', 'url'];
      const missingFields = requiredFields.filter(field => !firstPost[field]);
      
      if (missingFields.length > 0) {
        console.log('⚠️ Estructura de post incompleta. Campos faltantes:', missingFields);
        return new Response(
          JSON.stringify({ 
            error: 'Estructura de posts incompleta',
            missingFields,
            receivedKeys: Object.keys(firstPost),
            expectedKeys: requiredFields
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      console.log('✅ Posts de Instagram obtenidos exitosamente');
      
      // Log estadísticas de los posts
      console.log('📊 Estadísticas de posts:');
      console.log('  - Total de posts:', data.length);
      console.log('  - Tipos de posts:', [...new Set(data.map((post: any) => post.type))]);
      
      // Calcular estadísticas adicionales
      const totalLikes = data.reduce((sum: number, post: any) => sum + (post.likesCount || 0), 0);
      const totalComments = data.reduce((sum: number, post: any) => sum + (post.commentsCount || 0), 0);
      const postsWithHashtags = data.filter((post: any) => post.hashtags && post.hashtags.length > 0).length;
      const postsWithImages = data.filter((post: any) => post.images && post.images.length > 0).length;
      
      console.log('📈 Estadísticas adicionales:');
      console.log('  - Total de likes:', totalLikes);
      console.log('  - Total de comentarios:', totalComments);
      console.log('  - Posts con hashtags:', postsWithHashtags);
      console.log('  - Posts con imágenes:', postsWithImages);
      
      // Mostrar información de los primeros posts
      if (data.length > 0) {
        console.log('📱 Primeros posts:');
        data.slice(0, 3).forEach((post: any, index: number) => {
          console.log(`  ${index + 1}. ${post.shortCode || 'Sin shortCode'}`);
          console.log(`     - Tipo: ${post.type || 'N/A'}`);
          console.log(`     - Likes: ${post.likesCount || 0}`);
          console.log(`     - Comentarios: ${post.commentsCount || 0}`);
          console.log(`     - Hashtags: ${post.hashtags?.length || 0}`);
          console.log(`     - Imágenes: ${post.images?.length || 0}`);
        });
      }

      // Devolver los datos tal como vienen de la API externa
      return new Response(
        JSON.stringify({
          posts: data,
          metadata: {
            totalPosts: data.length,
            totalLikes,
            totalComments,
            postsWithHashtags,
            postsWithImages,
            competitorId,
            timestamp: new Date().toISOString()
          }
        }), 
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