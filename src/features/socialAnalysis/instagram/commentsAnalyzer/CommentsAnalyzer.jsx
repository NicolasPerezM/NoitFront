import TabsInstagram from "../TabsInstagram";
import InstagramHeader from "../InstagramHeader";
import Loader from "../../../../components/common/Loader";
import useFetchData from "../../../../hooks/useFetch";
export default function CommentsAnalyzer() {

    const {
        data: headerData,
        loading: headerLoading,
        error: headerError,
      } = useFetchData("/data/Processed_data_infinitekparis_col.json");

      if(headerLoading) return (
        <div className="w-full h-full flex items-center justify-center">
          <Loader
            size="lg"
            color="primary"
            text="Cargando..."
            fullScreen={false}
          />
        </div>
      );

      if(headerError) return <div>Error al cargar los datos</div>;
      if(!headerData) return <div>No se encontraron datos</div>;

      const accountData = headerData.UserInfo;

    return (
        <div className="p-4 mt-4">
            <InstagramHeader accountData={accountData}/>
            <TabsInstagram />
        </div>
    );
}   