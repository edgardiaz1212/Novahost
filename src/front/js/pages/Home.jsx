import React, { useState, useContext, useEffect, useRef } from 'react';
import '../../styles/Home.css';
import { Context } from '../store/appContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../img/CDHLogo.jpg";
import logoMad from '../../img/mad_data.png';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { store, actions } = useContext(Context);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setShowLogin(!showLogin);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const data = await actions.login(email, password);
    if (data) {
      setEmail('');
      setPassword('');
      setShowLogin(false);
      toast.success(`Bienvenido ${data.user.userName}!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate('/dashboard'); // Redirect to /dashboard
    } else {
      toast.error("Credenciales incorrectas", {
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

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowLogin(false);
    }
  };

  useEffect(() => {
    if (showLogin) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogin]);

  useEffect(() => {
    if (store.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [store.isAuthenticated]);

  return (
    <div className="home-container">
      <ToastContainer />
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Logo" width="70" height="40" className="me-2" />
          Novahost
        </div>
        <nav>
          {store.isAuthenticated ? (
            <div className="d-flex align-items-center gap-3">
              <span className="text-white">Bienvenido, {store.user.userName}</span>
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleLoginClick}>
              {showLogin ? 'Close Login' : 'Login'}
            </button>
          )}
        </nav>
      </header>

      <main className="main-content">
        <section className="hero">
          <h1>Bienvenido a Novahost</h1>
          <h1 className="text-5xl font-bold mb-6 text-white">
            Soluciones de Centro de Datos de Nivel Empresarial
          </h1>
          <p className="mx-auto">
            Despliega y gestiona tu infraestructura con nuestros servicios de centro de datos seguros y escalables.
            Elige entre nuestras soluciones preconfiguradas o crea tu entorno personalizado.
          </p>
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

      {showLogin && (
        <div className="login-modal">
          <div className="login-form-container" ref={modalRef}>
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <h2 className="mb-4">Login</h2>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Clave:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                Inicio de Sesión
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="footer">
        <img className="logo-icon" src={logoMad} alt="icon" width="80" />
        <p>&copy; {new Date().getFullYear()} Novahost</p>
      </footer>
    </div>
  );
}

export default Home;
