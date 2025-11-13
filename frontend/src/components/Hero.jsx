import React, { useState } from 'react'

const livrosExemplo = [
  {id:1, titulo:'Coroa dos Justos (Espada dos Mortos — Livro Três)', autor:'Morgan Rice', categoria:'ficção', ano:2025, capa:'img1'},
  {id:2, titulo:'Canção dos Valentes (Espada dos Mortos — Livro Dois)', autor:'Morgan Rice', categoria:'ficção', ano:2025, capa:'img2'},
  {id:3, titulo:'A Arte da Guerra', autor:'Sun Tzu', categoria:'ação', ano:2009, capa:'img3'},
  {id:4, titulo:'O Encantador de Corvos', autor:'Jacob Grey', categoria:'ficção', ano:2017, capa:'img4'},
]

export default function Hero({ onSearch }) {
  const [q, setQ] = useState('')
  const [resultados, setResultados] = useState([])

  const buscarLivros = () => {
    const termo = q.trim().toLowerCase()
    if (termo === '') {
      setResultados([])
      return
    }
    const encontrados = livrosExemplo.filter(
      (l) =>
        l.titulo.toLowerCase().includes(termo) ||
        l.autor.toLowerCase().includes(termo)
    )
    setResultados(encontrados)
  }

  const abrirDetalhe = (livro) => {
    onSearch(livro)
  }

  return (
    <section className="rounded-lg p-6 bg-gradient-to-r from-[#071018] to-[#0b1420] border border-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Campo de busca */}
        <div>
          <h2 className="text-2xl font-bold text-white">Encontre o próximo livro</h2>
          <p className="mt-2 text-gray-400">
            Busque por título, autor ou categoria. Reserve e receba notificações.
          </p>

          <div className="mt-4 flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Pesquisar..."
              className="flex-1 bg-[#061019] border border-gray-800 rounded-md px-3 py-2 text-gray-200"
            />
            <button
              onClick={buscarLivros}
              className="px-4 py-2 rounded-md bg-accent text-black hover:brightness-95"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Resultados da pesquisa */}
        <div className="bg-panel rounded-md p-4 border border-gray-800 min-h-[220px]">
          {resultados.length === 0 ? (
            <div className="text-gray-500 flex items-center justify-center h-full text-sm">
              Nenhum resultado encontrado
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resultados.map((livro) => (
                <div
                  key={livro.id}
                  onClick={() => abrirDetalhe(livro)}
                  className="bg-[#071018] rounded-md p-3 hover:bg-[#0c1a26] cursor-pointer transition"
                >
                  <div className="h-32 bg-panel flex items-center justify-center text-gray-400 rounded">
                    {livro.capa}
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-white">{livro.titulo}</h3>
                  <p className="text-xs text-gray-400">{livro.autor} • {livro.ano}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
