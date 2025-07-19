import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/api/queryClient';
import { getInstagramImageAnalysis } from '@/lib/api/getInstagramImageAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function ImageAnalysisReport({ competitorId: initialCompetitorId }: { competitorId?: string }) {
  const [competitorId, setCompetitorId] = useState(initialCompetitorId || '');
  const [submittedId, setSubmittedId] = useState<string | null>(initialCompetitorId || null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery(
    {
      queryKey: ['instagram-image-analysis', submittedId],
      queryFn: () => submittedId ? getInstagramImageAnalysis(submittedId) : Promise.reject('No competitorId'),
      enabled: !!submittedId,
    },
    queryClient,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedId(competitorId.trim());
  };

  // Helper: Color palette to CSS rgb
  const rgbToString = (rgb: [number, number, number]) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

  // Chart: Posts per type
  const postTypeChart = data ? (() => {
    const counts: Record<string, number> = {};
    data.posts_analyzed.forEach(post => {
      counts[post.post_type] = (counts[post.post_type] || 0) + 1;
    });
    return {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Posts por tipo',
        data: Object.values(counts),
        backgroundColor: ['#60a5fa', '#fbbf24', '#34d399', '#f87171', '#a78bfa'],
      }],
    };
  })() : null;

  // Chart: Average colors per image
  const avgColors = data ? (() => {
    const totalImages = data.posts_analyzed.reduce((sum, post) => sum + post.images.length, 0);
    const totalColors = data.posts_analyzed.reduce((sum, post) => sum + post.images.reduce((s, img) => s + img.color_palette.length, 0), 0);
    return totalImages > 0 ? (totalColors / totalImages).toFixed(2) : '0';
  })() : '0';

  // Chart: Top colors (flattened)
  const topColorsChart = data ? (() => {
    const colorMap: Record<string, number> = {};
    data.posts_analyzed.forEach(post => {
      post.images.forEach(img => {
        img.color_palette.forEach(color => {
          const key = rgbToString(color.rgb);
          colorMap[key] = (colorMap[key] || 0) + color.proportion;
        });
      });
    });
    const sorted = Object.entries(colorMap).sort((a, b) => b[1] - a[1]).slice(0, 8);
    return {
      labels: sorted.map(([color]) => color),
      datasets: [{
        label: 'Proporción de color',
        data: sorted.map(([, prop]) => prop),
        backgroundColor: sorted.map(([color]) => color),
      }],
    };
  })() : null;

  return (
    <Card className="max-w-5xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Análisis de Imágenes de Instagram</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            placeholder="Competitor ID (username o id)"
            value={competitorId}
            onChange={e => setCompetitorId(e.target.value)}
            className="w-64"
          />
          <Button type="submit" disabled={isLoading || isFetching || !competitorId.trim()}>Buscar</Button>
        </form>
        {isLoading || isFetching ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : isError ? (
          <div className="text-red-500 font-semibold">{(error as Error)?.message || 'Error desconocido'}</div>
        ) : data ? (
          <div className="space-y-6">
            <div>
              <div className="text-lg font-bold">Usuario: <span className="text-blue-600">{data.username}</span></div>
              <div className="text-sm text-gray-500">Total de posts analizados: <span className="font-semibold text-black">{data.total_posts_analyzed}</span></div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold mb-2">Distribución de tipos de post</div>
                {postTypeChart && <Bar data={postTypeChart} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
              </div>
              <div>
                <div className="font-semibold mb-2">Colores más frecuentes</div>
                {topColorsChart && <Pie data={topColorsChart} options={{ plugins: { legend: { position: 'bottom' } } }} />}
              </div>
            </div>
            <div className="mt-4">
              <div className="font-semibold">Promedio de colores por imagen: <span className="text-blue-700">{avgColors}</span></div>
            </div>
            <Separator />
            <div>
              <div className="font-bold mb-2">Posts Analizados</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">ID</th>
                      <th className="p-2 border">Tipo</th>
                      <th className="p-2 border">Caption</th>
                      <th className="p-2 border"># Imágenes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.posts_analyzed.map(post => (
                      <tr key={post.post_id} className="hover:bg-gray-50">
                        <td className="p-2 border font-mono">{post.post_id}</td>
                        <td className="p-2 border"><Badge>{post.post_type}</Badge></td>
                        <td className="p-2 border max-w-xs truncate" title={post.caption}>{post.caption.slice(0, 60)}{post.caption.length > 60 ? '…' : ''}</td>
                        <td className="p-2 border text-center">{post.images.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Separator />
            <div>
              <div className="font-bold mb-2">Detalle de Imágenes y Análisis GPT</div>
              <div className="space-y-6">
                {data.posts_analyzed.map(post => (
                  <div key={post.post_id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="font-semibold mb-1">Post <span className="text-blue-600">{post.post_id}</span> ({post.post_type})</div>
                    <div className="text-xs text-gray-500 mb-2">Caption: {post.caption}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {post.images.map((img, idx) => (
                        <div key={img.file_name + idx} className="border rounded p-2 bg-white">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs">{img.file_name}</span>
                            <span className="text-xs text-gray-400">({img.object_path})</span>
                          </div>
                          <div className="flex gap-2 mb-1">
                            <span className="font-semibold text-xs">Colores:</span>
                            <div className="flex gap-1">
                              {img.color_palette.map((color, i) => (
                                <span
                                  key={i}
                                  className="inline-block w-4 h-4 rounded-full border"
                                  style={{ background: rgbToString(color.rgb) }}
                                  title={`RGB: ${color.rgb.join(', ')} | Proporción: ${(color.proportion * 100).toFixed(1)}%`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-xs text-gray-700 mb-1">
                            <span className="font-semibold">Análisis GPT:</span> {img.gpt4o_analysis || <span className="italic text-gray-400">Sin análisis</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400">Ingrese un Competitor ID para ver el análisis.</div>
        )}
      </CardContent>
    </Card>
  );
} 