import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Acervo from './pages/Acervo';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import Painel from './pages/Painel';

export default function App(){
  const [route, setRoute] = useState('home');
  const [user, setUser] = useState(()=>{ try{ return JSON.parse(localStorage.getItem('user')) }catch(e){ return null } });

  useEffect(()=>{ if(!user){ const token = localStorage.getItem('token'); if(!token) return; /* opcional: validar token */ } }, []);

  const handleLogout = ()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); setUser(null); setRoute('home'); }

  return (
    <div className="min-h-screen bg-[#03060a] text-white">
      <Header onNavigate={setRoute} user={user} onLogout={handleLogout} onShowLogin={()=>setRoute('login')} />
      <main className="max-w-6xl mx-auto p-6">
        {route === 'home' && <Acervo user={user} />}
        {route === 'acervo' && <Acervo user={user} />}
        {route === 'login' && <Login onLogin={(data)=>{ localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user)); setUser(data.user); setRoute('home'); }} onCancel={()=>setRoute('home')} onGoToRegister={()=>setRoute('register')} />}
        {route === 'register' && <Register onSuccess={(u)=>{ setUser(u); setRoute('home') }} />}
        {route === 'perfil' && <Perfil user={user} />}
        {route === 'painel' && <Painel />}
      </main>
    </div>
  );
}