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
    const [isLoading, setIsLoading] = useState(false); // Estado para la carga

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
        setIsLoading(true); // Iniciar carga
        // Validación básica (requiere contraseña para nuevo hypervisor)
        if (!newHypervisor.name || !newHypervisor.type || !newHypervisor.hostname || !newHypervisor.port || !newHypervisor.username || !newHypervisor._password) {
            setError("All fields are required");
            setIsLoading(false); // Detener carga si hay error de validación
            return;
        }
        try {
            const success = await actions.addHypervisor(newHypervisor);
            if (success) {
                setNewHypervisor({ // Reset form
                    name: "", type: "vcenter", hostname: "", port: 443, username: "", _password: "",
                    client_id: "", client_secret: "", authorization_endpoint: "", token_endpoint: "", redirect_uri: "", scope: ""
                });
                setShowNewHypervisorForm(false);
                await actions.fetchHypervisors(); // Refrescar lista
            } else {
                setError("Failed to add Hypervisor. Please check the form and try again.");
            }
        } catch (err) {
            console.error("Error adding hypervisor:", err);
            setError("An unexpected error occurred while adding the hypervisor.");
        } finally {
            setIsLoading(false); // Detener carga al finalizar (éxito o error)
        }
    };

    const handleEditHypervisor = (hypervisor) => {
        // Al editar, limpiamos el campo de contraseña para no mostrarla
        // y para que solo se actualice si el usuario introduce una nueva.
        setEditingHypervisor({ ...hypervisor, _password: "" });
    };

    const handleCancelEdit = () => {
        setEditingHypervisor(null);
        setError(null); // Limpiar errores al cancelar
    };

    const saveHypervisor = async (hypervisorId) => {
        setError(null);
        setIsLoading(true); // Iniciar carga
        // Validación al editar (NO requiere contraseña)
        if (!editingHypervisor.name || !editingHypervisor.type || !editingHypervisor.hostname || !editingHypervisor.port || !editingHypervisor.username) {
            setError("All fields (except password) are required");
            setIsLoading(false); // Detener carga si hay error de validación
            return;
        }
        try {
            const success = await actions.updateHypervisor(hypervisorId, editingHypervisor);
            if (success) {
                setEditingHypervisor(null);
                await actions.fetchHypervisors(); // Refrescar lista
            } else {
                setError("Failed to update Hypervisor. Please check the form and try again.");
            }
        } catch (error) {
            console.error("Error updating hypervisor:", error);
            setError("An unexpected error occurred while updating the hypervisor.");
        } finally {
            setIsLoading(false); // Detener carga al finalizar (éxito o error)
        }
    };

    const deleteHypervisor = async (hypervisorId) => {
        if (window.confirm("Seguro que quiere eliminar el Hypervisor?")) {
            setError(null);
            setIsLoading(true); // Opcional: mostrar carga también al eliminar
            try {
                const success = await actions.deleteHypervisor(hypervisorId);
                if (!success) {
                    setError("Failed to delete Hypervisor.");
                } else {
                    await actions.fetchHypervisors(); // Refrescar si se borró
                }
            } catch (err) {
                console.error("Error deleting hypervisor:", err);
                setError("An unexpected error occurred while deleting the hypervisor.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const fetchVMs = async (hypervisorId) => {
        // Opcional: Podrías añadir un estado de carga específico para VMs si la carga es lenta
        await actions.fetchHypervisorVMs(hypervisorId);
    };

    const statusIconMap = {
        connected: { icon: CheckCircle, color: "success" }, // Usar colores de Bootstrap
        disconnected: { icon: XCircle, color: "danger" },
        connecting: { icon: Loader, color: "primary" }, // Podrías añadir animate-spin aquí si es necesario
        error: { icon: AlertCircle, color: "warning" },
    };

    const getStatusIcon = (status) => {
        const statusInfo = statusIconMap[status] || { icon: AlertCircle, color: "secondary" }; // Default a gris/alerta
        const IconComponent = statusInfo.icon;
        const animationClass = status === 'connecting' ? 'animate-spin' : ''; // Añadir clase de animación si está conectando
        return <IconComponent size={16} className={`text-${statusInfo.color} ${animationClass}`} />;
    };

    // Limpiar error cuando se cierra el formulario o se cancela la edición
    useEffect(() => {
        if (!showNewHypervisorForm && !editingHypervisor) {
            setError(null);
        }
    }, [showNewHypervisorForm, editingHypervisor]);


    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 d-flex align-items-center gap-2">
                <Server className="text-primary" />
                Hypervisores
            </h2>

            {/* Mensaje de error general para operaciones */}
            {error && !showNewHypervisorForm && !editingHypervisor && <div className="alert alert-danger">{error}</div>}

            {showNewHypervisorForm && (
                <div className="mb-4 p-4 border rounded-md bg-light">
                    <h3 className="font-semibold mb-2">Nuevo Hypervisor</h3>
                    {/* Mensaje de error específico del formulario */}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={(e) => { e.preventDefault(); addHypervisor() }} className="row g-3">
                        {/* Basic Fields */}
                        <div className="col-md-6">
                            <label htmlFor="new-name" className="form-label">Nombre</label>
                            <input
                                type="text"
                                id="new-name"
                                name="name"
                                value={newHypervisor.name}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="new-type" className="form-label">Tipo</label>
                            <select
                                id="new-type"
                                name="type"
                                value={newHypervisor.type}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-select"
                                required
                                disabled={isLoading}
                            >
                                <option value="vcenter">vCenter</option>
                                <option value="proxmox">Proxmox</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="new-hostname" className="form-label">Hostname/IP</label>
                            <input
                                type="text"
                                id="new-hostname"
                                name="hostname"
                                value={newHypervisor.hostname}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="new-port" className="form-label">Puerto</label>
                            <input
                                type="number"
                                id="new-port"
                                name="port"
                                value={newHypervisor.port}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="new-username" className="form-label">Usuario</label>
                            <input
                                type="text"
                                id="new-username"
                                name="username"
                                value={newHypervisor.username}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="new-password" className="form-label">Contraseña</label>
                            <input
                                type="password"
                                id="new-password"
                                name="_password"
                                value={newHypervisor._password}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                required // Requerida al crear
                                disabled={isLoading}
                            />
                        </div>

                        {/* OAuth 2.0 Fields */}
                        <div className="col-md-6">
                            <label htmlFor="new-client_id" className="form-label">Client ID</label>
                            <input
                                type="text"
                                id="new-client_id"
                                name="client_id"
                                value={newHypervisor.client_id}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="new-client_secret" className="form-label">Client Secret</label>
                            <input
                                type="text"
                                id="new-client_secret"
                                name="client_secret"
                                value={newHypervisor.client_secret}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="new-authorization_endpoint" className="form-label">Authorization Endpoint</label>
                            <input
                                type="text"
                                id="new-authorization_endpoint"
                                name="authorization_endpoint"
                                value={newHypervisor.authorization_endpoint}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="new-token_endpoint" className="form-label">Token Endpoint</label>
                            <input
                                type="text"
                                id="new-token_endpoint"
                                name="token_endpoint"
                                value={newHypervisor.token_endpoint}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="new-redirect_uri" className="form-label">Redirect URI</label>
                            <input
                                type="text"
                                id="new-redirect_uri"
                                name="redirect_uri"
                                value={newHypervisor.redirect_uri}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="new-scope" className="form-label">Scope</label>
                            <input
                                type="text"
                                id="new-scope"
                                name="scope"
                                value={newHypervisor.scope}
                                onChange={(e) => handleInputChange(e, setNewHypervisor, newHypervisor)}
                                className="form-control"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="col-12 d-flex gap-2 mt-3">
                            <button
                                type="submit"
                                className="btn btn-success d-flex align-items-center gap-2"
                                disabled={isLoading} // Deshabilitar mientras carga
                            >
                                {isLoading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                                {isLoading ? "Guardando..." : "Guardar"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary d-flex align-items-center gap-2"
                                onClick={() => { setShowNewHypervisorForm(false); setError(null); }}
                                disabled={isLoading} // Deshabilitar mientras carga
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
                    onClick={() => { setShowNewHypervisorForm(true); setError(null); }}
                    className="btn btn-success mb-4 d-flex align-items-center gap-2"
                    disabled={isLoading} // Deshabilitar si hay otra operación en curso
                >
                    <PlusCircle size={18} />
                    Añadir Nuevo Hypervisor
                </button>
            )}

            <div className="overflow-x-auto">
                <table className="table table-hover align-middle"> {/* align-middle para centrar verticalmente */}
                    <thead className="table-light">
                        <tr>
                            <th scope="col" style={{ minWidth: '180px' }}>Nombre</th>
                            <th scope="col" style={{ minWidth: '100px' }}>Tipo</th>
                            <th scope="col" style={{ minWidth: '150px' }}>Hostname/IP</th>
                            <th scope="col" style={{ minWidth: '80px' }}>Puerto</th>
                            <th scope="col" style={{ minWidth: '140px' }}>Usuario</th>
                            <th scope="col" style={{ minWidth: '140px' }}>Contraseña</th>
                            <th scope="col" style={{ minWidth: '140px' }}>Client ID</th>
                            <th scope="col" style={{ minWidth: '140px' }}>Client Secret</th>
                            <th scope="col" style={{ minWidth: '180px' }}>Auth Endpoint</th>
                            <th scope="col" style={{ minWidth: '180px' }}>Token Endpoint</th>
                            <th scope="col" style={{ minWidth: '180px' }}>Redirect URI</th>
                            <th scope="col" style={{ minWidth: '140px' }}>Scope</th>
                            <th scope="col" style={{ minWidth: '200px' }}>Acciones</th> {/* Ancho para botones */}
                        </tr>
                    </thead>
                    <tbody>
                        {store.hypervisors && store.hypervisors.length > 0 ? (
                            store.hypervisors.map((hypervisor) => (
                                <tr key={hypervisor.id}>
                                    {editingHypervisor && editingHypervisor.id === hypervisor.id ? (
                                        <>
                                            {/* Celdas de Edición */}
                                            <td>
                                                <input type="text" name="name" value={editingHypervisor.name} onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)} className="form-control form-control-sm" required disabled={isLoading} />
                                            </td>
                                            <td>
                                                <select name="type" value={editingHypervisor.type} onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)} className="form-select form-select-sm" required disabled={isLoading}>
                                                    <option value="vcenter">vCenter</option>
                                                    <option value="proxmox">Proxmox</option>
                                                </select>
                                            </td>
                                            <td><input type="text" name="hostname" value={editingHypervisor.hostname} onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)} className="form-control form-control-sm" required disabled={isLoading} /></td>
                                            <td><input type="number" name="port" value={editingHypervisor.port} onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)} className="form-control form-control-sm" required disabled={isLoading} style={{ width: '70px' }} /></td>
                                            <td><input type="text" name="username" value={editingHypervisor.username} onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)} className="form-control form-control-sm" required disabled={isLoading} /></td>
                                            <td><input type="password" name="_password" placeholder="Nueva contraseña (opcional)" value={editingHypervisor._password} onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)} className="form-control form-control-sm" disabled={isLoading} /></td>
                                            <td><input type="text" name="client_id" value={editingHypervisor.client_id} onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)} className="form-control form-control-sm" disabled={isLoading} /></td>
                                            <td><input type="text" name="client_secret" value={editingHypervisor.client_secret} onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)} className="form-control form-control-sm" disabled={isLoading} /></td>
                                            <td><input type="text" name="authorization_endpoint" value={editingHypervisor.authorization_endpoint} onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)} className="form-control form-control-sm" disabled={isLoading} /></td>
                                            <td><input type="text" name="token_endpoint" value={editingHypervisor.token_endpoint} onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)} className="form-control form-control-sm" disabled={isLoading} /></td>
                                            <td><input type="text" name="redirect_uri" value={editingHypervisor.redirect_uri} onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)} className="form-control form-control-sm" disabled={isLoading} /></td>
                                            <td><input type="text" name="scope" value={editingHypervisor.scope} onChange={(e) => handleInputChange(e, setEditingHypervisor, editingHypervisor)} className="form-control form-control-sm" disabled={isLoading} /></td>
                                            {/* Botones Guardar/Cancelar Edición */}
                                            <td className="d-flex flex-nowrap gap-1"> {/* flex-nowrap para evitar salto de línea */}
                                                <button
                                                    onClick={() => saveHypervisor(editingHypervisor.id)}
                                                    className="btn btn-success btn-sm d-flex align-items-center"
                                                    disabled={isLoading}
                                                    title="Guardar Cambios"
                                                >
                                                    {isLoading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="btn btn-secondary btn-sm d-flex align-items-center"
                                                    disabled={isLoading}
                                                    title="Cancelar Edición"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            {/* Celdas de Visualización */}
                                            <td className='d-flex align-items-center gap-2'>
                                                {getStatusIcon(hypervisor.status)}
                                                {hypervisor.name}
                                            </td>
                                            <td>{hypervisor.type}</td>
                                            <td>{hypervisor.hostname}</td>
                                            <td>{hypervisor.port}</td>
                                            <td>{hypervisor.username}</td>
                                            <td>********</td> {/* Mostrar siempre oculto */}
                                            <td>{hypervisor.client_id || '-'}</td> {/* Mostrar guión si está vacío */}
                                            <td>{hypervisor.client_secret ? '********' : '-'}</td> {/* Ocultar si existe */}
                                            <td>{hypervisor.authorization_endpoint || '-'}</td>
                                            <td>{hypervisor.token_endpoint || '-'}</td>
                                            <td>{hypervisor.redirect_uri || '-'}</td>
                                            <td>{hypervisor.scope || '-'}</td>
                                            {/* Botones Editar/Eliminar/Ver VMs */}
                                            <td className="d-flex flex-nowrap gap-1">
                                                <button
                                                    onClick={() => handleEditHypervisor(hypervisor)}
                                                    className="btn btn-primary btn-sm"
                                                    disabled={isLoading || !!editingHypervisor} // Deshabilitar si se está cargando o ya se está editando otro
                                                    title="Editar Hypervisor"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteHypervisor(hypervisor.id)}
                                                    className="btn btn-danger btn-sm"
                                                    disabled={isLoading || !!editingHypervisor} // Deshabilitar si se está cargando o editando
                                                    title="Eliminar Hypervisor"
                                                >
                                                    <Trash size={16} />
                                                </button>
                                                <button
                                                    onClick={() => fetchVMs(hypervisor.id)}
                                                    className="btn btn-info btn-sm text-white" // text-white para mejor contraste
                                                    disabled={isLoading || !!editingHypervisor} // Deshabilitar si se está cargando o editando
                                                    title="Ver VMs"
                                                >
                                                    VMs {/* Texto más corto */}
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="13" className="text-center text-muted">
                                    {isLoading ? 'Cargando hypervisores...' : 'No hay hypervisores configurados.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Tabla de VMs (sin cambios relevantes aquí) */}
            {store.hypervisorVMs && store.hypervisorVMs.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">VMs del Hypervisor Seleccionado</h3>
                    <div className="overflow-x-auto">
                        <table className="table table-hover table-sm"> {/* table-sm para hacerla más compacta */}
                            <thead className="table-light">
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
                                    <tr key={vm.vm_id || index}> {/* Usar vm_id si existe, sino index */}
                                        <td>{vm.name}</td>
                                        <td>{vm.power_state}</td>
                                        <td>{vm.guest_os || 'N/A'}</td>
                                        <td>{vm.ip_address || 'N/A'}</td>
                                        <td>{vm.cpu_count}</td>
                                        <td>{vm.memory_mb}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HypervisorPanel;
