import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getBusinessIdeas } from "@/lib/api/getBusinessIdeas";
import { queryClient } from "@/lib/api/queryClient"

export function BusinessIdeaDetail({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["businessIdea", id],
    queryFn: async () => {
      const all = await getBusinessIdeas();
      return all.projects.find((p) => String(p.id) === String(id));
    },
    staleTime: 5 * 60 * 1000,
  }, queryClient);

  if (isLoading) return <div>Cargando... putos</div>;
  if (error || !data) return <div>No se encontró la idea de negocio.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
      <p>{data.description}</p>
      {/* Agrega más campos según la estructura de tu API */}
    </div>
  );
}