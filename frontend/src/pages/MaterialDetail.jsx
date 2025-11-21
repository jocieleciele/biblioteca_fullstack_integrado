import React, { useState } from 'react'
import api from '../services/api'

export default function MaterialDetail({ material, onBack, user }){
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleEmprestimo = async () => {
    if(!user) return alert('Faça login antes')
    try{
      setLoading(true)
      const res = await api.post('/emprestimos', { usuarioId: user.id, materialId: material.id })
      setStatus('Empréstimo criado com sucesso')
    }catch(err){ console.error(err); setStatus(err.response?.data?.message || 'Erro ao solicitar empréstimo') }
    finally{ setLoading(false) }
  }

  const handleReserva = async () => {
    if(!user) return alert('Faça login antes')
    try{
      setLoading(true)
      await api.post('/reservas', { usuarioId: user.id, materialId: material.id })
      setStatus('Reserva criada')
    }catch(err){ console.error(err); setStatus('Erro ao reservar') }
    finally{ setLoading(false) }
  }

  return (
    <div className="bg-panel p-4 rounded">
      <button onClick={onBack} className="mb-3 px-3 py-1 border rounded">Voltar</button>
      <h2 className="text-xl font-bold">{material.titulo}</h2>
      <p className="text-sm text-gray-400">{material.autor} • {material.categoria} • {material.ano}</p>

      <div className="mt-4 flex gap-2">
        <button onClick={handleEmprestimo} disabled={loading} className="px-4 py-2 bg-accent rounded">Solicitar Empréstimo</button>
        <button onClick={handleReserva} disabled={loading} className="px-4 py-2 bg-[#334155] rounded">Reservar</button>
      </div>

      {status && <div className="mt-3 text-sm">{status}</div>}

      <div className="mt-4 text-gray-300">
        <div><strong>Status:</strong> {material.disponiveis > 0 ? 'Disponível' : 'Indisponível'}</div>
        <div><strong>Total de cópias:</strong> {material.total}</div>
        <div className="mt-2"><strong>Descrição:</strong><div className="mt-1 text-sm text-gray-400">{material.descricao || '—'}</div></div>
      </div>
    </div>
  )
}