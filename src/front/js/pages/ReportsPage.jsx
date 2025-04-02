import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { Filter } from 'lucide-react';

function ReportsPage({ requests, virtualMachines, hypervisors }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);

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

  useEffect(() => {
    const formattedData = filteredData.map(item => {
      const hypervisorName = hypervisors.find(h => h.id === item.hypervisor_id)?.name || 'N/A';
      return {
        ...item,
        hypervisor: hypervisorName
      };
    });
    setCsvData(formattedData);
  }, [filteredData, hypervisors]);

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

        <div className="mb-4">
          <CSVLink data={csvData} headers={headers} filename={"report.csv"} className="btn btn-primary">
            Descargar CSV
          </CSVLink>
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

export default ReportsPage;
