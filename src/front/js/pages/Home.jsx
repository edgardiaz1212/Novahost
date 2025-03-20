import React, { useState, useContext, useEffect, useRef } from 'react';
import '../../styles/Home.css';
import { Context } from '../store/appContext'; // Import Context
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const { store, actions } = useContext(Context); // Use useContext to access store and actions
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const modalRef = useRef(null);

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
      toast.success(`Bienvenido ${data.user.name}!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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

  return (
    <div className="home-container">
      <ToastContainer />
      {/* ... (rest of your Home component code) */}
      <header className="header">
        <div className="logo">Novahost</div>
        <nav>
          <button className="login-button" onClick={handleLoginClick}>
            {showLogin ? 'Close Login' : 'Login'}
          </button>
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
              <p>Soluciones preconfiguradas para implementación inmediata.
              </p>
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
              <h2>Login</h2>
              <div className="form-group">
                <label htmlFor="email">email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Login
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Novahost</p>
      </footer>
    </div>
  );
}

export default Home;
