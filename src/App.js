import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Dialog } from '@blueprintjs/core'; // Import Dialog and Button for modal
import { Spinner } from '@blueprintjs/core';
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Routes, Route, Navigate for navigation

// Importing logo from the correct path
import logo from './assets/SI.png';  // <-- Correct path to the logo

import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { ZoomButtons } from 'polotno/toolbar/zoom-buttons';
import { SidePanel, DEFAULT_SECTIONS } from 'polotno/side-panel';
import { Workspace } from 'polotno/canvas/workspace';
import { Tooltip } from 'polotno/canvas/tooltip';
import { PagesTimeline } from 'polotno/pages-timeline';
import { setTranslations } from 'polotno/config';

import { loadFile } from './file';
import { QrSection } from './sections/qr-section';
import { QuotesSection } from './sections/quotes-section';
import { IconsSection } from './sections/icons-section';
import { ShapesSection } from './sections/shapes-section';
import { CustomAIImageSection } from './sections/stable-diffusion-section';
import { MyDesignsSection } from './sections/my-designs-section';

import { AIWriteMenu } from './ai-text';
import { useProject } from './project';
import { ImageRemoveBackground } from './background-remover';

import fr from './translations/fr';
import en from './translations/en';
import id from './translations/id';
import ru from './translations/ru';
import ptBr from './translations/pt-br';

import Topbar from './topbar/topbar';
import Login from './topbar/Login';  // Import Login component from topbar
import Signup from './topbar/Signup';  // Import Signup component from topbar
import ChatPage from './ChatPage';  // Import ChatPage component

// Load default translations
setTranslations(en);

// Helper function to check if the user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem('session') !== null;
};

const isStandalone = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone
  );
};

const getOffsetHeight = () => {
  let safeAreaInsetBottom = 0;

  if (isStandalone()) {
    const safeAreaInsetBottomString = getComputedStyle(
      document.documentElement
    ).getPropertyValue('env(safe-area-inset-bottom)');
    if (safeAreaInsetBottomString) {
      safeAreaInsetBottom = parseFloat(safeAreaInsetBottomString);
    }

    if (!safeAreaInsetBottom) {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/iPhone|iPad|iPod/i.test(userAgent) && !window.MSStream) {
        safeAreaInsetBottom = 20;
      }
    }
  }
  return window.innerHeight - safeAreaInsetBottom;
};

const useHeight = () => {
  const [height, setHeight] = React.useState(getOffsetHeight());
  useEffect(() => {
    window.addEventListener('resize', () => {
      setHeight(getOffsetHeight());
    });
  }, []);
  return height;
};

const App = observer(({ store }) => {
  const project = useProject();
  const height = useHeight();
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage modal visibility
  const [newImageUrl, setNewImageUrl] = useState(null); // Store the URL of the new image to be loaded

  // Clear the workspace
  const clearWorkspace = () => {
    if (store.activePage) {
      const elements = store.activePage?.elements || [];
      elements.forEach((element) => store.activePage?.removeElement(element.id));
    }
  };

  // Function to load a new image onto the canvas
  const loadImage = (imageUrl) => {
    clearWorkspace(); // Clear the canvas before adding the new image

    if (store.activePage) {
      const imageWidth = 1024;
      const imageHeight = 1024;
      store.activePage.addElement({
        type: 'image',
        src: imageUrl, // Ensure image loaded from Replicate API
        width: imageWidth,
        height: imageHeight,
        x: store.width / 2 - imageWidth / 2,
        y: store.height / 2 - imageHeight / 2,
      });
    }
  };

  // Function to handle the user's decision from the dialog
  const handleConfirm = () => {
    setIsDialogOpen(false); // Close the dialog
    if (newImageUrl) {
      loadImage(newImageUrl); // Load the new image
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false); // Close the dialog without loading the new image
  };

  // Effect to load the image when the app loads or the store changes
  useEffect(() => {
    project.firstLoad();

    const imageUrl = new URLSearchParams(window.location.search).get('image');
    if (imageUrl) {
      setNewImageUrl(imageUrl); // Store the new image URL
      setIsDialogOpen(true); // Show the dialog asking whether to clear the canvas
    }
  }, [store, project]);

  // Fetch the image URL from Replicate after the generation process
  useEffect(() => {
    const fetchGeneratedImage = async () => {
      try {
        const response = await fetch("/generate-image/"); // Assuming the backend endpoint exists
        const data = await response.json();
        if (data.image_path) {
          setNewImageUrl(data.image_path); // Store the Replicate-generated image URL
          loadImage(data.image_path); // Load it onto the canvas
        }
      } catch (error) {
        console.error("Failed to fetch generated image:", error);
      }
    };

    fetchGeneratedImage(); // Call it to load the image after generation
  }, []);

  // Handle file drop onto the canvas
  const handleDrop = (ev) => {
    ev.preventDefault();

    if (ev.dataTransfer.files.length !== ev.dataTransfer.items.length) {
      return;
    }

    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      loadFile(ev.dataTransfer.files[i], store);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: height + 'px',
        display: 'flex',
        flexDirection: 'column',
      }}
      onDrop={handleDrop}
    >
      <Topbar store={store} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Default Route: Redirect to login page */}
        <Route path="/" element={<Navigate to={isAuthenticated() ? '/chat' : '/login'} />} />

        {/* Protected Chat Route */}
        <Route
          path="/chat"
          element={isAuthenticated() ? <ChatPage /> : <Navigate to="/login" />}
        />

        {/* Protected Main Route */}
        <Route
          path="/main"
          element={
            isAuthenticated() ? (
              <div style={{ height: 'calc(100% - 50px)', position: 'relative' }}>
                <PolotnoContainer className="polotno-app-container">
                  <SidePanelWrap>
                    <SidePanel store={store} sections={DEFAULT_SECTIONS} />
                  </SidePanelWrap>
                  <WorkspaceWrap>
                    <Toolbar
                      store={store}
                      components={{
                        ImageRemoveBackground,
                        TextAIWrite: AIWriteMenu,
                      }}
                    />
                    <Workspace
                      store={store}
                      components={{ Tooltip, TextAIWrite: AIWriteMenu }}
                    />
                    <ZoomButtons store={store} />
                    <PagesTimeline store={store} />
                  </WorkspaceWrap>
                </PolotnoContainer>

                {/* Overlay for the logo */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: window.innerWidth < 768 ? '45px' : '-7px',
                    right: window.innerWidth < 768 ? '-5px' : '0px',
                    left: window.innerWidth < 768 ? 'auto' : 'unset',
                    backgroundColor: 'transparent',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                  }}
                >
                  <img
                    src={logo}
                    alt="Logo"
                    style={{
                      width: window.innerWidth < 768 ? '90px' : '90px',
                      height: window.innerWidth < 768 ? '40px' : '50px',
                      maxWidth: '100%',
                    }}
                  />
                </div>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>

      {/* Confirmation Dialog */}
      <Dialog isOpen={isDialogOpen} onClose={handleCancel} title="Clear Canvas?">
        <div className="bp3-dialog-body">Do you want to clear the current canvas and load the new image?</div>
        <div className="bp3-dialog-footer">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button intent="primary" onClick={handleConfirm}>Confirm</Button>
        </div>
      </Dialog>

      {project.status === 'loading' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
            }}
          >
            <Spinner />
          </div>
        </div>
      )}
    </div>
  );
});

export default App;
