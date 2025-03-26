import React from 'react';
import { User, Plus, Save, X, Edit, Trash } from 'lucide-react';

function UsersPanel({ users, setUsers, newUser, setNewUser, showNewUserForm, setShowNewUserForm, handleInputChange, addUser, editingUser, setEditingUser, saveUser, deleteUser }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4">
        <button
          className="btn btn-success mb-4 d-flex align-items-center gap-2" // Bootstrap button
          onClick={() => setShowNewUserForm(!showNewUserForm)}
        >
          <Plus size={16} />
          Añadir Usuario
        </button>

        {showNewUserForm && (
          <div className="bg-light p-4 rounded-md mb-4"> {/* Changed to bg-light */}
            <h4 className="font-semibold mb-2">Nuevo Usuario</h4>
            <form onSubmit={(e) => { e.preventDefault(); addUser() }} className="row g-3"> {/* Bootstrap grid */}
              <div className="col-md-4"> {/* Bootstrap column */}
                <label className="form-label">Nombre</label> {/* Changed to form-label */}
                <input
                  type="text"
                  name="nombre"
                  value={newUser.nombre}
                  onChange={(e) => handleInputChange(e, setNewUser, newUser)}
                  className="form-control" // Changed to form-control
                  required
                />
              </div>
              <div className="col-md-4"> {/* Bootstrap column */}
                <label className="form-label">Correo</label> {/* Changed to form-label */}
                <input
                  type="email"
                  name="correo"
                  value={newUser.correo}
                  onChange={(e) => handleInputChange(e, setNewUser, newUser)}
                  className="form-control" // Changed to form-control
                  required
                />
              </div>
              <div className="col-md-4"> {/* Bootstrap column */}
                <label className="form-label">Clave</label> {/* Changed to form-label */}
                <input
                  type="password"
                  name="clave"
                  value={newUser.clave}
                  onChange={(e) => handleInputChange(e, setNewUser, newUser)}
                  className="form-control" // Changed to form-control
                  required
                />
              </div>
              <div className="col-12 d-flex gap-2"> {/* Bootstrap column and flex */}
                <button
                  type="submit"
                  className="btn btn-success d-flex align-items-center gap-2" // Bootstrap button and flex
                >
                  <Save size={16} />
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary d-flex align-items-center gap-2" // Bootstrap button and flex
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
          <table className="table table-hover"> {/* Changed to Bootstrap table */}
            <thead className="table-light"> {/* Changed to table-light */}
              <tr>
                <th scope="col">Nombre</th> {/* Added scope="col" */}
                <th scope="col">Correo</th> {/* Added scope="col" */}
                <th scope="col">Clave</th> {/* Added scope="col" */}
                <th scope="col" className="text-center">Acciones</th> {/* Added scope="col" and text-center */}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  {editingUser && editingUser.id === user.id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="nombre"
                          value={editingUser.nombre}
                          onChange={(e) => handleInputChange(e, setEditingUser, editingUser)}
                          className="form-control" // Changed to form-control
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="correo"
                          value={editingUser.correo}
                          onChange={(e) => handleInputChange(e, setEditingUser, editingUser)}
                          className="form-control" // Changed to form-control
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="password"
                          name="clave"
                          value={editingUser.clave}
                          onChange={(e) => handleInputChange(e, setEditingUser, editingUser)}
                          className="form-control" // Changed to form-control
                          required
                        />
                      </td>
                      <td className="text-center"> {/* Added text-center */}
                        <button
                          onClick={() => saveUser(user.id)}
                          className="btn btn-primary btn-sm me-2" // Bootstrap button
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => setEditingUser(null)}
                          className="btn btn-secondary btn-sm" // Bootstrap button
                        >
                          <X size={16} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{user.nombre}</td>
                      <td>{user.correo}</td>
                      <td>********</td>
                      <td className="text-center"> {/* Added text-center */}
                        <button
                          onClick={() => setEditingUser({ ...user })}
                          className="btn btn-primary btn-sm me-2" // Bootstrap button
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="btn btn-danger btn-sm" // Bootstrap button
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
