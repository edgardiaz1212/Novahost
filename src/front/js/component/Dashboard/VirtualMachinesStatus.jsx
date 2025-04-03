import React from 'react';
import { Cpu } from 'lucide-react';

function VirtualMachinesStatus({ virtualMachines, isLoading }) {
  if (isLoading) {
    return (
      <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
        <div className="col">
          <div className="card shadow-sm p-4">
            <div className="text-center">
              <p className="text-muted">Cargando datos de Máquinas Virtuales...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!virtualMachines || virtualMachines.length === 0) {
    return (
      <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
        <div className="col">
          <div className="card shadow-sm p-4">
            <div className="text-center">
              <p className="text-muted">No hay máquinas virtuales disponibles.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 g-4 mb-4">
      {virtualMachines
        .slice() // Create a copy to avoid mutating the original array
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by creation date (newest first)
        .slice(0, 10) // Get the first 10 (newest)
        .map((vm, index) => (
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
                  <span
                    className={`badge ${
                      vm.status === 'Activa'
                        ? 'bg-success'
                        : vm.status === 'Inactiva'
                        ? 'bg-danger'
                        : 'bg-warning'
                    }`}
                  >
                    {vm.status}
                  </span>
                </p>
                {vm.external_vm_power_state && (
                  <p>
                    <strong>Estado Externo:</strong>
                    <span
                      className={`badge ${
                        vm.external_vm_power_state === 'poweredOn'
                          ? 'bg-success'
                          : vm.external_vm_power_state === 'poweredOff'
                          ? 'bg-danger'
                          : 'bg-warning'
                      }`}
                    >
                      {vm.external_vm_power_state}
                    </span>
                  </p>
                )}
                {vm.external_vm_guest_os && (
                  <p>
                    <strong>Sistema Operativo:</strong>{' '}
                    {vm.external_vm_guest_os}
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
                {vm.created_at && (
                  <p>
                    <strong>Creada:</strong>{' '}
                    {new Date(vm.created_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default VirtualMachinesStatus;
