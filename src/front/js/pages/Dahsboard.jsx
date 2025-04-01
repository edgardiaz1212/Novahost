import React, { useState, useEffect, useContext } from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import '../../styles/Dashboard.css';
import StatCard from '../component/Home/StatCard';
import { Context } from '../store/appContext'; // Import Context
import HypervisorStatus from '../component/Home/HypervisorStatus'; // Import HypervisorStatus
import VirtualMachinesStatus from '../component/Home/VirtualMachinesStatus'; // Import VirtualMachinesStatus
import RequestsTable from '../component/Home/RequestsTable'; // Import RequestsTable

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
        <HypervisorStatus hypervisors={hypervisors} isLoading={isLoading} />

        {/* Virtual Machines Status Section */}
        <VirtualMachinesStatus virtualMachines={virtualMachines} isLoading={isLoading} />

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
        <RequestsTable requests={requests} />
      </div>
    </div>
  );
}

export default Dahsboard;
