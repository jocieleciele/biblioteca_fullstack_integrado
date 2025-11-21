import React from "react";
import { Star } from "lucide-react";

export default function MaterialCard({ material, onOpen }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < material.avaliacao);

  return (
    <div
      onClick={onOpen}
      className="
        bg-panel rounded-xl overflow-hidden cursor-pointer 
        border border-transparent hover:border-accent 
        transition-all duration-300 hover:shadow-lg
      "
    >
      {/* Capa */}
      <div className="h-52 bg-[#0c1622] flex items-center justify-center">
        {material.capa ? (
          <img
            src={material.capa}
            alt={`Capa de ${material.titulo}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-gray-500 text-sm">Sem imagem</span>
        )}
      </div>

      {/* Corpo */}
      <div className="p-4">
        <h3
          className="
            font-semibold text-base 
            truncate mb-1 
            group-hover:text-accent transition-colors
          "
        >
          {material.titulo}
        </h3>

        <p className="text-sm text-gray-400 truncate">{material.autor}</p>

        {/* Avaliação */}
        <div className="flex items-center gap-1 mt-3">
          {stars.map((filled, idx) => (
            <Star
              key={idx}
              size={16}
              className={filled ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

