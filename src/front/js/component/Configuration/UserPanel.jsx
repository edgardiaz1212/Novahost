import React, { useState, useEffect, useContext } from 'react';
import { Plus, Save, X, Edit, Trash } from 'lucide-react';
import { Context } from '../../store/appContext';

function UsersPanel() {
  const { store, actions } = useContext(Context);
  const [newUser, setNewUser] = useState({ userName: "", email: "", password: "", telephone: "", role: "user" });
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // Track the user being edited
  const [editedUserData, setEditedUserData] = useState({}); // Track the edited data

  useEffect(() => {
    actions.fetchUsers();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditedUserData({ ...editedUserData, [name]: value });
  };

  const addUser = async () => {
    setError(null);
    // Basic validation
    if (!newUser.userName || !newUser.email || !newUser.password) {
      setError("Username, email and password are required fields");
      return;
    }
    const success = await actions.addUser(newUser);
    if (success) {
      setNewUser({ userName: "", email: "", password: "", telephone: "", role: "user" });
      setShowNewUserForm(false);
    } else {
      setError("Failed to add user. Please check the form and try again.");
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setEditedUserData({ ...user }); // Initialize edited data with current user data
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditedUserData({});
  };

  const handleSaveUser = async () => {
    setError(null);

    // Basic validation
    if (!editedUserData.userName || !editedUserData.email) {
      setError("Username and email are required fields");
      return;
    }

    try {
      const success = await actions.updateUser(editingUser, editedUserData);
      if (success) {
        setEditingUser(null);
        setEditedUserData({});
      } else {
        setError("Failed to update user. Please check the form and try again.");
      }
    } catch (error) {
      console.error("Error in save user handler:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const renderUserRow = (user) => {
    const isEditing = editingUser === user.id;

    return (
      <tr key={user.id}>
        <td>
          {isEditing ? (
            <input type="text" name="userName" value={editedUserData.userName} onChange={handleEditInputChange} className="form-control" />
          ) : (
            user.userName
          )}
        </td>
        <td>
          {isEditing ? (
            <input type="email" name="email" value={editedUserData.email} onChange={handleEditInputChange} className="form-control" />
          ) : (
            user.email
          )}
        </td>
        <td>
          {isEditing ? (
            <input type="tel" name="telephone" value={editedUserData.telephone} onChange={handleEditInputChange} className="form-control" />
          ) : (
            user.telephone
          )}
        </td>
        <td>
          {isEditing ? (
            <select name="role" value={editedUserData.role} onChange={handleEditInputChange} className="form-select">
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          ) : (
            user.role
          )}
        </td>
        <td className="d-flex gap-2">
          {isEditing ? (
            <>
              <button className="btn btn-success" onClick={handleSaveUser}>
                <Save size={16} />
              </button>
              <button className="btn btn-secondary" onClick={handleCancelEdit}>
                <X size={16} />
              </button>
            </>
          ) : (
            <button className="btn btn-warning" onClick={() => handleEditUser(user)}>
              <Edit size={16} />
            </button>
          )}
          <button className="btn btn-danger">
            <Trash size={16} />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-xl font-semibold">Lista de Usuarios</h2>
          <button className="btn btn-primary" onClick={() => setShowNewUserForm(!showNewUserForm)}>
            <Plus size={16} /> Añadir Usuario
          </button>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {showNewUserForm && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Nuevo Usuario</h3>
            <div className="row">
              <div className="col-md-4 mb-2">
                <input type="text" name="userName" placeholder="Nombre de Usuario" value={newUser.userName} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="col-md-4 mb-2">
                <input type="email" name="email" placeholder="Correo Electrónico" value={newUser.email} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="col-md-4 mb-2">
                <input type="password" name="password" placeholder="Contraseña" value={newUser.password} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="col-md-4 mb-2">
                <input type="tel" name="telephone" placeholder="Teléfono" value={newUser.telephone} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="col-md-4 mb-2">
                <select name="role" value={newUser.role} onChange={handleInputChange} className="form-select">
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
            <button className="btn btn-success mt-2" onClick={addUser}>
              <Save size={16} /> Guardar
            </button>
          </div>
        )}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre de Usuario</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {store.users.map(renderUserRow)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPanel;
