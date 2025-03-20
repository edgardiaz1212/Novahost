import React from 'react';
import { CheckCircle, XCircle, Server, HardDrive, Cpu, Monitor, Eye } from 'lucide-react';

function TablaServicios({ servicios, setServicioDetalle, aprobarServicio, rechazarServicio }) {
  return (
    <div className="overflow-x-auto  rounded-2 shadow">
      <table className="  table table-striped w-full table-bordered">
        <thead className="table-primary ">
          <tr>
            <th scope="col" className="px-3 py-3 text-left fw-medium  text-uppercase ">
              Solicitante
            </th>
            <th scope="col" className="px-3 py-3 text-left fw-medium  text-text-uppercase ">
              Fecha
            </th>
            <th scope="col" className="px-3 py-3 text-left fw-medium  text-text-uppercase ">
              <div className="flex items-center">
                <HardDrive size={14} className="m-1" />
                Disco (GB)
              </div>
            </th>
            <th scope="col" className="px-3 py-3 text-left fw-medium  text-uppercase ">
              <div className="flex items-center">
                <Server size={14} className="m-1" />
                RAM (GB)
              </div>
            </th>
            <th scope="col" className="px-3 py-3 text-left fw-medium text-uppercase">
              <div className="flex items-center">
                <Cpu size={14} className="m-1" />
                CPU (Núcleos)
              </div>
            </th>
            <th scope="col" className="px-3 py-3 text-left fw-medium  text-uppercase ">
              <div className="flex items-center">
                <Monitor size={14} className="m-1" />
                Sistema Operativo
              </div>
            </th>
            <th scope="col" className="px-3 py-3 text-left fw-medium  text-uppercase ">
              Estado
            </th>
            <th scope="col" className="px-5 py-3 text-left fw-medium  text-uppercase">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className=" divide-y text-center">
          {servicios.map((servicio) => (
            <tr key={servicio.id} className="">
              <td className="px-3 py-4 ">
                <div className="text-sm-end fw-medium ">{servicio.solicitante}</div>
              </td>
              <td className="px-3 py-4 ">
                <div className="text-sm-end ">{servicio.fecha}</div>
              </td>
              <td className="px-3 py-4 ">
                <div className="text-sm-end ">{servicio.disco} GB</div>
              </td>
              <td className="px-3 py-4 ">
                <div className="text-sm-end ">{servicio.ram} GB</div>
              </td>
              <td className="px-3 py-4 ">
                <div className="text-sm-end ">{servicio.procesador}</div>
              </td>
              <td className="px-3 py-4 ">
                <div className="text-sm-end ">{servicio.sistemaOperativo}</div>
              </td>
              <td className="px-3 py-4 ">
                {servicio.estado === "pendiente" && (
                  <span className="px-2 inline-flex p-1 rounded-2 bg-warning">
                    Pendiente
                  </span>
                )}
                {servicio.estado === "aprobado" && (
                  <span className="px-2 inline-flex p-1 rounded-2 bg-success">
                    Aprobado
                  </span>
                )}
                {servicio.estado === "rechazado" && (
                  <span className="px-2 inline-flex p-1 rounded-2 bg-danger ">
                    Rechazado
                  </span>
                )}
              </td>
              <td className="px-6 py-4  text-right text-sm-end fw-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setServicioDetalle(servicio)}
                    className="btn btn-outline-primary flex items-center gap-1"
                  >
                    <Eye size={16} />
                    Ver
                  </button>
                  {servicio.estado === "pendiente" && (
                    <>
                      <button
                        onClick={() => aprobarServicio(servicio.id)}
                        className="btn btn-outline-success flex items-center gap-1"
                      >
                        <CheckCircle size={16} />
                        Aprobar
                      </button>
                      <button
                        onClick={() => rechazarServicio(servicio.id)}
                        className="btn btn-outline-danger rounded flex items-center gap-1"
                      >
                        <XCircle size={16} />
                        Rechazar
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaServicios;
