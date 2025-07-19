import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInstagramPosts } from '@/lib/api/getInstagramPosts';
import { queryClient } from '@/lib/api/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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

export default function PostsListReport({ competitorId: initialCompetitorId }: { competitorId?: string }) {
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
      queryKey: ['instagram-posts', submittedId],
      queryFn: () => submittedId ? getInstagramPosts(submittedId) : Promise.reject('No competitorId'),
      enabled: !!submittedId,
    },
    queryClient,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedId(competitorId.trim());
  };

  // Chart: Posts por tipo
  const postTypeChart = data ? (() => {
    const counts = data.statistics?.postsByType || {};
    return {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Posts por tipo',
        data: Object.values(counts),
        backgroundColor: ['#60a5fa', '#fbbf24', '#34d399', '#f87171', '#a78bfa'],
      }],
    };
  })() : null;

  // Chart: Hashtags más usados
  const topHashtagsChart = data ? (() => {
    const hashtagCounts: Record<string, number> = {};
    data.posts.forEach(post => {
      post.hashtags.forEach(tag => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      });
    });
    const sorted = Object.entries(hashtagCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    return {
      labels: sorted.map(([tag]) => tag),
      datasets: [{
        label: 'Hashtags',
        data: sorted.map(([, count]) => count),
        backgroundColor: ['#60a5fa', '#fbbf24', '#34d399', '#f87171', '#a78bfa', '#f472b6', '#facc15', '#818cf8'],
      }],
    };
  })() : null;

  return (
    <Card className="max-w-5xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Posts de Instagram</CardTitle>
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
              <div className="text-lg font-bold">Total de posts: <span className="text-blue-600">{data.totalPosts}</span></div>
              <div className="text-sm text-gray-500">Total de comentarios: <span className="font-semibold text-black">{data.statistics?.totalComments}</span></div>
              <div className="text-sm text-gray-500">Posts con comentarios: <span className="font-semibold text-black">{data.statistics?.postsWithComments}</span></div>
              <div className="text-xs text-gray-400">Última actualización: {data.timestamp ? new Date(data.timestamp).toLocaleString() : 'N/A'}</div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold mb-2">Distribución de tipos de post</div>
                {postTypeChart && <Bar data={postTypeChart} options={{ responsive: true, plugins: { legend: { display: false } } }} />}
              </div>
              <div>
                <div className="font-semibold mb-2">Hashtags más usados</div>
                {topHashtagsChart && <Pie data={topHashtagsChart} options={{ plugins: { legend: { position: 'bottom' } } }} />}
              </div>
            </div>
            <Separator />
            <div>
              <div className="font-bold mb-2">Lista de Posts</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">ID</th>
                      <th className="p-2 border">Tipo</th>
                      <th className="p-2 border">Caption</th>
                      <th className="p-2 border">Hashtags</th>
                      <th className="p-2 border">Comentarios</th>
                      <th className="p-2 border">URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.posts.map(post => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="p-2 border font-mono">{post.id}</td>
                        <td className="p-2 border"><Badge>{post.type}</Badge></td>
                        <td className="p-2 border max-w-xs truncate" title={post.caption}>{post.caption.slice(0, 60)}{post.caption.length > 60 ? '…' : ''}</td>
                        <td className="p-2 border">
                          <div className="flex flex-wrap gap-1">
                            {post.hashtags.map(tag => <Badge key={tag} variant="secondary">#{tag}</Badge>)}
                          </div>
                        </td>
                        <td className="p-2 border text-center">{post.commentsCount}</td>
                        <td className="p-2 border">
                          <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">Ver post</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <Separator />
            <div>
              <div className="font-bold mb-2">Comentarios recientes en los posts</div>
              <div className="space-y-4">
                {data.posts.slice(0, 5).map(post => (
                  <div key={post.id} className="border rounded-lg p-3 bg-gray-50">
                    <div className="font-semibold mb-1">Post <span className="text-blue-600">{post.id}</span> ({post.type})</div>
                    <div className="text-xs text-gray-500 mb-2">Caption: {post.caption}</div>
                    <div className="space-y-2">
                      {post.latestComments.length === 0 ? (
                        <div className="text-xs text-gray-400 italic">Sin comentarios recientes</div>
                      ) : post.latestComments.map((comment, idx) => (
                        <div key={comment.id + idx} className="flex items-start gap-2 border-b pb-2 last:border-b-0 last:pb-0">
                          <Avatar className="w-7 h-7">
                            <AvatarImage src={comment.ownerProfilePicUrl || comment.owner?.profile_pic_url} alt={comment.ownerUsername || comment.owner?.username} />
                            <AvatarFallback>{(comment.ownerUsername || comment.owner?.username || '?').slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs font-semibold">{comment.ownerUsername || comment.owner?.username}</div>
                            <div className="text-xs text-gray-700">{comment.text}</div>
                            <div className="text-[10px] text-gray-400">{comment.timestamp ? new Date(comment.timestamp).toLocaleString() : ''}</div>
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
          <div className="text-gray-400">Ingrese un Competitor ID para ver los posts.</div>
        )}
      </CardContent>
    </Card>
  );
} 