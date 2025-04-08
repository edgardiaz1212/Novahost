import { useState } from "react";
import { Server, Cpu, ArrowRight, Check } from "lucide-react";

// Hypervisor types
export const HypervisorType = {
  PROXMOX: "proxmox",
  VCENTER: "vcenter",
};

// VM creation steps
export const VM_CREATION_STEPS = {
  HYPERVISOR: 'hypervisor',
  RESOURCES: 'resources',
  CONFIGURATION: 'configuration',
  REVIEW: 'review'
};

// OS options
export const OS_OPTIONS = [
  { value: "ubuntu-20.04", label: "Ubuntu 20.04 LTS" },
  { value: "ubuntu-22.04", label: "Ubuntu 22.04 LTS" },
  { value: "centos-7", label: "CentOS 7" },
  { value: "centos-8", label: "CentOS 8" },
  { value: "windows-server-2019", label: "Windows Server 2019" },
  { value: "windows-server-2022", label: "Windows Server 2022" },
  { value: "windows-10", label: "Windows 10" },
  { value: "windows-11", label: "Windows 11" }
];

// Network interface options
export const NETWORK_OPTIONS = [
  { value: "prod-net", label: "Production Network" },
  { value: "dev-net", label: "Development Network" },
  { value: "test-net", label: "Test Network" },
  { value: "dmz-net", label: "DMZ Network" }
];

// Proxmox storage options
export const PROXMOX_STORAGE_OPTIONS = [
  { value: "local-lvm", label: "local-lvm" },
  { value: "local-zfs", label: "local-zfs" },
  { value: "ceph-pool", label: "ceph-pool" },
  { value: "nfs-storage", label: "nfs-storage" }
];

// Proxmox node options
export const PROXMOX_NODE_OPTIONS = [
  { value: "node1", label: "node1" },
  { value: "node2", label: "node2" },
  { value: "node3", label: "node3" }
];

// vCenter datastore options
export const VCENTER_DATASTORE_OPTIONS = [
  { value: "ds-ssd-01", label: "ds-ssd-01" },
  { value: "ds-ssd-02", label: "ds-ssd-02" },
  { value: "ds-sas-01", label: "ds-sas-01" },
  { value: "ds-sas-02", label: "ds-sas-02" }
];

// vCenter cluster options
export const VCENTER_CLUSTER_OPTIONS = [
  { value: "prod-cluster", label: "prod-cluster" },
  { value: "dev-cluster", label: "dev-cluster" },
  { value: "test-cluster", label: "test-cluster" }
];

// vCenter resource pool options
export const VCENTER_RESOURCE_POOL_OPTIONS = [
  { value: "high", label: "High Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "low", label: "Low Priority" }
];

// vCenter folder options
export const VCENTER_FOLDER_OPTIONS = [
  { value: "web-servers", label: "Web Servers" },
  { value: "app-servers", label: "App Servers" },
  { value: "db-servers", label: "DB Servers" },
  { value: "utility-servers", label: "Utility Servers" }
];

export function HypervisorSelector({
  selectedHypervisor,
  onSelect,
  onNext,
}) {
  const isValid = selectedHypervisor !== null;

  const hypervisorOptions = [
    {
      type: HypervisorType.PROXMOX,
      name: "Proxmox",
      description: "Plataforma de virtualización de código abierto",
      icon: <Server className="h-8 w-8" />,
      iconBgColor: "bg-danger-subtle text-danger",
    },
    {
      type: HypervisorType.VCENTER,
      name: "vCenter",
      description: "Gestión de virtualización de VMware",
      icon: <Cpu className="h-8 w-8" />,
      iconBgColor: "bg-primary-subtle text-primary",
    },
  ];

  return (
    <div className="container">
      <h3 className="mb-3">Selecciona el Tipo de Hipervisor</h3>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {hypervisorOptions.map((option) => (
          <div key={option.type} className="col">
            <div
              onClick={() => onSelect(option.type)}
              className={`card border-2 p-3 cursor-pointer ${
                selectedHypervisor === option.type
                  ? "border-primary bg-primary-subtle"
                  : "border-secondary"
              }`}
            >
              <div className="d-flex align-items-center">
                <div
                  className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${option.iconBgColor}`}
                  style={{ width: "48px", height: "48px" }}
                >
                  {option.icon}
                </div>
                <div>
                  <h5 className="card-title mb-1">{option.name}</h5>
                  <p className="card-text text-secondary">{option.description}</p>
                </div>
                <div className="ms-auto">
                  <div
                    className={`rounded-circle border-2 d-flex align-items-center justify-content-center ${
                      selectedHypervisor === option.type
                        ? "border-primary bg-primary"
                        : "border-secondary"
                    }`}
                    style={{ width: "20px", height: "20px" }}
                  >
                    {selectedHypervisor === option.type && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedHypervisor === HypervisorType.VCENTER && (
        <div className="mt-3">
          <div className="alert alert-primary" role="alert">
            <div className="d-flex">
              <div className="ms-3">
                <h5 className="alert-heading">
                  Compatible con vCenter 6.x y 7.x
                </h5>
                <p>
                  Ambas versiones de vCenter 6 y 7 son compatibles. Las
                  características específicas de cada versión estarán
                  disponibles en pasos posteriores.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 d-flex justify-content-end">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="btn btn-primary"
        >
          Siguiente
          <ArrowRight className="h-4 w-4 ms-1" />
        </button>
      </div>
    </div>
  );
}
