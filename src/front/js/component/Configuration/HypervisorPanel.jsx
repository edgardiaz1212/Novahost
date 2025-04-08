import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';
import { PlusCircle, Save, X, Edit, Trash, Server, CheckCircle, AlertCircle, Loader, XCircle } from 'lucide-react';

function HypervisorPanel() {
    const { store, actions } = useContext(Context);
    const [newHypervisor, setNewHypervisor] = useState({
        name: "",
        type: "vcenter",
        hostname: "",
        port: 443,
        username: "",
        _password: "", 
        client_id: "",
        client_secret: "",
        authorization_endpoint: "",
        token_endpoint: "",
        redirect_uri: "",
        scope: ""
    });
    const [showNewHypervisorForm, setShowNewHypervisorForm] = useState(false);
    const [editingHypervisor, setEditingHypervisor] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        actions.fetchHypervisors();
    }, []);

    const handleInputChange = (event, setter, object) => {
        const { name, value } = event.target;
        setter({
            ...object,
            [name]: value,
        });
    };

    const addHypervisor = async () => {
        setError(null);
        if (!newHypervisor.name || !newHypervisor.type || !newHypervisor.hostname || !newHypervisor.port || !newHypervisor.username || !newHypervisor._password) { // Changed password to _password
            setError("All fields are required");
            return;
        }
        const success = await actions.addHypervisor(newHypervisor);
        if (success) {
            setNewHypervisor({
                name: "",
                type: "vcenter",
                hostname: "",
                port: 443,
                username: "",
                _password: "", // Changed password to _password
                client_id: "",
                client_secret: "",
                authorization_endpoint: "",
                token_endpoint: "",
                redirect_uri: "",
                scope: ""
            });
            setShowNewHypervisorForm(false);
        } else {
            setError("Failed to add Hypervisor. Please check the form and try again.");
        }
    };

    const handleEditHypervisor = (hypervisor) => {
        setEditingHypervisor({ ...hypervisor, _password: "" }); // Changed password to _password
    };

    const handleCancelEdit = () => {
        setEditingHypervisor(null);
    };

    const saveHypervisor = async (hypervisorId) => {
        setError(null);
        if (!editingHypervisor.name || !editingHypervisor.type || !editingHypervisor.hostname || !editingHypervisor.port || !editingHypervisor.username || !editingHypervisor._password) { // Changed password to _password
            setError("All fields are required");
            return;
        }
        try {
            const success = await actions.updateHypervisor(hypervisorId, editingHypervisor);
            if (success) {
                setEditingHypervisor(null);
                await actions.fetchHypervisors();
            } else {
                setError("Failed to update Hypervisor. Please check the form and try again.");
            }
        } catch (error) {
            console.error("Error updating hypervisor:", error);
            setError("An unexpected error occurred while updating the hypervisor.");
        }
    };

    const deleteHypervisor = async (hypervisorId) => {
        if (window.confirm("Seguro que quiere eliminar el Hypervisor?")) {
            setError(null);
            const success = await actions.deleteHypervisor(hypervisorId);
            if (!success) {
                setError("Failed to delete Hypervisor.");
            }
        }
    };

    const fetchVMs = async (hypervisorId) => {
        await actions.fetchHypervisorVMs(hypervisorId);
    };

    const statusIconMap = {
        connected: { icon: CheckCircle, color: "green" },
        disconnected: { icon: XCircle, color: "red" },
        connecting: { icon: Loader, color: "blue" },
        error: { icon: AlertCircle, color: "orange" },
    };

    const getStatusIcon = (status) => {
        const statusInfo = statusIconMap[status] || { icon: XCircle, color: "gray" };
        return <statusInfo.icon size={16} className={`text-${statusInfo.color}`} />;
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 d-flex align-items-center gap-2">
                <Server className="text-primary" />
                Hypervisores
            </h2>

            {showNewHypervisorForm && (
                <div className="mb-4 p-4 border rounded-md bg-light">
                    <h3 className="font-semibold mb-2">Nuevo Hypervisor</h3>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={(e) => { e.preventDefault(); addHypervisor() }} className="row g-3">
                        {/* Basic Fields */}
                        <div className="col-md-6">
                            <label htmlFor="name" className="form-label">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={newHypervisor.name}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="type" className="form-label">Tipo</label>
                            <select
                                id="type"
                                name="type"
                                value={newHypervisor.type}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-select"
                                required
                            >
                                <option value="vcenter">vCenter</option>
                                <option value="proxmox">Proxmox</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="hostname" className="form-label">Hostname/IP</label>
                            <input
                                type="text"
                                id="hostname"
                                name="hostname"
                                value={newHypervisor.hostname}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="port" className="form-label">Puerto</label>
                            <input
                                type="number"
                                id="port"
                                name="port"
                                value={newHypervisor.port}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="username" className="form-label">Usuario</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={newHypervisor.username}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="_password" className="form-label">Contraseña</label> {/* Changed password to _password */}
                            <input
                                type="password"
                                id="_password" // Changed password to _password
                                name="_password" // Changed password to _password
                                value={newHypervisor._password} // Changed password to _password
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                required
                            />
                        </div>

                        {/* OAuth 2.0 Fields */}
                        <div className="col-md-6">
                            <label htmlFor="client_id" className="form-label">Client ID</label>
                            <input
                                type="text"
                                id="client_id"
                                name="client_id"
                                value={newHypervisor.client_id}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="client_secret" className="form-label">Client Secret</label>
                            <input
                                type="text"
                                id="client_secret"
                                name="client_secret"
                                value={newHypervisor.client_secret}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="authorization_endpoint" className="form-label">Authorization Endpoint</label>
                            <input
                                type="text"
                                id="authorization_endpoint"
                                name="authorization_endpoint"
                                value={newHypervisor.authorization_endpoint}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="token_endpoint" className="form-label">Token Endpoint</label>
                            <input
                                type="text"
                                id="token_endpoint"
                                name="token_endpoint"
                                value={newHypervisor.token_endpoint}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="redirect_uri" className="form-label">Redirect URI</label>
                            <input
                                type="text"
                                id="redirect_uri"
                                name="redirect_uri"
                                value={newHypervisor.redirect_uri}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="scope" className="form-label">Scope</label>
                            <input
                                type="text"
                                id="scope"
                                name="scope"
                                value={newHypervisor.scope}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
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
                                onClick={() => setShowNewHypervisorForm(false)}
                            >
                                <X size={16} />
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!showNewHypervisorForm && (
                <button
                    onClick={() => setShowNewHypervisorForm(true)}
                    className="btn btn-success mb-4 d-flex align-items-center gap-2"
                >
                    <PlusCircle size={18} />
                    Añadir Nuevo Hypervisor
                </button>
            )}

            <div className="overflow-x-auto">
                <table className="table table-hover">
                    <thead className="table-light">
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Hostname/IP</th>
                            <th scope="col">Puerto</th>
                            <th scope="col">Usuario</th>
                            <th scope="col">Contraseña</th>
                            <th scope="col">Client ID</th>
                            <th scope="col">Client Secret</th>
                            <th scope="col">Authorization Endpoint</th>
                            <th scope="col">Token Endpoint</th>
                            <th scope="col">Redirect URI</th>
                            <th scope="col">Scope</th>
                            <th scope="col" >Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.hypervisors.map((hypervisor) => (
                            <tr key={hypervisor.id}>
                                {editingHypervisor && editingHypervisor.id === hypervisor.id ? (
                                    <>
                                        <td >
                                            <input
                                                type="text"
                                                name="name"
                                                value={editingHypervisor.name}
                                                onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)}
                                                className="form-control"
                                                required
                                            />
                                        </td>
                                        <td>
                                            <select
                                                name="type"
                                                value={editingHypervisor.type}
                                                onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)}
                                                className="form-select"
                                                required
                                            >
                                                <option value="vcenter">vCenter</option>
                                                <option value="proxmox">Proxmox</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="hostname"
                                                value={editingHypervisor.hostname}
                                                onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)}
                                                className="form-control"
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="port"
                                                value={editingHypervisor.port}
                                                onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)}
                                                className="form-control"
                                                required
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="username"
                                                value={editingHypervisor.username}
                                                onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)}
                                                className="form-control"
                                                required
                                                style={{ width: '140px' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="password"
                                                name="_password" // Changed password to _password
                                                value={editingHypervisor._password} // Changed password to _password
                                                onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)}
                                                className="form-control"
                                                required
                                                style={{ width: '140px' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="client_id"
                                                value={editingHypervisor.client_id}
                                                onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)}
                                                className="form-control"
                                                style={{ width: '140px' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="client_secret"
                                                value={editingHypervisor.client_secret}
                                                onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)}
                                                className="form-control"
                                                style={{ width: '140px' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="authorization_endpoint"
                                                value={editingHypervisor.authorization_endpoint}
                                                onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)}
                                                className="form-control"
                                                style={{ width: '140px' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="token_endpoint"
                                                value={editingHypervisor.token_endpoint}
                                                onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)}
                                                className="form-control"
                                                style={{ width: '140px' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="redirect_uri"
                                                value={editingHypervisor.redirect_uri}
                                                onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)}
                                                className="form-control"
                                                style={{ width: '140px' }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="scope"
                                                value={editingHypervisor.scope}
                                                onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)}
                                                className="form-control"
                                                style={{ width: '140px' }}
                                            />
                                        </td>
                                        <td className="d-flex flex-wrap gap-2">
                                            <button
                                                onClick={async () => { await saveHypervisor(editingHypervisor.id) }}
                                                className="btn btn-primary btn-sm"
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
                                        <td className='d-flex align-items-center gap-2'>
                                            {getStatusIcon(hypervisor.status)}
                                            {hypervisor.name}
                                        </td>
                                        <td>{hypervisor.type}</td>
                                        <td>{hypervisor.hostname}</td>
                                        <td>{hypervisor.port}</td>
                                        <td>{hypervisor.username}</td>
                                        <td>********</td>
                                        <td>{hypervisor.client_id}</td>
                                        <td>{hypervisor.client_secret}</td>
                                        <td>{hypervisor.authorization_endpoint}</td>
                                        <td>{hypervisor.token_endpoint}</td>
                                        <td>{hypervisor.redirect_uri}</td>
                                        <td>{hypervisor.scope}</td>
                                        <td className="d-flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleEditHypervisor(hypervisor)}
                                                className="btn btn-primary btn-sm"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteHypervisor(hypervisor.id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                <Trash size={16} />
                                            </button>
                                            <button
                                                onClick={() => fetchVMs(hypervisor.id)}
                                                className="btn btn-info btn-sm"
                                            >
                                                Ver VMs
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {store.hypervisorVMs.length > 0 && (
                <div className="mt-4">
                    <h3>VMs del Hypervisor</h3>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Estado</th>
                                <th>Sistema Operativo</th>
                                <th>Dirección IP</th>
                                <th>CPUs</th>
                                <th>Memoria (MB)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.hypervisorVMs.map((vm, index) => (
                                <tr key={index}>
                                    <td>{vm.name}</td>
                                    <td>{vm.power_state}</td>
                                    <td>{vm.guest_os}</td>
                                    <td>{vm.ip_address}</td>
                                    <td>{vm.cpu_count}</td>
                                    <td>{vm.memory_mb}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default HypervisorPanel;
