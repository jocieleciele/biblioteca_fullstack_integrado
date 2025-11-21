import React, { useEffect, useState } from 'react'
import api from '../services/api'
import MaterialCard from '../components/MaterialCard'
import MaterialDetail from './MaterialDetail'

export default function Acervo({ user }){
  const [materials, setMaterials] = useState([])
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = async (query='') => {
    setLoading(true)
    try{
      const res = await api.get('/materials' + (query ? '?q=' + encodeURIComponent(query) : ''))
      setMaterials(res.data)
    }catch(err){ console.error(err) }
    setLoading(false)
  }

  useEffect(()=>{ load() }, [])

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Pesquisar por título, autor ou categoria" className="flex-1 bg-[#061019] p-2 rounded" />
        <button onClick={()=>load(q)} className="px-4 py-2 bg-accent rounded">Buscar</button>
      </div>

      {selected ? (
        <MaterialDetail user={user} material={selected} onBack={()=>setSelected(null)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {loading ? <div>Carregando...</div> : materials.map(m => <MaterialCard key={m.id} material={m} onOpen={() => setSelected(m)} />)}
        </div>
      )}
    </div>
  )
}