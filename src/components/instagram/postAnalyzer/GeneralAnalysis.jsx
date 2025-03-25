"use client"
import React from "react"
import { BarChart2, Hash, TrendingUp, Lightbulb } from "lucide-react"

/**
 * Componente que muestra el análisis general del feed, incluyendo métricas,
 * gráficos de engagement y de hashtags, y tendencias y sugerencias.
 */
export default function generalAnalysis({ posts, totalLikes, totalComments, totalShares, avgEngagement, topHashtags, bestPost }) {
  return (
    <div className="bg-theme-light dark:bg-theme-dark rounded-xl border-t-1 border-b-1 border-theme-light dark:border-theme-primary shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4 text-theme-darkest dark:text-theme-light">Análisis General</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-theme-white dark:bg-theme-darkest shadow-xl p-4 rounded-lg">
          <div className="text-sm mb-1 text-theme-darkest dark:text-theme-light font-medium">Total Likes</div>
          <div className="text-3xl font-bold text-theme-dark dark:text-theme-white">{totalLikes}</div>
        </div>
        <div className="bg-theme-white dark:bg-theme-darkest shadow-xl p-4 rounded-lg">
          <div className="text-sm mb-1  text-theme-darkest dark:text-theme-light font-medium">Total Comentarios</div>
          <div className="text-2xl font-bold text-theme-dark dark:text-theme-white">{totalComments}</div>
        </div>
        <div className="bg-theme-white dark:bg-theme-darkest shadow-xl p-4 rounded-lg">
          <div className="text-sm mb-1 text-theme-darkest dark:text-theme-light font-medium">Total Compartidos</div>
          <div className="text-2xl font-bold text-theme-dark dark:text-theme-white">{totalShares}</div>
        </div>
        <div className="bg-theme-white dark:bg-theme-darkest shadow-xl p-4 rounded-lg">
          <div className="text-sm text-theme-darkest dark:text-theme-light font-medium mb-1">Engagement Promedio</div>
          <div className="text-2xl font-bold text-theme-dark dark:text-theme-white">{avgEngagement}%</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-semibold mb-3 flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-primary" />
            Engagement por Post
          </h3>
          <div className="h-48 relative">
            <div className="absolute inset-0 flex items-end justify-around px-4">
              {posts.map((post, index) => (
                <div key={index} className="flex flex-col items-center w-1/4">
                  <div
                    className="w-12 bg-primary rounded-t-md transition-all duration-500 ease-in-out"
                    style={{ height: `${post.engagement * 3}%` }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2 text-center">Post {index + 1}</div>
                  <div className="text-xs font-medium">{post.engagement}%</div>
                </div>
              ))}
            </div>
            <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500 py-2">
              <span>15%</span>
              <span>10%</span>
              <span>5%</span>
              <span>0%</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-semibold mb-3 flex items-center">
            <Hash className="h-5 w-5 mr-2 text-primary" />
            Hashtags Más Utilizados
          </h3>
          <div className="h-48 relative">
            <div className="absolute inset-0 flex flex-col justify-around py-2">
              {topHashtags.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-24 text-xs text-gray-600">#{item.tag}</div>
                  <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                      style={{ width: `${(item.count / posts.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-xs font-medium text-gray-700 text-right ml-2">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            Tendencias Encontradas
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>
                  Los posts con formato de pregunta generan <span className="font-medium">3x más comentarios</span> que los posts informativos.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>
                  El mejor horario para publicar es entre <span className="font-medium">14:00-16:00</span>, con un engagement promedio 25% mayor.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>
                  Posts que muestran el lado humano de la marca tienen un <span className="font-medium">engagement 20% mayor</span> que los posts de solo producto.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>
                  El post con mejor rendimiento fue <span className="font-medium">"{bestPost.text.substring(0, 30)}..."</span> con {bestPost.engagement}% de engagement.
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-primary" />
            Sugerencias de Optimización
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>
                  Implementar una estrategia de <span className="font-medium">encuestas semanales</span> para aumentar la participación de la audiencia.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>
                  Crear una serie de posts sobre <span className="font-medium">el proceso creativo</span> y el equipo detrás de la marca.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>
                  Aumentar el uso de <span className="font-medium">hashtags relevantes</span> (5-7 por post) para mejorar el alcance orgánico.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>
                  Programar publicaciones entre <span className="font-medium">14:00-16:00</span> para maximizar el engagement.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2"></span>
                <span>
                  Experimentar con <span className="font-medium">formatos de carrusel</span> para mostrar múltiples ángulos de los productos.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
