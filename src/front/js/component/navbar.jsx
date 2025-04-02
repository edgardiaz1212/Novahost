import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { ToastContainer, toast } from 'react-toastify';
import { User, Server, Monitor, Settings, Info, Cloud, Building, LogOut, LayoutDashboard, CheckCircle, AlertCircle, Clock, BarChart3, BarChart } from 'lucide-react';

const Navbar = ({ isOpen, toggleMenu, offcanvasRef }) => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [showDetailsDropdown, setShowDetailsDropdown] = useState(false);

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

  const toggleDetailsDropdown = () => {
    setShowDetailsDropdown(!showDetailsDropdown);
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
          {/* Details Dropdown */}
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="detailsDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded={showDetailsDropdown}
              onClick={(e) => {
                e.preventDefault(); // Evitar el comportamiento predeterminado
                e.stopPropagation(); // Evitar que el evento cierre el menú principal
                toggleDetailsDropdown(); // Alternar el estado del dropdown
              }}
            >
              <Info className="nav-icon" /> Detalles
            </a>
            <ul className={`dropdown-menu  border-0 ${showDetailsDropdown ? 'show' : ''}`} aria-labelledby="detailsDropdown">
              <li>
                <NavLink to="/details/completed" className="dropdown-item" onClick={toggleMenu} state={{ color: 'border-green-500' }}>
                  <CheckCircle className="nav-icon" /> Completadas
                </NavLink>
              </li>
              <li>
                <NavLink to="/details/failed" className="dropdown-item" onClick={toggleMenu} state={{ color: 'border-red-500' }}>
                  <AlertCircle className="nav-icon" /> Fallidas
                </NavLink>
              </li>
              <li>
                <NavLink to="/details/inProgress" className="dropdown-item" onClick={toggleMenu} state={{ color: 'border-blue-500' }}>
                  <Clock className="nav-icon" /> En Proceso
                </NavLink>
              </li>
              <li>
                <NavLink to="/details/total" className="dropdown-item" onClick={toggleMenu} state={{ color: 'border-purple-500' }}>
                  <BarChart3 className="nav-icon" /> Total VMs
                </NavLink>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <NavLink to="/reports" className="nav-link" onClick={toggleMenu}>
              <BarChart className="nav-icon" /> Reportes
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
