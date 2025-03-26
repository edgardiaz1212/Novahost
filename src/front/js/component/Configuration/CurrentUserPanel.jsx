import React from 'react';
import { User, Mail, Key, Edit, Save, X } from 'lucide-react';

function CurrentUserPanel({ currentUser, setCurrentUser, editingCurrentUser, setEditingCurrentUser, handleInputChange, saveCurrentUser }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4">
        {!editingCurrentUser ? (
          <>
            <div className="row g-3 mb-4"> {/* Changed to Bootstrap grid */}
              <div className="col-md-6 d-flex align-items-center"> {/* Changed to Bootstrap column and flex */}
                <User className="text-primary me-2" /> {/* Changed icon color to primary */}
                <span className="font-semibold me-2">Nombre:</span>
                <span>{currentUser.nombre}</span>
              </div>
              <div className="col-md-6 d-flex align-items-center"> {/* Changed to Bootstrap column and flex */}
                <Mail className="text-primary me-2" /> {/* Changed icon color to primary */}
                <span className="font-semibold me-2">Correo:</span>
                <span>{currentUser.correo}</span>
              </div>
              <div className="col-md-6 d-flex align-items-center"> {/* Changed to Bootstrap column and flex */}
                <Key className="text-primary me-2" /> {/* Changed icon color to primary */}
                <span className="font-semibold me-2">Clave:</span>
                <span>{currentUser.clave}</span>
              </div>
            </div>
            <button
              className="btn btn-primary d-flex align-items-center gap-2" // Changed to Bootstrap button and flex
              onClick={() => setEditingCurrentUser(true)}
            >
              <Edit size={16} />
              Editar mi usuario
            </button>
          </>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); saveCurrentUser() }} className="row g-3"> {/* Changed to Bootstrap grid */}
            <div className="col-md-12"> {/* Changed to Bootstrap column */}
              <label className="form-label d-flex align-items-center gap-1"> {/* Changed to form-label and flex */}
                <User size={16} className="text-primary" /> {/* Changed icon color to primary */}
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={currentUser.nombre}
                onChange={(e) => handleInputChange(e, setCurrentUser, currentUser)}
                className="form-control" // Changed to form-control
                required
              />
            </div>
            <div className="col-md-12"> {/* Changed to Bootstrap column */}
              <label className="form-label d-flex align-items-center gap-1"> {/* Changed to form-label and flex */}
                <Mail size={16} className="text-primary" /> {/* Changed icon color to primary */}
                Correo
              </label>
              <input
                type="email"
                name="correo"
                value={currentUser.correo}
                onChange={(e) => handleInputChange(e, setCurrentUser, currentUser)}
                className="form-control" // Changed to form-control
                required
              />
            </div>
            <div className="col-md-12"> {/* Changed to Bootstrap column */}
              <label className="form-label d-flex align-items-center gap-1"> {/* Changed to form-label and flex */}
                <Key size={16} className="text-primary" /> {/* Changed icon color to primary */}
                Clave
              </label>
              <input
                type="password"
                name="clave"
                value={currentUser.clave}
                onChange={(e) => handleInputChange(e, setCurrentUser, currentUser)}
                className="form-control" // Changed to form-control
                required
              />
            </div>
            <div className="col-12 d-flex gap-2"> {/* Changed to Bootstrap column and flex */}
              <button
                type="submit"
                className="btn btn-success d-flex align-items-center gap-2" // Changed to Bootstrap button and flex
              >
                <Save size={16} />
                Guardar
              </button>
              <button
                type="button"
                className="btn btn-danger d-flex align-items-center gap-2" // Changed to Bootstrap button and flex
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
