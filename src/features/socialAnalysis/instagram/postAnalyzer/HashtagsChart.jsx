import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

/**
 * Componente para visualizar los hashtags más utilizados.
 * Se espera recibir por prop "posts", un array de objetos, cada uno con la propiedad "hashtags"
 * (un array de strings). El componente calcula la frecuencia de cada hashtag y lo muestra
 * en un gráfico de barras.
 */
const HashtagsChart = ({ posts }) => {
  // Si no se reciben posts o el array está vacío, mostramos un mensaje
  if (!posts || posts.length === 0) {
    return <div className="text-center py-4">No hay datos de posts disponibles</div>;
  }

  // Calculamos la frecuencia de cada hashtag (convertimos a minúsculas para agrupar de forma consistente)
  const hashtagCounts = {};
  posts.forEach(post => {
    if (Array.isArray(post.hashtags)) {
      post.hashtags.forEach(tag => {
        const lowerTag = tag.toLowerCase();
        hashtagCounts[lowerTag] = (hashtagCounts[lowerTag] || 0) + 1;
      });
    }
  });

  // Convertimos el objeto de frecuencias en un array de objetos para que Recharts lo pueda procesar
  const data = Object.entries(hashtagCounts).map(([hashtag, count]) => ({
    hashtag,
    count,
  }));

  // Si no se encontraron hashtags, mostramos un mensaje adecuado
  if (data.length === 0) {
    return <div className="text-center py-4">No se encontraron hashtags en los posts</div>;
  }

  return (
    <section className="bg-theme-light dark:bg-theme-dark shadow-xl rounded-xl p-4 border-b border-t border-theme-light dark:border-theme-primary">
      <h2 className="text-xl font-semibold mb-4">Hashtags Más Utilizados</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          {/* Eje X: hashtags */}
          <XAxis dataKey="hashtag" />
          {/* Eje Y: cantidad de usos */}
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Barra para la cantidad de usos de cada hashtag, usando el color primario */}
          <Bar dataKey="count" fill="#E81840" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};

export default HashtagsChart;
