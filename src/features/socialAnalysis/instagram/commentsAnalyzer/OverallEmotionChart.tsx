"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import InfoPopover from "../../../../components/common/InfoPopover";
import { useQuery } from "@tanstack/react-query";
import { getInstagramCommentsEmotions } from "@/lib/api/getInstagramCommentsEmotions";
import { queryClient } from "@/lib/api/queryClient";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

// Paleta de colores usando variables CSS del tema global.css
const COLORS = {
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted))",
  border: "hsl(var(--border))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  popover: "hsl(var(--popover))",
  mutedForeground: "hsl(var(--muted-foreground))",
  destructive: "hsl(var(--destructive))"
};

interface RadarChartData {
  emotion: string;
  value: number;
  normalizedValue: number;
}

interface OverallEmotionChartProps {
  competitorId: string;
}

const RadarChart = ({ data }: { data: RadarChartData[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Utilidad para obtener el valor real de la variable CSS
  function getCssVar(name: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Obtener los colores del tema
    const themeColors = {
      primary: getCssVar('--primary'),
      secondary: getCssVar('--secondary'),
      accent: getCssVar('--accent'),
      muted: getCssVar('--muted'),
      border: getCssVar('--border'),
      background: getCssVar('--background'),
      foreground: getCssVar('--foreground'),
      popover: getCssVar('--popover'),
      mutedForeground: getCssVar('--muted-foreground'),
      destructive: getCssVar('--destructive'),
    };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Limpiar contenido previo

    const container = svgRef.current.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const size = Math.min(containerRect.width, containerRect.height);
    const margin = 60;
    const radius = (size - margin * 2) / 2;
    const centerX = size / 2;
    const centerY = size / 2;

    svg.attr("width", size).attr("height", size);

    const angleScale = d3.scaleLinear()
      .domain([0, data.length])
      .range([0, 2 * Math.PI]);

    const radiusScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, radius]);

    // Crear el fondo circular
    const backgroundGroup = svg.append("g").attr("class", "background");
    
    backgroundGroup
      .append("circle")
      .attr("cx", centerX)
      .attr("cy", centerY)
      .attr("r", radius)
      .attr("fill", themeColors.muted)
      .attr("fill-opacity", 0.05)
      .attr("stroke", themeColors.border)
      .attr("stroke-width", 2)
      .attr("opacity", 0.8);

    // Crear los círculos concéntricos (grid)
    const gridLevels = 5;
    const gridGroup = svg.append("g").attr("class", "grid");

    for (let i = 1; i <= gridLevels; i++) {
      gridGroup
        .append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", (radius / gridLevels) * i)
        .attr("fill", i === gridLevels ? "none" : themeColors.muted)
        .attr("fill-opacity", i === gridLevels ? 0 : 0.02)
        .attr("stroke", themeColors.border)
        .attr("stroke-width", i === gridLevels ? 2 : 1)
        .attr("opacity", 0.4);
    }

    // Crear las líneas radiales
    const linesGroup = svg.append("g").attr("class", "lines");
    
    data.forEach((d, i) => {
      const angle = angleScale(i) - Math.PI / 2; // Comenzar desde arriba
      const x2 = centerX + Math.cos(angle) * radius;
      const y2 = centerY + Math.sin(angle) * radius;

      linesGroup
        .append("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", themeColors.border)
        .attr("stroke-width", 1)
        .attr("opacity", 0.3);
    });

    // Crear las etiquetas de los ejes
    const labelsGroup = svg.append("g").attr("class", "labels");
    
    data.forEach((d, i) => {
      const angle = angleScale(i) - Math.PI / 2;
      const labelRadius = radius + 20;
      const x = centerX + Math.cos(angle) * labelRadius;
      const y = centerY + Math.sin(angle) * labelRadius;

      labelsGroup
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", themeColors.foreground)
        .attr("font-size", "12px")
        .attr("font-weight", "500")
        .style("text-transform", "capitalize")
        .text(d.emotion);
    });

    // Crear el área del radar
    const radarLine = d3.line<RadarChartData>()
      .x((d, i) => {
        const angle = angleScale(i) - Math.PI / 2;
        return centerX + Math.cos(angle) * radiusScale(d.normalizedValue);
      })
      .y((d, i) => {
        const angle = angleScale(i) - Math.PI / 2;
        return centerY + Math.sin(angle) * radiusScale(d.normalizedValue);
      })
      .curve(d3.curveLinearClosed);

    const radarGroup = svg.append("g").attr("class", "radar");

    // Área rellena
    radarGroup
      .append("path")
      .datum(data)
      .attr("d", radarLine)
      .attr("fill", themeColors.primary)
      .attr("fill-opacity", 0.2)
      .attr("stroke", themeColors.primary)
      .attr("stroke-width", 2);

    // Puntos en cada vértice
    const pointsGroup = svg.append("g").attr("class", "points");
    
    data.forEach((d, i) => {
      const angle = angleScale(i) - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radiusScale(d.normalizedValue);
      const y = centerY + Math.sin(angle) * radiusScale(d.normalizedValue);

      const point = pointsGroup
        .append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 4)
        .attr("fill", themeColors.primary)
        .attr("stroke", themeColors.background)
        .attr("stroke-width", 2)
        .style("cursor", "pointer");

      // Tooltip en hover
      point
        .on("mouseover", function(event) {
          // Crear tooltip
          const tooltip = d3.select("body")
            .append("div")
            .attr("class", "radar-tooltip")
            .style("position", "absolute")
            .style("background", themeColors.popover)
            .style("border", `1px solid ${themeColors.border}`)
            .style("border-radius", "6px")
            .style("padding", "8px 12px")
            .style("font-size", "12px")
            .style("color", themeColors.foreground)
            .style("pointer-events", "none")
            .style("z-index", "1000")
            .style("opacity", 0);

          tooltip.html(`
            <div style="font-weight: 500; text-transform: capitalize;">${d.emotion}</div>
            <div style="color: ${themeColors.mutedForeground}; font-size: 11px;">Valor: ${d.value.toFixed(3)}</div>
          `);

          tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px")
            .transition()
            .duration(200)
            .style("opacity", 1);

          d3.select(this)
            .transition()
            .duration(150)
            .attr("r", 6);
        })
        .on("mouseout", function() {
          d3.selectAll(".radar-tooltip").remove();
          
          d3.select(this)
            .transition()
            .duration(150)
            .attr("r", 4);
        });
    });

    // Etiquetas de niveles (opcional)
    const levelLabelsGroup = svg.append("g").attr("class", "level-labels");
    
    for (let i = 1; i <= gridLevels; i++) {
      levelLabelsGroup
        .append("text")
        .attr("x", centerX + 5)
        .attr("y", centerY - (radius / gridLevels) * i)
        .attr("fill", themeColors.mutedForeground)
        .attr("font-size", "10px")
        .attr("opacity", 0.7)
        .text((i / gridLevels).toFixed(1));
    }

  }, [data]);

  return <svg ref={svgRef} className="w-full h-full" />;
};

