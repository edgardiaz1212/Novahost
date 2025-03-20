import React from 'react';

function Estadisticas({ serviciosPendientes }) {
  const total = serviciosPendientes.length;
  const pendientes = serviciosPendientes.filter(s => s.estado === "pendiente").length;
  const aprobados = serviciosPendientes.filter(s => s.estado === "aprobado").length;
  const rechazados = serviciosPendientes.filter(s => s.estado === "rechazado").length;

  return (
    <div className=" row gap-2 mb-4">
      <div className="col bg-secondary bg-opacity-50  p-4 rounded-3">
        <p className="text-secondary-emphasis text-sm">Total Solicitudes</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>
      <div className="col bg-warning bg-opacity-50  p-4 rounded-3">
        <p className="text-warning-emphasis text-sm">Pendientes</p>
        <p className="text-2xl font-bold text-yellow-600">{pendientes}</p>
      </div>
      <div className="col bg-success bg-opacity-50  p-4 rounded-3">
        <p className="text-succcess-emphasis text-sm">Aprobados</p>
        <p className="text-2xl font-bold text-green-600">{aprobados}</p>
      </div>
      <div className="col bg-danger bg-opacity-50  p-4 rounded-3">
        <p className="text-danger-emphasis text-sm">Rechazados</p>
        <p className="text-2xl font-bold text-red-600">{rechazados}</p>
      </div>
    </div>
  );
}

export default Estadisticas;
