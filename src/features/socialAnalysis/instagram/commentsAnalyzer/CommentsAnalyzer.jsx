import { SentimentsByPostChart } from "./SentimentsByPostChart.tsx";
import OverallEmotionChart from "./OverallEmotionChart.tsx";
import CategoryByChart from "./CategoryByChart.tsx";
import AnalysisDialog from "./AnalysisDialog.tsx";
import TopicByChart from "./TopicByChart";
import WordCloudChart from "./WordCloudChart";

export default function CommentsAnalyzer({ competitorId }) {
  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between py-4">
        <div>
          <h2 className="text-3xl font-britanica px-6 font-bold mb-4">
            Análisis de comentarios
          </h2>
          <p className="text-sm text-muted-foreground px-6">
            Análisis de comentarios de la cuenta
          </p>
        </div>
      </div>
      
      {/* Nuevo grid avanzado según especificación */}
      <div className="grid grid-cols-5 grid-rows-6 gap-4">
        {/* 1: Análisis de sentimiento por post (col-span-3 row-span-2) */}
        <div className="col-span-3 row-span-2">
          <SentimentsByPostChart competitorId={competitorId} />
        </div>
        {/* 2: Distribución de emociones (col-span-2 row-span-2 col-start-4) */}
        <div className="col-span-2 row-span-2 col-start-4">
          <OverallEmotionChart competitorId={competitorId} />
        </div>
        {/* 3: Descripción de la gráfica en texto (row-span-2 row-start-3) */}
        <div className="row-span-2 row-start-3 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl mb-2">Distribución de Palabras Dominantes por Tópico</h3>
            <p className="text-lg text-gray-600">
              Cada panel representa un tópico diferente identificado mediante análisis de texto de los comentarios.

El peso (weight) indica la relevancia de cada palabra dentro del tópico, donde valores más altos representan mayor importancia.

Los colores van de púrpura (mayor peso) a naranja (menor peso) para facilitar la identificación visual.
            </p>
          </div>
        </div>
        {/* 4: Distribución de palabras dominantes por tópico (col-span-4 row-span-2 row-start-3) */}
        <div className="col-span-4 row-span-2 row-start-3">
          <TopicByChart competitorId={competitorId} />
        </div>
        {/* 5: Distribución de categorías de comentarios (col-span-3 row-span-2 row-start-5) */}
        <div className="col-span-3 row-span-2 row-start-5">
          <CategoryByChart competitorId={competitorId} />
        </div>
        {/* 6: Nube de palabras (col-span-2 row-span-2 col-start-4 row-start-5) */}
        <div className="col-span-2 row-span-2 col-start-4 row-start-5">
          <WordCloudChart competitorId={competitorId} />
        </div>
      </div>
    </div>
  );
}