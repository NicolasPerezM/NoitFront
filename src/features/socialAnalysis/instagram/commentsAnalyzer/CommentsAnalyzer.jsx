import TabsInstagram from "../TabsInstagram";
import InstagramHeader from "../InstagramHeader";
import Loader from "../../../../components/common/Loader";
import useFetchData from "../../../../hooks/useFetch";
import { SentimentsByPostChart } from "./SentimentsByPostChart";
import OverallEmotionChart from "./OverallEmotionChart";
export default function CommentsAnalyzer() {
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
    <div className="p-4 mt-4">
      <InstagramHeader accountData={accountData} />
      <TabsInstagram />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center mt-4">
        <div className="lg:col-span-3">
          <SentimentsByPostChart sentimentsData={sentimentsData} />
        </div>
        <div className="lg:col-span-2 lg:col-start-4">
          <OverallEmotionChart emotionData={emotionData} /> 
        </div>
      </div>
    </div>
  );
}
