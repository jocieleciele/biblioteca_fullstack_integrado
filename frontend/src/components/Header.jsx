import React from 'react'

export default function Header({ onNavigate, user, onLogout, onShowLogin }){
  return (
    <header className="border-b border-gray-800 bg-[#071018]">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-panel shadow"><span className="text-xl font-bold text-white">SGB</span></div>
          <div><h1 className="text-lg font-semibold">Biblioteca</h1></div>
        </div>

        <nav className="flex items-center gap-3">
          <button onClick={() => onNavigate('home')} className="px-3 py-2 rounded-md hover:bg-gray-800">Início</button>
          <button onClick={() => onNavigate('acervo')} className="px-3 py-2 rounded-md hover:bg-gray-800">Acervo</button>

          {!user && (
            <button onClick={onShowLogin} className="px-3 py-2 rounded-md bg-accent text-black ml-3">Entrar</button>
          )}

          {user && user.role === 'Leitor' && (
            <button onClick={() => onNavigate('perfil')} className="hover:text-accent">Meu Perfil</button>
          )}

          {user && (user.role === 'Bibliotecario' || user.role === 'Administrador') && (
            <button onClick={() => onNavigate('painel')} className="hover:text-accent">Painel</button>
          )}

          {user && (
            <div className="flex items-center gap-2 ml-3">
              <div className="text-sm text-gray-300">{user.name} • {user.role}</div>
              <button onClick={onLogout} className="px-3 py-2 rounded-md bg-gray-800 text-gray-200">Sair</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
