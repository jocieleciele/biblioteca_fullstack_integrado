import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function Painel(){
  const [emprestimos, setEmprestimos] = useState([])
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    (async()=>{
      setLoading(true)
      try{
        const [eRes, rRes] = await Promise.all([api.get('/emprestimos/atrasados'), api.get('/reservas')])
        setEmprestimos(eRes.data)
        setReservas(rRes.data)
      }catch(err){ console.error(err) }
      setLoading(false)
    })()
  }, [])

  const atender = async (id) => { try{ await api.put(`/reservas/${id}/atender`); setReservas(rs=>rs.filter(r=>r.id!==id)) }catch(err){ console.error(err) } }
  const devolver = async (id) => { try{ await api.put(`/emprestimos/${id}/devolver`); setEmprestimos(es=>es.map(e=> e.id===id ? {...e, data_devolucao: new Date().toISOString(), status:'Devolvido'} : e )) }catch(err){ console.error(err) } }

  if(loading) return <div>Carregando...</div>

  return (
    <div className="space-y-6">
      <h2 className="text-xl">Painel</h2>

      <section>
        <h3>Atrasados</h3>
        {emprestimos.map(e => (
          <div key={e.id} className="p-3 bg-panel rounded flex justify-between">
            <div>{e.titulo} — {e.usuario_name}</div>
            <div><button onClick={()=>devolver(e.id)} className="px-3 py-1 bg-accent rounded">Marcar devolução</button></div>
          </div>
        ))}
      </section>

      <section>
        <h3>Reservas pendentes</h3>
        {reservas.map(r => (
          <div key={r.id} className="p-3 bg-panel rounded flex justify-between">
            <div>{r.material_titulo} — {r.usuario_name}</div>
            <div><button onClick={()=>atender(r.id)} className="px-3 py-1 bg-green-600 rounded">Atender</button></div>
          </div>
        ))}
      </section>
    </div>
  )
}