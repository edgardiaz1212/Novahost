import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '../../styles/Layout.css';
import Navbar from './Navbar.jsx';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close the offcanvas when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <div className="layout-container">
      <button className="hamburger-menu btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" onClick={toggleMenu}>
        <div className={`hamburger-icon ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      <Navbar isOpen={isOpen} toggleMenu={toggleMenu} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
