import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Server, HardDrive, Cpu, Monitor } from 'lucide-react';

function AprobacionServicios() {
  // Estado para servicios pendientes de aprobación
  const [serviciosPendientes, setServiciosPendientes] = useState([
    { 
      id: 1, 
      solicitante: "Juan Pérez", 
      fecha: "2025-03-15", 
      disco: 200, 
      ram: 8, 
      procesador: 4, 
      sistemaOperativo: "Ubuntu 22.04 LTS",
      justificacion: "Necesario para proyecto de desarrollo web con alto tráfico",
      estado: "pendiente" 
    },
    { 
      id: 2, 
      solicitante: "María García", 
      fecha: "2025-03-18", 
      disco: 500, 
      ram: 16, 
      procesador: 8, 
      sistemaOperativo: "Windows Server 2022",
      justificacion: "Entorno para pruebas de aplicación empresarial",
      estado: "pendiente" 
    },
    { 
      id: 3, 
      solicitante: "Carlos Rodríguez", 
      fecha: "2025-03-19", 
      disco: 1000, 
      ram: 32, 
      procesador: 12, 
      sistemaOperativo: "CentOS 8",
      justificacion: "Servidor de base de datos para aplicación crítica",
      estado: "pendiente" 
    }
  ]);

  // Estado para filtrado y ordenamiento
  const [filtro, setFiltro] = useState("");
  const [ordenPor, setOrdenPor] = useState("fecha");
  const [ordenAsc, setOrdenAsc] = useState(false);

  // Estado para mostrar detalles
  const [servicioDetalle, setServicioDetalle] = useState(null);

  // Función para aprobar servicio
  const aprobarServicio = (id) => {
    setServiciosPendientes(serviciosPendientes.map(servicio => 
      servicio.id === id ? { ...servicio, estado: "aprobado" } : servicio
    ));
  };

  // Función para rechazar servicio
  const rechazarServicio = (id) => {
    setServiciosPendientes(serviciosPendientes.map(servicio => 
      servicio.id === id ? { ...servicio, estado: "rechazado" } : servicio
    ));
  };

  // Función para filtrar servicios
  const serviciosFiltrados = () => {
    return serviciosPendientes
      .filter(servicio => 
        servicio.solicitante.toLowerCase().includes(filtro.toLowerCase()) ||
        servicio.sistemaOperativo.toLowerCase().includes(filtro.toLowerCase())
      )
      .sort((a, b) => {
        if (ordenPor === "fecha") {
          return ordenAsc ? new Date(a.fecha) - new Date(b.fecha) : new Date(b.fecha) - new Date(a.fecha);
        } else if (ordenPor === "ram") {
          return ordenAsc ? a.ram - b.ram : b.ram - a.ram;
        } else if (ordenPor === "disco") {
          return ordenAsc ? a.disco - b.disco : b.disco - a.disco;
        } else if (ordenPor === "procesador") {
          return ordenAsc ? a.procesador - b.procesador : b.procesador - a.procesador;
        }
        return 0;
      });
  };

  // Función para cambiar orden
  const cambiarOrden = (campo) => {
    if (ordenPor === campo) {
      setOrdenAsc(!ordenAsc);
    } else {
      setOrdenPor(campo);
      setOrdenAsc(true);
    }
  };

  // Renderiza la barra de estadísticas
  const renderEstadisticas = () => {
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
  };

  // Renderiza la tabla de servicios
  const renderTablaServicios = () => {
    const servicios = serviciosFiltrados();
    
    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Solicitante
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => cambiarOrden("fecha")}
              >
                Fecha
                {ordenPor === "fecha" && (
                  <span className="ml-1">{ordenAsc ? "↑" : "↓"}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => cambiarOrden("disco")}
              >
                <div className="flex items-center">
                  <HardDrive size={14} className="mr-1" />
                  Disco (GB)
                  {ordenPor === "disco" && (
                    <span className="ml-1">{ordenAsc ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => cambiarOrden("ram")}
              >
                <div className="flex items-center">
                  <Server size={14} className="mr-1" />
                  RAM (GB)
                  {ordenPor === "ram" && (
                    <span className="ml-1">{ordenAsc ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => cambiarOrden("procesador")}
              >
                <div className="flex items-center">
                  <Cpu size={14} className="mr-1" />
                  CPU (Núcleos)
                  {ordenPor === "procesador" && (
                    <span className="ml-1">{ordenAsc ? "↑" : "↓"}</span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Monitor size={14} className="mr-1" />
                  Sistema Operativo
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {servicios.map((servicio) => (
              <tr key={servicio.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{servicio.solicitante}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{servicio.fecha}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{servicio.disco} GB</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{servicio.ram} GB</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{servicio.procesador}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{servicio.sistemaOperativo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {servicio.estado === "pendiente" && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pendiente
                    </span>
                  )}
                  {servicio.estado === "aprobado" && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aprobado
                    </span>
                  )}
                  {servicio.estado === "rechazado" && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Rechazado
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setServicioDetalle(servicio)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1 rounded"
                    >
                      Ver detalles
                    </button>
                    {servicio.estado === "pendiente" && (
                      <>
                        <button 
                          onClick={() => aprobarServicio(servicio.id)}
                          className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded"
                        >
                          Aprobar
                        </button>
                        <button 
                          onClick={() => rechazarServicio(servicio.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded"
                        >
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
  };

  // Renderiza el modal de detalles
  const renderModalDetalles = () => {
    if (!servicioDetalle) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Detalles de la Solicitud</h2>
              <button 
                onClick={() => setServicioDetalle(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Solicitante</p>
                <p className="font-medium">{servicioDetalle.solicitante}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de Solicitud</p>
                <p className="font-medium">{servicioDetalle.fecha}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p>
                  {servicioDetalle.estado === "pendiente" && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pendiente
                    </span>
                  )}
                  {servicioDetalle.estado === "aprobado" && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aprobado
                    </span>
                  )}
                  {servicioDetalle.estado === "rechazado" && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Rechazado
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-bold mb-2">Especificaciones Técnicas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <HardDrive size={18} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Disco</p>
                    <p className="font-medium">{servicioDetalle.disco} GB</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Server size={18} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">RAM</p>
                    <p className="font-medium">{servicioDetalle.ram} GB</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Cpu size={18} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Procesador</p>
                    <p className="font-medium">{servicioDetalle.procesador} Núcleos</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Monitor size={18} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Sistema Operativo</p>
                    <p className="font-medium">{servicioDetalle.sistemaOperativo}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-bold mb-2">Justificación</h3>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{servicioDetalle.justificacion}</p>
            </div>
            
            {servicioDetalle.estado === "pendiente" && (
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => {
                    aprobarServicio(servicioDetalle.id);
                    setServicioDetalle(null);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                >
                  <CheckCircle size={18} className="mr-1" />
                  Aprobar Solicitud
                </button>
                <button 
                  onClick={() => {
                    rechazarServicio(servicioDetalle.id);
                    setServicioDetalle(null);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
                >
                  <XCircle size={18} className="mr-1" />
                  Rechazar Solicitud
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Server className="text-blue-600" />
          Aprobación de Servicios de Hosting No Catalogados
        </h1>
        <p className="text-gray-600">
          Revisa y gestiona las solicitudes de servicios de hosting personalizados que requieren aprobación.
        </p>
      </div>

      {renderEstadisticas()}

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

      {renderTablaServicios()}
      {renderModalDetalles()}

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-6">
        <div className="flex items-start gap-2">
          <AlertTriangle className="text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-yellow-800">Nota Importante</h3>
            <p className="text-sm text-yellow-700">
              Los servicios no catalogados requieren aprobación manual antes de su implementación.
              Verifique cuidadosamente los recursos solicitados y la justificación antes de aprobar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AprobacionServicios;