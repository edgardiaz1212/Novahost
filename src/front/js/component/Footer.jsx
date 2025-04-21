// src/front/js/component/Footer.jsx
import React from 'react';
import '../../styles/Footer.css'; // Crearemos este archivo CSS a continuación

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Novahost. Todos los derechos reservados.</p>
      {/* Puedes añadir más elementos aquí si lo necesitas */}
    </footer>
  );
};

export default Footer;
