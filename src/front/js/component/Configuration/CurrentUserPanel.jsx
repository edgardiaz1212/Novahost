import React from 'react';
import { User, Mail, Key, Edit, Save, X } from 'lucide-react';

function CurrentUserPanel({ currentUser, setCurrentUser, editingCurrentUser, setEditingCurrentUser, handleInputChange, saveCurrentUser }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4">
        {!editingCurrentUser ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <User className="text-blue-600 mr-2" />
                <span className="font-semibold mr-2">Nombre:</span>
                <span>{currentUser.nombre}</span>
              </div>
              <div className="flex items-center">
                <Mail className="text-blue-600 mr-2" />
                <span className="font-semibold mr-2">Correo:</span>
                <span>{currentUser.correo}</span>
              </div>
              <div className="flex items-center">
                <Key className="text-blue-600 mr-2" />
                <span className="font-semibold mr-2">Clave:</span>
                <span>{currentUser.clave}</span>
              </div>
            </div>
            <button
              className="bg-blue-500 text-white px-3 py-2 rounded-md flex items-center gap-1"
              onClick={() => setEditingCurrentUser(true)}
            >
              <Edit size={16} />
              Editar mi usuario
            </button>
          </>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); saveCurrentUser() }} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <User size={16} className="text-blue-600" />
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={currentUser.nombre}
                onChange={(e) => handleInputChange(e, setCurrentUser, currentUser)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Mail size={16} className="text-blue-600" />
                Correo
              </label>
              <input
                type="email"
                name="correo"
                value={currentUser.correo}
                onChange={(e) => handleInputChange(e, setCurrentUser, currentUser)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                <Key size={16} className="text-blue-600" />
                Clave
              </label>
              <input
                type="password"
                name="clave"
                value={currentUser.clave}
                onChange={(e) => handleInputChange(e, setCurrentUser, currentUser)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-3 py-2 rounded-md flex items-center gap-1"
              >
                <Save size={16} />
                Guardar
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-3 py-2 rounded-md flex items-center gap-1"
                onClick={() => setEditingCurrentUser(false)}
              >
                <X size={16} />
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CurrentUserPanel;
