import React from 'react';

function Estadisticas({ serviciosPendientes }) {
  const total = serviciosPendientes.length;
  const pendientes = serviciosPendientes.filter(s => s.estado === "pendiente").length;
  const aprobados = serviciosPendientes.filter(s => s.estado === "aprobado").length;
  const rechazados = serviciosPendientes.filter(s => s.estado === "rechazado").length;

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className="text-gray-500 text-sm">Total Solicitudes</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <p className="text-yellow-600 text-sm">Pendientes</p>
        <p className="text-2xl font-bold text-yellow-600">{pendientes}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-green-600 text-sm">Aprobados</p>
        <p className="text-2xl font-bold text-green-600">{aprobados}</p>
      </div>
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600 text-sm">Rechazados</p>
        <p className="text-2xl font-bold text-red-600">{rechazados}</p>
      </div>
    </div>
  );
}

export default Estadisticas;
