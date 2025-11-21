import React, { useEffect, useState } from "react";
import api from "../services/api";
import MaterialCard from "../components/MaterialCard";

export default function Home({ onOpenMaterial }) {
  const [recommended, setRecommended] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Carregar recomendados
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/materials/recommended");
        setRecommended(res.data);
      } catch (err) {
        console.error("Erro carregando recomendados:", err);
      }
    })();
  }, []);

  // Buscar materiais
  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await api.get(`/materials/search?q=${query}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error("Erro na busca:", err);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 text-white">
      {/* ====================== HERO ====================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ESQUERDA — texto + campo de busca */}
        <div className="bg-gray-900/60 p-8 rounded-xl shadow">
          <h1 className="text-2xl font-bold mb-2">Encontre o próximo livro</h1>
          <p className="text-gray-300 mb-4">
            Busque por título, autor ou categoria. Reserve e receba notificações.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-md bg-gray-800 border border-gray-700"
              placeholder="Pesquisar..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-md"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* DIREITA — caixa de resultados */}
        <div className="bg-gray-900/60 p-8 rounded-xl shadow flex items-center justify-center">
          {loading ? (
            <p className="text-gray-400">Carregando...</p>
          ) : query && searchResults.length === 0 ? (
            <p className="text-gray-500">Nenhum resultado encontrado</p>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {searchResults.map((m) => (
                <MaterialCard
                  key={m.id}
                  material={m}
                  onOpen={() => onOpenMaterial(m)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Nenhuma busca realizada ainda</p>
          )}
        </div>
      </div>

      {/* ====================== RECOMENDADOS ====================== */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Recomendados</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommended.map((m) => (
            <MaterialCard
              key={m.id}
              material={m}
              onOpen={() => onOpenMaterial(m)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
