import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signupBackground from '../assets/trr.webp';  // Correct image path
import './signup.css';  // Import the CSS file

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    // Mock signup - save to localStorage as a simple form of registration
    localStorage.setItem('signupData', JSON.stringify({
      email,
      username,
      fullName,
      phoneNumber,
      password
    }));

    alert('Signup successful! Please log in.');
    navigate('/login');  // Redirect to login
  };

  return (
    <div
      className="signup-container"
      style={{
        backgroundImage: `url(${signupBackground})`,
      }}
    >
      <div className="signup-box">
        <h2 className="signup-title">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label className="input-label">Full Name:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field"
              placeholder="Enter your full name"
            />
          </div>
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
            <label className="input-label">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Enter your username"
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
          <div className="input-group">
            <label className="input-label">Phone Number (optional):</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-field"
              placeholder="Enter your phone number"
            />
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <div className="login-link">
          <p>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')}>
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
