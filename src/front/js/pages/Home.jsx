import React, { useState } from 'react';
import '../../styles/Home.css'; // Import the CSS file

function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    setShowLogin(!showLogin);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    // Here you would typically handle the login logic, e.g., sending data to an API
    console.log('Login submitted:', { username, password });
    // Reset form fields after submission (optional)
    setUsername('');
    setPassword('');
    setShowLogin(false);
    alert(`Login submitted with username: ${username}`);
  };

  return (
    <div className="home-container">
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
          <p>Your minimalist hosting solution.</p>
          <button className="cta-button">Get Started</button>
        </section>

        <section className="features">
          <h2>Our Features</h2>
          <div className="feature-list">
            <div className="feature-item">
              <h3>Fast Performance</h3>
              <p>Experience lightning-fast loading times.</p>
            </div>
            <div className="feature-item">
              <h3>Reliable Uptime</h3>
              <p>We guarantee 99.9% uptime.</p>
            </div>
            <div className="feature-item">
              <h3>Easy to Use</h3>
              <p>Simple and intuitive control panel.</p>
            </div>
          </div>
        </section>
      </main>

      {showLogin && (
        <div className="login-modal">
          <div className="login-form-container">
            <form className="login-form" onSubmit={handleLoginSubmit}>
              <h2>Login</h2>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
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
