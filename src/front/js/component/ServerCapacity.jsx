import React from 'react';
import { Server, Cpu, HardDrive, MemoryStick } from 'lucide-react';

function ServerCapacity({ serverData }) {
  // Ensure serverData is provided and has the necessary properties
  if (!serverData || !serverData.platform || !serverData.cpuTotal || !serverData.cpuUsed || !serverData.ramTotal || !serverData.ramUsed || !serverData.diskTotal || !serverData.diskUsed) {
    return (
      <div className="card shadow-sm p-4">
        <div className="text-center">
          <p className="text-muted">Datos de capacidad del servidor no disponibles.</p>
        </div>
      </div>
    );
  }

  const { platform, cpuTotal, cpuUsed, ramTotal, ramUsed, diskTotal, diskUsed } = serverData;

  const calculatePercentage = (used, total) => {
    if (total === 0) return 0;
    return Math.round((used / total) * 100);
  };

  const cpuPercentage = calculatePercentage(cpuUsed, cpuTotal);
  const ramPercentage = calculatePercentage(ramUsed, ramTotal);
  const diskPercentage = calculatePercentage(diskUsed, diskTotal);

  const getProgressBarColor = (percentage) => {
    if (percentage < 50) return 'bg-success';
    if (percentage < 80) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white border-bottom">
        <div className="d-flex align-items-center">
          <Server className="text-primary me-2" size={20} />
          <h5 className="mb-0">Capacidad del Servidor ({platform})</h5>
        </div>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <div className="d-flex align-items-center mb-1">
            <Cpu className="text-secondary me-2" size={16} />
            <span className="fw-bold">CPU:</span>
            <span className="ms-auto">{cpuUsed} / {cpuTotal} Cores</span>
          </div>
          <div className="progress">
            <div
              className={`progress-bar ${getProgressBarColor(cpuPercentage)}`}
              role="progressbar"
              style={{ width: `${cpuPercentage}%` }}
              aria-valuenow={cpuPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {cpuPercentage}%
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex align-items-center mb-1">
            <MemoryStick className="text-secondary me-2" size={16} />
            <span className="fw-bold">RAM:</span>
            <span className="ms-auto">{ramUsed} / {ramTotal} GB</span>
          </div>
          <div className="progress">
            <div
              className={`progress-bar ${getProgressBarColor(ramPercentage)}`}
              role="progressbar"
              style={{ width: `${ramPercentage}%` }}
              aria-valuenow={ramPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {ramPercentage}%
            </div>
          </div>
        </div>

        <div>
          <div className="d-flex align-items-center mb-1">
            <HardDrive className="text-secondary me-2" size={16} />
            <span className="fw-bold">Disco:</span>
            <span className="ms-auto">{diskUsed} / {diskTotal} GB</span>
          </div>
          <div className="progress">
            <div
              className={`progress-bar ${getProgressBarColor(diskPercentage)}`}
              role="progressbar"
              style={{ width: `${diskPercentage}%` }}
              aria-valuenow={diskPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {diskPercentage}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServerCapacity;
