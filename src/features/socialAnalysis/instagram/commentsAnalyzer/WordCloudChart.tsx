import React, { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import InfoPopover from "../../../../components/common/InfoPopover";
import { useQuery } from "@tanstack/react-query";
import { getInstagramCommentsWordCloud } from "@/lib/api/getInstagramCommentsWordCloud";
import { queryClient } from "@/lib/api/queryClient";
import { Loader2 } from "lucide-react";
import * as d3 from "d3";
import cloud from "d3-cloud";

interface WordCloudChartProps {
  competitorId: string;
}

export default function WordCloudChart({ competitorId }: WordCloudChartProps) {
  const {
    data: wordCloudData,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["instagramCommentsWordCloud", competitorId],
      queryFn: () => getInstagramCommentsWordCloud(competitorId),
      enabled: !!competitorId,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  );

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!wordCloudData || !wordCloudData.word_frequencies_list || isLoading || error) return;
    
    const words = wordCloudData.word_frequencies_list.slice(0, 85); // Optimizar para mejor renderizado
    
    // Dimensiones responsive
    const container = svgRef.current?.parentElement;
    const width = container?.clientWidth || 800;
    const height = container?.clientHeight || 450;
    
    // Escalas responsive
    const minFont = Math.max(12, width * 0.018);
    const maxFont = Math.min(width * 0.1, height * 0.15);
    
    const maxFreq = d3.max(words, (d: any) => d.frequency) || 1;
    const minFreq = d3.min(words, (d: any) => d.frequency) || 1;
    
    // Escala de fuente con curva suave
    const fontScale = d3.scalePow()
      .exponent(0.7)
      .domain([minFreq, maxFreq])
      .range([minFont, maxFont]);

    // Paleta de colores moderna y vibrante
    const colorPalette = [
      "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
      "#06b6d4", "#3b82f6", "#f97316", "#ef4444", "#84cc16",
      "#a855f7", "#14b8a6", "#f59e0b", "#6366f1", "#8b5cf6",
      "#fb7185", "#34d399", "#fbbf24", "#60a5fa", "#c084fc"
    ];

    // Limpia el SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Crear SVG con mejor configuración
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("background", "transparent");

    // Definir gradientes y filtros
    const defs = svg.append("defs");
    
    // Gradiente radial sutil para fondo
    const bgGradient = defs.append("radialGradient")
      .attr("id", "backgroundGradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "70%");
    
    bgGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f8fafc")
      .attr("stop-opacity", 0.3);
    
    bgGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#e2e8f0")
      .attr("stop-opacity", 0.1);

    // Filtro de sombra personalizado
    const dropShadow = defs.append("filter")
      .attr("id", "dropShadow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    dropShadow.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 2);

    dropShadow.append("feOffset")
      .attr("dx", 0)
      .attr("dy", 2)
      .attr("result", "offset");

    dropShadow.append("feFlood")
      .attr("flood-color", "#000000")
      .attr("flood-opacity", 0.15);

    dropShadow.append("feComposite")
      .attr("in2", "offset")
      .attr("operator", "in");

    const feMerge = dropShadow.append("feMerge");
    feMerge.append("feMergeNode");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Fondo con gradiente
    

    // Configurar el layout de d3-cloud mejorado
    const layout = cloud()
      .size([width - 40, height - 40]) // Padding para evitar cortes
      .words(words.map((w: any, i: number) => ({
        text: w.word,
        size: fontScale(w.frequency),
        frequency: w.frequency,
        color: colorPalette[i % colorPalette.length],
        index: i,
      })))
      .padding(6) // Más padding para mejor separación
      .rotate(() => {
        const rand = Math.random();
        if (rand > 0.7) return 90;
        if (rand > 0.85) return -90;
        if (rand > 0.95) return 45;
        return 0;
      })
      .font("system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif")
      .fontWeight((d: any) => d.size > maxFont * 0.6 ? "700" : "600")
      .fontSize((d: any) => d.size as number)
      .spiral("archimedean") // Espiral más uniforme
      .on("end", draw);

    layout.start();

    function draw(words: any[]) {
      const textGroup = svg.append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);

      const textElements = textGroup.selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .text((d: any) => d.text)
        .attr("font-size", 0) // Comenzar invisible para animación
        .attr("fill", (d: any) => d.color)
        .attr("font-family", "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif")
        .attr("font-weight", (d: any) => d.size > maxFont * 0.6 ? "700" : "600")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("opacity", 0)
        .attr("transform", (d: any) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .style("cursor", "pointer")
        .style("filter", "url(#dropShadow)")
        .style("transition", "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)");

      // Animación de entrada escalonada
      textElements
        .transition()
        .duration(1200)
        .delay((d: any, i: number) => i * 60)
        .ease(d3.easeBackOut.overshoot(1.2))
        .attr("font-size", (d: any) => d.size)
        .attr("opacity", 0.9);

      // Efectos hover mejorados
      textElements
        .on("mouseover", function(event, d: any) {
          const element = d3.select(this);
          
          // Destacar elemento actual
          element
            .transition()
            .duration(200)
            .ease(d3.easeQuadOut)
            .attr("opacity", 1)
            .attr("font-size", d.size * 1.2)
            .attr("fill", d3.color(d.color).brighter(0.4))
            .style("filter", "url(#dropShadow) brightness(1.1)");

          // Atenuar otros elementos
          textElements
            .filter(function() { return this !== element.node(); })
            .transition()
            .duration(200)
            .attr("opacity", 0.4);
        })
        .on("mouseout", function(event, d: any) {
          // Restaurar elemento actual
          d3.select(this)
            .transition()
            .duration(250)
            .ease(d3.easeQuadInOut)
            .attr("opacity", 0.9)
            .attr("font-size", d.size)
            .attr("fill", d.color)
            .style("filter", "url(#dropShadow)");

          // Restaurar todos los elementos
          textElements
            .transition()
            .duration(250)
            .attr("opacity", 0.9);
        })
        .on("click", function(event, d: any) {
          // Efecto de click con animación de pulso
          d3.select(this)
            .transition()
            .duration(150)
            .ease(d3.easeQuadOut)
            .attr("font-size", d.size * 1.3)
            .transition()
            .duration(150)
            .ease(d3.easeQuadIn)
            .attr("font-size", d.size);
        });

      // Tooltips mejorados
      textElements.append("title")
        .text((d: any) => `"${d.text}"\nFrecuencia: ${d.frequency}\nTamaño: ${Math.round(d.size)}px`);

      // Animación de respiración para palabras importantes
      const importantWords = textElements.filter((d: any) => d.size > maxFont * 0.7);
      
      function breathe() {
        importantWords
          .transition()
          .duration(4000)
          .ease(d3.easeSinInOut)
          .attr("opacity", 0.7)
          .transition()
          .duration(4000)
          .ease(d3.easeSinInOut)
          .attr("opacity", 0.95)
          .on("end", breathe);
      }
      
      // Iniciar animación de respiración después de la carga
      setTimeout(breathe, 2000);
    }
  }, [wordCloudData, isLoading, error]);

  if (isLoading) {
    return (
      <Card className="h-full w-full bg-background border border-border flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-primary/20 animate-pulse"></div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Generando nube de palabras</p>
            <p className="text-xs text-muted-foreground">Optimizando distribución...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full w-full bg-background border border-border flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-destructive font-medium">Error al cargar datos</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              {error instanceof Error ? error.message : "Error desconocido"}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full rounded-2xl bg-background border border-border text-foreground shadow-lg">
      <CardHeader className="relative pb-4">
        <h3 className="text-2xl">
          Nube de palabras de comentarios
        </h3>
        <CardDescription className="text-base text-muted-foreground">
          Palabras más frecuentes organizadas por relevancia. Interactúa con las palabras para explorar los datos.
        </CardDescription>
        <InfoPopover>
          <h4 className="font-semibold text-lg mb-2">Acerca de esta visualización</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• El tamaño representa la frecuencia de aparición</p>
            <p>• Los colores ayudan a distinguir diferentes palabras</p>
            <p>• Haz hover para destacar una palabra específica</p>
            <p>• Click para ver un efecto de pulso</p>
          </div>
        </InfoPopover>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[450px] p-6">
        <div className="w-full h-full rounded-xl overflow-hidden">
          <svg ref={svgRef} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
}