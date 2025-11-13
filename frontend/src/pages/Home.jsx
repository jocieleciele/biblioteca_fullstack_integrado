import React from 'react'
import Hero from '../components/Hero'
import MaterialCard from '../components/MaterialCard'

const sampleMaterials = [
 {id:1, titulo:'Coroa dos Justos (Espada dos Mortos — Livro Três)', autor:'Morgan Rice', categoria:'ficção', ano:2025, capa:'img1', avaliação:4, total:2, link:'https://books.google.com.br/books?id=eDNuEQAAQBAJ&newbks=0&lpg=PT1&dq=livros%20de%20fic%C3%A7%C3%A3o%20e%20fantasia%20mais%20vendidos&hl=pt-BR&pg=PP1&output=embed'},
 {id:2, titulo:'Canção dos Valentes (Espada dos Mortos — Livro Dois)', autor:'Morgan Rice', categoria:'ficção', ano:2025, capa:'img2', avaliação:5, total:1, link:'https://books.google.com.br/books?id=ajNuEQAAQBAJ&newbks=0&lpg=PT1&dq=livros%20de%20fic%C3%A7%C3%A3o%20e%20fantasia%20mais%20vendidos&hl=pt-BR&pg=PT1&output=embed'},
 {id:3, titulo:'A Arte da Guerra', autor:'Sun Tzu', categoria:'ação', ano:2009, capa:'img3', avaliação:3, total:5, link:'https://books.google.com.br/books?id=FxPNEAAAQBAJ&newbks=0&lpg=PT2&dq=livro%20arte%20da%20guerra&hl=pt-BR&pg=PT2&output=embed'},
 {id:4, titulo:'O encantador de corvos - Ferinos - vol. 1', autor:'Jacob Grey', categoria:'ficção', ano:2017, capa:'img4', avaliação:2, total:2, link:'https://books.google.com.br/books?id=ioArDwAAQBAJ&newbks=0&lpg=PT274&dq=trono%20de%20vidro&hl=pt-BR&pg=PT274&output=embed'}
]

export default function Home({ onSearch }) {
  return (
    <div>
      {/* Hero com busca e resultados */}
      <Hero
        onSearch={(livro) => {
          // se o usuário clicou em um livro, abre os detalhes
          if (livro && livro.id) {
            onSearch(livro)
          } else {
            // caso apenas tenha feito uma busca genérica, vai para o acervo
            onSearch('')
          }
        }}
      />

      {/* Seção de recomendados */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recomendados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleMaterials.map((m) => (
            <MaterialCard key={m.id} material={m} onOpen={() => onSearch(m)} />
          ))}
        </div>
      </section>
    </div>
  )
}