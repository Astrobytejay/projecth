import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginBackground from '../assets/dsd.webp';  // Correct image path
import './login.css';  // Import the CSS file
import { supabase } from '../supabaseClient'; // Ensure this points to your Supabase client

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Login error:', error.message);
        alert('Login failed: ' + error.message);
      } else {
        localStorage.setItem('session', JSON.stringify(data.session));
        navigate('/chat');  // Redirect to ChatPage after successful login
      }
    } catch (error) {
      console.error('Login error:', error);
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
