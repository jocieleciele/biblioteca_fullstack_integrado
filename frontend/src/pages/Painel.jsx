import React, { useEffect, useState } from "react";
import { Book, Users, Repeat, Clock, PlusCircle, Bookmark } from "lucide-react";
import api from "../services/api";

export default function Painel() {
  const [items, setItems] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    livros: 0,
    usuarios: 0,
    emprestimos: 0,
    reservas: 0,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Carrega empréstimos e reservas em paralelo
        const [emprestimosRes, reservasRes] = await Promise.all([
          api.get("/emprestimos"),
          api.get("/reservas"), // Nova chamada para buscar todas as reservas pendentes
        ]);

        const emprestimosItems = emprestimosRes.data.items || [];
        const reservasItems = reservasRes.data.items || [];

        setItems(emprestimosItems);
        setReservas(reservasItems);

        // simulando estatísticas rápidas
        setStats({
          livros: 8,
          usuarios: 4,
          emprestimos: emprestimosItems.filter((i) => !i.data_devolucao).length,
          reservas: reservasItems.length, // Contagem real de reservas pendentes
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const atenderReserva = async (id) => {
    try {
      await api.put(`/reservas/${id}/atender`);
      // Remove a reserva da lista local para atualizar a UI
      setReservas(reservas.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Erro ao atender reserva:", err);
      alert("Falha ao atender a reserva.");
    }
  };

  const marcarDevolucao = async (id) => {
    try {
      await api.put(`/emprestimos/${id}/devolver`);
      setItems(
        items.map((i) =>
          i.id === id
            ? {
                ...i,
                data_devolucao: new Date().toISOString(),
                status: "Concluído",
              }
            : i
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-10">Carregando...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">Painel de Controle</h1>
      <p className="text-center text-gray-400">
        Bem-vindo ao Sistema de Gerenciamento de Biblioteca
      </p>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <StatCard
          icon={<Book size={28} />}
          label="Total de Livros"
          value={stats.livros}
        />
        <StatCard
          icon={<Users size={28} />}
          label="Usuários Ativos"
          value={stats.usuarios}
        />
        <StatCard
          icon={<Repeat size={28} />}
          label="Empréstimos Ativos"
          value={stats.emprestimos}
        />
        <StatCard
          icon={<Clock size={28} />}
          label="Reservas Pendentes"
          value={stats.reservas}
        />
      </div>

      {/* Ações rápidas */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard icon={<PlusCircle size={24} />} label="Novo Material" />
          <ActionCard icon={<Repeat size={24} />} label="Novo Empréstimo" />
          <ActionCard icon={<Bookmark size={24} />} label="Nova Reserva" />
        </div>
      </section>

      {/* Atividade recente */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Últimos Empréstimos</h2>
        <div className="space-y-3">
          {items.slice(0, 5).map((it) => (
            <div
              key={it.id}
              className="p-4 bg-[#101010] rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="font-medium text-white">
                  {it.material_titulo}
                </div>
                <div className="text-sm text-gray-400">
                  {it.usuario_name} — {it.status} — Prevista:{" "}
                  {it.data_prevista?.slice(0, 10)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!it.data_devolucao &&
                  new Date(it.data_prevista) < new Date() && (
                    <span className="px-2 py-1 rounded bg-red-900 text-red-200 text-xs">
                      Atrasado
                    </span>
                  )}
                {!it.data_devolucao && (
                  <button
                    onClick={() => marcarDevolucao(it.id)}
                    className="px-3 py-1 bg-accent text-black rounded-md text-sm font-medium"
                  >
                    Marcar devolução
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gerenciamento de Reservas Pendentes */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Reservas Pendentes</h2>
        <div className="space-y-3">
          {reservas.length === 0 && !loading && (
            <p className="text-gray-400">
              Nenhuma reserva pendente no momento.
            </p>
          )}
          {reservas.map((res) => (
            <div
              key={res.id}
              className="p-4 bg-[#101010] rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="font-medium text-white">
                  {res.material_titulo}
                </div>
                <div className="text-sm text-gray-400">
                  Reservado por: {res.usuario_name} em{" "}
                  {new Date(res.data_reserva).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => atenderReserva(res.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                >
                  Atender Empréstimo
                </button>
                {/* Opcional: Botão de cancelar */}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="p-5 bg-[#0a0a0a] rounded-lg flex flex-col items-center justify-center text-center shadow-lg">
      <div className="text-accent mb-2">{icon}</div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function ActionCard({ icon, label }) {
  return (
    <button className="flex flex-col items-center justify-center p-5 bg-[#0a0a0a] rounded-lg shadow hover:bg-[#161616] transition">
      <div className="text-accent mb-2">{icon}</div>
      <div className="font-medium text-white">{label}</div>
    </button>
  );
}
