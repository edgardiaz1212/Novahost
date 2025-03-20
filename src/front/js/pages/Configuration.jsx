import React, { useState, useEffect } from 'react';
import { User, Server, Monitor, Settings, Info } from 'lucide-react';
import CurrentUserPanel from '../component/Configuration/CurrentUserPanel';
import UsersPanel from '../component/Configuration/UserPanel';
import ServicesPanel from '../component/Configuration/ServicesPanel';
import OSPanel from '../component/Configuration/OSPanel';

function Configuration() {
  // State for active tab
  const [activeTab, setActiveTab] = useState('usuario');

  // State for data
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    nombre: "Usuario Actual",
    correo: "usuario@ejemplo.com",
    clave: "********"
  });

  const [users, setUsers] = useState([
    { id: 2, nombre: "Usuario Ejemplo", correo: "ejemplo@mail.com", clave: "********" },
    { id: 3, nombre: "Admin Sistema", correo: "admin@sistema.com", clave: "********" }
  ]);

  const [services, setServices] = useState([
    { id: 1, nombre: "Servicio Base", ram: 4, disco: 100, procesador: 2 },
    { id: 2, nombre: "Servicio Premium", ram: 16, disco: 500, procesador: 8 }
  ]);

  const [operatingSystems, setOperatingSystems] = useState([
    { id: 1, nombre: "Ubuntu", version: "22.04 LTS" },
    { id: 2, nombre: "Windows Server", version: "2022" }
  ]);

  // State for editing
  const [editingUser, setEditingUser] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingOS, setEditingOS] = useState(null);
  const [editingCurrentUser, setEditingCurrentUser] = useState(false);

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

  // State for showing forms
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [showNewServiceForm, setShowNewServiceForm] = useState(false);
  const [showNewOSForm, setShowNewOSForm] = useState(false);

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

  const saveCurrentUser = () => {
    setCurrentUser({ ...currentUser });
    setEditingCurrentUser(false);
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

  // Render tabs
  const renderTabs = () => {
    return (
      <div className="bg-gray-100 p-3 rounded-lg mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'usuario' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            onClick={() => setActiveTab('usuario')}
          >
            <div className="flex items-center gap-2">
              <User size={18} />
              Usuario
            </div>
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'usuarios' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            onClick={() => setActiveTab('usuarios')}
          >
            <div className="flex items-center gap-2">
              <User size={18} />
              Usuarios
            </div>
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'servicios' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            onClick={() => setActiveTab('servicios')}
          >
            <div className="flex items-center gap-2">
              <Server size={18} />
              Servicios
            </div>
          </button>
          <button
            className={`px-4 py-2 rounded-md ${activeTab === 'sistemas' ? 'bg-blue-600 text-white' : 'bg-white'}`}
            onClick={() => setActiveTab('sistemas')}
          >
            <div className="flex items-center gap-2">
              <Monitor size={18} />
              Sistemas Operativos
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
          <CurrentUserPanel
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            editingCurrentUser={editingCurrentUser}
            setEditingCurrentUser={setEditingCurrentUser}
            handleInputChange={handleInputChange}
            saveCurrentUser={saveCurrentUser}
          />
        );
      case 'usuarios':
        return (
          <UsersPanel
            users={users}
            setUsers={setUsers}
            newUser={newUser}
            setNewUser={setNewUser}
            showNewUserForm={showNewUserForm}
            setShowNewUserForm={setShowNewUserForm}
            handleInputChange={handleInputChange}
            addUser={addUser}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            saveUser={saveUser}
            deleteUser={deleteUser}
          />
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
          Administra usuarios, servicios y sistemas operativos disponibles.
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
