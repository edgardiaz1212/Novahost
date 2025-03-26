import React from 'react';
import { Server, Plus, Save, X, Edit, Trash } from 'lucide-react';

function ServicesPanel({ services, setServices, newService, setNewService, showNewServiceForm, setShowNewServiceForm, handleInputChange, addService, editingService, setEditingService, saveService, deleteService }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4">
        <button
          className="btn btn-success mb-4 d-flex align-items-center gap-2" // Bootstrap button
          onClick={() => setShowNewServiceForm(!showNewServiceForm)}
        >
          <Plus size={16} />
          Añadir Servicio
        </button>

        {showNewServiceForm && (
          <div className="bg-light p-4 rounded-md mb-4"> {/* Changed to bg-light */}
            <h4 className="font-semibold mb-2">Nuevo Servicio</h4>
            <form onSubmit={(e) => { e.preventDefault(); addService() }} className="row g-3"> {/* Bootstrap grid */}
              <div className="col-md-6"> {/* Bootstrap column */}
                <label className="form-label">Nombre</label> {/* Changed to form-label */}
                <input
                  type="text"
                  name="nombre"
                  value={newService.nombre}
                  onChange={(e) => handleInputChange(e, setNewService, newService)}
                  className="form-control" // Changed to form-control
                  required
                />
              </div>
              <div className="col-md-6"> {/* Bootstrap column */}
                <label className="form-label">RAM (GB)</label> {/* Changed to form-label */}
                <input
                  type="number"
                  name="ram"
                  value={newService.ram}
                  onChange={(e) => handleInputChange(e, setNewService, newService)}
                  className="form-control" // Changed to form-control
                  required
                />
              </div>
              <div className="col-md-6"> {/* Bootstrap column */}
                <label className="form-label">Disco (GB)</label> {/* Changed to form-label */}
                <input
                  type="number"
                  name="disco"
                  value={newService.disco}
                  onChange={(e) => handleInputChange(e, setNewService, newService)}
                  className="form-control" // Changed to form-control
                  required
                />
              </div>
              <div className="col-md-6"> {/* Bootstrap column */}
                <label className="form-label">Procesadores</label> {/* Changed to form-label */}
                <input
                  type="number"
                  name="procesador"
                  value={newService.procesador}
                  onChange={(e) => handleInputChange(e, setNewService, newService)}
                  className="form-control" // Changed to form-control
                  required
                />
              </div>
              <div className="col-12 d-flex gap-2"> {/* Bootstrap column and flex */}
                <button
                  type="submit"
                  className="btn btn-success d-flex align-items-center gap-2" // Bootstrap button and flex
                >
                  <Save size={16} />
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary d-flex align-items-center gap-2" // Bootstrap button and flex
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
          <table className="table table-hover"> {/* Changed to Bootstrap table */}
            <thead className="table-light"> {/* Changed to table-light */}
              <tr>
                <th scope="col">Nombre</th> {/* Added scope="col" */}
                <th scope="col">RAM (GB)</th> {/* Added scope="col" */}
                <th scope="col">Disco (GB)</th> {/* Added scope="col" */}
                <th scope="col">Procesadores</th> {/* Added scope="col" */}
                <th scope="col" className="text-center">Acciones</th> {/* Added scope="col" and text-center */}
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id}>
                  {editingService && editingService.id === service.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="nombre"
                          value={editingService.nombre}
                          onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                          className="form-control" // Changed to form-control
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="ram"
                          value={editingService.ram}
                          onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                          className="form-control" // Changed to form-control
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="disco"
                          value={editingService.disco}
                          onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                          className="form-control" // Changed to form-control
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="procesador"
                          value={editingService.procesador}
                          onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                          className="form-control" // Changed to form-control
                          required
                        />
                      </td>
                      <td className="text-center"> {/* Added text-center */}
                        <button
                          onClick={() => saveService(service.id)}
                          className="btn btn-primary btn-sm me-2" // Bootstrap button
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="btn btn-secondary btn-sm" // Bootstrap button
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
                      <td className="text-center"> {/* Added text-center */}
                        <button
                          onClick={() => setEditingService({ ...service })}
                          className="btn btn-primary btn-sm me-2" // Bootstrap button
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="btn btn-danger btn-sm" // Bootstrap button
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
