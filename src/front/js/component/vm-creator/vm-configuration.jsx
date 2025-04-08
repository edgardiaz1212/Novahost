import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HypervisorType, OS_OPTIONS, NETWORK_OPTIONS, PROXMOX_STORAGE_OPTIONS, PROXMOX_NODE_OPTIONS, VCENTER_DATASTORE_OPTIONS, VCENTER_CLUSTER_OPTIONS, VCENTER_RESOURCE_POOL_OPTIONS, VCENTER_FOLDER_OPTIONS } from "./hypervisor-selector";
import { z } from "zod";
import { ArrowLeft, ArrowRight } from "lucide-react"; // Import the icons from lucide-react

// Form schema for VM configuration
const vmConfigFormSchema = z.object({
  name: z.string().min(1, "El nombre de la VM es requerido"),
  description: z.string().optional(),
  operatingSystem: z.string().min(1, "El sistema operativo es requerido"),
  networkInterface: z.string().min(1, "La interfaz de red es requerida"),
  ipAddress: z.string().optional(),
  gateway: z.string().optional(),
  dns: z.string().optional(),
  datastore: z.string().optional(),

  // Proxmox-specific fields
  hostGroup: z.string().optional(),
  vncAccess: z.boolean().optional(),

  // vCenter-specific fields
  cluster: z.string().optional(),
  resourcePool: z.string().optional(),
  folder: z.string().optional(),
  snapshot: z.boolean().optional(),

  // Common options
  backup: z.boolean().optional(),
});

