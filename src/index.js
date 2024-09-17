import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Make sure Router is properly imported

import { createStore } from 'polotno/model/store';
import { createProject, ProjectContext } from './project';  // Import Project Context and createProject function
import App from './App';
import ChatPage from './ChatPage';
import EditPage from './EditPage';  // Ensure EditPage is properly imported
import Login from './topbar/Login';  // Import Login component
import Signup from './topbar/Signup';  // Import Signup component

import './index.css';  // CSS file for global styles
import './logger';     // Logger file if needed for logging
import { ErrorBoundary } from 'react-error-boundary';  // Error boundary to handle application errors

// Create Polotno store with your Polotno key and disable the watermark
const store = createStore({
  key: 'ajmZpbd8NK3uZ4-_5JNO',  // Your Polotno key
  showCredit: false             // Disable the "Powered by Polotno" watermark
});

// Ensure at least one page exists in the store
if (store.pages.length === 0) {
  store.addPage();
}

window.store = store;  // Expose store to window for debugging

// Create project context using Polotno store
const project = createProject({ store });
window.project = project;  // Expose project to window for debugging

const root = ReactDOM.createRoot(document.getElementById('root'));

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

// Render the app with routing
root.render(
  <ErrorBoundary
    FallbackComponent={Fallback}   // Handle errors with the fallback component
    onReset={(details) => {}}
    onError={(e) => {
      if (window.Sentry) {
        window.Sentry.captureException(e);  // Optionally capture errors with Sentry
      }
    }}
  >
    <ProjectContext.Provider value={project}>
      <Router>
        <Routes>
          <Route path="/" element={<ChatPage />} />   {/* Default route: ChatPage */}
          <Route path="/edit-image" element={<EditPage />} />  {/* Route for EditPage */}
          <Route path="/studio" element={<App store={store} />} />  {/* Route for the main app */}
          <Route path="/login" element={<Login />} />  {/* Route for login */}
          <Route path="/signup" element={<Signup />} />  {/* Route for signup */}
        </Routes>
      </Router>
    </ProjectContext.Provider>
  </ErrorBoundary>
);
