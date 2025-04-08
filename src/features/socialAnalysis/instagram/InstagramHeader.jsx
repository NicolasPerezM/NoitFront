"use client"

import { RefreshCw } from "lucide-react"

export default function InstagramHeader({ accountData }) {
  
  return (
    <div className="">
      <div className="mx-auto py-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-16">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-theme-light dark:bg-gray-700">
              <img
                src="/placeholder.svg?height=64&width=64"
                alt={accountData.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl text-theme-darkest dark:text-theme-white font-sora font-medium">{accountData.fullName}</h1>
                {accountData.verified && (
                  <span className="text-blue-500">
                    
                  </span>
                )}
              </div>
              <p className="text-theme-dark dark:text-theme-light">@{accountData.username}</p>
              <p className="text-theme-gray text-sm mt-1">{accountData.businessCategory}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl">{accountData.followersCount.toLocaleString()}</span>
              <span className="text-sm text-theme-gray">Seguidores</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl">{accountData.followsCount.toLocaleString()}</span>
              <span className="text-sm text-theme-gray">Siguiendo</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl">{accountData.totalPosts.toLocaleString()}</span>
              <span className="text-sm text-theme-gray">Posts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