export function VmConfiguration({
  hypervisorType,
  onNext,
  onPrevious,
  onFormSubmit,
  initialValues,
}) {
  const form = useForm({
    resolver: zodResolver(vmConfigFormSchema),
    defaultValues: {
      name: "",
      description: "",
      operatingSystem: "",
      networkInterface: "",
      ipAddress: "",
      gateway: "",
      dns: "",
      datastore: "",
      hostGroup: "",
      cluster: "",
      resourcePool: "",
      folder: "",
      vncAccess: false,
      snapshot: false,
      backup: false,
      ...initialValues,
    },
  });

  function onSubmit(data) {
    onFormSubmit(data);
    onNext();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="container">
        <h3 className="mb-3">Configuración de la Máquina Virtual</h3>

        {/* Basic Information */}
        <div className="mb-3">
          <h5 className="mb-3">Información Básica</h5>
          <div className="row row-cols-1 row-cols-sm-2 g-3">
            <div className="col">
              <label htmlFor="name" className="form-label">
                Nombre de la VM <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="ej. web-server-01"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <div className="text-danger">
                  {form.formState.errors.name.message}
                </div>
              )}
            </div>

            <div className="col">
              <label htmlFor="description" className="form-label">
                Descripción
              </label>
              <input
                type="text"
                className="form-control"
                id="description"
                placeholder="ej. Servidor web para intranet"
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <div className="text-danger">
                  {form.formState.errors.description.message}
                </div>
              )}
            </div>

            <div className="col">
              <label htmlFor="operatingSystem" className="form-label">
                Sistema Operativo <span className="text-danger">*</span>
              </label>
              <select
                id="operatingSystem"
                className="form-select"
                {...form.register("operatingSystem")}
              >
                <option value="">Seleccionar SO</option>
                {OS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {form.formState.errors.operatingSystem && (
                <div className="text-danger">
                  {form.formState.errors.operatingSystem.message}
                </div>
              )}
            </div>

            <div className="col">
              <label htmlFor="networkInterface" className="form-label">
                Interfaz de Red <span className="text-danger">*</span>
              </label>
              <select
                id="networkInterface"
                className="form-select"
                {...form.register("networkInterface")}
              >
                <option value="">Seleccionar Red</option>
                {NETWORK_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {form.formState.errors.networkInterface && (
                <div className="text-danger">
                  {form.formState.errors.networkInterface.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Network Configuration */}
        <div className="mb-3">
          <h5 className="mb-3">Configuración de Red</h5>
          <div className="row row-cols-1 row-cols-sm-3 g-3">
            <div className="col">
              <label htmlFor="ipAddress" className="form-label">
                Dirección IP
              </label>
              <input
                type="text"
                className="form-control"
                id="ipAddress"
                placeholder="ej. 192.168.1.100"
                {...form.register("ipAddress")}
              />
              <div className="form-text">Dejar vacío para DHCP</div>
              {form.formState.errors.ipAddress && (
                <div className="text-danger">
                  {form.formState.errors.ipAddress.message}
                </div>
              )}
            </div>

            <div className="col">
              <label htmlFor="gateway" className="form-label">
                Puerta de Enlace
              </label>
              <input
                type="text"
                className="form-control"
                id="gateway"
                placeholder="ej. 192.168.1.1"
                {...form.register("gateway")}
              />
              {form.formState.errors.gateway && (
                <div className="text-danger">
                  {form.formState.errors.gateway.message}
                </div>
              )}
            </div>

            <div className="col">
              <label htmlFor="dns" className="form-label">
                Servidores DNS
              </label>
              <input
                type="text"
                className="form-control"
                id="dns"
                placeholder="ej. 8.8.8.8, 8.8.4.4"
                {...form.register("dns")}
              />
              {form.formState.errors.dns && (
                <div className="text-danger">
                  {form.formState.errors.dns.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hypervisor-specific Settings */}
        {hypervisorType === HypervisorType.PROXMOX && (
          <div className="mb-3">
            <h5 className="mb-3">Configuración Específica de Proxmox</h5>
            <div className="row row-cols-1 row-cols-sm-2 g-3">
              <div className="col">
                <label htmlFor="datastore" className="form-label">
                  Pool de Almacenamiento
                </label>
                <select
                  id="datastore"
                  className="form-select"
                  {...form.register("datastore")}
                >
                  <option value="">Seleccionar Pool</option>
                  {PROXMOX_STORAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.datastore && (
                  <div className="text-danger">
                    {form.formState.errors.datastore.message}
                  </div>
                )}
              </div>

              <div className="col">
                <label htmlFor="hostGroup" className="form-label">
                  Nodo
                </label>
                <select
                  id="hostGroup"
                  className="form-select"
                  {...form.register("hostGroup")}
                >
                  <option value="">Seleccionar Nodo</option>
                  {PROXMOX_NODE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.hostGroup && (
                  <div className="text-danger">
                    {form.formState.errors.hostGroup.message}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 d-flex align-items-center gap-5">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="vncAccess"
                  {...form.register("vncAccess")}
                />
                <label className="form-check-label" htmlFor="vncAccess">
                  Habilitar Consola VNC
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="backup"
                  {...form.register("backup")}
                />
                <label className="form-check-label" htmlFor="backup">
                  Incluir en Backup
                </label>
              </div>
            </div>
          </div>
        )}

        {hypervisorType === HypervisorType.VCENTER && (
          <div className="mb-3">
            <h5 className="mb-3">Configuración Específica de vCenter</h5>
            <div className="row row-cols-1 row-cols-sm-2 g-3">
              <div className="col">
                <label htmlFor="datastore" className="form-label">
                  Datastore
                </label>
                <select
                  id="datastore"
                  className="form-select"
                  {...form.register("datastore")}
                >
                  <option value="">Seleccionar Datastore</option>
                  {VCENTER_DATASTORE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.datastore && (
                  <div className="text-danger">
                    {form.formState.errors.datastore.message}
                  </div>
                )}
              </div>

              <div className="col">
                <label htmlFor="cluster" className="form-label">
                  Cluster
                </label>
                <select
                  id="cluster"
                  className="form-select"
                  {...form.register("cluster")}
                >
                  <option value="">Seleccionar Cluster</option>
                  {VCENTER_CLUSTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.cluster && (
                  <div className="text-danger">
                    {form.formState.errors.cluster.message}
                  </div>
                )}
              </div>

              <div className="col">
                <label htmlFor="resourcePool" className="form-label">
                  Resource Pool
                </label>
                <select
                  id="resourcePool"
                  className="form-select"
                  {...form.register("resourcePool")}
                >
                  <option value="">Seleccionar Resource Pool</option>
                  {VCENTER_RESOURCE_POOL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.resourcePool && (
                  <div className="text-danger">
                    {form.formState.errors.resourcePool.message}
                  </div>
                )}
              </div>

              <div className="col">
                <label htmlFor="folder" className="form-label">
                  Carpeta de VM
                </label>
                <select
                  id="folder"
                  className="form-select"
                  {...form.register("folder")}
                >
                  <option value="">Seleccionar Carpeta</option>
                  {VCENTER_FOLDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.folder && (
                  <div className="text-danger">
                    {form.formState.errors.folder.message}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 d-flex align-items-center gap-5">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="snapshot"
                  {...form.register("snapshot")}
                />
                <label className="form-check-label" htmlFor="snapshot">
                  Crear Snapshot Inicial
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="backup"
                  {...form.register("backup")}
                />
                <label className="form-check-label" htmlFor="backup">
                  Incluir en Backup
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onPrevious}
          >
            <ArrowLeft className="h-4 w-4 me-1" />
            Atrás
          </button>
          <button type="submit" className="btn btn-primary">
            Siguiente
            <ArrowRight className="h-4 w-4 ms-1" />
          </button>
        </div>
      </div>
    </form>
  );
}
