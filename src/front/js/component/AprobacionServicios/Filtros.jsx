import React from "react";
import { Search } from "lucide-react";

function Filtros({
  filtro,
  setFiltro,
  ordenPor,
  setOrdenPor,
  ordenAsc,
  setOrdenAsc,
  cambiarOrden,
}) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <div className="input-group relative" >
          <input
            type="text"
            placeholder="Buscar por solicitante o sistema operativo..."
            className=" py-2 border rounded-2 w-25"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            aria-describedby="search-button"
          />
          <span className="input-group-text" id="search-button">
            <Search />
          </span>
        </div>

        <div className="flex items-center m-2">
          <span className="text-sm ">Ordenar por:</span>
          <select
            className="border rounded-2 p-2"
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
            className="p-2 border rounded-2 bg-secondary-subtle"
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
