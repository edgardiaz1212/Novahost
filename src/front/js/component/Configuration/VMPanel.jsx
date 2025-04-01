// c:\Users\AdminLocal\Documents\Github\proyectonovahost\Novahost\src\front\js\component\Configuration\VMPanel.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Trash, Edit, PlusCircle, Cloud, Save, X } from 'lucide-react';
import { Context } from '../../store/appContext';

function VMPanel() {
    const { store, actions } = useContext(Context);
    const [newVM, setNewVM] = useState({ nombre: "", direccion: "", plataforma: "", estado: "" });
    const [showNewVMForm, setShowNewVMForm] = useState(false);
    const [editingVM, setEditingVM] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        actions.fetchVirtualMachines();
    }, []);

    // Corrected handleInputChange function
    const handleInputChange = (event, setter, object) => {
        const { name, value } = event.target;
        if (setter === setEditingVM) {
            setEditingVM({
                ...editingVM,
                [name]: value,
            });
        } else {
            setter({
                ...object,
                [name]: value,
            });
        }
    };

    const addVM = async () => {
        setError(null);
        if (!newVM.nombre || !newVM.direccion || !newVM.plataforma || !newVM.estado) {
            setError("All fields are required");
            return;
        }
        const success = await actions.addVirtualMachine(newVM);
        if (success) {
            setNewVM({ nombre: "", direccion: "", plataforma: "", estado: "" });
            setShowNewVMForm(false);
        } else {
            setError("Failed to add VM. Please check the form and try again.");
        }
    };

    const handleEditVM = (vm) => {
        setEditingVM({ ...vm });
    };

    const handleCancelEdit = () => {
        setEditingVM(null);
    };

    const saveVM = async (vmId) => {
        setError(null);
        if (!editingVM.nombre_maquina || !editingVM.ip || !editingVM.platform || !editingVM.status) {
            setError("All fields are required");
            return;
        }
        const success = await actions.updateVirtualMachine(vmId, {
            nombre: editingVM.nombre_maquina,
            direccion: editingVM.ip,
            plataforma: editingVM.platform,
            estado: editingVM.status
        });
        if (success) {
            setEditingVM(null);
        } else {
            setError("Failed to update VM. Please check the form and try again.");
        }
    };

    const deleteVM = async (vmId) => {
        if (window.confirm("Are you sure you want to delete this VM?")) {
            setError(null);
            const success = await actions.deleteVirtualMachine(vmId);
            if (!success) {
                setError("Failed to delete VM.");
            }
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 d-flex align-items-center gap-2">
                <Cloud className="text-primary" />
                Máquinas Virtuales
            </h2>

            {/* New VM Form */}
            {showNewVMForm && (
                <div className="mb-4 p-4 border rounded-md bg-light">
                    <h3 className="font-semibold mb-2">Nueva Máquina Virtual</h3>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={(e) => { e.preventDefault(); addVM() }} className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="nombre" className="form-label">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={newVM.nombre}
                                onChange={(e) => handleInputChange(e, setNewVM, newVM)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="direccion" className="form-label">Dirección IP</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={newVM.direccion}
                                onChange={(e) => handleInputChange(e, setNewVM, newVM)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="plataforma" className="form-label">Plataforma</label>
                            <input
                                type="text"
                                id="plataforma"
                                name="plataforma"
                                value={newVM.plataforma}
                                onChange={(e) => handleInputChange(e, setNewVM, newVM)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="estado" className="form-label">Estado</label>
                            <input
                                type="text"
                                id="estado"
                                name="estado"
                                value={newVM.estado}
                                onChange={(e) => handleInputChange(e, setNewVM, newVM)}
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
                                onClick={() => setShowNewVMForm(false)}
                            >
                                <X size={16} />
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Add New VM Button */}
            {!showNewVMForm && (
                <button
                    onClick={() => setShowNewVMForm(true)}
                    className="btn btn-success mb-4 d-flex align-items-center gap-2"
                >
                    <PlusCircle size={18} />
                    Añadir Nueva VM
                </button>
            )}

            {/* VM List */}
            <div className="overflow-x-auto">
                <table className="table table-hover">
                    <thead className="table-light">
                        <tr>
                            <th scope="col">
                                Nombre
                            </th>
                            <th scope="col">
                                Dirección IP
                            </th>
                            <th scope="col">
                                Plataforma
                            </th>
                            <th scope="col">
                                Estado
                            </th>
                            <th scope="col" className="text-end">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.virtualMachines.map((vm) => (
                            <tr key={vm.id}>
                                {editingVM && editingVM.id === vm.id ? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                name="nombre_maquina"
                                                value={editingVM.nombre_maquina}
                                                onChange={(e) => handleInputChange(e, setEditingVM, editingVM)}
                                                className="form-control"
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="ip"
                                                value={editingVM.ip}
                                                onChange={(e) => handleInputChange(e, setEditingVM, editingVM)}
                                                className="form-control"
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="platform"
                                                value={editingVM.platform}
                                                onChange={(e) => handleInputChange(e, setEditingVM, editingVM)}
                                                className="form-control"
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="status"
                                                value={editingVM.status}
                                                onChange={(e) => handleInputChange(e, setEditingVM, editingVM)}
                                                className="form-control"
                                                required
                                            />
                                        </td>
                                        <td className="text-end">
                                            <button
                                                onClick={() => saveVM(vm.id)}
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
                                        <td>{vm.nombre_maquina}</td>
                                        <td>{vm.ip}</td>
                                        <td>{vm.platform}</td>
                                        <td>{vm.status}</td>
                                        <td className="text-end">
                                            <button
                                                onClick={() => handleEditVM(vm)}
                                                className="btn btn-primary btn-sm me-2"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteVM(vm.id)}
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
    );
}

export default VMPanel;
