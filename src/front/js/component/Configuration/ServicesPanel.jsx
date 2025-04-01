// c:\Users\AdminLocal\Documents\Github\proyectonovahost\Novahost\src\front\js\component\Configuration\ServicesPanel.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Server, PlusCircle, Save, X, Edit, Trash, ArrowUp, ArrowDown } from 'lucide-react'; // Import Arrow icons
import { Context } from '../../store/appContext';

function ServicesPanel() {
    const { store, actions } = useContext(Context);
    const [newService, setNewService] = useState({ nombre: "", ram: "", disco: "", procesador: "" });
    const [showNewServiceForm, setShowNewServiceForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [error, setError] = useState(null);
    const [services, setServices] = useState([]); // Local state for services

    useEffect(() => {
        actions.fetchServices();
    }, []);

    useEffect(() => {
        setServices(store.services);
    }, [store.services]); // Re-run when store.services changes

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

    // Function to move a service up
    const moveServiceUp = (index) => {
        if (index > 0) {
            const newServices = [...services];
            [newServices[index], newServices[index - 1]] = [newServices[index - 1], newServices[index]];
            setServices(newServices);
            updateServiceOrder(newServices);
        }
    };

    // Function to move a service down
    const moveServiceDown = (index) => {
        if (index < services.length - 1) {
            const newServices = [...services];
            [newServices[index], newServices[index + 1]] = [newServices[index + 1], newServices[index]];
            setServices(newServices);
            updateServiceOrder(newServices);
        }
    };

    // Function to update the order in the backend
    const updateServiceOrder = async (newServices) => {
        const orderData = newServices.map((service, index) => ({
            id: service.id,
            order: index + 1, // Order starts from 1
        }));
        await actions.updateServiceOrder(orderData);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <h2 className="text-xl font-semibold mb-4 d-flex align-items-center gap-2">
                <Server className="text-primary" />
                Servicios
            </h2>
            {/* New Service Form */}
            {showNewServiceForm && (
                <div className="mb-4 p-4 border rounded-md bg-light">
                    <h3 className="font-semibold mb-2">Nuevo Servicio</h3>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={(e) => { e.preventDefault(); addService() }} className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="nombre" className="form-label">Nombre</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={newService.nombre}
                                onChange={(e) => handleInputChange(e, setNewService, newService)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="ram" className="form-label">RAM</label>
                            <input
                                type="text"
                                id="ram"
                                name="ram"
                                value={newService.ram}
                                onChange={(e) => handleInputChange(e, setNewService, newService)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="disco" className="form-label">Disco</label>
                            <input
                                type="text"
                                id="disco"
                                name="disco"
                                value={newService.disco}
                                onChange={(e) => handleInputChange(e, setNewService, newService)}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="procesador" className="form-label">Procesador</label>
                            <input
                                type="text"
                                id="procesador"
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

            {/* Add New Service Button */}
            {!showNewServiceForm && (
                <button
                    onClick={() => setShowNewServiceForm(true)}
                    className="btn btn-success mb-4 d-flex align-items-center gap-2"
                >
                    <PlusCircle size={18} />
                    Añadir Nuevo Servicio
                </button>
            )}

            <div className="overflow-auto">
                <table className="table table-hover">
                    <thead className="table-light">
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">RAM</th>
                            <th scope="col">Disco</th>
                            <th scope="col">Procesador</th>
                            <th scope="col" className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service, index) => ( // Use the local 'services' state
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
                                                type="text"
                                                name="ram"
                                                value={editingService.ram}
                                                onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                                                className="form-control"
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="disco"
                                                value={editingService.disco}
                                                onChange={(e) => handleInputChange(e, setEditingService, editingService)}
                                                className="form-control"
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
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
                                                className="btn btn-danger btn-sm me-2"
                                            >
                                                <Trash size={16} />
                                            </button>
                                            <button
                                                onClick={() => moveServiceUp(index)}
                                                className="btn btn-secondary btn-sm me-2"
                                                disabled={index === 0}
                                            >
                                                <ArrowUp size={16} />
                                            </button>
                                            <button
                                                onClick={() => moveServiceDown(index)}
                                                className="btn btn-secondary btn-sm"
                                                disabled={index === services.length - 1}
                                            >
                                                <ArrowDown size={16} />
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

export default ServicesPanel;
