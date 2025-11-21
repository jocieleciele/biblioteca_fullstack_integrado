import React, { useState } from "react";

export default function Hero({ onSearch }) {
  const [q, setQ] = useState("");

  return (
    <section className="grid md:grid-cols-2 gap-6 mt-10">
      {/* Busca */}
      <div className="bg-panel rounded-xl p-6 border border-[#182635]">
        <h2 className="text-xl font-semibold mb-2">Encontre o próximo livro</h2>
        <p className="text-gray-400 mb-4">
          Busque por título, autor ou categoria. Reserve e receba notificações.
        </p>

        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquisar..."
            className="
              flex-1 px-4 py-3 rounded-lg bg-[#0d1824]
              border border-[#1e2d3d] focus:border-accent
              focus:outline-none placeholder-gray-500
            "
          />

          <button
            onClick={() => onSearch(q)}
            className="px-5 py-3 bg-accent text-black font-semibold rounded-lg 
                       hover:brightness-110 transition shadow"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-panel rounded-xl p-6 border border-[#182635] flex items-center justify-center">
        <span className="text-gray-500">Nenhum resultado encontrado</span>
      </div>
    </section>
  );
}
