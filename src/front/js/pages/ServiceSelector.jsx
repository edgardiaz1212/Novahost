import React, { useState } from 'react';
import { Server, Monitor, Database, Cpu, MemoryStick, Package, XCircle } from 'lucide-react';

function ServiceSelector() {
  const [selectedType, setSelectedType] = useState(null); // 'catalogado' or 'no-catalogado'
  const [selectedTier, setSelectedTier] = useState(null);
  const [selectedOS, setSelectedOS] = useState(null);
  const [customOS, setCustomOS] = useState('');
  const [ram, setRam] = useState('');
  const [disk, setDisk] = useState('');
  const [processors, setProcessors] = useState('');
  const [showSelection, setShowSelection] = useState(true);

  const tiers = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const operatingSystems = ['Linux', 'Windows', 'Otro'];

  // Color gradient for tiers (from lightest to darkest blue)
  const getTierColor = (tier) => {
    const tierIndex = tiers.indexOf(tier);
    const colors = {
      background: [
        '#e6f0ff', // S - Lightest blue
        '#cce0ff', // M
        '#99c2ff', // L
        '#66a3ff', // XL
        '#3385ff', // XXL
        '#0066ff', // XXXL - Darkest blue
      ],
      border: [
        '#b3d1ff', // S - Lightest blue border
        '#80b3ff', // M
        '#4d94ff', // L
        '#1a75ff', // XL
        '#0059df', // XXL
        '#0047b3', // XXXL - Darkest blue border
      ],
      text: [
        '#0047b3', // S - Darker text for light backgrounds
        '#003d99', // M
        '#003380', // L
        '#002966', // XL
        '#00204d', // XXL
        '#ffffff', // XXXL - White text for dark background
      ]
    };
    
    return {
      bg: colors.background[tierIndex],
      border: colors.border[tierIndex],
      text: colors.text[tierIndex]
    };
  };

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
    setShowSelection(true);
  };

  const handleTierSelect = (tier) => {
    setSelectedTier(tier);
  };

  const handleOSSelect = (e) => {
    const value = e.target.value;
    setSelectedOS(value);
    if (value !== 'Otro') {
      setCustomOS('');
    }
  };

  const isConfirmDisabled = () => {
    if (!selectedType) return true;
    
    if (selectedType === 'catalogado') {
      if (!selectedTier) return true;
    }
    
    if (!selectedOS) return true;
    
    if (selectedOS === 'Otro' && !customOS.trim()) return true;
    
    if (selectedType === 'no-catalogado') {
      if (!ram || !disk || !processors) return true;
    }
    
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
                    className={`card border-2 cursor-pointer ${
                      selectedType === 'catalogado'
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
                    className={`card border-2 cursor-pointer ${
                      selectedType === 'no-catalogado'
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
                <>
                  {/* Select Hosting Tier */}
                  <div className="mb-6">
                    <h2 className="h4 fw-bold text-gray-800 mb-4 d-flex align-items-center gap-2">
                      <Server className="w-6 h-6 text-indigo-600" />
                      Selecciona Talla Hosting
                    </h2>
                    <div className="row row-cols-2 g-4">
                      {tiers.map((tier) => {
                        const tierColor = getTierColor(tier);
                        const isActive = selectedTier === tier;
                        
                        return (
                          <div className="col" key={tier}>
                            <button
                              onClick={() => handleTierSelect(tier)}
                              className="btn w-100 p-3 rounded-3 border-2 transition-all"
                              style={{
                                backgroundColor: isActive ? tierColor.bg : 'transparent',
                                borderColor: tierColor.border,
                                color: isActive ? tierColor.text : tierColor.border,
                                fontWeight: isActive ? 'bold' : 'normal',
                              }}
                            >
                              Tier {tier}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* No-Catalogado Options */}
              {selectedType === 'no-catalogado' && (
                <div className="bg-gray-50 p-4 p-md-8 rounded-3 mb-6">
                  <h2 className="h4 fw-bold text-gray-800 mb-4 d-flex align-items-center gap-2">
                    <Database className="w-6 h-6 text-indigo-600" />
                    ESpecificaciones
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
                      value={processors}
                      onChange={(e) => handleInputChange(e, setProcessors)}
                      required
                    />
                  </div>
                </div>
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

              {/* Confirm Button */}
              <div className="text-center">
                <button
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled()}
                  className="btn btn-primary py-2 px-4 rounded-3 hover:bg-indigo-700 transition-colors mx-auto"
                >
                  Confirma Seleccion
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