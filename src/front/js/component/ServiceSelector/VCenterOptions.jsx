import React from 'react';
import { Cloud, HardDrive, Shield, Settings, File } from 'lucide-react';

function VCenterOptions({
  diskType,
  setDiskType,
  storagePolicy,
  setStoragePolicy,
  guestOsCustomization,
  setGuestOsCustomization,
  highAvailability,
  setHighAvailability,
  drs,
  setDrs,
  snapshotPolicy,
  setSnapshotPolicy,
  handleInputChange,
  diskTypes
}) {
  return (
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
  );
}

export default VCenterOptions;
