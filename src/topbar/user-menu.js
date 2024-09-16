import React, { useState, useEffect } from 'react';
import { Button, Position, Menu, MenuItem, Popover } from '@blueprintjs/core';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// UserMenu component to handle authentication and profile
export const UserMenu = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken')); // Retrieve token from local storage
  const navigate = useNavigate(); // useNavigate replaces useHistory

  // Fetch the user profile if the token exists
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const response = await fetch("http://localhost:8001/profile/", {
            headers: {
              'Authorization': `Bearer ${token}`, // Send token in the Authorization header
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData); // Set user data if token is valid
          } else {
            setUser(null); // Clear user if token is invalid
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          setUser(null);
        }
      }
    };
    fetchProfile();
  }, [token]);

  // Redirect to the login page
  const handleLogin = () => {
    navigate("/login"); // useNavigate instead of history.push
  };

  // Redirect to the signup page
  const handleSignup = () => {
    navigate("/signup"); // useNavigate instead of history.push
  };

  // Handle logout by clearing the token and user data
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <Popover
      content={
        <Menu style={{ width: '80px' }}>
          {user ? (
            <>
              <div style={{ padding: '5px' }}>Logged in as {user.username}</div>
              <MenuItem text="Logout" icon="log-out" onClick={handleLogout} />
            </>
          ) : (
            <>
              <MenuItem text="Login" icon="log-in" onClick={handleLogin} />
              <MenuItem text="Sign Up" icon="new-person" onClick={handleSignup} />
            </>
          )}
        </Menu>
      }
      position={Position.BOTTOM_RIGHT}
    >
      <Button icon="user" minimal intent={user ? 'none' : 'warning'} />
    </Popover>
  );
};
