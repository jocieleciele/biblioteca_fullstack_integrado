import React, { useState } from 'react'
import api from '../services/api'

export default function Login({ onLogin, onCancel, onGoToRegister }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try{
      setLoading(true)
      const res = await api.post('/auth/login', { email, password })
      onLogin(res.data)
    }catch(err){ console.error(err); setError(err.response?.data?.message || 'Erro ao conectar'); }
    finally{ setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-panel rounded-md p-6 shadow">
      <h2 className="text-xl font-semibold mb-3">Entrar</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-300">E-mail</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md bg-[#061019] border border-gray-800 text-gray-200" />
        </div>
        <div>
          <label className="text-sm text-gray-300">Senha</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-md bg-[#061019] border border-gray-800 text-gray-200" />
        </div>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <div className="flex items-center gap-2">
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-accent text-black">{loading ? 'Entrando...' : 'Entrar'}</button>
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border border-gray-700">Cancelar</button>
        </div>
        <div className="text-center pt-2">
          <p className="text-sm text-gray-400">Não tem uma conta? <button type="button" onClick={onGoToRegister} className="text-accent hover:underline">Registre-se</button></p>
        </div>
      </form>
    </div>
  )
}