import React from 'react';
import { Server } from 'lucide-react';

function HypervisorStatus({ hypervisors, isLoading }) {
  return (
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
  );
}

export default HypervisorStatus;
