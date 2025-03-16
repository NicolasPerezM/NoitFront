"use client"

import { useState } from "react"
import { RefreshCw, ChevronDown, Filter } from "lucide-react"

export default function FeedAnalyzer() {
  const [selectedAccount, setSelectedAccount] = useState("mi_cuenta")
  const [filterType, setFilterType] = useState("engagement")

  const accounts = [
    { id: "mi_cuenta", name: "Mi Cuenta" },
    { id: "cuenta2", name: "Cuenta 2" },
    { id: "cuenta3", name: "Cuenta 3" },
  ]

  const filters = [
    { id: "engagement", name: "Engagement" },
    { id: "likes", name: "Likes" },
    { id: "fecha", name: "Fecha" },
  ]

  const posts = [
    { id: 1, image: "/data/ad91b300ace666c49adef8b341594b9e.jpeg", likes: 120, comments: 24, engagement: 4.5 },
    { id: 2, image: "/data/3dc49cee2e13559e70a1edab1858771e.jpeg", likes: 85, comments: 12, engagement: 3.2 },
    { id: 3, image: "/data/5d8fb97a8ceb691cdbd926217c029701.jpeg", likes: 210, comments: 45, engagement: 7.8 },
    { id: 4, image: "/data/774a725701ce6eb078b4b3d1fe4c5348.jpeg", likes: 65, comments: 8, engagement: 2.1 },
    { id: 5, image: "/data/74829a8a5f44228a1c976b49dcde22ff.jpeg", likes: 150, comments: 32, engagement: 5.6 },
    { id: 6, image: "/data/c5213c928a54051921ce726817234f5d.jpeg", likes: 95, comments: 18, engagement: 3.8 },
    { id: 7, image: "/data/d03bdf0ae811eae983f8a39cecd86b8b.jpeg", likes: 180, comments: 36, engagement: 6.2 },
    { id: 8, image: "/data/dfc5895f5f6953cf95cf4fbc03333f36.jpeg", likes: 75, comments: 14, engagement: 2.9 },
    { id: 9, image: "/data/f178ff804ad9fcfe765c7d77e82151fc.jpeg", likes: 130, comments: 28, engagement: 4.8 },
  ]

  return (
    <div className="flex flex-row-reverse h-full gap-6">
      {/* RIGHT SIDE - Text Analysis */}
      <div className="w-full lg:w-1/3 space-y-6 overflow-auto pr-0 lg:pr-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Feed Analyzer</h2>
            <button className="flex items-center text-sm text-primary hover:text-primary-dark">
              <RefreshCw className="h-4 w-4 mr-1" />
              Actualizar
            </button>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-md font-semibold mb-3">Resumen del Análisis</h3>
          <p className="text-sm text-gray-600 mb-4">
            El feed muestra una estética coherente con predominio de tonos cálidos. El engagement es moderado con
            potencial de mejora en la frecuencia de publicación.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Puntos Fuertes</h4>
              <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
                <li>Calidad visual consistente</li>
                <li>Buena respuesta en contenido de producto</li>
                <li>Interacción positiva en publicaciones con personas</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Áreas de Mejora</h4>
              <ul className="text-sm text-gray-600 space-y-1 pl-5 list-disc">
                <li>Aumentar frecuencia de publicación</li>
                <li>Incorporar más llamadas a la acción</li>
                <li>Experimentar con formatos de carrusel</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Analysis */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-md font-semibold mb-3">Análisis de Contenido</h3>
          <p className="text-sm text-gray-600 mb-4">
            El análisis de contenido muestra que las publicaciones con personas tienen un 45% más de engagement que las
            publicaciones de solo producto.
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fotos de producto</span>
              <span className="font-medium">32%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "32%" }}></div>
            </div>

            <div className="flex justify-between text-sm mt-3">
              <span className="text-gray-600">Fotos con personas</span>
              <span className="font-medium">58%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "58%" }}></div>
            </div>

            <div className="flex justify-between text-sm mt-3">
              <span className="text-gray-600">Carruseles</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
            </div>

            <div className="flex justify-between text-sm mt-3">
              <span className="text-gray-600">Videos</span>
              <span className="font-medium">72%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "72%" }}></div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="text-md font-semibold mb-3">Recomendaciones</h3>
          <ul className="text-sm text-gray-600 space-y-2 pl-5 list-disc">
            <li>Aumentar la frecuencia de publicación a 3-4 veces por semana</li>
            <li>Incluir más contenido con personas usando el producto</li>
            <li>Experimentar con formatos de carrusel para mostrar múltiples ángulos</li>
            <li>Incorporar más llamadas a la acción en las descripciones</li>
            <li>Utilizar hashtags más específicos del nicho para aumentar el alcance</li>
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE - Instagram Feed Images */}
      <div className="w-full lg:w-2/3">
        <div className="bg-white p-4 rounded-xl shadow-sm h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Feed de Instagram</h2>

            <div className="flex items-center">
              <div className="relative mr-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-8 pr-4 py-1 text-sm border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {filters.map((filter) => (
                    <option key={filter.id} value={filter.id}>
                      {filter.name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Instagram Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="relative group aspect-square overflow-hidden rounded-md border border-gray-100"
              >
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={`Post ${post.id}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-white text-center">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-14a6 6 0 110 12 6 6 0 010-12zm0 9a1 1 0 100-2 1 1 0 000 2zm0-6a1 1 0 100 2 1 1 0 000-2z" />
                        </svg>
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                          <path d="M10 7a1 1 0 00-1 1v3a1 1 0 002 0V8a1 1 0 00-1-1z" />
                          <path d="M10 12a1 1 0 100 2 1 1 0 000-2z" />
                        </svg>
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <button className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-2 py-1 rounded-full">
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>

                {/* Engagement Badge */}
                <div className="absolute top-2 right-2 bg-primary text-white text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center">
                  <span>{post.engagement}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}



