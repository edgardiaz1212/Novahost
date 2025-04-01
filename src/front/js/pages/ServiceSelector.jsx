import React, { useState, useEffect, useContext } from 'react';
import { Server, Monitor, Database, Cpu, MemoryStick, Package, XCircle, User, Cloud, HardDrive, Network, KeyRound, File, Settings, Shield } from 'lucide-react';
import CatalogedServiceSelector from '../component/ServiceSelector/CatalogedServiceSelector.jsx';
import NonCatalogedServiceSelector from '../component/ServiceSelector/NonCatalogedServiceSelector.jsx';
import VCenterOptions from '../component/ServiceSelector/VCenterOptions.jsx';
import ProxmoxOptions from '../component/ServiceSelector/ProxmoxOptions.jsx';
import CommonVMDetails from '../component/ServiceSelector/CommonVMDetails.jsx'; // Import CommonVMDetails
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

  // New state for ticket number
  const [ticketNumber, setTicketNumber] = useState('');

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
      ticketNumber, // Include ticket number in the confirmation data
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
    setTicketNumber(''); // Reset ticket number
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
    setSelectedVM(hypervisors.find(h => h.id === parseInt(e.target.value)));
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
    if (!ticketNumber) return true; // Ticket number is now required

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
                <CommonVMDetails
                  vmName={vmName}
                  setVmName={setVmName}
                  network={network}
                  setNetwork={setNetwork}
                  ipAddress={ipAddress}
                  setIpAddress={setIpAddress}
                  networkAdapter={networkAdapter}
                  setNetworkAdapter={setNetworkAdapter}
                  osCredentialsUser={osCredentialsUser}
                  setOsCredentialsUser={setOsCredentialsUser}
                  osCredentialsPassword={osCredentialsPassword}
                  setOsCredentialsPassword={setOsCredentialsPassword}
                  sshKeys={sshKeys}
                  setSshKeys={setSshKeys}
                  resourceGroup={resourceGroup}
                  setResourceGroup={setResourceGroup}
                  storage={storage}
                  setStorage={setStorage}
                  templateOrIso={templateOrIso}
                  setTemplateOrIso={setTemplateOrIso}
                  handleInputChange={handleInputChange}
                />
              )}

              {/* vCenter Specific Options */}
              {selectedVM && selectedVM.type === 'vcenter' && (
                <VCenterOptions
                  diskType={diskType}
                  setDiskType={setDiskType}
                  storagePolicy={storagePolicy}
                  setStoragePolicy={setStoragePolicy}
                  guestOsCustomization={guestOsCustomization}
                  setGuestOsCustomization={setGuestOsCustomization}
                  highAvailability={highAvailability}
                  setHighAvailability={setHighAvailability}
                  drs={drs}
                  setDrs={setDrs}
                  snapshotPolicy={snapshotPolicy}
                  setSnapshotPolicy={setSnapshotPolicy}
                  handleInputChange={handleInputChange}
                  diskTypes={diskTypes}
                />
              )}

              {/* Proxmox Specific Options */}
              {selectedVM && selectedVM.type === 'proxmox' && (
                <ProxmoxOptions
                  vmType={vmType}
                  setVmType={setVmType}
                  diskFormat={diskFormat}
                  setDiskFormat={setDiskFormat}
                  biosOrUefi={biosOrUefi}
                  setBiosOrUefi={setBiosOrUefi}
                  cloudInit={cloudInit}
                  setCloudInit={setCloudInit}
                  numa={numa}
                  setNuma={setNuma}
                  backupSchedule={backupSchedule}
                  setBackupSchedule={setBackupSchedule}
                  hotplug={hotplug}
                  setHotplug={setHotplug}
                  handleInputChange={handleInputChange}
                  vmTypes={vmTypes}
                  diskFormats={diskFormats}
                  biosUefiOptions={biosUefiOptions}
                />
              )}
              {/* Ticket Number Input */}
              <div className="mb-6">
                <h2 className="h4 fw-bold text-gray-800 mt-4 mb-4 d-flex align-items-center gap-2">
                  <File className="w-6 h-6 text-indigo-600" />
                  Número de Ticket
                </h2>
                <div className="mb-3">
                 
                  <input
                    type="text"
                    className="form-control"
                    id="ticketNumber"
                    value={ticketNumber}
                    onChange={(e) => handleInputChange(e, setTicketNumber)}
                    required
                  />
                </div>
              </div>

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
