import { InfoIcon, CheckCircle, XCircle } from "lucide-react";
import { HypervisorType } from "./hypervisor-selector";

export function VmReview({
  hypervisorType,
  planType,
  selectedPlan,
  customConfig,
  vmConfig,
  onPrevious,
  onSubmit,
  isLoading,
  isSuccess,
  isError,
  errorMessage,
  onReset,
  onRetry,
}) {
  const ram = planType === "cataloged" ? selectedPlan?.ram : customConfig.ram;
  const cpuCores =
    planType === "cataloged" ? selectedPlan?.cpuCores : customConfig.cpuCores;
  const diskSize =
    planType === "cataloged" ? selectedPlan?.diskSize : customConfig.diskSize;
  const diskType = customConfig.diskType;

  if (isLoading) {
    return (
      <div className="p-5 d-flex flex-column align-items-center justify-content-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="text-lg text-secondary">
          Creando máquina virtual...
        </p>
        <p className="text-sm text-secondary mt-2">
          Esto puede tardar unos momentos
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="p-5">
        <div className="alert alert-success mb-3" role="alert">
          <div className="d-flex align-items-center">
            <CheckCircle className="me-2" />
            <div>
              <h5 className="alert-heading">VM Creada Exitosamente</h5>
              <p className="mb-0">
                La máquina virtual se ha creado correctamente y ahora se está
                aprovisionando.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-light p-3 rounded mb-3">
          <h5 className="mb-3">Detalles de la VM</h5>
          <div className="row row-cols-1 row-cols-md-2 g-3">
            <div className="col">
              <p className="text-secondary mb-0">Nombre de la VM</p>
              <p className="fw-bold">{vmConfig.name}</p>
            </div>
            <div className="col">
              <p className="text-secondary mb-0">Hipervisor</p>
              <p className="fw-bold">
                {hypervisorType === HypervisorType.PROXMOX ? "Proxmox" : "vCenter"}
              </p>
            </div>
            <div className="col">
              <p className="text-secondary mb-0">Estado</p>
              <p className="fw-bold text-success">Aprovisionando</p>
            </div>
            <div className="col">
              <p className="text-secondary mb-0">Fecha de Creación</p>
              <p className="fw-bold">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <button onClick={onReset} className="btn btn-primary">
            Crear Otra VM
          </button>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-5">
        <div className="alert alert-danger mb-3" role="alert">
          <div className="d-flex align-items-center">
            <XCircle className="me-2" />
            <div>
              <h5 className="alert-heading">Falló la Creación de la VM</h5>
              <p className="mb-0">
                {errorMessage ||
                  "Falló la conexión con el hipervisor. Por favor, revise su conexión e intente de nuevo."}
              </p>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onReset}
          >
            Empezar de Nuevo
          </button>
          <button onClick={onRetry} className="btn btn-primary">
            Intentar de Nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-3">Revisar y Enviar</h3>

      <div className="bg-light p-3 rounded mb-3">
        <h5 className="mb-3">Resumen de la Máquina Virtual</h5>

        <div className="row row-cols-1 row-cols-md-2 g-3">
          <div className="col">
            <p className="text-secondary mb-0">Tipo de Hipervisor</p>
            <p className="fw-bold">
              {hypervisorType === HypervisorType.PROXMOX ? "Proxmox" : "vCenter"}
            </p>
          </div>
          <div className="col">
            <p className="text-secondary mb-0">Tipo de Plan</p>
            <p className="fw-bold">
              {planType === "cataloged"
                ? `Predefinido - ${selectedPlan?.name || ""}`
                : "Personalizado"}
            </p>
          </div>
          <div className="col">
            <p className="text-secondary mb-0">Nombre de la VM</p>
            <p className="fw-bold">{vmConfig.name || "No especificado"}</p>
          </div>
          <div className="col">
            <p className="text-secondary mb-0">Sistema Operativo</p>
            <p className="fw-bold">
              {vmConfig.operatingSystem || "No especificado"}
            </p>
          </div>
          <div className="col">
            <p className="text-secondary mb-0">CPU</p>
            <p className="fw-bold">{cpuCores} Núcleos</p>
          </div>
          <div className="col">
            <p className="text-secondary mb-0">RAM</p>
            <p className="fw-bold">{ram}</p>
          </div>
          <div className="col">
            <p className="text-secondary mb-0">Disco</p>
            <p className="fw-bold">
              {diskSize} ({diskType === "ssd" ? "SSD" : "HDD"})
            </p>
          </div>
          <div className="col">
            <p className="text-secondary mb-0">Red</p>
            <p className="fw-bold">
              {vmConfig.networkInterface || "No especificado"}
            </p>
          </div>
        </div>

        {hypervisorType === HypervisorType.PROXMOX && (
          <div className="mt-3">
            <h6 className="mb-2">Configuración de Proxmox</h6>
            <div className="row row-cols-1 row-cols-md-2 g-3">
              <div className="col">
                <p className="text-secondary mb-0">Pool de Almacenamiento</p>
                <p className="fw-bold">
                  {vmConfig.datastore || "No especificado"}
                </p>
              </div>
              <div className="col">
                <p className="text-secondary mb-0">Nodo</p>
                <p className="fw-bold">
                  {vmConfig.hostGroup || "No especificado"}
                </p>
              </div>
              <div className="col">
                <p className="text-secondary mb-0">Acceso VNC</p>
                <p className="fw-bold">
                  {vmConfig.vncAccess ? "Habilitado" : "Deshabilitado"}
                </p>
              </div>
              <div className="col">
                <p className="text-secondary mb-0">Backup</p>
                <p className="fw-bold">
                  {vmConfig.backup ? "Habilitado" : "Deshabilitado"}
                </p>
              </div>
            </div>
          </div>
        )}

        {hypervisorType === HypervisorType.VCENTER && (
          <div className="mt-3">
            <h6 className="mb-2">Configuración de vCenter</h6>
            <div className="row row-cols-1 row-cols-md-2 g-3">
              <div className="col">
                <p className="text-secondary mb-0">Datastore</p>
                <p className="fw-bold">
                  {vmConfig.datastore || "No especificado"}
                </p>
              </div>
              <div className="col">
                <p className="text-secondary mb-0">Cluster</p>
                <p className="fw-bold">
                  {vmConfig.cluster || "No especificado"}
                </p>
              </div>
              <div className="col">
                <p className="text-secondary mb-0">Resource Pool</p>
                <p className="fw-bold">
                  {vmConfig.resourcePool || "No especificado"}
                </p>
              </div>
              <div className="col">
                <p className="text-secondary mb-0">Carpeta de VM</p>
                <p className="fw-bold">
                  {vmConfig.folder || "No especificado"}
                </p>
              </div>
              <div className="col">
                <p className="text-secondary mb-0">Snapshot Inicial</p>
                <p className="fw-bold">
                  {vmConfig.snapshot ? "Habilitado" : "Deshabilitado"}
                </p>
              </div>
              <div className="col">
                <p className="text-secondary mb-0">Backup</p>
                <p className="fw-bold">
                  {vmConfig.backup ? "Habilitado" : "Deshabilitado"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="alert alert-info mb-3" role="alert">
        <div className="d-flex align-items-center">
          <InfoIcon className="me-2" />
          <div>
            Por favor, revise la información anterior antes de enviar. Una vez
            enviado, el proceso de creación de la máquina virtual comenzará.
          </div>
        </div>
      </div>

      <div className="mt-3 d-flex justify-content-between">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onPrevious}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 me-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Atrás
        </button>
        <button onClick={onSubmit} className="btn btn-primary">
          Crear VM
        </button>
      </div>
    </div>
  );
}
