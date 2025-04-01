import React from 'react';
import { Server, Cpu, HardDrive, MemoryStick } from 'lucide-react';

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
                {/* Display resource usage if available */}
                {hypervisor.cpu_total && hypervisor.cpu_used && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-1">
                      <Cpu className="text-secondary me-2" size={16} />
                      <span className="fw-bold">CPU:</span>
                      <span className="ms-auto">
                        {hypervisor.cpu_used} / {hypervisor.cpu_total} Cores
                      </span>
                    </div>
                    <div className="progress">
                      <div
                        className={`progress-bar ${getProgressBarColor(
                          calculatePercentage(hypervisor.cpu_used, hypervisor.cpu_total)
                        )}`}
                        role="progressbar"
                        style={{
                          width: `${calculatePercentage(
                            hypervisor.cpu_used,
                            hypervisor.cpu_total
                          )}%`,
                        }}
                        aria-valuenow={calculatePercentage(
                          hypervisor.cpu_used,
                          hypervisor.cpu_total
                        )}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {calculatePercentage(
                          hypervisor.cpu_used,
                          hypervisor.cpu_total
                        )}
                        %
                      </div>
                    </div>
                  </div>
                )}
                {hypervisor.ram_total && hypervisor.ram_used && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-1">
                      <MemoryStick className="text-secondary me-2" size={16} />
                      <span className="fw-bold">RAM:</span>
                      <span className="ms-auto">
                        {hypervisor.ram_used} / {hypervisor.ram_total} GB
                      </span>
                    </div>
                    <div className="progress">
                      <div
                        className={`progress-bar ${getProgressBarColor(
                          calculatePercentage(hypervisor.ram_used, hypervisor.ram_total)
                        )}`}
                        role="progressbar"
                        style={{
                          width: `${calculatePercentage(
                            hypervisor.ram_used,
                            hypervisor.ram_total
                          )}%`,
                        }}
                        aria-valuenow={calculatePercentage(
                          hypervisor.ram_used,
                          hypervisor.ram_total
                        )}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {calculatePercentage(
                          hypervisor.ram_used,
                          hypervisor.ram_total
                        )}
                        %
                      </div>
                    </div>
                  </div>
                )}
                {hypervisor.disk_total && hypervisor.disk_used && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-1">
                      <HardDrive className="text-secondary me-2" size={16} />
                      <span className="fw-bold">Disco:</span>
                      <span className="ms-auto">
                        {hypervisor.disk_used} / {hypervisor.disk_total} GB
                      </span>
                    </div>
                    <div className="progress">
                      <div
                        className={`progress-bar ${getProgressBarColor(
                          calculatePercentage(hypervisor.disk_used, hypervisor.disk_total)
                        )}`}
                        role="progressbar"
                        style={{
                          width: `${calculatePercentage(
                            hypervisor.disk_used,
                            hypervisor.disk_total
                          )}%`,
                        }}
                        aria-valuenow={calculatePercentage(
                          hypervisor.disk_used,
                          hypervisor.disk_total
                        )}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {calculatePercentage(
                          hypervisor.disk_used,
                          hypervisor.disk_total
                        )}
                        %
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Helper functions
const calculatePercentage = (used, total) => {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
};

const getProgressBarColor = (percentage) => {
  if (percentage < 50) return 'bg-success';
  if (percentage < 80) return 'bg-warning';
  return 'bg-danger';
};

export default HypervisorStatus;
