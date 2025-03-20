import React, { useState } from 'react';
import { Server, AlertTriangle } from 'lucide-react';
import Estadisticas from '../component/AprobacionServicios/Estadisticas.jsx';
import Filtros from '../component/AprobacionServicios/Filtros.jsx';
import TablaServicios from '../component/AprobacionServicios/TablaServicios.jsx';
import ModalDetalles from '../component/AprobacionServicios/ModalDetalles.jsx';

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

  return (
    <div className="p-5  mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Server className="text-blue-600" />
          Aprobación de Servicios de Hosting No Catalogados
        </h1>
        <p className="text-gray-600">
          Revisa y gestiona las solicitudes de servicios de hosting personalizados que requieren aprobación.
        </p>
      </div>

      <Estadisticas serviciosPendientes={serviciosPendientes} />

      <Filtros
        filtro={filtro}
        setFiltro={setFiltro}
        ordenPor={ordenPor}
        setOrdenPor={setOrdenPor}
        ordenAsc={ordenAsc}
        setOrdenAsc={setOrdenAsc}
        cambiarOrden={cambiarOrden}
        
      />

      <TablaServicios
        servicios={serviciosFiltrados()}
        setServicioDetalle={setServicioDetalle}
        aprobarServicio={aprobarServicio}
        rechazarServicio={rechazarServicio}
      />

      <ModalDetalles
        servicioDetalle={servicioDetalle}
        setServicioDetalle={setServicioDetalle}
        aprobarServicio={aprobarServicio}
        rechazarServicio={rechazarServicio}
      />

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
