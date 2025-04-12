"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ThumbsUp, Star, Info, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import AnalysisDialog from "../commentsAnalyzer/AnalysisDialog.tsx";

interface Post {
  id: string;
  imageUrl: string;
  rating: number;
  likes: number;
  comments: number;
  insight: string;
  title: string;
}

const posts: Post[] = [
  {
    id: "1",
    imageUrl: "/data/3dc49cee2e13559e70a1edab1858771e.jpeg",
    rating: 4.5,
    likes: 73,
    comments: 3,
    title: "Concurso JK DREAMERS",
    insight:
      '**CTA Recomendado vs CTA del Post:** - **Imagen:** Sugiere una rutina AM para obtener un "GLOW". - **Post:** "Desliza para conocer la rutina AM y PM, con nuestro Kit Ritual 21 Días." - **Análisis:** El CTA del post es consistente con la imagen, ya que ambos enfatizan la rutina de cuidado facial. Sin embargo, el post podría ser más específico sobre el beneficio del "glow" que se menciona en la imagen.',
  },
  {
    id: "2",
    imageUrl: "/data/5d8fb97a8ceb691cdbd926217c029701.jpeg",
    rating: 4.5,
    likes: 65,
    comments: 5,
    title: "Rutina AM para el GLOW",
    insight:
      "**Colores de la Imagen vs Mensaje del Post:** - **Imagen:** Paleta neutra que transmite calma y sofisticación. - **Post:** Enfocado en cuidado y transformación de la piel. - **Análisis:** La paleta de colores suaves y neutros refuerza el mensaje de cuidado delicado de la piel, creando una coherencia visual-textual efectiva.",
  },
  {
    id: "3",
    imageUrl: "/data/774a725701ce6eb078b4b3d1fe4c5348.jpeg",
    rating: 4.5,
    likes: 89,
    comments: 7,
    title: "Kit Ritual 21 Días",
    insight:
      "**Composición Visual vs Mensaje:** - **Imagen:** Muestra el producto aplicado en la piel con un acabado brillante. - **Post:** Habla sobre resultados visibles en 21 días. - **Análisis:** La imagen muestra el resultado final (piel luminosa) mientras que el texto explica el proceso para lograrlo, creando una narrativa completa de problema-solución.",
  },
  {
    id: "4",
    imageUrl: "/data/74829a8a5f44228a1c976b49dcde22ff.jpeg",
    rating: 4.5,
    likes: 54,
    comments: 2,
    title: "Serum Facial",
    insight:
      "**Engagement vs Tipo de Contenido:** - **Imagen:** Muestra múltiples productos en mano. - **Post:** Explica beneficios de cada producto. - **Análisis:** Las publicaciones que muestran múltiples productos juntos generan menos engagement que las que se centran en un solo producto estrella. Recomendación: Destacar un producto por publicación.",
  },
  {
    id: "5",
    imageUrl: "/data/ad91b300ace666c49adef8b341594b9e.jpeg",
    rating: 4.5,
    likes: 92,
    comments: 8,
    title: "Dúo Hidratante",
    insight:
      "**Estilo Visual vs Audiencia:** - **Imagen:** Estilo minimalista con fondo neutro. - **Post:** Lenguaje técnico sobre ingredientes. - **Análisis:** El estilo visual atrae a un público que valora la estética minimalista, pero el lenguaje técnico puede alienar a parte de esta audiencia. Recomendación: Mantener el estilo visual pero simplificar el lenguaje.",
  },
  {
    id: "6",
    imageUrl: "/data/ad91b300ace666c49adef8b341594b9e.jpeg",
    rating: 4.5,
    likes: 67,
    comments: 4,
    title: "Rutina Nocturna",
    insight:
      "**Temporalidad del Contenido:** - **Imagen:** Muestra rutina nocturna. - **Post:** Publicado a las 8 AM. - **Análisis:** Las publicaciones sobre rutinas nocturnas generan mayor engagement cuando se publican en la tarde/noche. Recomendación: Alinear el contenido con el momento del día en que la audiencia está pensando en ese tipo de rutina.",
  },
  {
    id: "7",
    imageUrl: "/data/c5213c928a54051921ce726817234f5d.jpeg",
    rating: 4.5,
    likes: 78,
    comments: 6,
    title: "Mascarilla Exfoliante",
    insight:
      '**Llamado a la Acción:** - **Imagen:** Muestra resultado después de usar el producto. - **Post:** No incluye CTA claro. - **Análisis:** Las imágenes de "antes y después" generan curiosidad, pero sin un CTA claro, se pierde la oportunidad de conversión. Recomendación: Incluir CTA específico como "Consigue tu transformación en el link de bio".',
  },
  {
    id: "8",
    imageUrl: "/data/d03bdf0ae811eae983f8a39cecd86b8b.jpeg",
    rating: 4.5,
    likes: 45,
    comments: 1,
    title: "Protector Solar",
    insight:
      "**Estacionalidad del Contenido:** - **Imagen:** Protector solar. - **Post:** Publicado en invierno. - **Análisis:** El contenido sobre protección solar genera menos engagement en invierno. Recomendación: Adaptar el mensaje para enfatizar la importancia del protector solar todo el año, no solo en verano.",
  },
  {
    id: "9",
    imageUrl: "/data/dfc5895f5f6953cf95cf4fbc03333f36.jpeg",
    rating: 4.5,
    likes: 83,
    comments: 9,
    title: "Limpiador Facial",
    insight:
      "**Formato de Contenido:** - **Imagen:** Foto de producto. - **Post:** Texto informativo. - **Análisis:** Las fotos de producto generan menos engagement que los videos demostrativos. Recomendación: Convertir este tipo de contenido en videos cortos mostrando la aplicación y textura del producto.",
  },
];

