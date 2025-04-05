import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Paleta de colores para las emociones
const COLORS = ["#E81840", "#e8c018", "#e85818", "#FF8042"];

/**
 * DonutChart - Representa un gráfico de dona con los conteos de emociones
 * usando Recharts y Tailwind CSS.
 */
const DonutChart = ({emotionData}) => {
  

  // Tomamos el conteo global de emociones y lo convertimos a un arreglo
  const overallEmotionCounts = emotionData.overall.emotion_counts;
  const chartData = Object.keys(overallEmotionCounts).map((emotion) => ({
    name: emotion,
    value: overallEmotionCounts[emotion],
  }));

  return (
    <div className="p-4 bg-theme-light dark:bg-theme-dark shadow-xl rounded-lg border-b border-t border-theme-light dark:border-theme-primary">
      <h2 className="text-2xl font-bold text-center mb-4">Distribución de Emociones</h2>
      <div className="flex justify-center">
        <ResponsiveContainer width={300} height={400}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              startAngle={90}
              endAngle={-270} // Gira el donut para que inicie en la parte superior
              paddingAngle={4} // Espacio entre porciones
              label={false}    // Sin etiquetas sobre las porciones
              stroke="none"    // Sin borde en cada porción
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DonutChart;

