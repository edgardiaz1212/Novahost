import React, { useState, useEffect, useContext } from "react";
import { Server, HardDrive, MemoryStick, Cpu, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Context } from "../../store/appContext";

export function PlanSelector({
  onPlanSelect,
  onCustomConfigChange,
  selectedPlan,
  planType,
  setPlanType,
  customConfig,
  onNext,
  onPrevious,
}) {
  const { store, actions } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if (
      planType === "custom" &&
      (customConfig.ram === "" ||
        customConfig.cpuCores === "" ||
        customConfig.diskSize === "")
    ) {
      onCustomConfigChange({
        ram: customConfig.ram || "4 GB",
        cpuCores: customConfig.cpuCores || "2",
        diskSize: customConfig.diskSize || "40 GB",
        diskType: customConfig.diskType,
      });
    }
  }, [planType, customConfig, onCustomConfigChange]);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      await actions.fetchServices();
      setPlans(store.services);
      setIsLoading(false);
    };
    fetchPlans();
  }, []);

  const isValid = () => {
    if (planType === "cataloged") {
      return selectedPlan !== null;
    } else {
      return (
        customConfig.ram !== "" &&
        customConfig.cpuCores !== "" &&
        customConfig.diskSize !== ""
      );
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <h3 className="mb-3">Configuración de Recursos</h3>

      <div className="mb-3">
        <div className="btn-group" role="group">
          <input
            type="radio"
            className="btn-check"
            name="planOptions"
            id="plan-cataloged"
            value="cataloged"
            checked={planType === "cataloged"}
            onChange={() => setPlanType("cataloged")}
          />
          <label className="btn btn-outline-primary" htmlFor="plan-cataloged">
            Planes Predefinidos
          </label>

          <input
            type="radio"
            className="btn-check"
            name="planOptions"
            id="plan-custom"
            value="custom"
            checked={planType === "custom"}
            onChange={() => setPlanType("custom")}
          />
          <label className="btn btn-outline-primary" htmlFor="plan-custom">
            Configuración Personalizada
          </label>
        </div>
      </div>

      {planType === "cataloged" && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
         {plans.map((plan) => (
  <div key={plan.id} className="col">
    <div
      onClick={() => onPlanSelect(plan)}
      className={`card p-3 cursor-pointer border-2 ${
        selectedPlan?.id === plan.id
          ? "border-primary bg-primary-subtle"
          : "border-secondary"
      }`}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h5 className="card-title">{plan.nombre}</h5> {/* Accessing 'nombre' */}
          <p className="card-text text-secondary mt-1">
            {plan.description} {/* You might want to add a description field to the model */}
          </p>
        </div>
        {/* ... */}
      </div>
      <div className="mt-3">
        <div className="d-flex align-items-center mb-2">
          <Cpu className="text-secondary me-2" />
          <span className="text-secondary">
            CPU: {plan.procesador} {/* Accessing 'procesador' */}
          </span>
        </div>
        <div className="d-flex align-items-center mb-2">
          <MemoryStick className="text-secondary me-2" />
          <span className="text-secondary">RAM: {plan.ram}</span> {/* Accessing 'ram' */}
        </div>
        <div className="d-flex align-items-center">
          <HardDrive className="text-secondary me-2" />
          <span className="text-secondary">
            Disk: {plan.disco} {/* Accessing 'disco' */}
          </span>
        </div>
      </div>
    </div>
  </div>
))}

        </div>
      )}

      {planType === "custom" && (
        <div className="mt-3">
          <div className="row row-cols-1 row-cols-sm-3 g-3">
            <div className="col">
              <label htmlFor="ram" className="form-label">
                RAM (GB)
              </label>
              <select
                id="ram"
                className="form-select"
                value={customConfig.ram}
                onChange={(e) =>
                  onCustomConfigChange({
                    ...customConfig,
                    ram: e.target.value,
                  })
                }
              >
                <option value="1 GB">1 GB</option>
                <option value="2 GB">2 GB</option>
                <option value="4 GB">4 GB</option>
                <option value="8 GB">8 GB</option>
                <option value="16 GB">16 GB</option>
                <option value="32 GB">32 GB</option>
                <option value="64 GB">64 GB</option>
                <option value="128 GB">128 GB</option>
              </select>
            </div>
            <div className="col">
              <label htmlFor="cpu-cores" className="form-label">
                Núcleos de CPU
              </label>
              <select
                id="cpu-cores"
                className="form-select"
                value={customConfig.cpuCores}
                onChange={(e) =>
                  onCustomConfigChange({
                    ...customConfig,
                    cpuCores: e.target.value,
                  })
                }
              >
                <option value="1">1 Núcleo</option>
                <option value="2">2 Núcleos</option>
                <option value="4">4 Núcleos</option>
                <option value="8">8 Núcleos</option>
                <option value="16">16 Núcleos</option>
                <option value="32">32 Núcleos</option>
                <option value="64">64 Núcleos</option>
              </select>
            </div>
            <div className="col">
              <label htmlFor="disk-size" className="form-label">
                Tamaño del Disco (GB)
              </label>
              <select
                id="disk-size"
                className="form-select"
                value={customConfig.diskSize}
                onChange={(e) =>
                  onCustomConfigChange({
                    ...customConfig,
                    diskSize: e.target.value,
                  })
                }
              >
                <option value="20 GB">20 GB</option>
                <option value="40 GB">40 GB</option>
                <option value="80 GB">80 GB</option>
                <option value="160 GB">160 GB</option>
                <option value="320 GB">320 GB</option>
                <option value="640 GB">640 GB</option>
                <option value="1 TB">1 TB</option>
                <option value="2 TB">2 TB</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="form-label">Tipo de Disco</label>
            <div className="d-flex">
              <div className="form-check me-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="diskTypeOptions"
                  id="disk-ssd"
                  value="ssd"
                  checked={customConfig.diskType === "ssd"}
                  onChange={(e) =>
                    onCustomConfigChange({
                      ...customConfig,
                      diskType: e.target.value,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="disk-ssd">
                  SSD (Recomendado)
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="diskTypeOptions"
                  id="disk-hdd"
                  value="hdd"
                  checked={customConfig.diskType === "hdd"}
                  onChange={(e) =>
                    onCustomConfigChange({
                      ...customConfig,
                      diskType: e.target.value,
                    })
                  }
                />
                <label className="form-check-label" htmlFor="disk-hdd">
                  HDD
                </label>
              </div>
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
          <ChevronLeft className="h-4 w-4 me-1" />
          Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!isValid()}
          className="btn btn-primary"
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ms-1" />
        </button>
      </div>
    </div>
  );
}
