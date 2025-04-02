// c:\Users\AdminLocal\Documents\Github\proyectonovahost\Novahost\src\front\js\pages\Home.jsx
import React, { useState, useContext, useEffect } from 'react';
import '../../styles/Home.css';
import { Context } from '../store/appContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../img/CDHLogo.jpg";
import logoMad from '../../img/mad_data.png';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../component/LoginModal.jsx'; 

function Home() {
  const { store } = useContext(Context);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setShowLogin(!showLogin);
  };

  useEffect(() => {
    if (store.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [store.isAuthenticated]);

  return (
    <div className="home-container">
      <ToastContainer />
      <header className="header ">
        <div className="logo">
          <img src={logo} alt="Logo" width="70" height="40" className="me-2" />
          Novahost
        </div>
        <nav>
          <button className="btn btn-primary" onClick={handleLoginClick}>
            {showLogin ? 'Close Login' : 'Login'}
          </button>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero  border border-danger">
        <div className="hero-content">
          <h1>Bienvenido a Novahost</h1>
          <h1 className="text-5xl font-bold mb-6 text-white">
            Soluciones Hosting de Centro de Datos
          </h1>
          <p className="mx-auto">
            Despliega y gestiona tu infraestructura con nuestros servicios de centro de datos seguros y escalables.
            Elige entre nuestras soluciones preconfiguradas o crea tu entorno personalizado.
          </p>
          </div>
        </section>
        
        <section className="features">
          <div className="feature-list">
            <div className="feature-item">
              <h3>Planes Hosting </h3>
              <p>Soluciones preconfiguradas para implementación inmediata.</p>
            </div>
            <div className="feature-item">
              <h3>Soluciones Personalizadas</h3>
              <p>Infraestructura tailor-made para necesidades específicas</p>
            </div>
          </div>
        </section>
      </main>

      {/* About Section */}
      <section className="about border border-danger">
          <h2>¿Quiénes Somos?</h2>
          <p>
            En el Centro de Datos el Hatillo nos especializamos en proporcionar soluciones de infraestructura para empresas de todos los tamaños.
            Nos dedicamos a ofrecer un servicio eficiente, seguro y confiable para garantizar que tus datos y aplicaciones estén siempre disponibles.
          </p>
        </section>

      {showLogin && <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />}

      <footer className="footer">
        <img className="logo-icon" src={logoMad} alt="icon" width="80" />
        <p>&copy; {new Date().getFullYear()} Novahost</p>
      </footer>
    </div>
  );
}

export default Home;
