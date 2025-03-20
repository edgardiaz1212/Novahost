import React from 'react';
import { CheckCircle, XCircle, Server, HardDrive, Cpu, Monitor,  } from 'lucide-react';

function ModalDetalles({ servicioDetalle, setServicioDetalle, aprobarServicio, rechazarServicio }) {
  if (!servicioDetalle) {
    return null; // Don't render the modal if there's no service selected
  }

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} tabIndex="-1" role="dialog" aria-labelledby="modalDetallesLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="modalDetallesLabel">Detalles del Servicio</h5>
            <button type="button" className="btn-close" onClick={() => setServicioDetalle(null)} aria-label="Close">
            </button>
          </div>
          <div className="modal-body">
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
            <div className="modal-footer">
              <button
                onClick={() => rechazarServicio(servicioDetalle.id)}
                className="btn btn-danger d-flex align-items-center gap-1"
              >
                <XCircle size={16} />
                Rechazar
              </button>
              <button
                onClick={() => aprobarServicio(servicioDetalle.id)}
                className="btn btn-success d-flex align-items-center gap-1"
              >
                <CheckCircle size={16} />
                Aprobar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalDetalles;
