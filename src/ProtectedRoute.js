import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Import the Supabase client

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
      }

      console.log('Session:', session); // Debugging session information

      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Add a simple loading indicator
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
