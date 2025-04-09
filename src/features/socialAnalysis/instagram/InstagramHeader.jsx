"use client"

import { RefreshCw } from "lucide-react"
import useFetchData from "../../../hooks/useFetch"

export default function InstagramHeader() {

  const {
      data: headerData,
      loading: headerLoading,
      error: headerError,
    } = useFetchData("/data/Processed_data_infinitekparis_col.json");

    if(!headerData) return <div>No hay datos de header disponibles</div>
    if(headerLoading) return <div>Cargando...</div>
    if(headerError) return <div>Error al cargar los datos</div>

    const { UserInfo } = headerData;
  
  return (
    <div className="flex items-center justify-between w-full p-4">
      <div className="flex items-center justify-between w-full mx-auto py-6">
        <div className="flex flex-col  w-full justify-between md:flex-row md:items-center gap-4 md:gap-16">
          <div className="flex items-center gap-4 lg:gap-16">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-theme-light dark:bg-gray-700">
              <img
                src="/placeholder.svg?height=64&width=64"
                alt={UserInfo.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl text-theme-darkest dark:text-theme-white font-sora font-medium">{UserInfo.fullName}</h1>
                {UserInfo.verified && (
                  <span className="text-blue-500">
                    
                  </span>
                )}
              </div>
              <p className="text-theme-dark dark:text-theme-light">@{UserInfo.username}</p>
              <p className="text-theme-gray text-sm mt-1">{UserInfo.businessCategory}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl">{UserInfo.followersCount.toLocaleString()}</span>
              <span className="text-sm text-theme-gray">Seguidores</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl">{UserInfo.followsCount.toLocaleString()}</span>
              <span className="text-sm text-theme-gray">Siguiendo</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl">{UserInfo.totalPosts.toLocaleString()}</span>
              <span className="text-sm text-theme-gray">Posts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

