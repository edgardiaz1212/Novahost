import React from 'react';
import { Trash, Edit, PlusCircle, Cloud } from 'lucide-react';

function VMPanel({
  vms,
  setVms,
  newVM,
  setNewVM,
  showNewVMForm,
  setShowNewVMForm,
  handleInputChange,
  addVM,
  editingVM,
  setEditingVM,
  saveVM,
  deleteVM,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 d-flex align-items-center gap-2">
        <Cloud className="text-primary" /> {/* Changed icon color to primary */}
        Máquinas Virtuales
      </h2>

      {/* New VM Form */}
      {showNewVMForm && (
        <div className="mb-4 p-4 border rounded-md bg-light"> {/* Added bg-light */}
          <h3 className="font-semibold mb-2">Nueva Máquina Virtual</h3>
          <div className="row g-3"> {/* Changed to Bootstrap grid */}
            <div className="col-md-6"> {/* Added Bootstrap column */}
              <label htmlFor="nombre" className="form-label">Nombre</label> {/* Changed to form-label */}
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={newVM.nombre}
                onChange={(e) => handleInputChange(e, setNewVM, newVM)}
                className="form-control" // Changed to form-control
              />
            </div>
            <div className="col-md-6"> {/* Added Bootstrap column */}
              <label htmlFor="direccion" className="form-label">Dirección IP</label> {/* Changed to form-label */}
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={newVM.direccion}
                onChange={(e) => handleInputChange(e, setNewVM, newVM)}
                className="form-control" // Changed to form-control
              />
            </div>
            <div className="col-md-6"> {/* Added Bootstrap column */}
              <label htmlFor="plataforma" className="form-label">Plataforma</label> {/* Changed to form-label */}
              <input
                type="text"
                id="plataforma"
                name="plataforma"
                value={newVM.plataforma}
                onChange={(e) => handleInputChange(e, setNewVM, newVM)}
                className="form-control" // Changed to form-control
              />
            </div>
            <div className="col-md-6"> {/* Added Bootstrap column */}
              <label htmlFor="estado" className="form-label">Estado</label> {/* Changed to form-label */}
              <input
                type="text"
                id="estado"
                name="estado"
                value={newVM.estado}
                onChange={(e) => handleInputChange(e, setNewVM, newVM)}
                className="form-control" // Changed to form-control
              />
            </div>
          </div>
          <button
            onClick={addVM}
            className="btn btn-primary mt-4" // Changed to Bootstrap button
          >
            Añadir VM
          </button>
        </div>
      )}

      {/* Add New VM Button */}
      {!showNewVMForm && (
        <button
          onClick={() => setShowNewVMForm(true)}
          className="btn btn-success mb-4 d-flex align-items-center gap-2" // Changed to Bootstrap button
        >
          <PlusCircle size={18} />
          Añadir Nueva VM
        </button>
      )}

      {/* VM List */}
      <div className="overflow-x-auto">
        <table className="table table-hover"> {/* Changed to Bootstrap table */}
          <thead className="table-light"> {/* Changed to Bootstrap table-light */}
            <tr>
              <th scope="col"> {/* Added scope="col" */}
                Nombre
              </th>
              <th scope="col"> {/* Added scope="col" */}
                Dirección IP
              </th>
              <th scope="col"> {/* Added scope="col" */}
                Plataforma
              </th>
              <th scope="col"> {/* Added scope="col" */}
                Estado
              </th>
              <th scope="col" className="text-end"> {/* Added scope="col" and text-end */}
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {vms.map((vm) => (
              <tr key={vm.id}>
                <td>{vm.nombre}</td>
                <td>{vm.direccion}</td>
                <td>{vm.plataforma}</td>
                <td>{vm.estado}</td>
                <td className="text-end"> {/* Added text-end */}
                  {editingVM && editingVM.id === vm.id ? (
                    <>
                      <button
                        onClick={() => saveVM(vm.id)}
                        className="btn btn-primary btn-sm me-2" // Changed to Bootstrap button
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingVM(null)}
                        className="btn btn-secondary btn-sm" // Changed to Bootstrap button
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingVM({ ...vm })}
                        className="btn btn-primary btn-sm me-2" // Changed to Bootstrap button
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteVM(vm.id)}
                        className="btn btn-danger btn-sm" // Changed to Bootstrap button
                      >
                        <Trash size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VMPanel;
