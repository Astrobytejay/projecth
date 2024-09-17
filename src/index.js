import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';  // Import Navigate to handle redirects

import { createStore } from 'polotno/model/store';
import { Auth0Provider } from '@auth0/auth0-react';
import { createProject, ProjectContext } from './project';
import App from './App';
import ChatPage from './ChatPage';
import EditPage from './EditPage';  // Ensure EditPage is properly imported
import Login from './topbar/Login';  // Import Login component
import Signup from './topbar/Signup';  // Import Signup component

import './index.css';
import './logger';
import { ErrorBoundary } from 'react-error-boundary';

// Create Polotno store with your new key and watermark disabled
const store = createStore({
  key: 'ajmZpbd8NK3uZ4-_5JNO',  // Your new Polotno key
  showCredit: false             // Disable the "Powered by Polotno" watermark
});

// Ensure a page is added
if (store.pages.length === 0) {
  store.addPage();
}

window.store = store;

// Create project context
const project = createProject({ store });
window.project = project;

const root = ReactDOM.createRoot(document.getElementById('root'));

// Auth0 variables
const AUTH_DOMAIN = 'polotno-studio.eu.auth0.com';
const PRODUCTION_ID = process.env.REACT_APP_AUTH0_ID;
const LOCAL_ID = process.env.REACT_APP_AUTH0_ID;

const isLocalhost = window.location.href.indexOf('localhost') >= 0;
const ID = isLocalhost ? LOCAL_ID : PRODUCTION_ID;
const REDIRECT = isLocalhost ? 'http://localhost:3000' : 'https://studio.polotno.com';

// Fallback component for error boundary
function Fallback({ error, resetErrorBoundary }) {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{ textAlign: 'center', paddingTop: '40px' }}>
        <p>Something went wrong in the app.</p>
        <p>Try to reload the page.</p>
        <button
          onClick={async () => {
            await project.clear();
            window.location.reload();
          }}
        >
          Clear cache and reload
        </button>
      </div>
    </div>
  );
}

// Authentication Check: Redirects user based on whether they are logged in
const isAuthenticated = () => {
  return localStorage.getItem('session') !== null;
};

// Define route structure with proper authentication
root.render(
  <ErrorBoundary
    FallbackComponent={Fallback}
    onReset={(details) => {}}
    onError={(e) => {
      if (window.Sentry) {
        window.Sentry.captureException(e);
      }
    }}
  >
    <ProjectContext.Provider value={project}>
      <Auth0Provider domain={AUTH_DOMAIN} clientId={ID} redirectUri={REDIRECT}>
        <Router>
          <Routes>
            {/* Default route redirects to login if not authenticated */}
            <Route path="/" element={<Navigate to={isAuthenticated() ? "/chat" : "/login"} />} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes (only accessible if logged in) */}
            <Route path="/chat" element={isAuthenticated() ? <ChatPage /> : <Navigate to="/login" />} />
            <Route path="/edit-image" element={isAuthenticated() ? <EditPage /> : <Navigate to="/login" />} />
            <Route path="/studio" element={isAuthenticated() ? <App store={store} /> : <Navigate to="/login" />} />

            {/* Catch-all route to redirect to login if no other route matches */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </Auth0Provider>
    </ProjectContext.Provider>
  </ErrorBoundary>
);
