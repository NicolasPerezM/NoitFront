// @/lib/api/businessIdea.ts

type BusinessIdeaInput = {
    title?: string;
    description: string;
    website_url?: string;
  };
  
  type BusinessIdeaResponse = {
    title: string;
    description: string;
    website_url: string;
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  };
  
  // Opcional: Define un tipo más específico para la estructura de error esperada de tu API
  // Esto ayuda a extraer el mensaje de error de forma más predecible.
  // Ajusta esto según lo que tu API realmente devuelve en caso de error.
  type ApiErrorPayload = {
    error?: string | { detail?: string; message?: string; [key: string]: any };
    detail?: string;
    message?: string;
    [key: string]: any; // Para capturar otras posibles estructuras de error
  };
  
  export async function businessIdea(input: BusinessIdeaInput): Promise<BusinessIdeaResponse> {
    console.log('[businessIdea] Iniciando fetch con input:', input); // Log inicial
  
    try {
      const response = await fetch('/api/chat/businessIdea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Si necesitas otras cabeceras (como un token CSRF si usas cookies), añádelas aquí.
        },
        credentials: 'include', // Importante para enviar cookies (si la autenticación las usa)
        body: JSON.stringify(input),
      });
  
      console.log('[businessIdea] Respuesta recibida, status:', response.status, 'Status text:', response.statusText); // Log de respuesta
  
      if (!response.ok) {
        // Intentar obtener más detalles del error
        let errorMessage = `Error ${response.status}: ${response.statusText || 'Error desconocido al contactar el servidor'}`; // Mensaje base
        let errorDetails: ApiErrorPayload | string | null = null;
  
        // Intentar leer el cuerpo de la respuesta como JSON
        try {
          // Clonamos la respuesta para poder leerla dos veces si es necesario (json y luego text si json falla)
          // Aunque en este flujo, si json() tiene éxito, es lo que usaremos.
          errorDetails = await response.json();
          console.error('[businessIdea] Error data del servidor (JSON):', errorDetails);
  
          if (errorDetails && typeof errorDetails === 'object') {
            // Intentar extraer un mensaje más específico del payload de error JSON
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
              // Si no hay un campo de mensaje estándar, usar una representación del objeto
              // Evita que errorDetails sea null aquí.
              errorMessage = `Error del servidor: ${JSON.stringify(errorDetails)}`;
            }
          } else if (typeof errorDetails === 'string') {
              // A veces el error puede ser solo una cadena
              errorMessage = errorDetails;
          }
        } catch (jsonError) {
          console.warn('[businessIdea] No se pudo parsear la respuesta de error como JSON:', jsonError);
          // Si falla el parseo JSON, intentar leer como texto plano
          try {
            const textError = await response.text();
            console.error('[businessIdea] Error data del servidor (texto):', textError);
            if (textError) {
              errorMessage = textError; // Usar el texto del error si está disponible
            }
          } catch (textError) {
            console.warn('[businessIdea] No se pudo leer la respuesta de error como texto:', textError);
            // Mantener el errorMessage base si la lectura de texto también falla
          }
        }
  
        // Lanzar un objeto Error estándar con el mensaje construido
        // Esto es lo que capturará el `onError` de `useMutation`
        throw new Error(errorMessage);
      }
  
      // Si la respuesta es OK (2xx)
      console.log("[businessIdea] Respuesta OK, parseando JSON...");
      const data: BusinessIdeaResponse = await response.json();
      console.log("[businessIdea] Datos recibidos exitosamente:", data);
      return data;
  
    } catch (error) {
      // Este catch captura errores de red (ej. servidor no disponible),
      // o los errores que lanzamos explícitamente arriba (new Error(errorMessage)),
      // o cualquier otro error inesperado durante la ejecución de fetch o el procesamiento.
      console.error('[businessIdea] Catch general:', error);
  
      if (error instanceof Error) {
        // Si ya es un objeto Error (lo cual debería ser si vino del bloque !response.ok o es un error de red)
        // Aseguramos que tenga un mensaje, aunque sea genérico.
        // error.message podría ser undefined si se crea un Error sin argumento.
        throw new Error(error.message || 'Ocurrió un error desconocido en la petición.');
      } else {
        // Si por alguna razón 'error' no es una instancia de Error, lo convertimos.
        // Esto es un fallback y no debería ser lo común.
        throw new Error(String(error) || 'Ocurrió un error desconocido y no estándar.');
      }
    }
  }