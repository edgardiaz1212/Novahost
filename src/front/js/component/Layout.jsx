import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '../../styles/Layout.css';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx'; 

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const offcanvasRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close the offcanvas when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const offcanvasElement = offcanvasRef.current;
    if (offcanvasElement) {
      const handleHidden = () => {
        setIsOpen(false);
      };
      offcanvasElement.addEventListener('hidden.bs.offcanvas', handleHidden);
      return () => {
        offcanvasElement.removeEventListener('hidden.bs.offcanvas', handleHidden);
      };
    }
  }, []);

  return (
    <div className="layout-container">
      <button
        className="hamburger-menu btn"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar"
        onClick={toggleMenu}
      >
        <div className={`hamburger-icon ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
      <Navbar isOpen={isOpen} toggleMenu={toggleMenu} offcanvasRef={offcanvasRef} />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;
