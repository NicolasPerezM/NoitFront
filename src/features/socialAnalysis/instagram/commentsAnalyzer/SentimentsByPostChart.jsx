import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Componente que muestra un gráfico de barras apiladas que analiza
 * el sentimiento de los comentarios en cada post. El gráfico utiliza
 * colores para representar el sentimiento Positivo, Neutral y Negativo.
 *
 *
 * @returns {JSX.Element} El componente JSX
 */
export const SentimentsByPostChart = ({sentimentsData}) => {
  const processData = (data) => {
    // Convierte el objeto en un arreglo para el gráfico
    return Object.keys(data.by_post).map((postId) => ({
      postId,
      POS: data.by_post[postId].positive_comments,
      NEU: data.by_post[postId].neutral_comments,
      NEG: data.by_post[postId].negative_comments,
    }));
  };
  const chartData = processData(sentimentsData);

  return (
    <div className="container mx-auto p-4 bg-theme-light dark:bg-theme-dark shadow-xl rounded-lg border-b border-t border-theme-light dark:border-theme-primary">
      <h2 className="text-2xl font-bold mb-4">
        Análisis de Sentimiento por Post
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="postId" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="POS" stackId="a" fill="#E81840" name="Positivo" />
          <Bar dataKey="NEU" stackId="a" fill="#e8c018" name="Neutral" />
          <Bar dataKey="NEG" stackId="a" fill="#18a8e8" name="Negativo" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
