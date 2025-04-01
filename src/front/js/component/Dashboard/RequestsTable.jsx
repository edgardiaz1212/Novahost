import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

function RequestsTable({ requests, hypervisors }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter requests that are "En Proceso"
  const inProgressRequests = requests.filter(
    (request) => request.status === 'En Proceso'
  );

  // Filter requests based on search term
  const filteredRequests = inProgressRequests.filter((request) => {
    const hypervisorName = hypervisors.find(h => h.id === request.hypervisor_id)?.name || 'N/A';
    return (
      request.id.toString().includes(searchTerm) ||
      request.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hypervisorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
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
                value={searchTerm}
                onChange={handleSearchChange}
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
              <th scope="col">Hypervisor</th> {/* New column */}
              <th scope="col">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => {
              const hypervisorName = hypervisors.find(h => h.id === request.hypervisor_id)?.name || 'N/A';
              return (
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
                  <td>{hypervisorName}</td> {/* Display hypervisor name */}
                  <td>{request.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RequestsTable;
