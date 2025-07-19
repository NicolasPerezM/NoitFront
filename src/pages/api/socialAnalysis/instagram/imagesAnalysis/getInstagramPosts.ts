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
      
      // Hacer fetch al endpoint externo con el competitor_id para obtener posts
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
      
      // Verificar que la respuesta tenga la estructura esperada para posts de Instagram
      if (!data || typeof data !== 'object') {
        console.log('⚠️ La respuesta no tiene la estructura esperada:', typeof data);
        return new Response(
          JSON.stringify({ 
            error: 'Formato de respuesta inesperado',
            receivedData: data,
            expectedStructure: 'Se esperaba un objeto con información de posts de Instagram'
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // Validar si es un post individual o un array de posts
      let posts = [];
      
      if (Array.isArray(data)) {
        // Si es un array directo de posts
        posts = data;
      } else if (data.id && data.type) {
        // Si es un post individual
        posts = [data];
      } else if (data.posts && Array.isArray(data.posts)) {
        // Si viene envuelto en un objeto con propiedad posts
        posts = data.posts;
      } else {
        // Intentar encontrar posts en otras propiedades comunes
        const possiblePostsKeys = ['data', 'items', 'content', 'results'];
        const postsKey = possiblePostsKeys.find(key => 
          data[key] && Array.isArray(data[key])
        );
        
        if (postsKey) {
          posts = data[postsKey];
        } else {
          console.log('⚠️ No se pudieron identificar posts en la respuesta');
          console.log('🔍 Claves disponibles:', Object.keys(data));
        }
      }

      // Validar estructura de posts individuales
      const validPosts = posts.filter((post: any) => {
        const hasRequiredFields = post && 
          typeof post.id === 'string' && 
          typeof post.type === 'string';
        
        if (!hasRequiredFields) {
          console.log('⚠️ Post inválido encontrado:', {
            id: post?.id,
            type: post?.type,
            hasId: !!post?.id,
            hasType: !!post?.type
          });
        }
        
        return hasRequiredFields;
      });

      // Procesar y limpiar datos de posts
      const processedPosts = validPosts.map((post: any) => {
        // Procesar comentarios si existen
        if (post.latestComments && Array.isArray(post.latestComments)) {
          post.latestComments = post.latestComments.filter((comment: any) => 
            comment && 
            typeof comment.id === 'string' && 
            typeof comment.text === 'string' &&
            comment.owner && 
            typeof comment.owner.username === 'string'
          );
          
          // Procesar replies en comentarios
          post.latestComments = post.latestComments.map((comment: any) => ({
            ...comment,
            replies: Array.isArray(comment.replies) 
              ? comment.replies.filter((reply: any) => 
                  reply && 
                  typeof reply.id === 'string' && 
                  typeof reply.text === 'string'
                )
              : []
          }));
        }

        // Limpiar URLs rotas o inválidas
        const cleanUrl = (url: string) => {
          if (!url || typeof url !== 'string') return '';
          try {
            new URL(url);
            return url;
          } catch {
            return '';
          }
        };

        return {
          ...post,
          url: cleanUrl(post.url),
          latestComments: post.latestComments || []
        };
      });

      console.log('✅ Posts de Instagram obtenidos exitosamente');
      
      // Log estadísticas de los posts
      console.log('📊 Estadísticas de posts:');
      console.log('  - Total de posts recibidos:', posts.length);
      console.log('  - Posts válidos:', validPosts.length);
      console.log('  - Posts procesados:', processedPosts.length);
      
      // Mostrar información de los primeros posts
      if (processedPosts.length > 0) {
        console.log('📱 Primeros posts:');
        processedPosts.slice(0, 3).forEach((post: any, index: number) => {
          console.log(`  ${index + 1}. Post ID: ${post.id || 'Sin ID'}`);
          console.log(`     - Tipo: ${post.type || 'N/A'}`);
          console.log(`     - Short Code: ${post.shortCode || 'N/A'}`);
          console.log(`     - Caption disponible: ${post.caption ? 'Sí' : 'No'}`);
          console.log(`     - Comentarios: ${post.commentsCount || 0}`);
          console.log(`     - Comentarios recientes: ${post.latestComments?.length || 0}`);
          console.log(`     - URL: ${post.url ? 'Sí' : 'No'}`);
          
          // Información de hashtags y menciones
          if (post.hashtags && post.hashtags.length > 0) {
            console.log(`     - Hashtags: ${post.hashtags.length}`);
          }
          if (post.mentions && post.mentions.length > 0) {
            console.log(`     - Menciones: ${post.mentions.length}`);
          }
        });
      }
      
      // Calcular estadísticas adicionales
      const totalComments = processedPosts.reduce((sum: number, post: any) => 
        sum + (post.commentsCount || 0), 0);
      console.log('💬 Total de comentarios en todos los posts:', totalComments);

      const postsWithComments = processedPosts.filter((post: any) => 
        post.latestComments && post.latestComments.length > 0
      ).length;
      console.log('💭 Posts con comentarios recientes:', postsWithComments);

      // Contar posts por tipo
      const postsByType = processedPosts.reduce((acc: Record<string, number>, post: any) => {
        const type = post.type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      console.log('📈 Posts por tipo:', postsByType);

      // Devolver los datos procesados
      return new Response(
        JSON.stringify({
          success: true,
          totalPosts: processedPosts.length,
          posts: processedPosts,
          statistics: {
            totalComments,
            postsWithComments,
            postsByType
          },
          timestamp: new Date().toISOString()
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
