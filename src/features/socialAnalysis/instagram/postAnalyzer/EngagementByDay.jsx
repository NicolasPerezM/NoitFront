import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * Componente que renderiza la gráfica de engagement por día de la semana
 * Recibe por props el array 'data' con los datos transformados de engagement_by_day_of_week.
 */
const EngagementByDay = ({ data }) => {
  return (
    <div className="bg-theme-light dark:bg-theme-dark shadow-xl border-b border-t border-theme-light dark:border-theme-primary rounded-xl p-4">
      <h2 className="text-xl font-bold mb-4">Engagement por Día de la Semana</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#888888" />
          {/* Eje X muestra los días de la semana */}
          <XAxis dataKey="day" stroke="#888888" />
          {/* Eje Y muestra la tasa de engagement */}
          <YAxis stroke="#888888"/>
          <Tooltip />
          <Legend />
          <Bar dataKey="rate" fill="#e8c018" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementByDay;
