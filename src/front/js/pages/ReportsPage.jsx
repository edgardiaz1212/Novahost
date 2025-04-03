import React, { useState, useEffect, useMemo } from 'react';
import { Filter } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function RequestsTable({ requests = [], virtualMachines = [], hypervisors = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [requestStatusData, setRequestStatusData] = useState({});
  const [vmByHypervisorData, setVmByHypervisorData] = useState({});
  const [requestByServiceData, setRequestByServiceData] = useState({});

  useEffect(() => {
    let dataToFilter = [];
    let newHeaders = [];
    switch (selectedCategory) {
      case 'completed':
        dataToFilter = requests.filter(req => req.status === "Completado");
        newHeaders = [
          { label: "Ticket#", key: "id" },
          { label: "Cliente", key: "client" },
          { label: "Servicio", key: "service" },
          { label: "Estado", key: "status" },
          { label: "Hypervisor", key: "hypervisor" },
          { label: "Fecha", key: "date" },
        ];
        break;
      case 'failed':
        dataToFilter = requests.filter(req => req.status === "Falla");
        newHeaders = [
          { label: "Ticket#", key: "id" },
          { label: "Cliente", key: "client" },
          { label: "Servicio", key: "service" },
          { label: "Estado", key: "status" },
          { label: "Hypervisor", key: "hypervisor" },
          { label: "Fecha", key: "date" },
        ];
        break;
      case 'inProgress':
        dataToFilter = requests.filter(req => req.status === "En Proceso");
        newHeaders = [
          { label: "Ticket#", key: "id" },
          { label: "Cliente", key: "client" },
          { label: "Servicio", key: "service" },
          { label: "Estado", key: "status" },
          { label: "Hypervisor", key: "hypervisor" },
          { label: "Fecha", key: "date" },
        ];
        break;
      case 'total':
        dataToFilter = virtualMachines;
        newHeaders = [
          { label: "ID", key: "id" },
          { label: "Nombre", key: "name" },
          { label: "CPU", key: "cpu" },
          { label: "RAM", key: "ram" },
          { label: "Disco", key: "disk" },
          { label: "Hypervisor", key: "hypervisor_id" },
        ];
        break;
      default:
        dataToFilter = [...requests, ...virtualMachines];
        newHeaders = [
          { label: "Ticket#", key: "id" },
          { label: "Cliente", key: "client" },
          { label: "Servicio", key: "service" },
          { label: "Estado", key: "status" },
          { label: "Hypervisor", key: "hypervisor" },
          { label: "Fecha", key: "date" },
        ];
        break;
    }
    setFilteredData(dataToFilter);
    setHeaders(newHeaders);
  }, [selectedCategory, requests, virtualMachines]);

  const chartData = useMemo(() => {
    // Request Status Distribution
    const statusCounts = requests.reduce((acc, req) => {
      if (req && req.status) {
        acc[req.status] = (acc[req.status] || 0) + 1;
      }
      return acc;
    }, {});

    const newRequestStatusData = {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: 'Estado de Solicitudes',
          data: Object.values(statusCounts),
          backgroundColor: ['#28a745', '#dc3545', '#007bff'],
        },
      ],
    };

    // Virtual Machine Distribution by Hypervisor
    const vmCountsByHypervisor = virtualMachines.reduce((acc, vm) => {
      if (vm && vm.hypervisor_id) {
        const hypervisor = hypervisors.find(h => h.id === vm.hypervisor_id);
        const hypervisorName = hypervisor ? hypervisor.name : 'N/A';
        acc[hypervisorName] = (acc[hypervisorName] || 0) + 1;
      }
      return acc;
    }, {});

    const newVmByHypervisorData = {
      labels: Object.keys(vmCountsByHypervisor),
      datasets: [
        {
          label: 'Máquinas Virtuales por Hypervisor',
          data: Object.values(vmCountsByHypervisor),
          backgroundColor: ['#007bff', '#6c757d', '#28a745', '#ffc107', '#dc3545'],
        },
      ],
    };

    // Request Distribution by Service
    const requestCountsByService = requests.reduce((acc, req) => {
      if (req && req.service) {
        acc[req.service] = (acc[req.service] || 0) + 1;
      }
      return acc;
    }, {});

    const newRequestByServiceData = {
      labels: Object.keys(requestCountsByService),
      datasets: [
        {
          label: 'Solicitudes por Servicio',
          data: Object.values(requestCountsByService),
          backgroundColor: ['#007bff', '#6c757d', '#28a745', '#ffc107', '#dc3545'],
        },
      ],
    };

    return { newRequestStatusData, newVmByHypervisorData, newRequestByServiceData };
  }, [requests, virtualMachines, hypervisors]);

  useEffect(() => {
    setRequestStatusData(chartData.newRequestStatusData);
    setVmByHypervisorData(chartData.newVmByHypervisorData);
    setRequestByServiceData(chartData.newRequestByServiceData);
  }, [chartData]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="container py-4">
        <h1 className="h3 mb-4 p-3 border-start border-5 border-primary">Reportes y Resúmenes</h1>

        <div className="mb-3">
          <div className="d-flex gap-3 align-items-center">
            <Filter size={16} />
            <label htmlFor="categoryFilter" className="form-label">Filtrar por:</label>
            <select id="categoryFilter" className="form-select" onChange={handleCategoryChange} value={selectedCategory}>
              <option value="all">Todos</option>
              <option value="completed">Completadas</option>
              <option value="failed">Fallidas</option>
              <option value="inProgress">En Proceso</option>
              <option value="total">Máquinas Virtuales</option>
            </select>
          </div>
        </div>

        {/* Charts */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Estado de Solicitudes</h5>
                {requestStatusData.datasets && requestStatusData.datasets.length > 0 && <Pie data={requestStatusData} />}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Máquinas Virtuales por Hypervisor</h5>
                {vmByHypervisorData.datasets && vmByHypervisorData.datasets.length > 0 && <Bar data={vmByHypervisorData} />}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Solicitudes por Servicio</h5>
                {requestByServiceData.datasets && requestByServiceData.datasets.length > 0 && <Bar data={requestByServiceData} />}
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                {headers.map((header) => (
                  <th key={header.key} scope="col">{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => {
                const hypervisorName = hypervisors.find(h => h.id === item.hypervisor_id)?.name || 'N/A';
                return (
                  <tr key={item.id}>
                    {headers.map((header) => {
                      let value = item[header.key];
                      if (header.key === 'hypervisor') {
                        value = hypervisorName;
                      }
                      return <td key={`${item.id}-${header.key}`}>{value}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RequestsTable;
