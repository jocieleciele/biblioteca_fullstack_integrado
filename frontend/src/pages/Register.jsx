import React, { useState } from 'react'
import api from '../services/api'

export default function Register({ onSuccess }){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setError(null)
    if(password !== confirm) return setError('Senhas não conferem')
    try{
      setLoading(true)
      const res = await api.post('/auth/register', { name, email, password })
      onSuccess(res.data.user)
    }catch(err){ setError(err.response?.data?.message || 'Erro ao cadastrar') }
    finally{ setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-panel rounded-md p-6 shadow">
      <h2 className="text-xl font-semibold mb-3">Registrar</h2>
      <form onSubmit={handle} className="space-y-3">
        <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nome" className="w-full p-2 bg-[#061019] rounded" />
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 bg-[#061019] rounded" />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Senha" className="w-full p-2 bg-[#061019] rounded" />
        <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Confirmar Senha" className="w-full p-2 bg-[#061019] rounded" />
        {error && <div className="text-red-400">{error}</div>}
        <button className="px-4 py-2 bg-accent rounded">Registrar</button>
      </form>
    </div>
  )
}