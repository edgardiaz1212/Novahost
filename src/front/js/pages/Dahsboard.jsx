import React, { useState, useEffect, useContext } from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Search,
  Filter,
  Server,
  Cpu,
  Database,
  Memory,
  Power,
} from 'lucide-react';
import '../../styles/Dashboard.css';
import StatCard from '../component/StatCard';
import { Context } from '../store/appContext'; // Import Context

function Dahsboard() {
  const { store, actions } = useContext(Context);
  const { serverResources, requests, hypervisors, virtualMachines } = store;
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await actions.fetchServerResources();
      await actions.fetchRequests();
      await actions.fetchHypervisors(); // Cargar hipervisores
      await actions.fetchVirtualMachines(); // Cargar máquinas virtuales
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Simulate stats data - replace with actual data if needed
  const stats = {
    completed: requests.filter(req => req.status === "Completado").length,
    pending: requests.filter(req => req.status === "Pendiente").length,
    inProgress: requests.filter(req => req.status === "En Proceso").length,
    total: requests.length
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="container py-4">
        <h1 className="h3 mb-4 p-3">Panel de Control de Solicitudes</h1>

        {/* Hypervisor Status Section */}
        <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
          {isLoading ? (
            <div className="col">
              <div className="card shadow-sm p-4">
                <div className="text-center">
                  <p className="text-muted">Cargando datos de Hypervisores...</p>
                </div>
              </div>
            </div>
          ) : (
            hypervisors.map((hypervisor, index) => (
              <div className="col" key={index}>
                <div className="card shadow-sm">
                  <div className="card-header d-flex align-items-center gap-2">
                    <Server className="text-primary" />
                    <h5 className="mb-0">{hypervisor.name}</h5>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Tipo:</strong> {hypervisor.type}
                    </p>
                    <p>
                      <strong>Hostname:</strong> {hypervisor.hostname}
                    </p>
                    <p>
                      <strong>Puerto:</strong> {hypervisor.port}
                    </p>
                    <p>
                      <strong>Usuario:</strong> {hypervisor.username}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Virtual Machines Status Section */}
        <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
          {isLoading ? (
            <div className="col">
              <div className="card shadow-sm p-4">
                <div className="text-center">
                  <p className="text-muted">Cargando datos de Máquinas Virtuales...</p>
                </div>
              </div>
            </div>
          ) : (
            virtualMachines.slice(0, 4).map((vm, index) => ( // Display only the last 4 VMs
              <div className="col" key={index}>
                <div className="card shadow-sm">
                  <div className="card-header d-flex align-items-center gap-2">
                    <Cpu className="text-primary" />
                    <h5 className="mb-0">{vm.nombre_maquina}</h5>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>IP:</strong> {vm.ip}
                    </p>
                    <p>
                      <strong>Plataforma:</strong> {vm.platform}
                    </p>
                    <p>
                      <strong>Estado:</strong>
                      <span className={`badge ${
                        vm.status === 'Activa' ? 'bg-success' :
                        vm.status === 'Inactiva' ? 'bg-danger' :
                        'bg-warning'
                      }`}>
                        {vm.status}
                      </span>
                    </p>
                    {vm.external_vm_power_state && (
                      <p>
                        <strong>Estado Externo:</strong>
                        <span className={`badge ${
                          vm.external_vm_power_state === 'poweredOn' ? 'bg-success' :
                          vm.external_vm_power_state === 'poweredOff' ? 'bg-danger' :
                          'bg-warning'
                        }`}>
                          {vm.external_vm_power_state}
                        </span>
                      </p>
                    )}
                    {vm.external_vm_guest_os && (
                      <p>
                        <strong>Sistema Operativo:</strong> {vm.external_vm_guest_os}
                      </p>
                    )}
                    {vm.external_vm_ip_address && (
                      <p>
                        <strong>IP Externa:</strong> {vm.external_vm_ip_address}
                      </p>
                    )}
                    {vm.external_vm_cpu_count && (
                      <p>
                        <strong>CPUs:</strong> {vm.external_vm_cpu_count}
                      </p>
                    )}
                    {vm.external_vm_memory_mb && (
                      <p>
                        <strong>Memoria:</strong> {vm.external_vm_memory_mb} MB
                      </p>
                    )}
                  </div>
                </div>
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
                {requests.map((request) => (
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
