import React from "react";
import { Star } from "lucide-react";

export default function MaterialCard({ material, onOpen }) {
  return (
    <div
      onClick={onOpen}
      className="bg-panel rounded-lg overflow-hidden cursor-pointer group"
    >
      <div className="h-48 bg-[#061019] flex items-center justify-center">
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
      <div className="p-4">
        <h3 className="font-semibold text-base truncate group-hover:text-accent">
          {material.titulo}
        </h3>
        <p className="text-sm text-gray-400 truncate">{material.autor}</p>
        <div className="flex items-center mt-2 text-xs text-yellow-400">
          <Star size={14} className="mr-1" /> {material.avaliação}
        </div>
      </div>
    </div>
  );
}
