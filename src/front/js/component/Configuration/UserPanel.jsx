import React from 'react';
import { User, Plus, Save, X, Edit, Trash } from 'lucide-react';

function UsersPanel({ users, setUsers, newUser, setNewUser, showNewUserForm, setShowNewUserForm, handleInputChange, addUser, editingUser, setEditingUser, saveUser, deleteUser }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4">
        <button
          className="bg-success text-white px-3 py-2 rounded-md flex items-center gap-1 mb-4"
          onClick={() => setShowNewUserForm(!showNewUserForm)}
        >
          <Plus size={16} />
          Añadir Usuario
        </button>

        {showNewUserForm && (
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <h4 className="font-semibold mb-2">Nuevo Usuario</h4>
            <form onSubmit={(e) => { e.preventDefault(); addUser() }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={newUser.nombre}
                  onChange={(e) => handleInputChange(e, setNewUser, newUser)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={newUser.correo}
                  onChange={(e) => handleInputChange(e, setNewUser, newUser)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Clave</label>
                <input
                  type="password"
                  name="clave"
                  value={newUser.clave}
                  onChange={(e) => handleInputChange(e, setNewUser, newUser)}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="flex items-end gap-2">
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
                  onClick={() => setShowNewUserForm(false)}
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-auto">
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Nombre</th>
                <th className="border p-2 text-left">Correo</th>
                <th className="border p-2 text-left">Clave</th>
                <th className="border p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  {editingUser && editingUser.id === user.id ? (
                    <>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="nombre"
                          value={editingUser.nombre}
                          onChange={(e) => handleInputChange(e, setEditingUser, editingUser)}
                          className="w-full p-1 border rounded"
                          required
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="email"
                          name="correo"
                          value={editingUser.correo}
                          onChange={(e) => handleInputChange(e, setEditingUser, editingUser)}
                          className="w-full p-1 border rounded"
                          required
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="password"
                          name="clave"
                          value={editingUser.clave}
                          onChange={(e) => handleInputChange(e, setEditingUser, editingUser)}
                          className="w-full p-1 border rounded"
                          required
                        />
                      </td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => saveUser(user.id)}
                          className="bg-success text-white p-1 rounded mr-1 inline-flex items-center"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="bg-secondary text-white p-1 rounded inline-flex items-center"
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border p-2">{user.nombre}</td>
                      <td className="border p-2">{user.correo}</td>
                      <td className="border p-2">********</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => setEditingUser({ ...user })}
                          className="bg-primary text-white p-1 rounded mr-1 inline-flex items-center"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="bg-danger text-white p-1 rounded inline-flex items-center"
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

export default UsersPanel;
