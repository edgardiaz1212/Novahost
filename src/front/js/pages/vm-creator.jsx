import React, { useState, useContext, useEffect } from "react";
import { HypervisorSelector } from "../component/vm-creator/hypervisor-selector";
import { PlanSelector } from "../component/vm-creator/plan-selector";
import { VmConfiguration } from "../component/vm-creator/vm-configuration";
import { VmReview } from "../component/vm-creator/vm-review";
import { ProgressStepper } from "../component/vm-creator/progress-stepper";
import { useStepper } from "../hooks/use-stepper.ts";
import { HypervisorType, VM_CREATION_STEPS } from "../component/vm-creator/hypervisor-selector";
// import { Layout } from "@/components/layout/layout";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from "../store/appContext";

export default function VmCreator() {
  const { store, actions } = useContext(Context);
  const [hypervisorType, setHypervisorType] = useState(null);
  const [planType, setPlanType] = useState("cataloged");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [customConfig, setCustomConfig] = useState({
    ram: "",
    cpuCores: "",
    diskSize: "",
    diskType: "ssd"
  });
  const [vmConfig, setVmConfig] = useState({
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
    backup: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Set up the stepper
  const {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    resetStepper
  } = useStepper({
    steps: [
      VM_CREATION_STEPS.HYPERVISOR,
      VM_CREATION_STEPS.RESOURCES,
      VM_CREATION_STEPS.CONFIGURATION,
      VM_CREATION_STEPS.REVIEW
    ]
  });

  // Handle hypervisor selection
  const handleHypervisorSelect = (type) => {
    setHypervisorType(type);
  };

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  // Handle custom config changes
  const handleCustomConfigChange = (config) => {
    setCustomConfig(config);
  };

  // Handle VM configuration form submission
  const handleVmConfigSubmit = (data) => {
    setVmConfig(data);
  };

  // Handle form reset
  const handleReset = () => {
    setHypervisorType(null);
    setPlanType("cataloged");
    setSelectedPlan(null);
    setCustomConfig({
      ram: "",
      cpuCores: "",
      diskSize: "",
      diskType: "ssd"
    });
    setVmConfig({
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
      backup: false
    });
    resetStepper();
    setIsLoading(false);
    setIsSuccess(false);
    setIsError(false);
    setErrorMessage("");
  };

  // Submit VM creation
  const handleSubmit = async () => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage("");
    const payload = {
      hypervisorType,
      planType,
      planId: planType === "cataloged" ? selectedPlan?.id : null,
      ram: planType === "cataloged" ? selectedPlan?.ram : customConfig.ram,
      cpuCores: planType === "cataloged" ? selectedPlan?.cpu_cores : customConfig.cpuCores,
      diskSize: planType === "cataloged" ? selectedPlan?.disk_size : customConfig.diskSize,
      diskType: customConfig.diskType,
      ...vmConfig
    };
    try {
      await actions.createVm(payload);
      setIsSuccess(true);
      toast.success("Máquina virtual creada exitosamente", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      setIsError(true);
      setErrorMessage(error.message);
      toast.error(`Falló al crear la máquina virtual: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle retry on error
  const handleRetry = () => {
    handleSubmit();
  };

  const steps = [
    { label: "Hipervisor" },
    { label: "Recursos" },
    { label: "Configuración" },
    { label: "Revisión" }
  ];

  return (
    <>
      <div className="container mb-3">
        <h1 className="fs-3 fw-bold">Crear Máquina Virtual</h1>
        <p className="text-secondary mt-2">Configure y despliegue una nueva máquina virtual en los hipervisores disponibles.</p>
      </div>

      {/* Form container */}
      <div className="card shadow-sm">
        {/* Progress bar */}
        <ProgressStepper currentStep={steps.indexOf({ label: currentStep }) + 1} steps={steps} />

        {/* Form content */}
        <div className="card-body p-3">
          {currentStep === VM_CREATION_STEPS.HYPERVISOR && (
            <HypervisorSelector
              selectedHypervisor={hypervisorType}
              onSelect={handleHypervisorSelect}
              onNext={goToNextStep}
            />
          )}

          {currentStep === VM_CREATION_STEPS.RESOURCES && (
            <PlanSelector
              onPlanSelect={handlePlanSelect}
              onCustomConfigChange={handleCustomConfigChange}
              selectedPlan={selectedPlan}
              planType={planType}
              setPlanType={setPlanType}
              customConfig={customConfig}
              onNext={goToNextStep}
              onPrevious={goToPreviousStep}
            />
          )}

          {currentStep === VM_CREATION_STEPS.CONFIGURATION && hypervisorType && (
            <VmConfiguration
              hypervisorType={hypervisorType}
              onNext={goToNextStep}
              onPrevious={goToPreviousStep}
              onFormSubmit={handleVmConfigSubmit}
              initialValues={vmConfig}
            />
          )}

          {currentStep === VM_CREATION_STEPS.REVIEW && hypervisorType && (
            <VmReview
              hypervisorType={hypervisorType}
              planType={planType}
              selectedPlan={selectedPlan}
              customConfig={customConfig}
              vmConfig={vmConfig}
              onPrevious={goToPreviousStep}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isSuccess={isSuccess}
              isError={isError}
              errorMessage={errorMessage}
              onReset={handleReset}
              onRetry={handleRetry}
            />
          )}
        </div>
      </div>
    </>
  );
}
