"use client"

import { RefreshCw } from "lucide-react"

export default function InstagramHeader({ accountData }) {
  
  return (
    <div className="bg-theme-white dark:bg-theme-darkest shadow-xl border-t rounded-t-lg dark:border-theme-primary border-theme-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                <h1 className="text-3xl text-theme-darkest dark:text-theme-white font-orbitron font-bold">{accountData.fullName}</h1>
                {accountData.verified && (
                  <span className="text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
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

