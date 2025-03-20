import React from 'react';
import { Search } from 'lucide-react';

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
            <Search />
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
