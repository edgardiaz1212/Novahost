// c:\Users\AdminLocal\Documents\Github\proyectonovahost\Novahost\src\front\js\pages\Configuration.jsx
import React, { useState, useEffect } from 'react';
import { User, Server, Monitor, Settings, Info, Cloud } from 'lucide-react';
import CurrentUserPanel from '../component/Configuration/CurrentUserPanel';
import UsersPanel from '../component/Configuration/UserPanel';
import ServicesPanel from '../component/Configuration/ServicesPanel';
import VMPanel from '../component/Configuration/VMPanel';
import ClientsPanel from '../component/Configuration/ClientsPanel';
import HypervisorPanel from '../component/Configuration/HypervisorPanel.jsx'; // Import HypervisorPanel

function Configuration() {
    // State for active tab
    const [activeTab, setActiveTab] = useState('usuario');

    // State for data
    const [users, setUsers] = useState([]);

    // Render tabs
    const renderTabs = () => {
        return (
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
                <div className="flex flex-wrap gap-2">
                    <button
                        className={`px-4 py-2 rounded-md ${activeTab === 'usuario' ? 'bg-success bg-opacity-75 text-white ' : 'bg-white'}`}
                        onClick={() => setActiveTab('usuario')}
                    >
                        <div className="flex items-center gap-2">
                            <User size={18} />
                            Usuario
                        </div>
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${activeTab === 'usuarios' ? 'bg-success bg-opacity-75 text-white ' : 'bg-white'}`}
                        onClick={() => setActiveTab('usuarios')}
                    >
                        <div className="flex items-center gap-2">
                            <User size={18} />
                            Usuarios
                        </div>
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${activeTab === 'servicios' ? 'bg-success bg-opacity-75 text-white ' : 'bg-white'}`}
                        onClick={() => setActiveTab('servicios')}
                    >
                        <div className="flex items-center gap-2">
                            <Server size={18} />
                            Servicios
                        </div>
                    </button>
                    {/* Remove "Sistemas Operativos" tab */}
                    {/* New tab for VMs */}
                    <button
                        className={`px-4 py-2 rounded-md ${activeTab === 'vms' ? 'bg-success bg-opacity-75 text-white ' : 'bg-white'}`}
                        onClick={() => setActiveTab('vms')}
                    >
                        <div className="flex items-center gap-2">
                            <Cloud size={18} />
                            Máquinas Virtuales
                        </div>
                    </button>
                    {/* New tab for clients */}
                    <button
                        className={`px-4 py-2 rounded-md ${activeTab === 'clientes' ? 'bg-success bg-opacity-75 text-white ' : 'bg-white'}`}
                        onClick={() => setActiveTab('clientes')}
                    >
                        <div className="flex items-center gap-2">
                            <User size={18} /> {/* Building icon for clients */}
                            Clientes
                        </div>
                    </button>
                    {/* New tab for hypervisors */}
                    <button
                        className={`px-4 py-2 rounded-md ${activeTab === 'hypervisors' ? 'bg-success bg-opacity-75 text-white ' : 'bg-white'}`}
                        onClick={() => setActiveTab('hypervisors')}
                    >
                        <div className="flex items-center gap-2">
                            <Server size={18} />
                            Hypervisores
                        </div>
                    </button>
                </div>
            </div>
        );
    };

    // Render active tab content
    const renderActiveTab = () => {
        switch (activeTab) {
            case 'usuario':
                return (
                    <CurrentUserPanel />
                );
            case 'usuarios':
                return (
                    <UsersPanel />
                );
            case 'servicios':
                return (
                    <ServicesPanel />
                );
            // Remove 'sistemas' case
            // New case for VMs
            case 'vms':
                return (
                    <VMPanel />
                );
            // New case for clients
            case 'clientes':
                return (
                    <ClientsPanel />
                );
            // New case for hypervisors
            case 'hypervisors':
                return (
                    <HypervisorPanel />
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-5 max-w-7xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <Settings className="text-blue-600" />
                    Configuración del Sistema
                </h1>
                <p className="text-gray-600">
                    Administra usuarios, servicios, máquinas virtuales, clientes e hypervisores disponibles.
                </p>
            </div>

            {renderTabs()}

            <div className="space-y-4 ">
                {renderActiveTab()}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-6">
                <div className="flex items-start gap-2">
                    <Info className="text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="font-bold text-blue-800">Información de Configuración</h3>
                        <p className="text-sm text-blue-700">
                            Los cambios en la configuración se aplican inmediatamente a nivel de interfaz.
                            Para aplicar cambios a nivel del sistema, contacte con el administrador.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Configuration;
