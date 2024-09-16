import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Make sure Router is properly imported

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

// Inject custom CSS to hide the Polotno watermark
const style = document.createElement('style');
style.innerHTML = `
  .polotno-credit {
    position: absolute;
    left: -9999px;
    top: -9999px;
  }
`;
document.head.appendChild(style); // Add the style to the document head

// Create Polotno store
const store = createStore({
  key: 'nFA5H9elEytDyPyvKL7T',  // Your Polotno key
  showCredit: false             // Disable the "Powered by Polotno" watermark
});

// Ensure a page is added
if (store.pages.length === 0) {
  store.addPage();
}

// Function to remove the watermark from the DOM
const removePolotnoCredit = () => {
  const creditElement = document.querySelector('.polotno-credit');
  if (creditElement) {
    creditElement.style.display = 'none';
  }
};

// Call the function once after the store is initialized
store.on('change', () => {
  removePolotnoCredit();
});

// Ensure the function is called after DOM content is loaded
document.addEventListener('DOMContentLoaded', removePolotnoCredit);

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

// Render the app with routing and Auth0Provider
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
            <Route path="/" element={<ChatPage />} />
            <Route path="/edit-image" element={<EditPage />} />
            <Route path="/studio" element={<App store={store} />} />
            <Route path="/login" element={<Login />} />  {/* Add login route */}
            <Route path="/signup" element={<Signup />} />  {/* Add signup route */}
          </Routes>
        </Router>
      </Auth0Provider>
    </ProjectContext.Provider>
  </ErrorBoundary>
);
