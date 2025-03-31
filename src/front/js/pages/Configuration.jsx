import React, { useState, useEffect } from 'react';
import { User, Server, Monitor, Settings, Info, Cloud, Building } from 'lucide-react'; // Import Building icon
import CurrentUserPanel from '../component/Configuration/CurrentUserPanel';
import UsersPanel from '../component/Configuration/UserPanel';
import ServicesPanel from '../component/Configuration/ServicesPanel';
import OSPanel from '../component/Configuration/OSPanel';
import VMPanel from '../component/Configuration/VMPanel';
import ClientsPanel from '../component/Configuration/ClientsPanel'; // Import the new ClientsPanel component

function Configuration() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('usuario');

  // State for data
  const [users, setUsers] = useState([]);

  const [services, setServices] = useState([
    { id: 1, nombre: "Servicio Base", ram: 4, disco: 100, procesador: 2 },
    { id: 2, nombre: "Servicio Premium", ram: 16, disco: 500, procesador: 8 }
  ]);

  const [operatingSystems, setOperatingSystems] = useState([
    { id: 1, nombre: "Ubuntu", version: "22.04 LTS" },
    { id: 2, nombre: "Windows Server", version: "2022" }
  ]);

  // New state for VMs
  const [vms, setVms] = useState([
    { id: 1, nombre: "VM-Servidor1", direccion: "192.168.1.10", plataforma: "vCenter", estado: "Activo" },
    { id: 2, nombre: "VM-Web01", direccion: "192.168.1.20", plataforma: "Proxmox 1", estado: "Inactivo" },
  ]);

  // New state for clients
  const [clients, setClients] = useState([
    { id: 1, razonSocial: "Cliente Ejemplo 1", rif: "J-123456789" },
    { id: 2, razonSocial: "Cliente Ejemplo 2", rif: "G-987654321" },
  ]);

  // State for editing
  const [editingUser, setEditingUser] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingOS, setEditingOS] = useState(null);
  const [editingVM, setEditingVM] = useState(null);
  const [editingClient, setEditingClient] = useState(null); // New state for editing clients

  // State for new elements
  const [newUser, setNewUser] = useState({
    nombre: "", correo: "", clave: ""
  });
  const [newService, setNewService] = useState({
    nombre: "", ram: "", disco: "", procesador: ""
  });
  const [newOS, setNewOS] = useState({
    nombre: "", version: ""
  });
  // New state for new VMs
  const [newVM, setNewVM] = useState({
    nombre: "", direccion: "", plataforma: "", estado: ""
  });
  // New state for new clients
  const [newClient, setNewClient] = useState({
    razonSocial: "", rif: ""
  });

  // State for showing forms
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewServiceForm, setShowNewServiceForm] = useState(false);
  const [showNewOSForm, setShowNewOSForm] = useState(false);
  const [showNewVMForm, setShowNewVMForm] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false); // New state for showing the new client form

  // Handle input changes
  const handleInputChange = (event, setter, object) => {
    const { name, value } = event.target;
    setter({
      ...object,
      [name]: value
    });
  };

  // Add new elements
  const addUser = () => {
    if (newUser.nombre && newUser.correo && newUser.clave) {
      setUsers([...users, { id: users.length + 2, ...newUser }]);
      setNewUser({ nombre: "", correo: "", clave: "" });
      setShowNewUserForm(false);
    }
  };

  const addService = () => {
    if (newService.nombre && newService.ram && newService.disco && newService.procesador) {
      setServices([...services, { id: services.length + 2, ...newService }]);
      setNewService({ nombre: "", ram: "", disco: "", procesador: "" });
      setShowNewServiceForm(false);
    }
  };

  const addOS = () => {
    if (newOS.nombre && newOS.version) {
      setOperatingSystems([...operatingSystems, { id: operatingSystems.length + 2, ...newOS }]);
      setNewOS({ nombre: "", version: "" });
      setShowNewOSForm(false);
    }
  };

  // New function to add a VM
  const addVM = () => {
    if (newVM.nombre && newVM.direccion && newVM.plataforma && newVM.estado) {
      setVms([...vms, { id: vms.length + 2, ...newVM }]);
      setNewVM({ nombre: "", direccion: "", plataforma: "", estado: "" });
      setShowNewVMForm(false);
    }
  };

  // New function to add a client
  const addClient = () => {
    if (newClient.razonSocial && newClient.rif) {
      setClients([...clients, { id: clients.length + 2, ...newClient }]);
      setNewClient({ razonSocial: "", rif: "" });
      setShowNewClientForm(false);
    }
  };

  // Save edited elements
  const saveUser = (id) => {
    setUsers(users.map(user => user.id === id ? editingUser : user));
    setEditingUser(null);
  };

  const saveService = (id) => {
    setServices(services.map(service => service.id === id ? editingService : service));
    setEditingService(null);
  };

  const saveOS = (id) => {
    setOperatingSystems(operatingSystems.map(os => os.id === id ? editingOS : os));
    setEditingOS(null);
  };

  // New function to save an edited VM
  const saveVM = (id) => {
    setVms(vms.map(vm => vm.id === id ? editingVM : vm));
    setEditingVM(null);
  };

  // New function to save an edited client
  const saveClient = (id) => {
    setClients(clients.map(client => client.id === id ? editingClient : client));
    setEditingClient(null);
  };

  // Delete elements
  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const deleteService = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  const deleteOS = (id) => {
    setOperatingSystems(operatingSystems.filter(os => os.id !== id));
  };

  // New function to delete a VM
  const deleteVM = (id) => {
    setVms(vms.filter(vm => vm.id !== id));
  };

  // New function to delete a client
  const deleteClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

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
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'sistemas' ? 'bg-success bg-opacity-75 text-white ' : 'bg-white'}`}
            onClick={() => setActiveTab('sistemas')}
          >
            <div className="flex items-center gap-2">
              <Monitor size={18} />
              Sistemas Operativos
            </div>
          </button>
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
              <Building size={18} /> {/* Building icon for clients */}
              Clientes
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
          <CurrentUserPanel/>
        );
      case 'usuarios':
        return (
          <UsersPanel/>
        );
      case 'servicios':
        return (
          <ServicesPanel
            services={services}
            setServices={setServices}
            newService={newService}
            setNewService={setNewService}
            showNewServiceForm={showNewServiceForm}
            setShowNewServiceForm={setShowNewServiceForm}
            handleInputChange={handleInputChange}
            addService={addService}
            editingService={editingService}
            setEditingService={setEditingService}
            saveService={saveService}
            deleteService={deleteService}
          />
        );
      case 'sistemas':
        return (
          <OSPanel
            operatingSystems={operatingSystems}
            setOperatingSystems={setOperatingSystems}
            newOS={newOS}
            setNewOS={setNewOS}
            showNewOSForm={showNewOSForm}
            setShowNewOSForm={setShowNewOSForm}
            handleInputChange={handleInputChange}
            addOS={addOS}
            editingOS={editingOS}
            setEditingOS={setEditingOS}
            saveOS={saveOS}
            deleteOS={deleteOS}
          />
        );
      // New case for VMs
      case 'vms':
        return (
          <VMPanel
            vms={vms}
            setVms={setVms}
            newVM={newVM}
            setNewVM={setNewVM}
            showNewVMForm={showNewVMForm}
            setShowNewVMForm={setShowNewVMForm}
            handleInputChange={handleInputChange}
            addVM={addVM}
            editingVM={editingVM}
            setEditingVM={setEditingVM}
            saveVM={saveVM}
            deleteVM={deleteVM}
          />
        );
      // New case for clients
      case 'clientes':
        return (
          <ClientsPanel
            clients={clients}
            setClients={setClients}
            newClient={newClient}
            setNewClient={setNewClient}
            showNewClientForm={showNewClientForm}
            setShowNewClientForm={setShowNewClientForm}
            handleInputChange={handleInputChange}
            addClient={addClient}
            editingClient={editingClient}
            setEditingClient={setEditingClient}
            saveClient={saveClient}
            deleteClient={deleteClient}
          />
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
          Administra usuarios, servicios, sistemas operativos, máquinas virtuales y clientes disponibles.
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
