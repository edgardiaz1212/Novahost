import React from 'react';
import { Monitor, Plus, Save, X, Edit, Trash } from 'lucide-react';

function OSPanel({ operatingSystems, setOperatingSystems, newOS, setNewOS, showNewOSForm, setShowNewOSForm, handleInputChange, addOS, editingOS, setEditingOS, saveOS, deleteOS }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4">
        <button
          className="btn btn-success mb-4 d-flex align-items-center gap-2" // Bootstrap button
          onClick={() => setShowNewOSForm(!showNewOSForm)}
        >
          <Plus size={16} />
          Añadir Sistema Operativo
        </button>

        {showNewOSForm && (
          <div className="bg-light p-4 rounded-md mb-4"> {/* Changed to bg-light */}
            <h4 className="font-semibold mb-2">Nuevo Sistema Operativo</h4>
            <form onSubmit={(e) => { e.preventDefault(); addOS() }} className="row g-3"> {/* Bootstrap grid */}
              <div className="col-md-6"> {/* Bootstrap column */}
                <label className="form-label">Nombre</label> {/* Changed to form-label */}
                <input
                  type="text"
                  name="nombre"
                  value={newOS.nombre}
                  onChange={(e) => handleInputChange(e, setNewOS, newOS)}
                  className="form-control" // Changed to form-control
                  required
                />
              </div>
              <div className="col-md-6"> {/* Bootstrap column */}
                <label className="form-label">Versión</label> {/* Changed to form-label */}
                <input
                  type="text"
                  name="version"
                  value={newOS.version}
                  onChange={(e) => handleInputChange(e, setNewOS, newOS)}
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
          <table className="table table-hover"> {/* Changed to Bootstrap table */}
            <thead className="table-light"> {/* Changed to table-light */}
              <tr>
                <th scope="col">Nombre</th> {/* Added scope="col" */}
                <th scope="col">Versión</th> {/* Added scope="col" */}
                <th scope="col" className="text-center">Acciones</th> {/* Added scope="col" and text-center */}
              </tr>
            </thead>
            <tbody>
              {operatingSystems.map(os => (
                <tr key={os.id}>
                  {editingOS && editingOS.id === os.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="nombre"
                          value={editingOS.nombre}
                          onChange={(e) => handleInputChange(e, setEditingOS, editingOS)}
                          className="form-control" // Changed to form-control
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="version"
                          value={editingOS.version}
                          onChange={(e) => handleInputChange(e, setEditingOS, editingOS)}
                          className="form-control" // Changed to form-control
                          required
                        />
                      </td>
                      <td className="text-center"> {/* Added text-center */}
                        <button
                          onClick={() => saveOS(os.id)}
                          className="btn btn-primary btn-sm me-2" // Bootstrap button
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => setEditingOS(null)}
                          className="btn btn-secondary btn-sm" // Bootstrap button
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{os.nombre}</td>
                      <td>{os.version}</td>
                      <td className="text-center"> {/* Added text-center */}
                        <button
                          onClick={() => setEditingOS({ ...os })}
                          className="btn btn-primary btn-sm me-2" // Bootstrap button
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteOS(os.id)}
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

export default OSPanel;
