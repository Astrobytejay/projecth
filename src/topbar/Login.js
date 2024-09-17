import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginBackground from '../assets/dsd.webp';  // Correct image path
import './login.css';  // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Hardcoded user credentials
  const users = [
    {
      email: 'info@svatai.com',
      password: 'qualiTyB4$$',
      name: 'Admin',
    },
    {
      email: 'demo@svatai.com',
      password: 'Password2803$',
      name: 'Demo',
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Check if the entered credentials match the hardcoded users
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // Save session data (e.g., username) to localStorage for session management
      localStorage.setItem('session', JSON.stringify({ email: user.email, name: user.name }));
      navigate('/chat');  // Redirect to ChatPage after successful login
    } else {
      setError('Invalid login credentials. Please try again.');
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${loginBackground})`,
      }}
    >
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password:</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
              />
              <span
                className="show-password-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '🙈'}
              </span>
            </div>
          </div>
          {/* Error message if login fails */}
          {error && <p className="error-message">{error}</p>}
          
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="signup-link">
          <p>
            Don't have an account?{' '}
            <span onClick={() => navigate('/signup')}>
              Sign up for free
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
