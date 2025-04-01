import React, { useState, useEffect, useContext } from 'react';
import { Server, Monitor, Database, Cpu, MemoryStick, Package, XCircle, User, Cloud, HardDrive, Network, KeyRound, File, Settings, Shield } from 'lucide-react';
import CatalogedServiceSelector from '../component/ServiceSelector/CatalogedServiceSelector.jsx';
import NonCatalogedServiceSelector from '../component/ServiceSelector/NonCatalogedServiceSelector.jsx';
import { Context } from '../store/appContext'; // Import the Context

function ServiceSelector() {
  // ... (other state variables)
  const { store, actions } = useContext(Context); // Use the Context
  const [selectedType, setSelectedType] = useState(null); // 'catalogado' or 'no-catalogado'
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedOS, setSelectedOS] = useState(null);
  const [customOS, setCustomOS] = useState('');
  const [ram, setRam] = useState('');
  const [disk, setDisk] = useState('');
  const [processors, setProcessors] = useState('');
  const [showSelection, setShowSelection] = useState(true);
  const [selectedClient, setSelectedClient] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedVM, setSelectedVM] = useState(null);
  //const [vmOptions, setVmOptions] = useState([]); // Remove vmOptions
  const [hypervisors, setHypervisors] = useState([]); // New state for hypervisors

  // New states for VM details
  const [vmName, setVmName] = useState('');
  const [network, setNetwork] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [networkAdapter, setNetworkAdapter] = useState('');
  const [osCredentialsUser, setOsCredentialsUser] = useState('');
  const [osCredentialsPassword, setOsCredentialsPassword] = useState('');
  const [sshKeys, setSshKeys] = useState('');
  const [resourceGroup, setResourceGroup] = useState('');
  const [storage, setStorage] = useState('');
  const [templateOrIso, setTemplateOrIso] = useState('');

  // vCenter specific states
  const [diskType, setDiskType] = useState('');
  const [storagePolicy, setStoragePolicy] = useState('');
  const [guestOsCustomization, setGuestOsCustomization] = useState('');
  const [highAvailability, setHighAvailability] = useState(false);
  const [drs, setDrs] = useState('');
  const [snapshotPolicy, setSnapshotPolicy] = useState('');

  // Proxmox specific states
  const [vmType, setVmType] = useState('');
  const [diskFormat, setDiskFormat] = useState('');
  const [biosOrUefi, setBiosOrUefi] = useState('');
  const [cloudInit, setCloudInit] = useState('');
  const [numa, setNuma] = useState('');
  const [backupSchedule, setBackupSchedule] = useState('');
  const [hotplug, setHotplug] = useState(false);

  const operatingSystems = ['Linux', 'Windows', 'Otro'];
  const diskTypes = ['Thin Provisioned', 'Thick Provisioned (Eager Zeroed)', 'Thick Provisioned (Lazy Zeroed)'];
  const vmTypes = ['KVM', 'LXC'];
  const diskFormats = ['QCOW2', 'RAW'];
  const biosUefiOptions = ['BIOS', 'UEFI'];

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/clients`);
        if (response.ok) {
          const data = await response.json();
          setClients(data);
        } else {
          console.error('Failed to fetch clients');
          setClients([{ id: 1, name: "Cliente 1" }, { id: 2, name: "Cliente 2" }, { id: 3, name: "Cliente 3" }]);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClients([{ id: 1, name: "Cliente 1" }, { id: 2, name: "Cliente 2" }, { id: 3, name: "Cliente 3" }]);
      }
    };
    fetchClients();
  }, []);

  // Fetch Hypervisors
  useEffect(() => {
    const fetchHypervisors = async () => {
      try {
        await actions.fetchHypervisors();
        setHypervisors(store.hypervisors);
      } catch (error) {
        console.error('Error fetching hypervisors:', error);
      }
    };
    fetchHypervisors();
  }, []);

  const handleConfirm = () => {
    // Here you would handle the confirmation logic
    console.log('Confirmed:', {
      selectedType,
      selectedTier,
      selectedOS,
      customOS,
      ram,
      disk,
      processors,
      selectedClient,
      selectedVM,
      vmName,
      network,
      ipAddress,
      networkAdapter,
      osCredentialsUser,
      osCredentialsPassword,
      sshKeys,
      resourceGroup,
      storage,
      templateOrIso,
      diskType,
      storagePolicy,
      guestOsCustomization,
      highAvailability,
      drs,
      snapshotPolicy,
      vmType,
      diskFormat,
      biosOrUefi,
      cloudInit,
      numa,
      backupSchedule,
      hotplug,
    });
    alert('Service Confirmed!');
  };

  const handleInputChange = (event, setter) => {
    setter(event.target.value);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setShowSelection(false);
  };

  const handleBackToSelection = () => {
    setSelectedType(null);
    setSelectedTier(null);
    setSelectedOS(null);
    setCustomOS('');
    setRam('');
    setDisk('');
    setProcessors('');
    setSelectedClient('');
    setSelectedVM(null);
    setShowSelection(true);
    // Reset VM details
    setVmName('');
    setNetwork('');
    setIpAddress('');
    setNetworkAdapter('');
    setOsCredentialsUser('');
    setOsCredentialsPassword('');
    setSshKeys('');
    setResourceGroup('');
    setStorage('');
    setTemplateOrIso('');
    setDiskType('');
    setStoragePolicy('');
    setGuestOsCustomization('');
    setHighAvailability(false);
    setDrs('');
    setSnapshotPolicy('');
    setVmType('');
    setDiskFormat('');
    setBiosOrUefi('');
    setCloudInit('');
    setNuma('');
    setBackupSchedule('');
    setHotplug(false);
  };

  const handleTierSelect = (plan) => {
    setSelectedTier(plan);
  };

  const handleOSSelect = (e) => {
    const value = e.target.value;
    setSelectedOS(value);
    if (value !== 'Otro') {
      setCustomOS('');
    }
  };

  const handleClientSelect = (e) => {
    setSelectedClient(e.target.value);
  };

  const handleVMSelect = (e) => {
    setSelectedVM(e.target.value);
  };

  const handleSpecsChange = (specs) => {
    setRam(specs.ram);
    setDisk(specs.disk);
    setProcessors(specs.processors);
  };

  const isConfirmDisabled = () => {
    if (!selectedType) return true;
    if (selectedType === 'catalogado' && !selectedTier) return true;
    if (!selectedOS) return true;
    if (selectedOS === 'Otro' && !customOS.trim()) return true;
    if (selectedType === 'no-catalogado' && (!ram || !disk || !processors)) return true;
    if (!selectedClient) return true;
    if (!selectedVM) return true;
    if (!vmName) return true;
    if (!selectedOS) return true;
    if (!network) return true;
    if (!storage) return true;
    if (selectedVM && selectedVM.type === 'vcenter' && !diskType) return true;
    if (selectedVM && selectedVM.type === 'proxmox' && !vmType) return true;
    if (selectedVM && selectedVM.type === 'proxmox' && !diskFormat) return true;
    if (selectedVM && selectedVM.type === 'proxmox' && !biosOrUefi) return true;

    return false;
  };

  return (
    <div className="min-vh-100 bg-gradient-to-br from-blue-50 to-indigo-100 p-5 p-md-8">
      <div className="container max-w-4xl mx-auto bg-white rounded-4 shadow-lg overflow-hidden">
        <div className="p-4 p-md-8">
          {/* Cataloged/Not Cataloged Selection */}
          {showSelection && (
            <div className="mb-6">
              <h2 className="h4 fw-bold text-gray-800 mb-4 d-flex align-items-center gap-2">
                <Package className="w-6 h-6 text-indigo-600" />
                Selecciona Tipo de Servicio
              </h2>
              <div className="row row-cols-1 row-cols-md-2 g-4">
                <div className="col">
                  <div
                    className={`card border-2 cursor-pointer ${selectedType === 'catalogado'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    onClick={() => handleTypeSelect('catalogado')}
                  >
                    <div className="card-body d-flex align-items-center gap-2">
                      <Server className="w-6 h-6" />
                      <h5 className="card-title mb-0">Catalogado</h5>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div
                    className={`card border-2 cursor-pointer ${selectedType === 'no-catalogado'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    onClick={() => handleTypeSelect('no-catalogado')}
                  >
                    <div className="card-body d-flex align-items-center gap-2">
                      <XCircle className="w-6 h-6" />
                      <h5 className="card-title mb-0">No Catalogado</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Conditional Rendering */}
          {!showSelection && (
            <>
              <button
                onClick={handleBackToSelection}
                className="btn btn-secondary mb-4"
              >
                Volver
              </button>

              {/* Catalogado Options */}
              {selectedType === 'catalogado' && (
                <CatalogedServiceSelector onTierSelect={handleTierSelect} />
              )}

              {/* No-Catalogado Options */}
              {selectedType === 'no-catalogado' && (
                <NonCatalogedServiceSelector onSpecsChange={handleSpecsChange} />
              )}

              {/* Operating System Selection - For Both Types */}
              <div className="mb-6">
                <h2 className="h4 fw-bold text-gray-800 mt-4 mb-4 d-flex align-items-center gap-2">
                  <Monitor className="w-6 h-6 text-indigo-600" />
                  Selecciona Sistema Operativo
                </h2>
                <div className="mb-3">
                  <select
                    className="form-select"
                    value={selectedOS || ''}
                    onChange={handleOSSelect}
                    required
                  >
                    <option value="" disabled>
                      Selecciona OS
                    </option>
                    {operatingSystems.map((os) => (
                      <option key={os} value={os}>
                        {os}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom OS input field */}
                {selectedOS === 'Otro' && (
                  <div className="mb-3 mt-3">
                    <label htmlFor="customOS" className="form-label d-flex align-items-center gap-2">
                      <Monitor className="w-4 h-4 text-indigo-600" />
                      Especifica OS
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="customOS"
                      value={customOS}
                      onChange={(e) => handleInputChange(e, setCustomOS)}
                      placeholder="Enter your operating system"
                      required
                    />
                  </div>
                )}
              </div>
              {/* VM Selection */}
              <div className="mb-6">
                <h2 className="h4 fw-bold text-gray-800 mt-4 mb-4 d-flex align-items-center gap-2">
                  <Cloud className="w-6 h-6 text-indigo-600" />
                  Selecciona Plataforma VM
                </h2>
                <div className="mb-3">
                  <select
                    className="form-select"
                    value={selectedVM ? selectedVM.id : ''} // Use selectedVM.id for value
                    onChange={handleVMSelect}
                    required
                  >
                    <option value="" disabled>
                      Selecciona VM
                    </option>
                    {hypervisors.map((hypervisor) => (
                      <option key={hypervisor.id} value={hypervisor.id}>
                        {hypervisor.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Common VM Details */}
              {selectedVM && (
                <div className="bg-gray-50 p-4 p-md-8 rounded-3 mb-6">
                  <h2 className="h4 fw-bold text-gray-800 mb-4 d-flex align-items-center gap-2">
                    <Settings className="w-6 h-6 text-indigo-600" />
                    Detalles de la VM
                  </h2>
                  <div className="mb-3">
                    <label htmlFor="vmName" className="form-label d-flex align-items-center gap-2">
                      <Server className="w-4 h-4 text-indigo-600" />
                      Nombre de la VM
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="vmName"
                      value={vmName}
                      onChange={(e) => handleInputChange(e, setVmName)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="network" className="form-label d-flex align-items-center gap-2">
                      <Network className="w-4 h-4 text-indigo-600" />
                      Red/VLAN
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="network"
                      value={network}
                      onChange={(e) => handleInputChange(e, setNetwork)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ipAddress" className="form-label d-flex align-items-center gap-2">
                      <Network className="w-4 h-4 text-indigo-600" />
                      Dirección IP (Opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ipAddress"
                      value={ipAddress}
                      onChange={(e) => handleInputChange(e, setIpAddress)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="networkAdapter" className="form-label d-flex align-items-center gap-2">
                      <Network className="w-4 h-4 text-indigo-600" />
                      Tipo de Adaptador de Red (Opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="networkAdapter"
                      value={networkAdapter}
                      onChange={(e) => handleInputChange(e, setNetworkAdapter)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="osCredentialsUser" className="form-label d-flex align-items-center gap-2">
                      <KeyRound className="w-4 h-4 text-indigo-600" />
                      Usuario OS (Opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="osCredentialsUser"
                      value={osCredentialsUser}
                      onChange={(e) => handleInputChange(e, setOsCredentialsUser)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="osCredentialsPassword" className="form-label d-flex align-items-center gap-2">
                      <KeyRound className="w-4 h-4 text-indigo-600" />
                      Contraseña OS (Opcional)
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="osCredentialsPassword"
                      value={osCredentialsPassword}
                      onChange={(e) => handleInputChange(e, setOsCredentialsPassword)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="sshKeys" className="form-label d-flex align-items-center gap-2">
                      <KeyRound className="w-4 h-4 text-indigo-600" />
                      Claves SSH (Opcional)
                    </label>
                    <textarea
                      className="form-control"
                      id="sshKeys"
                      value={sshKeys}
                      onChange={(e) => handleInputChange(e, setSshKeys)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="resourceGroup" className="form-label d-flex align-items-center gap-2">
                      <Server className="w-4 h-4 text-indigo-600" />
                      Grupo de Recursos/Cluster
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="resourceGroup"
                      value={resourceGroup}
                      onChange={(e) => handleInputChange(e, setResourceGroup)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="storage" className="form-label d-flex align-items-center gap-2">
                      <HardDrive className="w-4 h-4 text-indigo-600" />
                      Almacenamiento/Datastore
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="storage"
                      value={storage}
                      onChange={(e) => handleInputChange(e, setStorage)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="templateOrIso" className="form-label d-flex align-items-center gap-2">
                      <File className="w-4 h-4 text-indigo-600" />
                      Plantilla/ISO
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="templateOrIso"
                      value={templateOrIso}
                      onChange={(e) => handleInputChange(e, setTemplateOrIso)}
                    />
                  </div>
                </div>
              )}

              {/* vCenter Specific Options */}
              {selectedVM && selectedVM.type === 'vcenter' && (
                <div className="bg-gray-50 p-4 p-md-8 rounded-3 mb-6">
                  <h2 className="h4 fw-bold text-gray-800 mb-4 d-flex align-items-center gap-2">
                    <Cloud className="w-6 h-6 text-indigo-600" />
                    Opciones Específicas de vCenter
                  </h2>
                  <div className="mb-3">
                    <label htmlFor="diskType" className="form-label d-flex align-items-center gap-2">
                      <HardDrive className="w-4 h-4 text-indigo-600" />
                      Tipo de Disco Virtual
                    </label>
                    <select
                      className="form-select"
                      id="diskType"
                      value={diskType}
                      onChange={(e) => handleInputChange(e, setDiskType)}
                      required
                    >
                      <option value="" disabled>Selecciona Tipo de Disco</option>
                      {diskTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="storagePolicy" className="form-label d-flex align-items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-600" />
                      Política de Almacenamiento (Opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="storagePolicy"
                      value={storagePolicy}
                      onChange={(e) => handleInputChange(e, setStoragePolicy)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="guestOsCustomization" className="form-label d-flex align-items-center gap-2">
                      <Settings className="w-4 h-4 text-indigo-600" />
                      Guest OS Customization (Opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="guestOsCustomization"
                      value={guestOsCustomization}
                      onChange={(e) => handleInputChange(e, setGuestOsCustomization)}
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="highAvailability"
                      checked={highAvailability}
                      onChange={(e) => setHighAvailability(e.target.checked)}
                    />
                    <label className="form-check-label d-flex align-items-center gap-2" htmlFor="highAvailability">
                      <Shield className="w-4 h-4 text-indigo-600" />
                      High Availability (HA)
                    </label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="drs" className="form-label d-flex align-items-center gap-2">
                      <Settings className="w-4 h-4 text-indigo-600" />
                      DRS (Distributed Resource Scheduler) (Opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="drs"
                      value={drs}
                      onChange={(e) => handleInputChange(e, setDrs)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="snapshotPolicy" className="form-label d-flex align-items-center gap-2">
                      <File className="w-4 h-4 text-indigo-600" />
                      Snapshot Policy (Opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="snapshotPolicy"
                      value={snapshotPolicy}
                      onChange={(e) => handleInputChange(e, setSnapshotPolicy)}
                    />
                  </div>
                </div>
              )}

              {/* Proxmox Specific Options */}
              {selectedVM && selectedVM.type === 'proxmox' && (
                <div className="bg-gray-50 p-4 p-md-8 rounded-3 mb-6">
                  <h2 className="h4 fw-bold text-gray-800 mb-4 d-flex align-items-center gap-2">
                    <Cloud className="w-6 h-6 text-indigo-600" />
                    Opciones Específicas de Proxmox
                  </h2>
                  <div className="mb-3">
                    <label htmlFor="vmType" className="form-label d-flex align-items-center gap-2">
                      <Server className="w-4 h-4 text-indigo-600" />
                      Tipo de Máquina Virtual
                    </label>
                    <select
                      className="form-select"
                      id="vmType"
                      value={vmType}
                      onChange={(e) => handleInputChange(e, setVmType)}
                      required
                    >
                      <option value="" disabled>Selecciona Tipo de VM</option>
                      {vmTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="diskFormat" className="form-label d-flex align-items-center gap-2">
                      <HardDrive className="w-4 h-4 text-indigo-600" />
                      Formato del Disco
                    </label>
                    <select
                      className="form-select"
                      id="diskFormat"
                      value={diskFormat}
                      onChange={(e) => handleInputChange(e, setDiskFormat)}
                      required
                    >
                      <option value="" disabled>Selecciona Formato</option>
                      {diskFormats.map((format) => (
                        <option key={format} value={format}>{format}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="biosOrUefi" className="form-label d-flex align-items-center gap-2">
                      <Settings className="w-4 h-4 text-indigo-600" />
                      BIOS/UEFI
                    </label>
                    <select
                      className="form-select"
                      id="biosOrUefi"
                      value={biosOrUefi}
                      onChange={(e) => handleInputChange(e, setBiosOrUefi)}
                      required
                    >
                      <option value="" disabled>Selecciona BIOS/UEFI</option>
                      {biosUefiOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cloudInit" className="form-label d-flex align-items-center gap-2">
                      <Settings className="w-4 h-4 text-indigo-600" />
                      Cloud-Init (Opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cloudInit"
                      value={cloudInit}
                      onChange={(e) => handleInputChange(e, setCloudInit)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="numa" className="form-label d-flex align-items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-600" />
                      NUMA (Opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="numa"
                      value={numa}
                      onChange={(e) => handleInputChange(e, setNuma)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="backupSchedule" className="form-label d-flex align-items-center gap-2">
                      <File className="w-4 h-4 text-indigo-600" />
                      Backup Schedule (Opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="backupSchedule"
                      value={backupSchedule}
                      onChange={(e) => handleInputChange(e, setBackupSchedule)}
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="hotplug"
                      checked={hotplug}
                      onChange={(e) => setHotplug(e.target.checked)}
                    />
                    <label className="form-check-label d-flex align-items-center gap-2" htmlFor="hotplug">
                      <Settings className="w-4 h-4 text-indigo-600" />
                      Hotplug
                    </label>
                  </div>
                </div>
              )}

              {/* Client Selection */}
              <div className="mb-6">
                <h2 className="h4 fw-bold text-gray-800 mt-4 mb-4 d-flex align-items-center gap-2">
                  <User className="w-6 h-6 text-indigo-600" />
                  Selecciona Cliente
                </h2>
                <div className="mb-3">
                  <select
                    className="form-select"
                    value={selectedClient}
                    onChange={handleClientSelect}
                    required
                  >
                    <option value="" disabled>
                      Selecciona Cliente
                    </option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.razon_social}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="text-center">
                <button
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled()}
                  className="btn btn-primary py-2 px-4 rounded-3 hover:bg-indigo-700 transition-colors mx-auto"
                >
                  Crear Servicio
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceSelector;
