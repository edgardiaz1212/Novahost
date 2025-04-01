import React, { useState } from 'react';
import { Database, Cpu, MemoryStick } from 'lucide-react';

function NonCatalogedServiceSelector({ onSpecsChange }) {
  const [ram, setRam] = useState('');
  const [disk, setDisk] = useState('');
  const [processors, setProcessors] = useState('');

  const handleInputChange = (event, setter) => {
    setter(event.target.value);
    onSpecsChange({ ram, disk, processors, [event.target.name]: event.target.value }); // Notify parent
  };

  return (
    <div className="bg-gray-50 p-4 p-md-8 rounded-3 mb-6">
      <h2 className="h4 fw-bold text-gray-800 mb-4 d-flex align-items-center gap-2">
        <Database className="w-6 h-6 text-indigo-600" />
        Especificaciones
      </h2>
      <div className="mb-3">
        <label htmlFor="ram" className="form-label d-flex align-items-center gap-2">
          <MemoryStick className="w-4 h-4 text-indigo-600" />
          RAM (GB)
        </label>
        <input
          type="number"
          className="form-control"
          id="ram"
          name="ram"
          value={ram}
          onChange={(e) => handleInputChange(e, setRam)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="disk" className="form-label d-flex align-items-center gap-2">
          <Database className="w-4 h-4 text-indigo-600" />
          Disco (GB)
        </label>
        <input
          type="number"
          className="form-control"
          id="disk"
          name="disk"
          value={disk}
          onChange={(e) => handleInputChange(e, setDisk)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="processors" className="form-label d-flex align-items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-600" />
          Procesadores
        </label>
        <input
          type="number"
          className="form-control"
          id="processors"
          name="processors"
          value={processors}
          onChange={(e) => handleInputChange(e, setProcessors)}
          required
        />
      </div>
    </div>
  );
}

export default NonCatalogedServiceSelector;
