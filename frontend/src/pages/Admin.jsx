// frontend/src/pages/Admin.jsx
import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Admin(){
  const [stats, setStats] = useState(null)
  useEffect(()=> {
    async function load(){
      try {
        const r = await api.get('/emprestimos/stats')
        setStats(r.data)
      } catch(err){ console.error(err) }
    }
    load()
  }, [])

  if(!stats) return <div>Carregando...</div>
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-panel rounded">
        <div className="text-sm text-gray-400">Total Empréstimos</div>
        <div className="text-2xl font-bold">{stats.totalEmprestimos}</div>
      </div>
      <div className="p-4 bg-panel rounded">
        <div className="text-sm text-gray-400">Atrasados</div>
        <div className="text-2xl font-bold text-red-400">{stats.atrasados}</div>
      </div>
      <div className="p-4 bg-panel rounded">
        <div className="text-sm text-gray-400">Usuários</div>
        <div className="text-2xl font-bold">{stats.totalUsers}</div>
      </div>
    </div>
  )
}
