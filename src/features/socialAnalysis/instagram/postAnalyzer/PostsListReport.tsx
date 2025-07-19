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
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import InfoPopover from '@/components/common/InfoPopover';
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

// Utiliza variables CSS del tema shadcn para los colores de los gráficos
const getThemeColors = () => {
  // fallback a los valores por defecto si no están definidos
  const getVar = (name: string, fallback: string) =>
    typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue(name) || fallback
      : fallback;

  // shadcn default palette (puedes ajustar los nombres de las variables según tu global.css)
  return [
    getVar('--primary', '#6366f1'), // Indigo
    getVar('--secondary', '#f59e42'), // Orange
    getVar('--destructive', '#ef4444'), // Red
    getVar('--muted', '#e5e7eb'), // Gray-200
    getVar('--accent', '#10b981'), // Emerald
    getVar('--ring', '#a21caf'), // Purple
    getVar('--foreground', '#18181b'), // Neutral
    getVar('--border', '#d1d5db'), // Gray-300
    getVar('--input', '#f3f4f6'), // Gray-100
    getVar('--background', '#fff'), // White
  ];
};

export default function PostsListReport({ competitorId: initialCompetitorId }: { competitorId?: string }) {
  const [competitorId, setCompetitorId] = useState(initialCompetitorId || '');
  const [submittedId, setSubmittedId] = useState<string | null>(initialCompetitorId || null);

  // Para evitar SSR issues, obtenemos los colores solo en el cliente
  const [themeColors, setThemeColors] = React.useState<string[]>([
    '#6366f1', '#f59e42', '#ef4444', '#e5e7eb', '#10b981', '#a21caf', '#18181b', '#d1d5db', '#f3f4f6', '#fff'
  ]);
  React.useEffect(() => {
    setThemeColors(getThemeColors());
  }, []);

  const {
    data,
    isLoading,
    isError,
    error,
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
    const counts: Record<string, number> = {};
    data.posts.forEach(post => {
      counts[post.type] = (counts[post.type] || 0) + 1;
    });
    return {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Posts por tipo',
        data: Object.values(counts),
        backgroundColor: Object.keys(counts).map((_, i) => themeColors[i % themeColors.length]),
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
        backgroundColor: sorted.map((_, i) => themeColors[i % themeColors.length]),
      }],
    };
  })() : null;

  // Chart: Engagement por post
  const engagementChart = data ? (() => {
    const labels = data.posts.map(post => post.shortCode);
    const likes = data.posts.map(post => post.likesCount);
    const comments = data.posts.map(post => post.commentsCount);
    return {
      labels,
      datasets: [
        {
          label: 'Likes',
          data: likes,
          backgroundColor: themeColors[0],
        },
        {
          label: 'Comentarios',
          data: comments,
          backgroundColor: themeColors[1],
        },
      ],
    };
  })() : null;

  return (
    <Card className="max-w-6xl mx-auto mt-8">
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
          <div className="text-destructive font-semibold">{(error as Error)?.message || 'Error desconocido'}</div>
        ) : data ? (
          <div className="space-y-8">
            {/* METADATA */}
            <Card className="mb-4">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Estadísticas Generales</CardTitle>
                  <div className="text-xs text-muted-foreground">Última actualización: {data.metadata?.timestamp ? new Date(data.metadata.timestamp).toLocaleString() : 'N/A'}</div>
                </div>
                <InfoPopover>
                  <div>
                    <b>totalPosts</b>: Total de posts encontrados.<br/>
                    <b>totalLikes</b>: Suma de likes de todos los posts.<br/>
                    <b>totalComments</b>: Suma de comentarios de todos los posts.<br/>
                    <b>postsWithHashtags</b>: Posts que tienen al menos un hashtag.<br/>
                    <b>postsWithImages</b>: Posts que tienen al menos una imagen.<br/>
                    <b>competitorId</b>: ID del perfil analizado.<br/>
                  </div>
                </InfoPopover>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>Total de posts: <span className="font-semibold text-primary">{data.metadata?.totalPosts}</span></div>
                  <div>Total de likes: <span className="font-semibold text-primary">{data.metadata?.totalLikes}</span></div>
                  <div>Total de comentarios: <span className="font-semibold text-primary">{data.metadata?.totalComments}</span></div>
                  <div>Posts con hashtags: <span className="font-semibold text-primary">{data.metadata?.postsWithHashtags}</span></div>
                  <div>Posts con imágenes: <span className="font-semibold text-primary">{data.metadata?.postsWithImages}</span></div>
                  <div>Competitor ID: <span className="font-semibold text-primary">{data.metadata?.competitorId}</span></div>
                </div>
              </CardContent>
            </Card>
            {/* CHARTS */}
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
            <div>
              <div className="font-semibold mb-2">Engagement por post (likes y comentarios)</div>
              {engagementChart && <Bar data={engagementChart} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { x: { display: false } } }} />}
            </div>
            {/* POSTS TABLE */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Lista de Posts</CardTitle>
                <InfoPopover>
                  <div>
                    <b>isSponsored</b>: Indica si el post es patrocinado.<br/>
                    <b>isCommentsDisabled</b>: Indica si los comentarios están deshabilitados.<br/>
                    <b>childPosts</b>: Si el post es un carrusel, aquí están los posts hijos.<br/>
                  </div>
                </InfoPopover>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Caption</TableHead>
                      <TableHead>Hashtags</TableHead>
                      <TableHead>Mentions</TableHead>
                      <TableHead>Likes</TableHead>
                      <TableHead>Comentarios</TableHead>
                      <TableHead>Dimensiones</TableHead>
                      <TableHead>Patrocinado</TableHead>
                      <TableHead>Comentarios deshabilitados</TableHead>
                      <TableHead>Ver</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.posts.map(post => (
                      <TableRow key={post.id}>
                        <TableCell className="font-mono text-xs">{post.id}</TableCell>
                        <TableCell><Badge>{post.type}</Badge></TableCell>
                        <TableCell>
                          {post.images && post.images.length > 0 ? (
                            <img src={post.images[0]} alt={post.alt || 'Imagen'} className="w-12 h-12 object-cover rounded" />
                          ) : (
                            <div className="w-12 h-12 bg-muted flex items-center justify-center rounded text-xs text-muted-foreground">Sin imagen</div>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={post.caption}>{post.caption?.slice(0, 60)}{post.caption?.length > 60 ? '…' : ''}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {post.hashtags.map(tag => <Badge key={tag} variant="secondary">#{tag}</Badge>)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {post.mentions.map(tag => <Badge key={tag} variant="outline">@{tag}</Badge>)}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{post.likesCount}</TableCell>
                        <TableCell className="text-center">{post.commentsCount}</TableCell>
                        <TableCell className="text-xs">{post.dimensionsWidth}x{post.dimensionsHeight}</TableCell>
                        <TableCell className="text-center"><Switch checked={post.isSponsored} disabled /></TableCell>
                        <TableCell className="text-center"><Switch checked={post.isCommentsDisabled} disabled /></TableCell>
                        <TableCell>
                          <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">Ver post</a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            {/* POSTS DETALLE: Collapsible por post */}
            <div className="space-y-4">
              <div className="font-bold mb-2">Detalle de cada post</div>
              {data.posts.map(post => (
                <Collapsible key={post.id}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full flex justify-between items-center mb-1">
                      <span className="font-mono text-xs">{post.id}</span>
                      <span className="truncate max-w-xs">{post.caption?.slice(0, 40)}{post.caption?.length > 40 ? '…' : ''}</span>
                      <span className="text-xs text-muted-foreground">{post.type}</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-4 border rounded bg-muted space-y-2">
                      <div className="flex gap-4 items-center">
                        {post.images && post.images.length > 0 && (
                          <img src={post.images[0]} alt={post.alt || 'Imagen'} className="w-24 h-24 object-cover rounded" />
                        )}
                        <div>
                          <div className="font-semibold">{post.caption}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.hashtags.map(tag => <Badge key={tag} variant="secondary">#{tag}</Badge>)}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.mentions.map(tag => <Badge key={tag} variant="outline">@{tag}</Badge>)}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mt-2">
                        <div><b>Likes:</b> {post.likesCount}</div>
                        <div><b>Comentarios:</b> {post.commentsCount}</div>
                        <div><b>Dimensiones:</b> {post.dimensionsWidth}x{post.dimensionsHeight}</div>
                        <div><b>Patrocinado:</b> <Switch checked={post.isSponsored} disabled /></div>
                        <div><b>Comentarios deshabilitados:</b> <Switch checked={post.isCommentsDisabled} disabled /></div>
                        <div><b>Owner:</b> {post.ownerUsername} ({post.ownerFullName})</div>
                        <div><b>Fecha:</b> {post.timestamp ? new Date(post.timestamp).toLocaleString() : 'N/A'}</div>
                        <div><b>ShortCode:</b> {post.shortCode}</div>
                        <div><b>inputUrl:</b> <a href={post.inputUrl} className="text-primary underline" target="_blank" rel="noopener noreferrer">inputUrl</a></div>
                        <div><b>displayUrl:</b> <a href={post.displayUrl} className="text-primary underline" target="_blank" rel="noopener noreferrer">displayUrl</a></div>
                      </div>
                      {/* Child posts (carrusel) */}
                      {post.childPosts && post.childPosts.length > 0 && (
                        <div className="mt-2">
                          <div className="font-semibold text-xs mb-1">Carrusel (posts hijos):</div>
                          <div className="flex flex-wrap gap-2">
                            {post.childPosts.map(child => (
                              <div key={child.id} className="border rounded p-2 bg-background w-40">
                                {child.images && child.images.length > 0 ? (
                                  <img src={child.images[0]} alt={child.alt || 'Imagen'} className="w-32 h-32 object-cover rounded mb-1" />
                                ) : (
                                  <div className="w-32 h-32 bg-muted flex items-center justify-center rounded mb-1 text-xs text-muted-foreground">Sin imagen</div>
                                )}
                                <div className="text-xs font-semibold truncate w-full">{child.caption?.slice(0, 30)}{child.caption?.length > 30 ? '…' : ''}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {child.hashtags.slice(0, 3).map(tag => <Badge key={tag} variant="secondary">#{tag}</Badge>)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Comentarios recientes */}
                      <div className="mt-2">
                        <div className="font-semibold text-xs mb-1">Comentarios recientes:</div>
                        <div className="space-y-2">
                          {post.latestComments.length === 0 ? (
                            <div className="text-xs text-muted-foreground italic">Sin comentarios recientes</div>
                          ) : post.latestComments.map((comment, idx) => (
                            <div key={comment.id + idx} className="flex items-start gap-2 border-b pb-2 last:border-b-0 last:pb-0">
                              <Avatar className="w-7 h-7">
                                <AvatarImage src={comment.ownerProfilePicUrl || comment.owner?.profile_pic_url} alt={comment.ownerUsername || comment.owner?.username} />
                                <AvatarFallback>{(comment.ownerUsername || comment.owner?.username || '?').slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-xs font-semibold">{comment.ownerUsername || comment.owner?.username}</div>
                                <div className="text-xs text-foreground">{comment.text}</div>
                                <div className="text-[10px] text-muted-foreground">{comment.timestamp ? new Date(comment.timestamp).toLocaleString() : ''}</div>
                                <div className="text-[10px] text-muted-foreground">Likes: {comment.likesCount} | Replies: {comment.repliesCount}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">Ingrese un Competitor ID para ver los posts.</div>
        )}
      </CardContent>
    </Card>
  );
} 