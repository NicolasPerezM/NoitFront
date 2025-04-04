import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/**
 * CommentsStats – Muestra estadísticas sobre los comentarios de un post.
 * Se espera recibir por prop "comments", un array de objetos con al menos:
 * - commentText
 * - commentatorUserName
 */
const CommentsStats = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-4">No hay comentarios para analizar.</div>
    );
  }

  // Total de comentarios y longitud promedio
  const totalComments = comments.length;
  const totalLength = comments.reduce(
    (acc, comment) => acc + comment.commentText.length,
    0
  );
  const averageLength = totalComments > 0 ? totalLength / totalComments : 0;

  // Ranking de comentaristas: contar ocurrencias por commentatorUserName
  const frequencyMap = {};
  comments.forEach((comment) => {
    const username = comment.commentatorUserName;
    frequencyMap[username] = (frequencyMap[username] || 0) + 1;
  });
  const commenterFrequency = Object.entries(frequencyMap)
    .map(([username, count]) => ({ username, count }))
    .sort((a, b) => b.count - a.count);

  // Frecuencia de palabras: extraer palabras de cada commentText
  // Se definen algunas stopwords en español e inglés para filtrar
  const stopwords = new Set([
    "de",
    "la",
    "que",
    "el",
    "en",
    "y",
    "a",
    "los",
    "del",
    "se",
    "las",
    "por",
    "un",
    "para",
    "con",
    "no",
    "una",
    "su",
    "al",
    "lo",
    "como",
    "más",
    "pero",
    "sus",
    "le",
    "ya",
    "o",
    "este",
    "sí",
    "esta",
    "entre",
    "cuando",
    "muy",
    "sin",
    "sobre",
    "también",
    "me",
    "hasta",
    "hay",
    "donde",
    "quien",
    "desde",
    "todo",
    "nos",
    "durante",
    "todos",
    "uno",
    "ni",
    "otros",
    "ese",
    "eso",
    "ante",
    "ellos",
    "esto",
    "antes",
    "algunos",
    "qué",
    "unos",
    "yo",
    "otro",
    "otras",
    "otra",
    "tanto",
    "esa",
    "estos",
    "mucho",
  ]);

  const wordFrequencyMap = {};
  comments.forEach((comment) => {
    // Eliminar signos de puntuación y pasar a minúsculas
    const words = comment.commentText
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()¿?¡"]/g, "")
      .toLowerCase()
      .split(/\s+/);
    words.forEach((word) => {
      if (word.length > 2 && !stopwords.has(word)) {
        wordFrequencyMap[word] = (wordFrequencyMap[word] || 0) + 1;
      }
    });
  });
  const wordFrequency = Object.entries(wordFrequencyMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 palabras

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Tarjetas de KPIs */}
      <div className="bg-theme-light dark:bg-theme-darkest p-4 rounded-xl shadow-xl hover:bg-theme-complementary transition delay-30 text-center dark:hover:text-theme-darkest">
        <h3 className="text-lg font-semibold">Total de Comentarios</h3>
        <p className="text-2xl">{totalComments}</p>
      </div>
      <div className="bg-theme-light dark:bg-theme-darkest p-4 rounded-xl shadow-xl hover:bg-theme-split transition delay-30 text-center dark:hover:text-theme-darkest">
        <h3 className="text-lg font-semibold">Longitud Promedio</h3>
        <p className="text-2xl">{averageLength.toFixed(1)} caracteres</p>
      </div>

      {/* Ranking de comentaristas */}
      <div className="bg-theme-light dark:bg-theme-darkest p-4 rounded-xl shadow-xl transition delay-30 text-center col-span-1 md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Top Comentaristas</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={commenterFrequency}
            margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="username" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#E81840" name="Comentarios" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Frecuencia de palabras en comentarios */}
      <div className="bg-theme-light dark:bg-theme-darkest p-4 rounded-xl shadow-xl  transition delay-30 text-center col-span-1 md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Frecuencia de Palabras</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={wordFrequency}
            margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="word" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#18e8c0" name="Frecuencia" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CommentsStats;
