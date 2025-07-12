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
        <div className="flex md:justify-end mb-4">
          <AnalysisDialog />
        </div>
      </div>
      <div className="flex flex-col  gap-4">
        <div className="lg:col-span-4 lg:h-[500px]">
          <SentimentsByPostChart competitorId={competitorId} />
        </div>
        
        <div className="lg:col-span-2 lg:row-span-2 lg:col-start-5 lg:h-[1032px] h-[400px]">
          <OverallEmotionChart competitorId={competitorId} />
        </div>
        
        <div className="lg:col-span-3 lg:row-start-2 lg:h-[500px] h-[400px]">
          <CategoryByChart competitorId={competitorId} />
        </div>
        {/* Nueva sección: Temas principales */}
        <div className="lg:col-span-6 lg:h-[500px] h-[400px]">
          <TopicByChart competitorId={competitorId} />
        </div>
        {/* Nueva sección: Wordcloud */}
        <div className="lg:col-span-6 lg:h-[400px] h-[350px]">
          <WordCloudChart competitorId={competitorId} />
        </div>
      </div>
      <div></div>
    </div>
  );
}
