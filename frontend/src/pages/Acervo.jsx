import React, { useState, useEffect } from "react";
import MaterialCard from "../components/MaterialCard.jsx";

export default function Acervo({ query, onOpen }) {
  const [q, setQ] = useState(typeof query === "string" ? query : "");
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        // Vamos buscar por "ficção" como um exemplo inicial
        const response = await fetch(
          "https://www.googleapis.com/books/v1/volumes?q=ficção&maxResults=12"
        );
        if (!response.ok) {
          throw new Error("Falha ao buscar livros");
        }
        const data = await response.json();

        // A API do Google Books tem uma estrutura diferente. Vamos adaptar.
        const formattedBooks = data.items.map((item) => ({
          id: item.id,
          titulo: item.volumeInfo.title,
          autor: item.volumeInfo.authors
            ? item.volumeInfo.authors.join(", ")
            : "Autor desconhecido",
          categoria: item.volumeInfo.categories
            ? item.volumeInfo.categories[0]
            : "Sem categoria",
          ano: item.volumeInfo.publishedDate
            ? new Date(item.volumeInfo.publishedDate).getFullYear()
            : "N/A",
          capa: item.volumeInfo.imageLinks?.thumbnail || "", // Pega a imagem da capa
          avaliação: item.volumeInfo.averageRating || 0,
          total: 1, // A API não informa o total, então definimos como 1
          link: item.volumeInfo.infoLink,
        }));

        setMaterials(formattedBooks);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []); // O array vazio [] faz com que este efeito rode apenas uma vez

  const filteredMaterials = materials.filter((m) => {
    const qq = (q || "").trim().toLowerCase();
    if (!qq) return true;
    return (
      m.titulo.toLowerCase().includes(qq) ||
      m.autor.toLowerCase().includes(qq) ||
      (m.categoria || "").toLowerCase().includes(qq)
    );
  });

  return (
    <div>
      <div className="flex items-center gap-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título, autor ou categoria"
          className="flex-1 bg-[#061019] border border-gray-800 rounded-md px-4 py-2 text-gray-200"
        />
        <button
          onClick={() => setQ("")}
          className="px-4 py-2 rounded-md bg-[#334155]"
        >
          Limpar
        </button>
      </div>

      {loading && <div className="text-center mt-10">Carregando livros...</div>}
      {error && (
        <div className="text-center mt-10 text-red-400">Erro: {error}</div>
      )}

      {!loading && !error && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((m) => (
            <MaterialCard key={m.id} material={m} onOpen={() => onOpen(m)} />
          ))}
        </div>
      )}
    </div>
  );
}