export default function InstagramPostDashboard() {
  const [selectedPost, setSelectedPost] = useState<Post>(posts[0]);

  return (
    <div className="p-4 space-y-6">
      <header className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-syne tracking-tight text-foreground">
            Análisis de Posts de Instagram
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Análisis detallado de 9 posts para optimizar tu estrategia de
            contenido
          </p>
        </div>
        <div className="flex">
          <AnalysisDialog />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vista de miniaturas */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-md h-full bg-white dark:bg-sidebar">
            <CardContent className=" h-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-full w-full overflow-y-auto">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={cn(
                      "relative group cursor-pointer overflow-hidden aspect-square rounded-lg border min-h-[200px] w-full shadow-md",
                      selectedPost.id === post.id
                        ? "border-chart-2 ring-1 ring-chart-2"
                        : "border-none"
                    )}
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Overlay completo al hacer hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs flex flex-col justify-end p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="truncate font-medium text-sm">
                          {post.title}
                        </span>
                        <Badge className="bg-amber-500 text-white px-2 py-0.5 text-xs">
                          <Star className="h-3 w-3 mr-1 fill-white" />
                          {post.rating}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-white">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {post.likes}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post.comments}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalle del post seleccionado */}
        <div className="space-y-4">
          <Card className="h-full border-none shadow-md">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center gap-2 font-syne">
                    <Sparkles className="h-5 w-5 text-muted-foreground " />{" "}
                    Análisis a Profundidad
                  </h2>
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground border-muted-foreground bg-muted-foreground/10"
                  >
                    Post #{selectedPost.id}
                  </Badge>
                </div>

                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full aspect-square object-cover rounded-lg shadow-md"
                />

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {selectedPost.title}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" /> {selectedPost.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />{" "}
                      {selectedPost.comments}
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="insight" className="w-full">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="insight">Insight</TabsTrigger>
                  <TabsTrigger value="recommendations">
                    Recomendaciones
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="insight" className="mt-4">
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4 text-sm text-muted-foreground">
                      {selectedPost.insight.split("-").map((part, index) => (
                        <div key={index} className="flex gap-2">
                          <Info className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                          <p
                            className={
                              index === 0 ? "font-semibold text-foreground" : ""
                            }
                          >
                            {part.trim()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="recommendations" className="mt-4">
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex gap-2">
                        <Sparkles className="h-5 w-5 text-rose-500 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-medium text-foreground mb-2">
                            Mejoras Recomendadas
                          </h4>
                          <ul className="list-inside list-disc space-y-2">
                            <li>
                              Optimizar el CTA para enfatizar los beneficios
                              mostrados en la imagen
                            </li>
                            <li>
                              Mantener coherencia entre la paleta de colores y
                              el mensaje del texto
                            </li>
                            <li>
                              Publicar contenido en el momento del día más
                              relevante para la audiencia
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
