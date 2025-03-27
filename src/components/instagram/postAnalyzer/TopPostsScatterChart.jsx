import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * Componente para visualizar la distribución de interacciones en posts destacados
 * mediante un gráfico de dispersión.
 * Se espera recibir por prop "data", un array de objetos con:
 * - likesCount: cantidad de likes (se corrige si es negativo)
 * - commentsCount: cantidad de comentarios
 * - engagement_rate: tasa de engagement (opcional, se muestra en el tooltip)
 * - post_date: fecha del post (para información adicional en el tooltip)
 */
const TopPostsScatterChart = ({ data }) => {
  // Si no se reciben datos, se muestra un mensaje informativo
  if (!data || data.length === 0) {
    return <div className="text-center py-4">No hay datos de posts destacados</div>;
  }

  // Preparamos los datos para el gráfico
  const formattedData = data.map((post, index) => ({
    name: `Post ${index + 1}`,
    likes: post.likesCount < 0 ? 0 : post.likesCount,
    comments: post.commentsCount,
    engagement_rate: post.engagement_rate,
    post_date: post.post_date,
  }));

  return (
    <section className="bg-white shadow rounded p-4">
      <h2 className="text-xl font-semibold mb-4">Distribución de Interacciones en Posts Destacados</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* Eje X para Likes */}
          <XAxis
            dataKey="likes"
            name="Likes"
            label={{ value: "Likes", position: "insideBottomRight", offset: 0 }}
          />
          {/* Eje Y para Comentarios */}
          <YAxis
            dataKey="comments"
            name="Comentarios"
            label={{ value: "Comentarios", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name, props) => {
              if (name === "engagement_rate") {
                return [value, "Engagement Rate"];
              }
              return [value, name];
            }}
          />
          <Legend />
          {/* Se traza un conjunto de puntos representando cada post */}
          <Scatter name="Posts Destacados" data={formattedData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </section>
  );
};

export default TopPostsScatterChart;
