import React, { useState, useEffect, useContext } from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import '../../styles/Dashboard.css';
import StatCard from '../component/Dashboard/StatCard';
import { Context } from '../store/appContext'; // Import Context
import HypervisorStatus from '../component/Dashboard/HypervisorStatus.jsx'; // Import HypervisorStatus
import VirtualMachinesStatus from '../component/Dashboard/VirtualMachinesStatus.jsx'; // Import VirtualMachinesStatus
import RequestsTable from '../component/Dashboard/RequestsTable.jsx'; // Import RequestsTable
import VMsOverTimeChart from '../component/Dashboard/VMsOverTimeChart'; // Import VMsOverTimeChart

function Dahsboard() {
  const { store, actions } = useContext(Context);
  const { serverResources, requests, hypervisors, virtualMachines } = store;
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await actions.fetchHypervisors(); // Cargar hipervisores
        await actions.fetchVirtualMachines(); // Cargar máquinas virtuales
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Simulate stats data - replace with actual data if needed
  const stats = {
    completed: requests.filter(req => req.status === "Completado").length,
    failed: requests.filter(req => req.status === "Falla").length, // New: Count failed requests
    inProgress: requests.filter(req => req.status === "En Proceso").length,
    total: virtualMachines ? virtualMachines.length : 0, // Changed: Total is now the number of virtual machines
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="container py-4">
        <h1 className="h3 mb-4 p-3">Panel de Control de Solicitudes</h1>

        {/* Hypervisor Status Section */}
        <HypervisorStatus hypervisors={hypervisors} isLoading={isLoading} />

        {/* Virtual Machines Status Section */}
        {virtualMachines && virtualMachines.length > 0 && (
          <VirtualMachinesStatus virtualMachines={virtualMachines} isLoading={isLoading} />
        )}

        {/* Stats Grid */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
          <div className="col">
            <StatCard
              icon={CheckCircle}
              title="Completadas"
              value={stats.completed}
              color="border-green-500"
              category="completed"
            />
          </div>
          <div className="col">
            <StatCard
              icon={AlertCircle}
              title="Fallidas"
              value={stats.failed}
              color="border-red-500"
              category="failed"
            />
          </div>
          <div className="col">
            <StatCard
              icon={Clock}
              title="En Proceso"
              value={stats.inProgress}
              color="border-blue-500"
              category="inProgress"
            />
          </div>
          <div className="col">
            <StatCard
              icon={BarChart3}
              title="Total VMs"
              value={stats.total}
              color="border-purple-500"
              category="total"
            />
          </div>
        </div>

        {/* VMs Over Time Chart */}
        <VMsOverTimeChart virtualMachines={virtualMachines} />

        {/* Table Section */}
        <RequestsTable requests={requests} />
      </div>
    </div>
  );
}

export default Dahsboard;
