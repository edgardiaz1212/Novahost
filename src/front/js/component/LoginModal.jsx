// c:\Users\AdminLocal\Documents\Github\proyectonovahost\Novahost\src\front\js\components\LoginModal.jsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function LoginModal({ showLogin, setShowLogin }) {
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const modalRef = useRef(null);
  const navigate = useNavigate();

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
      navigate('/dashboard');
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
  );
}

export default LoginModal;
