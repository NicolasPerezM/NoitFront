import Loader from "../../../../components/common/Loader";
import useFetchData from "../../../../hooks/useFetch";
import { SentimentsByPostChart } from "./SentimentsByPostChart.tsx";
import OverallEmotionChart from "./OverallEmotionChart.tsx";
import CategoryByChart from "./CategoryByChart.tsx";
import AnalysisDialog from "./AnalysisDialog.tsx";

export default function CommentsAnalyzer({ competitorId }) {
  const {
    data: sentimentsData,
    loading: sentimentsLoading,
    error: sentimentsError,
  } = useFetchData("/data/Sentiment_data_infinitekparis_col.json");

  const {
    data: headerData,
    loading: headerLoading,
    error: headerError,
  } = useFetchData("/data/Processed_data_infinitekparis_col.json");

  const {
    data: emotionData,
    loading: emotionLoading,
    error: emotionError,
  } = useFetchData("/data/Emotion_data_infinitekparis_col.json");

  if (headerLoading || sentimentsLoading || emotionLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader
          size="lg"
          color="primary"
          text="Cargando..."
          fullScreen={false}
        />
      </div>
    );

  if (headerError) return <div>Error al cargar los datos</div>;
  if (!headerData) return <div>No se encontraron datos</div>;
  if (emotionError) return <div>Error al cargar los datos</div>;
  if (!emotionData) return <div>No se encontraron datos</div>;
  if (sentimentsError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Error al cargar los sentimientos</p>
      </div>
    );
  }

  if (!sentimentsData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>No se encontraron comentarios</p>
      </div>
    );
  }

  const accountData = headerData.UserInfo;

  return (
    <div className="">
      <div className="flex flex-col md:flex-row justify-between py-4">
        <div>
          <h2 className="text-3xl font-britanica px-6 font-bold mb-4">
            Análisis de comentarios
          </h2>
          <p className="text-sm text-muted-foreground px-6">
            Análisis de comentarios de la cuenta {accountData.username}
          </p>
        </div>

        <div className="flex md:justify-end mb-4">
          <AnalysisDialog />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-6 lg:grid-rows-2 gap-4">
        <div className="lg:col-span-4 lg:h-[500px]">
          <SentimentsByPostChart sentimentsData={sentimentsData} />
        </div>
        <div className="lg:col-span-2 lg:row-span-2 lg:col-start-5 lg:h-[1032px] h-[400px]">
          <OverallEmotionChart emotionData={emotionData} />
        </div>
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
