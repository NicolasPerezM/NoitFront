"use client";
import { useState } from "react";
import GeneralAnalysis from "./GeneralAnalysis";
import PostCard from "./PostCard";
import TabsInstagram from "../TabsInstagram";
import InstagramHeader from "../InstagramHeader";
import useFetchData from "../../../../hooks/useFetch";
import Loader from "../../../../components/common/Loader";
import EngagementTrends from "./EngagementTrends";
import EngagementByDay from "./EngagementByDay";
import PostTypePieChart from "./PostTypePieChart";
import TopPostsScatterChart from "./TopPostsScatterChart";
import HashtagsChart from "./HashtagsChart";

// Página principal que orquesta el análisis de posts.
// Los datos se simulan aquí; en un entorno real se obtendrían de una API.
export default function PostAnalyzer() {
  const [selectedAccount, setSelectedAccount] = useState("mi_cuenta");
  const [sortBy, setSortBy] = useState("date");

  const {
    data: headerData,
    loading: headerLoading,
    error: headerError,
  } = useFetchData("/data/Processed_data_infinitekparis_col.json");

  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
  } = useFetchData("/data/instagram_statistics_infinitekparis_col.json");

  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
  } = useFetchData("/data/infinitekparis_col_posts_filtered.json");

  if (headerLoading || statsLoading || postsLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader
          size="lg"
          color="primary"
          text="Cargando..."
          fullScreen={false}
          speed="normal"
          logo={
            <img
              src="/data/661173d22e87885e52d592e7_Group 73.svg"
              alt="Logo"
              className="object-contain h-full w-full"
            />
          }
        />
      </div>
    );
  if (statsError) return <div>Error en stats: {statsError.message}</div>;
  if (!statsData) return <div>No hay datos en stats</div>;
  if (headerError) return <div>Error en header: {headerError.message}</div>;
  if (!headerData) return <div>No hay datos de header disponibles</div>;
  if (postsError) return <div>Error en posts: {postsError.message}</div>;
  if (!postsData) return <div>No hay datos de posts disponibles</div>;

  const { UserInfo, PostTypeCounts } = headerData;

  const { engagement_trends, engagement_by_day_of_week, top_posts } = statsData;

  const engagementByDayArray = Object.entries(engagement_by_day_of_week).map(
    ([day, rate]) => ({
      day,
      rate,
    })
  );

  return (
    <div className="flex flex-col p-4 gap-4">
      <div className="mt-4">
        <InstagramHeader accountData={UserInfo} />
        <TabsInstagram />
      </div>
      <div className="text-3xl font-bold p-4 dark:text-theme-white">
        <h1>Análisis General de los Posts</h1>
      </div>
      <GeneralAnalysis
        totalLikes={statsData.total_likes}
        totalComments={statsData.total_comments}
        avgEngagement={statsData.avg_engagement_rate}
      />
      <div className="grid grid-cols-6 grid-rows-2 gap-4">
        <div className="col-span-3">
          <EngagementTrends trends={engagement_trends} />
        </div>
        <div className="col-span-3 col-start-4">
          <EngagementByDay data={engagementByDayArray} />
        </div>
        <div className="col-span-4 row-span-2 row-start-2 ">
          <HashtagsChart posts={postsData} />
        </div>
        <div className="col-span-2 row-span-2 col-start-5 row-start-2">
          <PostTypePieChart data={PostTypeCounts} />
        </div>
      </div>
      <div className="text-3xl font-bold p-4 dark:text-theme-white">
        <h1>Posts Analizados</h1>
      </div>
      <div className="space-y-8">
        {top_posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
