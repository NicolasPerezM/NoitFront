import React from "react";

/**
 * Componente para mostrar el grid de imágenes de Instagram.
 * Recibe `posts` como prop para mostrar la información de cada post (imagen, likes, comments).
 */
export default function InstagramGrid({ posts }) {
  return (
    <div className="w-full lg:w-2/3 overflow-hidden h-full">
      <div className="bg-dark-blue p-4 rounded-xl shadow-sm h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-semibold text-theme-primary">Feed de Instagram</h2>
          <p className="italic text-lg">@infnitekparis</p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full h-[90%]">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative group overflow-hidden rounded-md  cursor-pointer"
            >
              <img
                src={post.image || "/placeholder.svg"}
                alt={`Post ${post.id}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-70">
                <div className="text-white text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="flex items-center">
                      <post.iconLikes className="h-5 w-5 mr-1" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <post.iconComments className="h-5 w-5 mr-1" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Si quieres mostrar la badget de engagement, descomenta
              <div className="absolute top-2 right-2 bg-primary text-white text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center">
                <span>{post.engagement}%</span>
              </div>
              */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
