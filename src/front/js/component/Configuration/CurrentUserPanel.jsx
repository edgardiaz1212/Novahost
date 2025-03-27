import React, { useContext, useState, useEffect } from 'react';
import { User, Mail, Key, Edit, Save, X } from 'lucide-react';
import { Context } from '../../store/appContext';
import { toast } from 'react-toastify';

function CurrentUserPanel() {
  const { store, actions } = useContext(Context);
  const [editingCurrentUser, setEditingCurrentUser] = useState(false);
  const [currentUserData, setCurrentUserData] = useState({
    userName: "",
    email: "",
    password: "",
    telephone: ""
  });

  useEffect(() => {
    // Fetch the current user data when the component mounts
    actions.fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (store.currentUser) {
      setCurrentUserData({
        userName: store.currentUser.userName,
        email: store.currentUser.email,
        password: "",
        telephone: store.currentUser.telephone
      });
    }
  }, [store.currentUser]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentUserData({
      ...currentUserData,
      [name]: value,
    });
  };

  const saveCurrentUser = async () => {
    const success = await actions.updateCurrentUser(currentUserData);
    if (success) {
      toast.success("Usuario actualizado correctamente", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setEditingCurrentUser(false);
    } else {
      toast.error("Error al actualizar el usuario", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4">
        {!editingCurrentUser ? (
          <>
            <div className="row g-3 mb-4">
              <div className="col-md-6 d-flex align-items-center">
                <User className="text-primary me-2" />
                <span className="font-semibold me-2">Nombre:</span>
                <span>{currentUserData.userName}</span>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <Mail className="text-primary me-2" />
                <span className="font-semibold me-2">Correo:</span>
                <span>{currentUserData.email}</span>
              </div>
              <div className="col-md-6 d-flex align-items-center">
                <Key className="text-primary me-2" />
                <span className="font-semibold me-2">Telefono:</span>
                <span>{currentUserData.telephone}</span>
              </div>
            </div>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => setEditingCurrentUser(true)}
            >
              <Edit size={16} />
              Editar mi usuario
            </button>
          </>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); saveCurrentUser() }} className="row g-3">
            <div className="col-md-12">
              <label className="form-label d-flex align-items-center gap-1">
                <User size={16} className="text-primary" />
                Nombre
              </label>
              <input
                type="text"
                name="userName"
                value={currentUserData.userName}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-12">
              <label className="form-label d-flex align-items-center gap-1">
                <Mail size={16} className="text-primary" />
                Correo
              </label>
              <input
                type="email"
                name="email"
                value={currentUserData.email}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-12">
              <label className="form-label d-flex align-items-center gap-1">
                <Key size={16} className="text-primary" />
                Telefono
              </label>
              <input
                type="text"
                name="telephone"
                value={currentUserData.telephone}
                onChange={handleInputChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-12">
              <label className="form-label d-flex align-items-center gap-1">
                <Key size={16} className="text-primary" />
                Clave
              </label>
              <input
                type="password"
                name="password"
                value={currentUserData.password}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="col-12 d-flex gap-2">
              <button
                type="submit"
                className="btn btn-success d-flex align-items-center gap-2"
              >
                <Save size={16} />
                Guardar
              </button>
              <button
                type="button"
                className="btn btn-danger d-flex align-items-center gap-2"
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
