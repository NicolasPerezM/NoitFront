// pages/api/socialAnalysis/instagram/getInstagramStatistics.ts
import type { APIRoute } from 'astro';

export function GET({ request, params }: Parameters<APIRoute>[0]) {
  return (async () => {
    try {
      console.log('🔍 Iniciando petición a Instagram statistics...');
      
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
      const apiUrl = `https://noit.com.co/api/v1/analyze-competitors/instagram-statistics/statistics/${competitorId}`;
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
      console.log('📊 Estadísticas obtenidas - Followers:', data?.total_followers || 0);
      console.log('📊 Estadísticas obtenidas - Posts:', data?.total_posts || 0);
      console.log('📊 Top posts encontrados:', data?.top_posts?.length || 0);
      
      // Verificar que la respuesta tenga la estructura esperada
      if (!data || typeof data.total_followers === 'undefined') {
        console.log('⚠️ La respuesta no tiene la estructura esperada:', typeof data);
        return new Response(
          JSON.stringify({ 
            error: 'Formato de respuesta inesperado',
            receivedData: data,
            expectedStructure: 'Se esperaba un objeto con propiedades como total_followers, total_posts, etc.'
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      console.log('✅ Estadísticas de Instagram obtenidas exitosamente');
      console.log('📈 Engagement rate promedio:', data.avg_engagement_rate);

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