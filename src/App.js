import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Dialog, Spinner } from '@blueprintjs/core'; 
import { useLocation, useNavigate } from 'react-router-dom'; 

import logo from './assets/SI.png'; 
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
import ImageRemoveBackground from './sections/ImageRemoveBackground'; 

import fr from './translations/fr';
import en from './translations/en';
import id from './translations/id';
import ru from './translations/ru';
import ptBr from './translations/pt-br';

import Topbar from './topbar/topbar';

setTranslations(en);

const App = observer(({ store }) => {
  const project = useProject();
  const height = useHeight();
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [newImageUrl, setNewImageUrl] = useState(null); 

  const location = useLocation(); 
  const navigate = useNavigate();

  const clearWorkspace = () => {
    if (store.activePage) {
      const elements = store.activePage?.elements || [];
      elements.forEach((element) => store.activePage?.removeElement(element.id));
    }
  };

  const loadImage = (imageUrl) => {
    clearWorkspace(); 
    if (store.activePage) {
      const imageWidth = 1024;
      const imageHeight = 1024;
      store.activePage.addElement({
        type: 'image',
        src: imageUrl, 
        width: imageWidth,
        height: imageHeight,
        x: store.width / 2 - imageWidth / 2,
        y: store.height / 2 - imageHeight / 2,
      });
    }
  };

  const handleConfirm = () => {
    setIsDialogOpen(false); 
    if (newImageUrl) {
      loadImage(newImageUrl); 
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false); 
  };

  useEffect(() => {
    project.firstLoad();
    const imageUrl = new URLSearchParams(location.search).get('image');
    if (imageUrl) {
      setNewImageUrl(imageUrl); 
      setIsDialogOpen(true); 
    }
  }, [store, project, location.search]);

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
      <div style={{ height: 'calc(100% - 50px)', position: 'relative' }}>
        <PolotnoContainer className="polotno-app-container">
          <SidePanelWrap>
            <SidePanel 
              store={store} 
              sections={[
                ...DEFAULT_SECTIONS, 
                QrSection, 
                QuotesSection, 
                IconsSection, 
                ShapesSection, 
                CustomAIImageSection, 
                MyDesignsSection
              ]}
            />
          </SidePanelWrap>
          <WorkspaceWrap>
            <Toolbar
              store={store}
              components={{
                ImageRemoveBackground,
                TextAIWrite: AIWriteMenu,
              }}
            >
              <ImageRemoveBackground store={store} />
              
              {/* Add the eraser button to the toolbar */}
              <Button
                icon="eraser"
                onClick={() => navigate('/remove-object')}
              >
                Remove Object
              </Button>
            </Toolbar>
            <Workspace
              store={store}
              components={{ Tooltip, TextAIWrite: AIWriteMenu }}
            />
            <ZoomButtons store={store} />
            <PagesTimeline store={store} />
          </WorkspaceWrap>
        </PolotnoContainer>

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

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Clear Canvas?"
      >
        <div className="bp3-dialog-body">
          Do you want to clear the current canvas and load the new image?
        </div>
        <div className="bp3-dialog-footer">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button intent="primary" onClick={handleConfirm}>
            Confirm
          </Button>
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
