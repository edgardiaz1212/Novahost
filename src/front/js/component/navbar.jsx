import React, { useContext, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { ToastContainer, toast } from 'react-toastify';
import { User, Server, Monitor, Settings, Info, Cloud, Building, LogOut, LayoutDashboard, CheckCircle } from 'lucide-react';

const Navbar = ({ isOpen, toggleMenu, offcanvasRef }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await actions.logout();
    if (success) {
      toast.success("Logout exitoso", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate('/');
    } else {
      toast.error("Error al cerrar sesión", {
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
    <div ref={offcanvasRef} className={`offcanvas offcanvas-start w-25 ${isOpen ? 'show' : ''}`} tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">NovaHost</h5>
        <hr className="title-greeting-divider" /> {/* Separator Line */}
        {/* Greeting and User Name - Now placed correctly */}
        {store.isAuthenticated && store.user && (
          <div className="user-greeting">
            <p>Hola, {store.user.userName}!</p>
          </div>
        )}
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" onClick={toggleMenu}></button>
      </div>
      <div className="offcanvas-body d-flex flex-column">
        <ul className="navbar-nav justify-content-end pe-3">
          <li className="nav-item">
            <NavLink to="/dashboard" className="nav-link" onClick={toggleMenu}>
              <LayoutDashboard className="nav-icon" /> Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/service-selector" className="nav-link" onClick={toggleMenu}>
              <Cloud className="nav-icon" /> Seleccion Servicio
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/aprobacion" className="nav-link" onClick={toggleMenu}>
              <CheckCircle className="nav-icon" /> Aprobacion Servicio
            </NavLink>
          </li>
          {/* Add more navigation links here */}
        </ul>
        <div className="mt-auto">
          <hr className="logout-divider" />
          <ul className="navbar-nav justify-content-end pe-3">
            <li className="nav-item">
              <NavLink to="/configuracion" className="nav-link" onClick={toggleMenu}>
                <Settings className="nav-icon" /> Configuracion
              </NavLink>
            </li>
            {store.isAuthenticated && (
              <li className="nav-item">
                <button className="nav-link btn btn-link logout-button" onClick={handleLogout}>
                  <LogOut className="nav-icon" /> Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
