import React, {useState} from 'react'
export default function MaterialDetail({material, onBack, userType}){
  const [reserved, setReserved] = useState(false)
  const [loaned, setLoaned] = useState(false)
  return (
    <div className="bg-panel rounded-lg shadow p-6">
      <div className="flex items-start gap-6">
       <div className="w-48 h-64 rounded-md bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
          <img
          src={`/src/capa/${material.capa}.jpg`}alt={material.titulo}
          className="object-cover w-full h-full"/>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white">{material.titulo}</h2>
          <p className="text-sm text-gray-400">{material.autor} • {material.categoria} • {material.ano}</p>
          <div className="mt-4 text-gray-300">Sinopse curta do material. Informações adicionais podem aparecer aqui.</div>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={()=>setLoaned(true)} disabled={material.avaliacao===0} className={`px-4 py-2 rounded-md ${material.avaliação>0 ? 'bg-accent text-black' : 'bg-gray-700 text-gray-400'}`}>Solicitar Empréstimo</button>
            <button onClick={()=>setReserved(true)} className={`px-4 py-2 rounded-md ${material.avaliação===0 ? 'bg-accent text-black' : 'bg-gray-800 text-gray-300'}`}>Reservar</button>
            <button onClick={onBack} className="px-3 py-2 rounded-md border border-gray-700">Voltar</button>
          </div>
          <div className="mt-4 space-y-2 text-gray-300">
            <div><span className="font-medium text-white">Status:</span> {material.avaliação>0 ? 'Disponível' : 'Indisponível'}</div>
            <div><span className="font-medium text-white">Total de cópias:</span> {material.total}</div>
            <div><span className="font-medium text-white">Localização:</span> Prateleira A3</div>
          </div>

          {loaned && <div className="mt-4 p-3 bg-green-900/30 border-l-4 border-green-700">Empréstimo registrado.</div>}
          {reserved && <div className="mt-4 p-3 bg-yellow-900/30 border-l-4 border-yellow-700">Reserva criada.</div>}
        </div>

        <aside className="w-64">
            <div className="bg-[#071018] p-4 rounded-md border border-gray-800">
              <h4 className="font-semibold text-white">Ações rápidas</h4>
              <div className="mt-3 flex flex-col gap-2">
                <button className="px-3 py-2 rounded-md border border-gray-700 text-sm">Ver histórico</button>
                <button className="px-3 py-2 rounded-md border border-gray-700 text-sm">Editar material</button>
              </div>
            </div>
        </aside>
      </div>
    </div>
  )
}
