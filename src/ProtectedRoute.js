import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const session = localStorage.getItem('session');

  // If session does not exist, redirect to login
  if (!session) {
    return <Navigate to="/login" />;
  }

  // Otherwise, render the children components (protected content)
  return children;
};

export default ProtectedRoute;
