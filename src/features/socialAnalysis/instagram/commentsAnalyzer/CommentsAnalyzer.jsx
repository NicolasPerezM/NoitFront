import { SentimentsByPostChart } from "./SentimentsByPostChart.tsx";
import OverallEmotionChart from "./OverallEmotionChart.tsx";
import CategoryByChart from "./CategoryByChart.tsx";
import AnalysisDialog from "./AnalysisDialog.tsx";
import TopicByChart from "./TopicByChart";
import WordCloudChart from "./WordCloudChart";


export default function CommentsAnalyzer({ competitorId }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-2 py-8">
        {/* Header principal */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 px-2">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-6 bg-primary rounded-full" />
              <h2 className="text-3xl font-britanica tracking-tight ">Análisis de comentarios</h2>
            </div>
            <p className="text-base text-muted-foreground font-normal max-w-xl">
              Panel de análisis avanzado de comentarios de Instagram. Visualiza emociones, tópicos, categorías y palabras clave extraídas de los comentarios.
            </p>
          </div>
        </div>

        {/* Grid avanzado según especificación */}
        <div className="grid grid-cols-5 grid-rows-6 gap-6">
          {/* 1: Análisis de sentimiento por post (col-span-3 row-span-2) */}
          <div className="col-span-3 row-span-2 bg-card/60 rounded-xl shadow-md p-6 flex flex-col">
            
            <SentimentsByPostChart competitorId={competitorId} />
          </div>

          {/* 2: Distribución de emociones (col-span-2 row-span-2 col-start-4) */}
          <div className="col-span-2 row-span-2 col-start-4 bg-card/60 rounded-xl shadow-md p-6 flex flex-col">
            
            <OverallEmotionChart competitorId={competitorId} />
          </div>

          {/* 3: Descripción de la gráfica en texto (row-span-2 row-start-3) */}
          <div className="row-span-2 row-start-3 flex items-center justify-center bg-card/40 rounded-xl shadow-sm px-8 py-6">
            <div className="text-center">
              <h3 className="text-2xl font-normal text-primary mb-2">Distribución de Palabras Dominantes por Tópico</h3>
              <p className="text-lg text-muted-foreground font-normal max-w-2xl mx-auto">
                Cada panel representa un tópico diferente identificado mediante análisis de texto de los comentarios.<br /><br />
                El <span className="font-semibold text-purple-700">peso</span> indica la relevancia de cada palabra dentro del tópico, donde valores más altos representan mayor importancia.<br /><br />
                Los colores van de <span className="font-semibold text-purple-700">púrpura</span> (mayor peso) a <span className="font-semibold text-orange-500">naranja</span> (menor peso) para facilitar la identificación visual.
              </p>
            </div>
          </div>

          {/* 4: Distribución de palabras dominantes por tópico (col-span-4 row-span-2 row-start-3) */}
          <div className="col-span-4 row-span-2 row-start-3 bg-card/60 rounded-xl shadow-md p-6 flex flex-col">
            
            <TopicByChart competitorId={competitorId} />
          </div>

          {/* 5: Distribución de categorías de comentarios (col-span-3 row-span-2 row-start-5) */}
          <div className="col-span-3 row-span-2 row-start-5 bg-card/60 rounded-xl shadow-md p-6 flex flex-col">
            
            <CategoryByChart competitorId={competitorId} />
          </div>

          {/* 6: Nube de palabras (col-span-2 row-span-2 col-start-4 row-start-5) */}
          <div className="col-span-2 row-span-2 col-start-4 row-start-5 bg-card/60 rounded-xl shadow-md p-6 flex flex-col">
            <WordCloudChart competitorId={competitorId} />
          </div>
        </div>
      </div>
    </div>
  );
}