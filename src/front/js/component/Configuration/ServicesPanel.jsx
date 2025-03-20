import React from 'react';
import { Server, Plus, Save, X, Edit, Trash } from 'lucide-react';

function ServicesPanel({ services, setServices, newService, setNewService, showNewServiceForm, setShowNewServiceForm, handleInputChange, addService, editingService, setEditingService, saveService, deleteService }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4">
        <button
          className="bg-success text-white px-3 py-2 rounded-md flex items-center gap-1 mb-4"
          onClick={() => setShowNewServiceForm(!showNewServiceForm)}
        >
          <Plus size={16} />
          Añadir Servicio
        </button>

        {showNewServiceForm && (
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <h4 className="font-semibold mb-2">Nuevo Servicio</h4>
            <form onSubmit={(e) => { e.preventDefault(); addService() }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={newService.nombre}
                  onChange={(e) => handleInputChange(e, setNewService, newService)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">RAM (GB)</label>
                <input
                  type="number"
                  name="ram"
                  value={newService.ram}
                  onChange={(e) => handleInputChange(e, setNewService, newService)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Disco (GB)</label>
                <input
                  type="number"
                  name="disco"
                  value={newService.disco}
                  onChange={(e) => handleInputChange(e, setNewService, newService)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Procesadores</label>
                <input
                  type="number"
                  name="procesador"
                  value={newService.procesador}
                  onChange={(e) => handleInputChange(e, setNewService, newService)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-3 py-2 rounded-md flex items-center gap-1"
                >
                  <Save size={16} />
                  Guardar
                </button>
                <button
                  type="button"
                  className="bg-gray-500 text-white px-3 py-2 rounded-md flex items-center gap-1"
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
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Nombre</th>
                <th className="border p-2 text-left">RAM (GB)</th>
                <th className="border p-2 text-left">Disco (GB)</th>
                <th className="border p-2 text-left">Procesadores</th>
                <th className="border p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id} className="border-b hover:bg-gray-50">
                  {editingService && editingService.id === service.id ? (
                    <>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="nombre"
                          value={editingService.nombre}
                          onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                          className="w-full p-1 border rounded"
                          required
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          name="ram"
                          value={editingService.ram}
                          onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                          className="w-full p-1 border rounded"
                          required
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          name="disco"
                          value={editingService.disco}
                          onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                          className="w-full p-1 border rounded"
                          required
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          name="procesador"
                          value={editingService.procesador}
                          onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                          className="w-full p-1 border rounded"
                          required
                        />
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => saveService(service.id)}
                          className="bg-success text-white p-1 rounded mr-1 inline-flex items-center"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => setEditingService(null)}
                          className="bg-secondary text-white p-1 rounded inline-flex items-center"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border p-2">{service.nombre}</td>
                      <td className="border p-2">{service.ram}</td>
                      <td className="border p-2">{service.disco}</td>
                      <td className="border p-2">{service.procesador}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => setEditingService({ ...service })}
                          className="bg-primary text-white p-1 rounded mr-1 inline-flex items-center"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="bg-danger text-white p-1 rounded inline-flex items-center"
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
