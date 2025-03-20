import React from 'react';

function Filtros({ filtro, setFiltro, ordenPor, setOrdenPor, ordenAsc, setOrdenAsc, cambiarOrden }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por solicitante o sistema operativo..."
            className="pl-8 pr-4 py-2 border rounded-lg w-80"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <div className="absolute left-3 top-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Ordenar por:</span>
          <select
            className="border rounded-md p-2"
            value={ordenPor}
            onChange={(e) => {
              setOrdenPor(e.target.value);
              setOrdenAsc(true);
            }}
          >
            <option value="fecha">Fecha</option>
            <option value="ram">RAM</option>
            <option value="disco">Disco</option>
            <option value="procesador">Procesador</option>
          </select>
          <button
            className="p-2 border rounded-md"
            onClick={() => setOrdenAsc(!ordenAsc)}
          >
            {ordenAsc ? "↑ Ascendente" : "↓ Descendente"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filtros;
