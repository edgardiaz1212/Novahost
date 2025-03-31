import React, { useState, useEffect, useContext } from 'react';
import { Plus, Save, X, Edit, Trash } from 'lucide-react';
import { Context } from '../../store/appContext'; // Import the Context

function UsersPanel() {
  const { store, actions } = useContext(Context); // Use the Context
  const [newUser, setNewUser] = useState({ userName: "", email: "", password: "", telephone: "", role: "user" });
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    actions.fetchUsers();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const addUser = async () => {
    setError(null);
    const success = await actions.addUser(newUser);
    if (success) {
      setNewUser({ userName: "", email: "", password: "", telephone: "", role: "user" });
      setShowNewUserForm(false);
    } else {
      setError("Failed to add user. Please check the form and try again."); // Or get the error message from the backend
    }
  };

  const renderUserRow = (user) => {
    // ... (Existing code for editing and deleting users remains the same) ...
    // You'll need to implement the edit and delete functionality here,
    // likely by adding new actions to flux.js and calling them here.
    return (
      <tr key={user.id}>
        <td>{user.userName}</td>
        <td>{user.email}</td>
        <td>{user.telephone}</td>
        <td>{user.role}</td>
        <td className="d-flex gap-2">
          <button className="btn btn-warning">
            <Edit size={16} />
          </button>
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
        <button className="btn btn-success mb-4 d-flex align-items-center gap-2" onClick={() => setShowNewUserForm(true)}>
          <Plus size={16} /> Añadir Usuario
        </button>

        {showNewUserForm && (
          <div className="bg-light p-4 rounded-md mb-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <h4 className="font-semibold mb-2">Nuevo Usuario</h4>
            <form onSubmit={(e) => { e.preventDefault(); addUser(); }}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input type="text" name="userName" value={newUser.userName} onChange={handleInputChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Correo</label>
                <input type="email" name="email" value={newUser.email} onChange={handleInputChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Clave</label>
                <input type="password" name="password" value={newUser.password} onChange={handleInputChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input type="tel" name="telephone" value={newUser.telephone} onChange={handleInputChange} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">Rol</label>
                <select name="role" value={newUser.role} onChange={handleInputChange} className="form-select">
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  <Save size={16} /> Guardar
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewUserForm(false)}>
                  <X size={16} /> Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
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
