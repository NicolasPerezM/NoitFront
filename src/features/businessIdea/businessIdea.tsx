import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getBusinessIdea } from "@/lib/api/getBusinessIdea";
import { queryClient } from "@/lib/api/queryClient";

export function BusinessIdeaDetail({ id }: { id: string }) {
  console.log('🔍 BusinessIdeaDetail renderizado con ID:', id);
  console.log('🔍 ID válido?', !!id && id.trim() !== '');

  // Debug del queryClient
  console.log('🔧 QueryClient disponible?', !!queryClient);

  const queryConfig = {
    queryKey: ["businessIdea", id],
    queryFn: async () => {
      console.log('🚀 Ejecutando queryFn para ID:', id);
      try {
        const response = await getBusinessIdea(id);
        console.log('✅ Respuesta de getBusinessIdea:', response);
        return response.businessIdea;
      } catch (err) {
        console.error('❌ Error en queryFn:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id && id.trim() !== '',
    retry: 1,
  };

  console.log('⚙️ Query config:', {
    queryKey: queryConfig.queryKey,
    enabled: queryConfig.enabled,
    hasQueryFn: !!queryConfig.queryFn
  });

  const { data, isLoading, error, status } = useQuery(queryConfig, queryClient);

  console.log('📊 Query state:', { 
    isLoading, 
    error: error?.message, 
    hasData: !!data,
    status 
  });

  if (isLoading) return <div>Cargando idea de negocio...</div>;
  
  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return (
      <div className="text-red-500">
        <p>Error al cargar la idea de negocio:</p>
        <p className="text-sm">{errorMessage}</p>
      </div>
    );
  }
  
  if (!data) {
    return <div>No se encontró la idea de negocio.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">{data.title}</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Descripción</h2>
            <p className="text-gray-600 leading-relaxed">{data.description}</p>
          </div>

          {data.website_url && (
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Sitio Web</h2>
              <a 
                href={data.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all"
              >
                {data.website_url}
              </a>
            </div>
          )}

          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-semibold">Fecha de creación:</span>
                <p>{data.date}</p>
              </div>
              <div>
                <span className="font-semibold">ID:</span>
                <p className="font-mono text-xs break-all">{data.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}