"use client";

import { useState } from "react";
import { ThumbsUp, MessageSquare, Verified } from "lucide-react";
import useFetchData from "../../../../hooks/useFetch";
import Loader from "../../../../components/common/Loader";

import InstagramHeader from "../InstagramHeader"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"



import InsightFeed from "./InsightFeed";
import InstagramFeedGrid from "./InstagramFeedGrid";

export default function FeedAnalyzer() {
  const [selectedAccount, setSelectedAccount] = useState("mi_cuenta");
  const [filterType, setFilterType] = useState("engagement");

  const {
    data: postData,
    loading: postLoading,
    error: postError,
  } = useFetchData("/data/infinitekparis_col_posts.json");

  const {
    data: insightData,
    loading: insightLoading,
    error: insightError,
  } = useFetchData("/data/global_insights_infinitekparis_col.json");

  const {
    data: headerData,
    loading: headerLoading,
    error: headerError,
  } = useFetchData("/data/Processed_data_infinitekparis_col.json");

  if (postLoading || insightLoading || headerLoading)
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
  if (postError) return <div>Error en posts: {postError.message}</div>;
  if (insightError) return <div>Error en insights: {insightError.message}</div>;
  if (headerError) return <div>Error en header: {headerError.message}</div>
  if (!postData || postData.length === 0)
    return <div>No hay datos de posts disponibles</div>;
  if (!insightData) return <div>No hay datos de insights disponibles</div>;
  if (!headerData) return <div>No hay datos de header disponibles</div>

  const accountData = headerData.UserInfo

  const posts = postData.map((post, index) => ({
    id: index + 1,
    image: `/data/${
      index === 0
        ? "ad91b300ace666c49adef8b341594b9e.jpeg"
        : index === 1
        ? "3dc49cee2e13559e70a1edab1858771e.jpeg"
        : index === 2
        ? "5d8fb97a8ceb691cdbd926217c029701.jpeg"
        : index === 3
        ? "774a725701ce6eb078b4b3d1fe4c5348.jpeg"
        : index === 4
        ? "74829a8a5f44228a1c976b49dcde22ff.jpeg"
        : index === 5
        ? "c5213c928a54051921ce726817234f5d.jpeg"
        : index === 6
        ? "d03bdf0ae811eae983f8a39cecd86b8b.jpeg"
        : index === 7
        ? "dfc5895f5f6953cf95cf4fbc03333f36.jpeg"
        : index === 8
        ? "f178ff804ad9fcfe765c7d77e82151fc.jpeg"
        : "placeholder.svg"
    }`,
    likes: post.likesCount,
    comments: post.commentsCount,
    engagement: 4.5,
    iconComments: MessageSquare,
    iconLikes: ThumbsUp,
  }));

  return (
    <div className="flex flex-col h-full gap-4 p-4 my-4">
      <div className="flex flex-col lg:flex-row h-full gap-4">
        <InstagramFeedGrid posts={posts} />
        <InsightFeed insightData={insightData} />
      </div>
    </div>
  );
}
