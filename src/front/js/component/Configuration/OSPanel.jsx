import React from 'react';
import { Monitor, Plus, Save, X, Edit, Trash } from 'lucide-react';

function OSPanel({ operatingSystems, setOperatingSystems, newOS, setNewOS, showNewOSForm, setShowNewOSForm, handleInputChange, addOS, editingOS, setEditingOS, saveOS, deleteOS }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4">
        <button
          className="bg-success text-white px-3 py-2 rounded-md flex items-center gap-1 mb-4"
          onClick={() => setShowNewOSForm(!showNewOSForm)}
        >
          <Plus size={16} />
          Añadir Sistema Operativo
        </button>

        {showNewOSForm && (
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <h4 className="font-semibold mb-2">Nuevo Sistema Operativo</h4>
            <form onSubmit={(e) => { e.preventDefault(); addOS() }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={newOS.nombre}
                  onChange={(e) => handleInputChange(e, setNewOS, newOS)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Versión</label>
                <input
                  type="text"
                  name="version"
                  value={newOS.version}
                  onChange={(e) => handleInputChange(e, setNewOS, newOS)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="bg-success text-white px-3 py-2 rounded-md flex items-center gap-1"
                >
                  <Save size={16} />
                  Guardar
                </button>
                <button
                  type="button"
                  className="bg-secondary text-white px-3 py-2 rounded-md flex items-center gap-1"
                  onClick={() => setShowNewOSForm(false)}
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
                <th className="border p-2 text-left">Versión</th>
                <th className="border p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {operatingSystems.map(os => (
                <tr key={os.id} className="border-b hover:bg-gray-50">
                  {editingOS && editingOS.id === os.id ? (
                    <>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="nombre"
                          value={editingOS.nombre}
                          onChange={(e) => handleInputChange(e, setEditingOS, editingOS)}
                          className="w-full p-1 border rounded"
                          required
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="version"
                          value={editingOS.version}
                          onChange={(e) => handleInputChange(e, setEditingOS, editingOS)}
                          className="w-full p-1 border rounded"
                          required
                        />
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => saveOS(os.id)}
                          className="bg-success text-white p-1 rounded mr-1 inline-flex items-center"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => setEditingOS(null)}
                          className="bg-secondary text-white p-1 rounded inline-flex items-center"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border p-2">{os.nombre}</td>
                      <td className="border p-2">{os.version}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => setEditingOS({ ...os })}
                          className="bg-primary text-white p-1 rounded mr-1 inline-flex items-center"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteOS(os.id)}
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

export default OSPanel;