const OverallEmotionChart = ({ competitorId }: OverallEmotionChartProps) => {
  const {
    data: emotionData,
    isLoading,
    error,
  } = useQuery(
    {
      queryKey: ["instagramCommentsEmotions", competitorId],
      queryFn: () => getInstagramCommentsEmotions(competitorId),
      enabled: !!competitorId,
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  );

  let chartData: RadarChartData[] = [];
  if (emotionData && Array.isArray(emotionData.results)) {
    const sumScores: Record<string, number> = {};
    const countScores: Record<string, number> = {};
    emotionData.results.forEach((comment: any) => {
      if (Array.isArray(comment.scores)) {
        comment.scores.forEach((score: any) => {
          const label = score.label;
          sumScores[label] = (sumScores[label] || 0) + score.score;
          countScores[label] = (countScores[label] || 0) + 1;
        });
      }
    });
    
    const averageScores = Object.keys(sumScores).map((emotion) => ({
      emotion,
      value: countScores[emotion] ? sumScores[emotion] / countScores[emotion] : 0,
    }));

    // Normalizar valores para el radar chart (0-1)
    const maxValue = Math.max(...averageScores.map(d => d.value));
    chartData = averageScores.map(d => ({
      ...d,
      normalizedValue: maxValue > 0 ? d.value / maxValue : 0,
    }));
  }
  
  const hasData = chartData.length > 0;

  if (isLoading) {
    return (
      <Card className="h-full w-full rounded-2xl bg-background border border-border text-foreground">
        <CardHeader className="relative">
          <Skeleton className="h-7 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
        </CardHeader>
        <CardContent className="h-[calc(100%-10rem)] flex items-center justify-center">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Skeleton className="rounded-full h-48 w-48 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4" />
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

  return (
    <Card className="h-full w-full bg-background border border-border rounded-2xl">
      <CardHeader className="relative">
        <CardTitle className="text-xl md:text-2xl font-normal text-foreground">
          Distribución de Emociones
        </CardTitle>
        <InfoPopover>
          <h4 className="font-normal text-lg">Acerca de esta gráfica</h4>
          <p className="text-sm font-normal text-muted-foreground">
            Esta gráfica radar muestra la intensidad de diferentes emociones en los comentarios. 
            Cada eje representa una emoción diferente, y la distancia desde el centro indica 
            la intensidad promedio de esa emoción.
          </p>
        </InfoPopover>
        <CardDescription className="text-base font-normal text-muted-foreground">
          Radar chart que muestra la intensidad de emociones en los comentarios.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100%-10rem)]">
        {hasData ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full h-full max-w-md max-h-md">
              <RadarChart data={chartData} />
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-base font-normal text-muted-foreground">
              No se encontraron datos de emociones
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverallEmotionChart;