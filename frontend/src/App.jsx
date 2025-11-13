import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Acervo from "./pages/Acervo";
import Detail from "./pages/Detail";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Painel from "./pages/Painel";
import Register from "./pages/Register";
import Admin from "./pages/Admin";

export default function App() {
  const [route, setRoute] = useState("home");
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null); // {name, role, email}

  // 🔸 Lê o user salvo no localStorage ao carregar o app
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // 🔸 Função de navegação
  const go = (r, payload) => {
    setRoute(r);
    if (payload) setSelected(payload);
  };

  // 🔸 Ao logar — salva token e usuário
  const handleLogin = (data) => {
    if (data?.token && data?.user) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } else {
      console.warn("Login inválido, sem token/user");
    }
    setRoute("home");
  };

  // 🔸 Logout — limpa storage e volta pra home
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setRoute("home");
  };

  // 🔍 Busca
  const handleSearch = (livro) => {
    if (livro && typeof livro === "object" && livro.id) {
      setSelected(livro);
      setRoute("detail");
    } else if (typeof livro === "string") {
      setQuery(livro);
      setRoute("acervo");
    } else {
      setQuery("");
      setRoute("acervo");
    }
  };

  return (
    <div className="min-h-screen bg-darkbg text-white font-inter">
      <Header
        onNavigate={go}
        user={user}
        onLogout={handleLogout}
        onShowLogin={() => setRoute("login")}
      />

      <main className="max-w-7xl mx-auto p-6">
        {route === "home" && (
          <Home
            onSearch={(q) => {
              setQuery(q);
              go("acervo");
            }}
          />
        )}
        {route === "acervo" && (
          <Acervo query={query} onOpen={(m) => go("detail", m)} />
        )}
        {route === "detail" && selected && (
          <Detail material={selected} onBack={() => go("acervo")} user={user} />
        )}
        {route === "account" && <Account user={user} />}
        {route === "login" && (
          <Login
            onLogin={handleLogin}
            onCancel={() => setRoute("home")}
            onGoToRegister={() => go("register")}
          />
        )}
        {route === "register" && (
          <Register
            onSuccess={() => go("login")}
            onCancel={() => go("login")}
          />
        )}

        {/* 🔒 Páginas protegidas */}
        {route === "perfil" &&
          (user && user.role === "Leitor" ? (
            <Perfil user={user} />
          ) : (
            <div className="text-red-400">Acesso negado.</div>
          ))}

        {route === "painel" &&
          (user &&
          (user.role === "Administrador" || user.role === "Bibliotecário") ? (
            <Painel user={user} />
          ) : (
            <div className="text-red-400">Acesso negado.</div>
          ))}

        {route === "admin" &&
          (user && user.role === "Administrador" ? (
            <Admin />
          ) : (
            <div className="text-red-400">Acesso negado.</div>
          ))}
      </main>

      <Footer />
    </div>
  );
}
