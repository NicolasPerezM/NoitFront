"use client";
import { useState } from "react";
import GeneralAnalysis from "./GeneralAnalysis";
import PostCard from "./PostCard";

import InstagramHeader from "../InstagramHeader";
import useFetchData from "../../../../hooks/useFetch";
import Loader from "../../../../components/common/Loader";
import EngagementTrends from "./EngagementTrends";
import EngagementByDay from "./EngagementByDay.tsx";
import PostTypePieChart from "./PostTypePieChart.tsx";
import HashtagsChart from "./HashtagsChart.tsx";
import { AnalysisTabs } from "../analysis-tabs";
import PostTable from "../post-table.tsx";

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
    <div className="flex flex-col px-4 gap-4">
      <div className="" />

      <div className="text-3xl font-sora font-medium px-4 dark:text-theme-white">
        <h1>Análisis General de los Posts</h1>
      </div>

      <GeneralAnalysis
        totalLikes={statsData.total_likes}
        totalComments={statsData.total_comments}
        avgEngagement={statsData.avg_engagement_rate}
      />

      {/* 🔁 Sección de tarjetas en grid responsivo */}

      <div className="grid grid-cols-1 lg:grid-cols-5 lg:grid-rows-2 grid-rows-1 gap-4">
        <div className="lg:col-span-3 h-[500px] p-1">
          <EngagementTrends trends={engagement_trends} />
        </div>
          <div className="lg:col-span-2 lg:col-start-4 h-[500px] p-1">
          <PostTypePieChart data={PostTypeCounts} />
        </div>
        <div className="lg:col-span-3 lg:col-start-3 lg:row-start-2 h-[500px] p-1">
          <EngagementByDay data={engagementByDayArray} />
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 overflow-hidden h-[500px] p-1">
          <HashtagsChart posts={postsData} />
        </div>
      </div>

      <div className="text-3xl font-bold font-sora p-4 dark:text-theme-white">
        <h1>Posts Analizados</h1>
      </div>
      <PostTable></PostTable>
    </div>
  );
}
