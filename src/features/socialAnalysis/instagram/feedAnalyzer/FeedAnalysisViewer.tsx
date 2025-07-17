import React from 'react';
import { useQuery, QueryClient } from '@tanstack/react-query';
import { getInstagramFeedAnalysis } from '@/lib/api/getInstagramFeedAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Puedes ajustar el tipo según tus necesidades
interface FeedAnalysisViewerProps {
  competitorId?: string;
}

// Crear un QueryClient local si no hay uno global
const queryClient = new QueryClient();

export const FeedAnalysisViewer: React.FC<FeedAnalysisViewerProps> = ({ competitorId: initialCompetitorId }) => {
  const [competitorId, setCompetitorId] = React.useState(initialCompetitorId || '');
  const [submittedId, setSubmittedId] = React.useState(initialCompetitorId || '');

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    {
      queryKey: ['instagramFeedAnalysis', submittedId],
      queryFn: () => getInstagramFeedAnalysis(submittedId),
      enabled: !!submittedId,
    },
    queryClient
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedId(competitorId.trim());
  };

  return (
    <Card className="max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Análisis de Feed de Instagram</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            placeholder="Competitor ID"
            value={competitorId}
            onChange={e => setCompetitorId(e.target.value)}
            className="w-64"
          />
          <Button type="submit" disabled={isLoading || isFetching}>
            Consultar
          </Button>
        </form>
        {isLoading || isFetching ? (
          <div className="text-center py-8">Cargando análisis...</div>
        ) : error ? (
          <div className="text-red-500">{(error as Error).message}</div>
        ) : data ? (
          <div className="space-y-6">
            {/* Global Analysis */}
            <section>
              <h2 className="font-semibold text-lg mb-2">Resumen Global</h2>
              <ul className="list-disc ml-6">
                <li><b>Resumen:</b> {data.global_analysis.summary}</li>
                <li><b>Total de posts analizados:</b> {data.global_analysis.total_posts_analyzed}</li>
                <li><b>Total de lotes:</b> {data.global_analysis.total_batches}</li>
                <li><b>Modelo usado:</b> {data.global_analysis.model_used}</li>
              </ul>
            </section>
            <Separator />
            {/* Batch Analyses */}
            <section>
              <h2 className="font-semibold text-lg mb-2">Análisis por Lotes</h2>
              <div className="space-y-4">
                {data.batch_analyses.map(batch => (
                  <Card key={batch.batch_number} className="bg-muted">
                    <CardHeader>
                      <CardTitle>Lote #{batch.batch_number}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc ml-6">
                        <li><b>Posts en lote:</b> {batch.post_ids.length}</li>
                        <li><b>Modelo usado:</b> {batch.model_used}</li>
                        <li><b>Análisis:</b> <span className="whitespace-pre-line">{batch.analysis}</span></li>
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            <Separator />
            {/* Detailed Posts */}
            <section>
              <h2 className="font-semibold text-lg mb-2">Posts Detallados</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 border">Post ID</th>
                      <th className="p-2 border">Caption</th>
                      <th className="p-2 border">Imagen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.detailed_posts.map(post => (
                      <tr key={post.post_id}>
                        <td className="p-2 border font-mono">{post.post_id}</td>
                        <td className="p-2 border max-w-xs truncate" title={post.caption}>{post.caption}</td>
                        <td className="p-2 border">
                          {post.object_path ? (
                            <img src={post.object_path} alt="Post" className="w-24 h-24 object-cover rounded" />
                          ) : (
                            <span>No image</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        ) : (
          <div className="text-gray-500">Ingrese un Competitor ID para ver el análisis.</div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedAnalysisViewer; 