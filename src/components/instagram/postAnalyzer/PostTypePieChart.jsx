import React from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';

/**
 * Componente para visualizar la distribución de los tipos de publicación
 * mediante un gráfico circular (PieChart).
 * 
 * Se espera recibir por props "data", un objeto con la siguiente estructura:
 * {
 *   "Image": número,
 *   "Sidecar": número,
 *   "Video": número
 * }
 */
const PostTypePieChart = ({ data }) => {

    if (!data) return null;
  // Transformamos el objeto en un array de objetos { name, value } para que Recharts lo pueda procesar
  const postTypeData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value,
  }));

  // Paleta de colores definida (puedes ajustar la asociación de color a cada tipo)
  const COLORS = ["#e8c018", "#E81840", "#18e858"];

  return (
    <section className="bg-theme-light dark:bg-theme-dark shadow rounded p-4">
      {/* Título de la gráfica */}
      <h2 className="text-xl font-semibold mb-4">Distribución de Tipos de Publicación</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={postTypeData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {/* Asignamos un color a cada segmento */}
            {postTypeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
};

export default PostTypePieChart;
