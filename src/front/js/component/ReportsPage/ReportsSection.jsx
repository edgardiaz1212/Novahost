import React from 'react';

function ReportsSection({
  downloadVMsByHypervisor,
  downloadClientVMs,
  downloadVMsThisMonth,
  downloadVMsThisYear,
  downloadAllVMs,
}) {
  return (
    <div className="mb-3">
      <button className="btn btn-primary me-2" onClick={downloadVMsByHypervisor}>
        Descargar VMs por Hypervisor
      </button>
      <button className="btn btn-primary me-2" onClick={downloadClientVMs}>
        Descargar VMs de Clientes
      </button>
      <button className="btn btn-primary me-2" onClick={downloadVMsThisMonth}>
        Descargar VMs del Mes Actual
      </button>
      <button className="btn btn-primary me-2" onClick={downloadVMsThisYear}>
        Descargar VMs del Año Actual
      </button>
      <button className="btn btn-primary" onClick={downloadAllVMs}>
        Descargar Todas las VMs
      </button>
    </div>
  );
}

export default ReportsSection;
