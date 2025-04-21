// src/front/js/component/Footer.jsx
import React from 'react';
import '../../styles/Footer.css'; // Crearemos este archivo CSS a continuación
import madadata from '../../img/mad_data.png'
const Footer = () => {
  return (
    <footer className="app-footer ">
        <spam className="footer-text">
      <p>&copy; {new Date().getFullYear()} Novahost. </p></spam>
      <img src={madadata} alt="Logo de Madadata" className="footer-image opacity-2" width={90}/>
    </footer>
  );
};

export default Footer;
