import React, { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import InfoPopover from "../../../../components/common/InfoPopover";
import { useQuery } from "@tanstack/react-query";
import { getInstagramCommentsWordCloud } from "@/lib/api/getInstagramCommentsWordCloud";
import { queryClient } from "@/lib/api/queryClient";
import { Loader2 } from "lucide-react";
import * as d3 from "d3";

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

  // Renderizar el wordcloud con D3
  useEffect(() => {
    if (!wordCloudData || !wordCloudData.word_frequencies_list || isLoading || error) return;
    const words = wordCloudData.word_frequencies_list.slice(0, 100); // Limitar a 100 palabras
    const width = 500;
    const height = 350;
    const minFont = 14;
    const maxFont = 48;
    const maxFreq = d3.max(words, d => d.frequency) || 1;
    const minFreq = d3.min(words, d => d.frequency) || 1;
    const fontScale = d3.scaleLinear()
      .domain([minFreq, maxFreq])
      .range([minFont, maxFont]);

    // Limpia el SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Generar posiciones aleatorias (simple, no colisiona)
    const placed: { x: number; y: number; fontSize: number; word: string; color: string }[] = [];
    words.forEach((w, i) => {
      const fontSize = fontScale(w.frequency);
      const angle = Math.random() > 0.8 ? 90 : 0;
      let x = Math.random() * (width - 100) + 50;
      let y = Math.random() * (height - 60) + 30;
      placed.push({ x, y, fontSize, word: w.word, color: d3.schemeCategory10[i % 10] });
    });

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("text")
      .data(placed)
      .enter()
      .append("text")
      .text(d => d.word)
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("font-size", d => d.fontSize)
      .attr("fill", d => d.color)
      .attr("font-family", "inherit")
      .attr("font-weight", 600)
      .attr("opacity", 0.85)
      .attr("transform", d => `rotate(${Math.random() > 0.8 ? 90 : 0},${d.x},${d.y})`)
      .style("cursor", "pointer")
      .append("title")
      .text(d => `Palabra: ${d.word}\nFrecuencia: ${d.fontSize}`);
  }, [wordCloudData, isLoading, error]);

  if (isLoading) {
    return (
      <Card className="h-full w-full bg-background border border-border flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full w-full bg-background border border-border flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-destructive font-normal">Error al cargar datos</p>
          <p className="text-sm font-normal text-muted-foreground">
            {error instanceof Error ? error.message : "Error desconocido"}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full rounded-2xl bg-background border border-border text-foreground">
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-normal">
          Nube de palabras de comentarios
        </CardTitle>
        <CardDescription className="text-base font-normal text-muted-foreground">
          Palabras más frecuentes en los comentarios analizados.
        </CardDescription>
        <InfoPopover>
          <h4 className="font-normal text-lg">Acerca de esta gráfica</h4>
          <p className="text-sm font-normal text-muted-foreground">
            El tamaño de cada palabra representa su frecuencia relativa en los comentarios.
          </p>
        </InfoPopover>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-[350px]">
        <svg ref={svgRef} className="w-full h-full" />
      </CardContent>
    </Card>
  );
} 