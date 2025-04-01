import React from 'react';
import { Server, Network, KeyRound, HardDrive, File, Settings } from 'lucide-react';

function CommonVMDetails({
  vmName,
  setVmName,
  network,
  setNetwork,
  ipAddress,
  setIpAddress,
  networkAdapter,
  setNetworkAdapter,
  osCredentialsUser,
  setOsCredentialsUser,
  osCredentialsPassword,
  setOsCredentialsPassword,
  sshKeys,
  setSshKeys,
  resourceGroup,
  setResourceGroup,
  storage,
  setStorage,
  templateOrIso,
  setTemplateOrIso,
  handleInputChange,
}) {
  return (
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
  );
}

export default CommonVMDetails;
