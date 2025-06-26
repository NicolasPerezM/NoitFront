// pages/api/businessIdea/[id].ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, params }) => {
  try {
    console.log('🔍 Iniciando petición para obtener idea de negocio por ID...');
    
    // Obtener el ID de los parámetros
    const { id } = params;
    console.log('📋 ID solicitado:', id);
    
    if (!id) {
      console.log('❌ ID no proporcionado');
      return new Response(
        JSON.stringify({ 
          error: 'ID requerido. Proporciona un ID válido en la URL.' 
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
    
    // Hacer fetch al endpoint externo con el ID específico
    const response = await fetch(`https://noit.com.co/api/v1/business-idea/${id}`, {
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
      
      // Manejar diferentes tipos de errores
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ 
            error: `Idea de negocio con ID ${id} no encontrada`,
            details: errorText,
            tokenPresent: !!token
          }), 
          { 
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: `Error del servidor externo: ${response.status} ${response.statusText}`,
          details: errorText,
          tokenPresent: !!token
        }), 
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    console.log('✅ Datos recibidos para ID:', id);
    
    // Verificar que data es un objeto válido
    if (!data || typeof data !== 'object') {
      console.log('⚠️ La respuesta no es un objeto válido:', typeof data);
      return new Response(
        JSON.stringify({ 
          error: 'Formato de respuesta inesperado',
          receivedType: typeof data,
          data: data
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Mapear los datos del objeto
    const businessIdea = {
      id: data.id,
      title: data.title || 'Sin título',
      description: data.description || 'Sin descripción',
      website_url: data.website_url || null,
      user_id: data.user_id,
      date: data.created_at 
        ? new Date(data.created_at).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })
        : 'Sin fecha',
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    console.log('✅ Idea de negocio mapeada:', businessIdea.title);

    return new Response(
      JSON.stringify({ businessIdea }), 
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
};