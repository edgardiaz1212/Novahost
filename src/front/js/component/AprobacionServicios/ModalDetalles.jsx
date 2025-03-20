import React from 'react';
import { CheckCircle, XCircle, Server, HardDrive, Cpu, Monitor, X } from 'lucide-react';

function ModalDetalles({ servicioDetalle, setServicioDetalle, aprobarServicio, rechazarServicio }) {
  if (!servicioDetalle) {
    return null; // Don't render the modal if there's no service selected
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={() => setServicioDetalle(null)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        <h3 className="text-lg font-semibold mb-4">Detalles del Servicio</h3>
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-medium">Solicitante:</span> {servicioDetalle.solicitante}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Fecha:</span> {servicioDetalle.fecha}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">
              <HardDrive size={14} className="inline mr-1" />
              Disco:
            </span> {servicioDetalle.disco} GB
          </p>
          <p className="text-gray-600">
            <span className="font-medium">
              <Server size={14} className="inline mr-1" />
              RAM:
            </span> {servicioDetalle.ram} GB
          </p>
          <p className="text-gray-600">
            <span className="font-medium">
              <Cpu size={14} className="inline mr-1" />
              CPU:
            </span> {servicioDetalle.procesador} Núcleos
          </p>
          <p className="text-gray-600">
            <span className="font-medium">
              <Monitor size={14} className="inline mr-1" />
              Sistema Operativo:
            </span> {servicioDetalle.sistemaOperativo}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Justificación:</span> {servicioDetalle.justificacion}
          </p>
        </div>
        {servicioDetalle.estado === "pendiente" && (
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => aprobarServicio(servicioDetalle.id)}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-1"
            >
              <CheckCircle size={16} />
              Aprobar
            </button>
            <button
              onClick={() => rechazarServicio(servicioDetalle.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-1"
            >
              <XCircle size={16} />
              Rechazar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalDetalles;
