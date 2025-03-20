import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';


function Navbar({ isOpen, toggleMenu }) {
  return (
    <div className={`offcanvas offcanvas-start w-25 ${isOpen ? 'show' : ''}`} tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasNavbarLabel">NovaHost</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" onClick={toggleMenu}></button>
      </div>
      <div className="offcanvas-body">
        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link" onClick={toggleMenu}>Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/service-selector" className="nav-link" onClick={toggleMenu}>Seleccion Servicio</Link>
          </li>
          <li className="nav-item">
            <Link to="/configuracion" className="nav-link" onClick={toggleMenu}>Configuracion</Link>

          </li>
          {/* Add more navigation links here */}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
