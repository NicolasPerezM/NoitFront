import { SentimentsByPostChart } from "./SentimentsByPostChart.tsx";
import OverallEmotionChart from "./OverallEmotionChart.tsx";
import CategoryByChart from "./CategoryByChart.tsx";
import AnalysisDialog from "./AnalysisDialog.tsx";

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
      <div className="grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-2 gap-4">
        <div className="lg:col-span-4 lg:h-[500px]">
          <SentimentsByPostChart competitorId={competitorId} />
        </div>
        {/*
        <div className="lg:col-span-2 lg:row-span-2 lg:col-start-5 lg:h-[1032px] h-[400px]">
          <OverallEmotionChart competitorId={competitorId} />
        </div>
        */}
        <div className="lg:col-span-3 lg:row-start-2 lg:h-[500px] h-[400px]">
          <CategoryByChart competitorId={competitorId} />
        </div>
        <div className="lg:col-start-4 lg:row-start-2 lg:h-[500px] h-[400px]">
          <img
            src="/data/output.png"
            alt="placeholder"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div></div>
    </div>
  );
}
