import React from "react";

/**
 * Componente para mostrar el análisis del feed y recomendaciones.
 * Recibe `insightData` como prop para mostrar la información obtenida.
 */
export default function AnalysisSummary({ insightData }) {
  return (
    
    <div className="w-full lg:w-1/3 overflow-hidden pr-0 lg:pr-4">
      {/* Analysis Summary */}
      <div className="bg-theme-light  dark:bg-theme-dark p-4 rounded-xl shadow-xl mb-4">
        <h3 className="text-2xl font-semibold mb-3 text-theme-darkest dark:text-theme-light font-orbitron">Análisis del Feed</h3>
        <p className="text-sm  mb-4">{insightData.final_insight}</p>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-theme-darkest dark:text-theme-light ">Puntos Fuertes</h4>
            <ul className="text-sm  space-y-1 pl-5 list-disc">
              <li>Calidad visual consistente</li>
              <li>Buena respuesta en contenido de producto</li>
              <li>Interacción positiva en publicaciones con personas</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-theme-darkest dark:text-theme-light  mb-2">Áreas de Mejora</h4>
            <ul className="text-sm space-y-1 pl-5 list-disc">
              <li>Aumentar frecuencia de publicación</li>
              <li>Incorporar más llamadas a la acción</li>
              <li>Experimentar con formatos de carrusel</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Additional Analysis */}
      <div className="bg-dark-blue p-4 rounded-xl shadow-sm mb-4 bg-theme-light dark:bg-theme-dark">
        <h3 className="text-md font-semibold mb-3 text-theme-darkest dark:text-theme-light ">Análisis de Contenido</h3>
        <p className="text-sm mb-4">
          El análisis de contenido muestra que las publicaciones con personas tienen un 45% más de engagement que las
          publicaciones de solo producto.
        </p>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fotos de producto</span>
            <span className="font-medium">32%</span>
          </div>
          <div className="w-full bg-theme-gray rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: "32%" }}></div>
          </div>

          <div className="flex justify-between text-sm mt-3">
            <span className="text-gray-600">Fotos con personas</span>
            <span className="font-medium">58%</span>
          </div>
          <div className="w-full bg-theme-gray rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: "58%" }}></div>
          </div>

          <div className="flex justify-between text-sm mt-3">
            <span className="text-gray-600">Carruseles</span>
            <span className="font-medium">45%</span>
          </div>
          <div className="w-full bg-theme-gray rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
          </div>

          <div className="flex justify-between text-sm mt-3">
            <span className="text-gray-600">Videos</span>
            <span className="font-medium">72%</span>
          </div>
          <div className="w-full bg-dark-blue rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: "72%" }}></div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-dark-blue p-4 rounded-xl shadow-sm bg-theme-light dark:bg-theme-dark">
        <h3 className="text-md font-semibold mb-3 text-theme-darkest dark:text-theme-light ">Recomendaciones</h3>
        <ul className="text-sm space-y-2 pl-5 list-disc">
          <li>Aumentar la frecuencia de publicación a 3-4 veces por semana</li>
          <li>Incluir más contenido con personas usando el producto</li>
          <li>Experimentar con formatos de carrusel para mostrar múltiples ángulos</li>
          <li>Incorporar más llamadas a la acción en las descripciones</li>
          <li>Utilizar hashtags más específicos del nicho para aumentar el alcance</li>
        </ul>
      </div>
      
    </div>
    
  );
}
