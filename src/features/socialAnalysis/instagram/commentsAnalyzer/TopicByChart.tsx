"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import InfoPopover from "../../../../components/common/InfoPopover";
import { useQuery } from "@tanstack/react-query";
import { getInstagramCommentsTopics } from "@/lib/api/getInstagramCommentsTopics";
import { queryClient } from "@/lib/api/queryClient";
import { Skeleton } from "@/components/ui/skeleton";

interface TopicWordDistributionChartProps {
  competitorId: string;
}

interface TopicData {
  topic: string;
  words: Array<{
    word: string;
    weight: number;
  }>;
}

export default function TopicWordDistributionChart({ 
  competitorId 
}: TopicWordDistributionChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const {
    data: topicsData,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["instagramCommentsTopics", competitorId],
      queryFn: () => getInstagramCommentsTopics(competitorId),
      enabled: !!competitorId,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  );

  // Usar los datos reales de la API: objeto de temas, cada uno con palabras_con_pesos
  const processedData: TopicData[] = React.useMemo(() => {
    if (!topicsData || typeof topicsData !== 'object') return [];
    // La estructura es: { Tema_1: { palabras_con_pesos: {word: weight, ...}, cantidad_comentarios: number }, ... }
    return Object.entries(topicsData)
      .filter(([key, value]) => value && value.palabras_con_pesos)
      .slice(0, 6)
      .map(([key, value]: [string, any], idx) => ({
        topic: key,
        words: Object.entries(value.palabras_con_pesos)
          .map(([word, weight]) => ({ word, weight: Number(weight) }))
          .sort((a, b) => b.weight - a.weight)
          .slice(0, 5)
      }));
  }, [topicsData]);

  useEffect(() => {
    if (!processedData.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const containerWidth = svgRef.current.clientWidth;
    const containerHeight = 400;
    
    // Configuración del grid
    const cols = 3;
    const rows = 2;
    const chartWidth = (containerWidth - 60) / cols;
    const chartHeight = (containerHeight - 60) / rows;
    const barHeight = 25;
    const spacing = 5;

    // Colores - gradiente de púrpura a naranja
    const colorScale = d3.scaleSequential()
      .domain([0, 4])
      .interpolator(d3.interpolateViridis);

    // Crear el grupo principal
    const mainGroup = svg
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .append("g")
      .attr("transform", "translate(30, 30)");

    // Crear subgráficas para cada tópico
    processedData.forEach((topicData, topicIndex) => {
      const row = Math.floor(topicIndex / cols);
      const col = topicIndex % cols;
      const x = col * chartWidth;
      const y = row * chartHeight;

      const topicGroup = mainGroup
        .append("g")
        .attr("transform", `translate(${x}, ${y})`);

      // Título del tópico
      topicGroup
        .append("text")
        .attr("x", chartWidth / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("class", "text-sm font-medium")
        .style("fill", "var(--foreground)")
        .text(`${topicData.topic} - Weight: ${topicData.words[0].weight}`);

      // Crear escala para las barras
      const xScale = d3.scaleLinear()
        .domain([0, d3.max(topicData.words, d => d.weight) || 1])
        .range([0, chartWidth - 100]);

      // Crear barras
      const bars = topicGroup
        .selectAll(".bar")
        .data(topicData.words)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", (d, i) => `translate(0, ${40 + i * (barHeight + spacing)})`);

      // Rectángulos de las barras
      bars
        .append("rect")
        .attr("x", 60)
        .attr("y", 0)
        .attr("width", d => xScale(d.weight))
        .attr("height", barHeight)
        .attr("rx", 4)
        .attr("ry", 4)
        .style("fill", (d, i) => colorScale(i))
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          d3.select(this)
            .style("opacity", 0.8);
          
          // Tooltip
          const tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "var(--popover)")
            .style("border", "1px solid var(--border)")
            .style("border-radius", "8px")
            .style("padding", "8px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("z-index", "1000")
            .style("opacity", 0);

          tooltip.html(`
            <div style="color: var(--foreground);">
              <strong>${d.word}</strong><br/>
              Weight: ${d.weight}
            </div>
          `)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
          .transition()
          .duration(200)
          .style("opacity", 1);
        })
        .on("mouseout", function() {
          d3.select(this)
            .style("opacity", 1);
          
          d3.selectAll(".tooltip").remove();
        });

      // Etiquetas de las palabras
      bars
        .append("text")
        .attr("x", 55)
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .style("fill", "var(--foreground)")
        .style("font-size", "11px")
        .style("font-weight", "500")
        .text(d => d.word);

      // Valores de weight
      bars
        .append("text")
        .attr("x", d => 65 + xScale(d.weight))
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("dx", "5px")
        .style("fill", "var(--foreground)")
        .style("font-size", "10px")
        .style("font-weight", "600")
        .text(d => d.weight.toFixed(2));
    });

  }, [processedData]);

  if (isLoading) {
    return (
      <Card className="h-full w-full rounded-2xl bg-background border border-border text-foreground">
        <CardHeader className="relative">
          <Skeleton className="h-7 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
        </CardHeader>
        <CardContent className="h-[calc(100%-10rem)] flex items-center justify-center">
          <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/6" />
                <Skeleton className="h-6 w-3/6" />
                <Skeleton className="h-6 w-2/6" />
                <Skeleton className="h-6 w-1/6" />
              </div>
            ))}
          </div>
        </CardContent>
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

  const hasData = processedData.length > 0;

  return (
    <Card className="h-full w-full rounded-2xl bg-background border border-border text-foreground">
      <CardHeader className="relative">
        
        <InfoPopover>
          <h4 className="font-normal text-lg">Acerca de esta gráfica</h4>
          <p className="text-sm font-normal text-muted-foreground">
            Cada panel representa un tópico diferente identificado mediante análisis
            de texto de los comentarios.
          </p>
          <p className="text-sm font-normal text-muted-foreground">
            El peso (weight) indica la relevancia de cada palabra dentro del tópico,
            donde valores más altos representan mayor importancia.
          </p>
          <p className="text-sm font-normal text-muted-foreground">
            Los colores van de púrpura (mayor peso) a naranja (menor peso) para
            facilitar la identificación visual.
          </p>
        </InfoPopover>
      </CardHeader>
      <CardContent className="h-[calc(100%-10rem)]">
        {hasData ? (
          <div className="w-full h-full">
            <svg
              ref={svgRef}
              className="w-full h-full"
              style={{ minHeight: "400px" }}
            />
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-base font-normal text-muted-foreground">
                No se encontraron datos de tópicos
              </p>
              <p className="text-xs font-normal text-muted-foreground">
                Competitor ID: {competitorId}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}