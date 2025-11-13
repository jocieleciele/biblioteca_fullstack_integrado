import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Perfil({ user }) {
  const [emprestimos, setEmprestimos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setLoading(true);
      try {
        const [emprestimosRes, reservasRes] = await Promise.all([
          api.get(`/emprestimos/user/${user.id}`),
          api.get(`/reservas/user/${user.id}`),
        ]);
        setEmprestimos(emprestimosRes.data.items || []);
        setReservas(reservasRes.data.items || []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  const emAndamento = emprestimos.filter(
    (e) => e.status === "Em andamento" && !e.atrasado
  );
  const lidos = emprestimos.filter((e) => e.status === "Concluído");
  const atrasados = emprestimos.filter((e) => e.atrasado);

  if (!user)
    return (
      <div className="p-6 bg-panel rounded">
        Você precisa entrar para ver seu perfil.
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Olá, {user.name}</h2>

      <section>
        <h3 className="font-medium">Em andamento</h3>
        {loading ? (
          <div>Carregando...</div>
        ) : emAndamento.length === 0 ? (
          <div className="text-sm text-gray-400">Nenhum</div>
        ) : (
          <div className="grid gap-3 mt-2">
            {emAndamento.map((e) => (
              <div
                key={e.id}
                className="p-3 bg-panel rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{e.material_titulo}</div>
                  <div className="text-sm text-gray-400">
                    Vencimento: {e.data_prevista?.slice(0, 10) || "—"}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="px-2 py-1 rounded bg-green-800 text-green-300 text-xs">
                    Em dia
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-medium">Empréstimos concluídos</h3>
        {lidos.length === 0 ? (
          <div className="text-sm text-gray-400">Nenhum</div>
        ) : (
          <div className="grid gap-3 mt-2">
            {lidos.map((e) => (
              <div
                key={e.id}
                className="p-3 bg-panel rounded"
                title={`ID do empréstimo: ${e.id}`}
              >
                <div className="font-semibold">{e.material_title}</div>
                <div className="text-sm text-gray-400">
                  Devolvido: {e.data_devolucao?.slice(0, 10)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-medium">Atrasados</h3>
        {atrasados.length === 0 ? (
          <div className="text-sm text-gray-400">Nenhum</div>
        ) : (
          <div className="grid gap-3 mt-2">
            {atrasados.map((e) => (
              <div
                key={e.id}
                className="p-3 bg-panel rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{e.material_titulo}</div>
                  <div className="text-sm text-red-400">
                    Vencimento: {e.data_prevista?.slice(0, 10)}
                  </div>
                </div>
                <div>
                  <span className="px-2 py-1 rounded bg-red-900 text-red-200 text-xs">
                    Atrasado
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="font-medium">Minhas Reservas</h3>
        {loading ? (
          <div>Carregando...</div>
        ) : reservas.length === 0 ? (
          <div className="text-sm text-gray-400">Nenhuma reserva pendente</div>
        ) : (
          <div className="grid gap-3 mt-2">
            {reservas.map((r) => (
              <div
                key={r.id}
                className="p-3 bg-panel rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{r.material_titulo}</div>
                  <div className="text-sm text-gray-400">
                    Reservado em:{" "}
                    {new Date(r.data_reserva).toLocaleDateString()}
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-blue-800 text-blue-300 text-xs">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
