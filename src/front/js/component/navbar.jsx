import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';
import { Context } from '../store/appContext';
import { toast } from 'react-toastify';

function Navbar({ isOpen, toggleMenu }) {
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
      toggleMenu(); // Close the navbar after logout
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
    <div className={`offcanvas offcanvas-start w-25 ${isOpen ? 'show' : ''}`} tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">NovaHost</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" onClick={toggleMenu}></button>
      </div>
      <div className="offcanvas-body d-flex flex-column">
        <ul className="navbar-nav justify-content-end pe-3">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link" onClick={toggleMenu}>Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/service-selector" className="nav-link" onClick={toggleMenu}>Seleccion Servicio</Link>
          </li>
          <li className="nav-item">
            <Link to="/aprobacion" className="nav-link" onClick={toggleMenu}>Aprobacion Servicio</Link>
          </li>
          {/* Add more navigation links here */}
        </ul>
        <div className="mt-auto">
          <hr className="logout-divider" />
          <ul className="navbar-nav justify-content-end pe-3">
            <li className="nav-item">
              <Link to="/configuracion" className="nav-link" onClick={toggleMenu}>Configuracion</Link>
            </li>
            {store.isAuthenticated && (
              <li className="nav-item">
                <button className="nav-link btn btn-link logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
