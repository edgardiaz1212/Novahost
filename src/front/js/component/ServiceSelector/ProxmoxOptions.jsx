import React from 'react';
import { Cloud, Server, HardDrive, Settings, Cpu, File } from 'lucide-react';

function ProxmoxOptions({
  vmType,
  setVmType,
  diskFormat,
  setDiskFormat,
  biosOrUefi,
  setBiosOrUefi,
  cloudInit,
  setCloudInit,
  numa,
  setNuma,
  backupSchedule,
  setBackupSchedule,
  hotplug,
  setHotplug,
  handleInputChange,
  vmTypes,
  diskFormats,
  biosUefiOptions
}) {
  return (
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
  );
}

export default ProxmoxOptions;
