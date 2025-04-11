import React from "react";

/**
 * Componente para mostrar el grid de imágenes de Instagram.
 * Recibe `posts` como prop para mostrar la información de cada post (imagen, likes, comments).
 */
export default function InstagramGrid({ posts }) {
  return (
    <div className="w-full lg:w-2/3">
      <div className="p-6 rounded-2xl dark:bg-sidebar shadow-lg bg-theme-white">
        <h3 className="text-2xl font-semibold mb-4 text-theme-darkest dark:text-theme-light font-orbitron">Feed de Instagram</h3>
        
        {/* Instagram Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative group overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <img
                src={post.image || "/placeholder.svg"}
                alt={`Post ${post.id}`}
                className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlay con efecto de glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 w-full p-4 text-theme-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 bg-black/30 px-3 py-1.5 rounded-full">
                      <post.iconLikes className="h-4 w-4" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-black/30 px-3 py-1.5 rounded-full">
                      <post.iconComments className="h-4 w-4" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Badge de engagement */}
              <div className="absolute top-3 right-3 bg-theme-accent text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                <span className="text-xs">⭐</span>
                <span>{post.engagement}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
