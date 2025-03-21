import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Search,
  Filter,
  Server,
} from 'lucide-react';
import '../../styles/Dashboard.css';
import StatCard from '../component/StatCard';
import ServerCapacity from '../component/ServerCapacity';

// Sample data - replace with your actual data
const requestsData = [
  { id: 1, client: "Acme Corp", service: "VPS Hosting", status: "En Proceso", date: "2024-03-15" },
  { id: 2, client: "Tech Solutions", service: "Shared Hosting", status: "Pendiente", date: "2024-03-14" },
  { id: 3, client: "Digital Inc", service: "Dedicated Server", status: "Completado", date: "2024-03-13" },
  { id: 4, client: "WebHost Pro", service: "Cloud Hosting", status: "En Proceso", date: "2024-03-12" },
];

const stats = {
  completed: 45,
  pending: 12,
  inProgress: 23,
  total: 80
};

function Dahsboard() {
  const [serverResources, setServerResources] = useState([]); // Initialize as an empty array
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  // Simulate fetching data for multiple servers
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate data for multiple servers
      const serverData = [
        {
          platform: "VMware",
          cpuTotal: 16,
          cpuUsed: 8,
          ramTotal: 64,
          ramUsed: 32,
          diskTotal: 1000,
          diskUsed: 500,
        },
        {
          platform: "Proxmox",
          cpuTotal: 24,
          cpuUsed: 12,
          ramTotal: 128,
          ramUsed: 64,
          diskTotal: 2000,
          diskUsed: 1000,
        },
        {
          platform: "Proxmox",
          cpuTotal: 12,
          cpuUsed: 6,
          ramTotal: 64,
          ramUsed: 32,
          diskTotal: 1000,
          diskUsed: 500,
        },
      ];

      setServerResources(serverData);
      setIsLoading(false); // Finish loading
    };

    fetchData();
  }, []);

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="container py-4">
        <h1 className="h3 mb-4 p-3">Panel de Control de Solicitudes</h1>

        {/* Display multiple ServerCapacity components */}
        <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
          {isLoading ? (
            <div className="col">
              <div className="card shadow-sm p-4">
                <div className="text-center">
                  <p className="text-muted">Cargando datos del servidor...</p>
                </div>
              </div>
            </div>
          ) : (
            serverResources.map((server, index) => (
              <div className="col" key={index}>
                <ServerCapacity serverData={server} />
              </div>
            ))
          )}
        </div>

        {/* Stats Grid */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
          <div className="col">
            <StatCard
              icon={CheckCircle}
              title="Completadas"
              value={stats.completed}
              color="border-green-500"
            />
          </div>
          <div className="col">
            <StatCard
              icon={Clock}
              title="Pendientes"
              value={stats.pending}
              color="border-yellow-500"
            />
          </div>
          <div className="col">
            <StatCard
              icon={AlertCircle}
              title="En Proceso"
              value={stats.inProgress}
              color="border-blue-500"
            />
          </div>
          <div className="col">
            <StatCard
              icon={BarChart3}
              title="Total"
              value={stats.total}
              color="border-purple-500"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="card shadow-sm">
          <div className="card-header border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">Solicitudes en Proceso</h2>
              <div className="d-flex gap-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar solicitud..."
                  />
                </div>
                <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
                  <Filter size={16} />
                  <span>Filtrar</span>
                </button>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Servicio</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {requestsData.map((request) => (
                  <tr key={request.id}>
                    <td>#{request.id}</td>
                    <td>{request.client}</td>
                    <td>{request.service}</td>
                    <td>
                      <span className={`badge ${
                        request.status === 'Completado' ? 'bg-success' :
                        request.status === 'En Proceso' ? 'bg-primary' :
                        'bg-warning'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td>{request.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dahsboard;
