// c:\Users\AdminLocal\Documents\Github\proyectonovahost\Novahost\src\front\js\component\Configuration\ServicesPanel.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Server, Plus, Save, X, Edit, Trash, ArrowUp, ArrowDown } from 'lucide-react'; // Import Arrow icons
import { Context } from '../../store/appContext';

function ServicesPanel() {
    const { store, actions } = useContext(Context);
    const [newService, setNewService] = useState({ nombre: "", ram: "", disco: "", procesador: "" });
    const [showNewServiceForm, setShowNewServiceForm] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [error, setError] = useState(null);
    const [services, setServices] = useState([]); // Local state for services

    useEffect(() => {
        actions.fetchServices().then((data) => {
            if (data) {
                setServices(data); // Update local state with fetched services
            }
        });
    }, []);

    // ... (other functions: handleInputChange, addService, handleEditService, handleCancelEdit, saveService, deleteService)

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
            {/* ... (rest of the component) */}
            <div className="overflow-auto">
                <table className="table table-hover">
                    {/* ... (table header) */}
                    <tbody>
                        {services.map((service, index) => ( // Use the local 'services' state
                            <tr key={service.id}>
                                {/* ... (editing logic) */}
                                {!editingService || editingService.id !== service.id ? (
                                    <>
                                        {/* ... (service data) */}
                                        <td className="text-center">
                                            {/* ... (edit and delete buttons) */}
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
                                ) : (
                                    <>
                                        {/* ... (edit inputs) */}
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
