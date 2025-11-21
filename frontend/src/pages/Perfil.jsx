import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Perfil({ user }){
  const [emprestimos, setEmprestimos] = useState([])
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    if(!user) return
    (async()=>{
      setLoading(true)
      try{
        const [eRes, rRes] = await Promise.all([api.get(`/emprestimos/user/${user.id}`), api.get(`/reservas/user/${user.id}`)])
        setEmprestimos(eRes.data)
        setReservas(rRes.data)
      }catch(err){ console.error(err) }
      setLoading(false)
    })()
  }, [user])

  if(!user) return <div className="p-6 bg-panel rounded">Faça login para ver seu perfil</div>

  return (
    <div className="space-y-6">
      <h2 className="text-xl">Olá, {user.name}</h2>

      <section>
        <h3 className="font-medium">Empréstimos</h3>
        {loading ? <div>Carregando...</div> : (
          <div className="grid gap-3 mt-2">
            {emprestimos.map(e => (
              <div key={e.id} className="p-3 bg-panel rounded flex items-center justify-between">
                <div>
                  <div className="font-semibold">{e.material_titulo}</div>
                  <div className="text-sm text-gray-400">Vencimento: {e.data_prevista_devolucao?.slice(0,10)}</div>
                </div>
                <div className="text-sm">
                  {new Date(e.data_prevista_devolucao) < new Date() ? <span className="text-red-400">Atrasado</span> : <span className="text-green-300">Em dia</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-medium">Reservas</h3>
        {reservas.map(r => (
          <div key={r.id} className="p-3 bg-panel rounded">{r.material_titulo} - {r.status}</div>
        ))}
      </section>
    </div>
  )
}