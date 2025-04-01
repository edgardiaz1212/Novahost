import React, { useState, useEffect, useContext } from 'react';
import { Building, Plus, Save, X, Edit, Trash } from 'lucide-react';
import { Context } from '../../store/appContext';

function ClientsPanel() {
    const { store, actions } = useContext(Context);
    const [newClient, setNewClient] = useState({ razon_social: "", rif: "" });
    const [showNewClientForm, setShowNewClientForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        actions.fetchClients();
    }, []);

    const handleInputChange = (event, setter, object) => {
        const { name, value } = event.target;
        setter({
            ...object,
            [name]: value,
        });
    };

    const addClient = async () => {
        setError(null);
        if (!newClient.razon_social || !newClient.rif) {
            setError("Razon Social and RIF are required");
            return;
        }
        const success = await actions.addClient(newClient);
        if (success) {
            setNewClient({ razon_social: "", rif: "" });
            setShowNewClientForm(false);
        } else {
            setError("Failed to add client. Please check the form and try again.");
        }
    };

    const handleEditClient = (client) => {
        setEditingClient({ ...client });
    };

    const handleCancelEdit = () => {
        setEditingClient(null);
    };

    const saveClient = async (clientId) => {
        setError(null);
        if (!editingClient.razon_social || !editingClient.rif) {
            setError("Razon Social and RIF are required");
            return;
        }
        const success = await actions.updateClient(clientId, editingClient);
        if (success) {
            setEditingClient(null);
        } else {
            setError("Failed to update client. Please check the form and try again.");
        }
    };

    const deleteClient = async (clientId) => {
        if (window.confirm("Are you sure you want to delete this client?")) {
            setError(null);
            const success = await actions.deleteClient(clientId);
            if (!success) {
                setError("Failed to delete client.");
            }
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-4">
                <button
                    className="btn btn-success mb-4 d-flex align-items-center gap-2"
                    onClick={() => setShowNewClientForm(!showNewClientForm)}
                >
                    <Plus size={16} />
                    Añadir Cliente
                </button>
                {error && <div className="alert alert-danger">{error}</div>}
                {showNewClientForm && (
                    <div className="bg-light p-4 rounded-md mb-4">
                        <h4 className="font-semibold mb-2">Nuevo Cliente</h4>
                        <form onSubmit={(e) => { e.preventDefault(); addClient() }} className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Razón Social</label>
                                <input
                                    type="text"
                                    name="razon_social"
                                    value={newClient.razon_social}
                                    onChange={(e) => handleInputChange(e, setNewClient, newClient)}
                                    className="form-control"
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">RIF</label>
                                <input
                                    type="text"
                                    name="rif"
                                    value={newClient.rif}
                                    onChange={(e) => handleInputChange(e, setNewClient, newClient)}
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
                                    onClick={() => setShowNewClientForm(false)}
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
                                <th scope="col">Razón Social</th>
                                <th scope="col">RIF</th>
                                <th scope="col" className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.clients.map((client) => (
                                <tr key={client.id}>
                                    {editingClient && editingClient.id === client.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="razon_social"
                                                    value={editingClient.razon_social}
                                                    onChange={(e) => handleInputChange(e, setEditingClient, editingClient)}
                                                    className="form-control"
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="rif"
                                                    value={editingClient.rif}
                                                    onChange={(e) => handleInputChange(e, setEditingClient, editingClient)}
                                                    className="form-control"
                                                    required
                                                />
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => saveClient(client.id)}
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
                                            <td>{client.razon_social}</td>
                                            <td>{client.rif}</td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => handleEditClient(client)}
                                                    className="btn btn-primary btn-sm me-2"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteClient(client.id)}
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

export default ClientsPanel;
