import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * Componente que renderiza la gráfica de tendencias de engagement
 * Recibe por props el array 'trends' con los datos de engagement_trends.
 */
const EngagementTrends = ({ trends }) => {
  return (
    <div className="bg-theme-light dark:bg-theme-dark shadow rounded-xl p-4">
      <h2 className="text-xl font-bold mb-4">Tendencias de Engagement</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={trends}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#888888" />
          {/* Eje X muestra la fecha del post */}
          <XAxis dataKey="post_date" stroke="#888888"/>
          {/* Eje Y muestra la tasa de engagement */}
          <YAxis stroke="#888888"/>
          <Tooltip />
          <Line
            type="monotone"
            dataKey="engagement_rate"
            stroke="#E81840"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementTrends;
