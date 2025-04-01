import React, { useState, useEffect, useContext } from 'react';
import { Server, Plus, Save, X, Edit, Trash } from 'lucide-react';
import { Context } from '../../store/appContext';

function ServicesPanel() {
  const { store, actions } = useContext(Context);
  const [newService, setNewService] = useState({ nombre: "", ram: "", disco: "", procesador: "" });
  const [showNewServiceForm, setShowNewServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    actions.fetchServices();
  }, []);

  const handleInputChange = (event, setter, object) => {
    const { name, value } = event.target;
    setter({
      ...object,
      [name]: value,
    });
  };

  const addService = async () => {
    setError(null);
    if (!newService.nombre || !newService.ram || !newService.disco || !newService.procesador) {
      setError("All fields are required");
      return;
    }
    const success = await actions.addService(newService);
    if (success) {
      setNewService({ nombre: "", ram: "", disco: "", procesador: "" });
      setShowNewServiceForm(false);
    } else {
      setError("Failed to add service. Please check the form and try again.");
    }
  };

  const handleEditService = (service) => {
    setEditingService({ ...service });
  };

  const handleCancelEdit = () => {
    setEditingService(null);
  };

  const saveService = async (serviceId) => {
    setError(null);
    if (!editingService.nombre || !editingService.ram || !editingService.disco || !editingService.procesador) {
      setError("All fields are required");
      return;
    }
    const success = await actions.updateService(serviceId, editingService);
    if (success) {
      setEditingService(null);
    } else {
      setError("Failed to update service. Please check the form and try again.");
    }
  };

  const deleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setError(null);
      const success = await actions.deleteService(serviceId);
      if (!success) {
        setError("Failed to delete service.");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4">
        <button
          className="btn btn-success mb-4 d-flex align-items-center gap-2"
          onClick={() => setShowNewServiceForm(!showNewServiceForm)}
        >
          <Plus size={16} />
          Añadir Servicio
        </button>
        {error && <div className="alert alert-danger">{error}</div>}
        {showNewServiceForm && (
          <div className="bg-light p-4 rounded-md mb-4">
            <h4 className="font-semibold mb-2">Nuevo Servicio</h4>
            <form onSubmit={(e) => { e.preventDefault(); addService() }} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={newService.nombre}
                  onChange={(e) => handleInputChange(e, setNewService, newService)}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">RAM (GB)</label>
                <input
                  type="number"
                  name="ram"
                  value={newService.ram}
                  onChange={(e) => handleInputChange(e, setNewService, newService)}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Disco (GB)</label>
                <input
                  type="number"
                  name="disco"
                  value={newService.disco}
                  onChange={(e) => handleInputChange(e, setNewService, newService)}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Procesadores</label>
                <input
                  type="number"
                  name="procesador"
                  value={newService.procesador}
                  onChange={(e) => handleInputChange(e, setNewService, newService)}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-12 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success d-flex align-items-center gap-2"
                >
                  <Save size={16} />
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary d-flex align-items-center gap-2"
                  onClick={() => setShowNewServiceForm(false)}
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-auto">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">RAM (GB)</th>
                <th scope="col">Disco (GB)</th>
                <th scope="col">Procesadores</th>
                <th scope="col" className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {store.services.map((service) => (
                <tr key={service.id}>
                  {editingService && editingService.id === service.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="nombre"
                          value={editingService.nombre}
                          onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                          className="form-control"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="ram"
                          value={editingService.ram}
                          onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                          className="form-control"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="disco"
                          value={editingService.disco}
                          onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                          className="form-control"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="procesador"
                          value={editingService.procesador}
                          onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                          className="form-control"
                          required
                        />
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => saveService(service.id)}
                          className="btn btn-primary btn-sm me-2"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn btn-secondary btn-sm"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{service.nombre}</td>
                      <td>{service.ram}</td>
                      <td>{service.disco}</td>
                      <td>{service.procesador}</td>
                      <td className="text-center">
                        <button
                          onClick={() => handleEditService(service)}
                          className="btn btn-primary btn-sm me-2"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="btn btn-danger btn-sm"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ServicesPanel;
