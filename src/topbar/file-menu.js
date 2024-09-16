import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Dialog, Classes, Position, Menu, MenuItem, MenuDivider, Popover } from '@blueprintjs/core';
import { downloadFile } from 'polotno/utils/download';

export const FileMenu = observer(({ store, project }) => {
  const inputRef = React.useRef();
  const [faqOpened, toggleFaq] = React.useState(false);

  return (
    <>
      <Popover
        content={
          <Menu>
            <MenuItem
              icon="plus"
              text="Create new design"
              onClick={() => {
                project.createNewDesign();
              }}
            />
            <MenuDivider />
            <MenuItem
              icon="folder-open"
              text="Open"
              onClick={() => {
                document.querySelector('#load-project').click();
              }}
            />
            <MenuItem
              icon="floppy-disk"
              text="Save as JSON"
              onClick={() => {
                const json = store.toJSON();
                const url =
                  'data:text/json;base64,' +
                  window.btoa(unescape(encodeURIComponent(JSON.stringify(json))));
                downloadFile(url, 'polotno.json');
              }}
            />
            <MenuDivider />
            <MenuItem text="Language" icon="translate">
              <MenuItem
                text="English"
                active={project.language.startsWith('en')}
                onClick={() => {
                  project.setLanguage('en');
                }}
              />
              <MenuItem
                text="Portuguese"
                active={project.language.startsWith('pt')}
                onClick={() => {
                  project.setLanguage('pt');
                }}
              />
              <MenuItem
                text="French"
                active={project.language.startsWith('fr')}
                onClick={() => {
                  project.setLanguage('fr');
                }}
              />
              <MenuItem
                text="Russian"
                active={project.language.startsWith('ru')}
                onClick={() => {
                  project.setLanguage('ru');
                }}
              />
              <MenuItem
                text="Indonesian"
                active={project.language.startsWith('id')}
                onClick={() => {
                  project.setLanguage('id');
                }}
              />
            </MenuItem>
            <MenuItem
              text="About"
              icon="info-sign"
              onClick={() => {
                toggleFaq(true);
              }}
            />
          </Menu>
        }
        position={Position.BOTTOM_RIGHT}
      >
        <Button minimal text="File" />
      </Popover>
      <input
        type="file"
        id="load-project"
        accept=".json,.polotno"
        ref={inputRef}
        style={{ width: '180px', display: 'none' }}
        onChange={(e) => {
          var input = e.target;
          if (!input.files.length) {
            return;
          }
          var reader = new FileReader();
          reader.onloadend = async function () {
            var text = reader.result;
            let json;
            try {
              json = JSON.parse(text);
            } catch (e) {
              alert('Can not load the project.');
            }
            if (json) {
              await project.createNewDesign();
              store.loadJSON(json);
              project.save();
              input.value = '';
            }
          };
          reader.onerror = function () {
            alert('Can not load the project.');
          };
          reader.readAsText(input.files[0]);
        }}
      />
      <Dialog
        icon="info-sign"
        onClose={() => toggleFaq(false)}
        title="About Polotno Studio"
        isOpen={faqOpened}
        style={{ width: '80%', maxWidth: '700px' }}
      >
        <div className={Classes.DIALOG_BODY}>
          <h2>What  is Svat ai??</h2>
          <p>
            <strong>SVAT AI</strong> - Deep Learning AI
          </p>
          <h2>SVATAI</h2>
          <p>
            Deep Learning{' '}
            <a href="#" target="_blank">
              GitHub repository
            </a>
            . <strong>Svat AI</strong> is powered by{' '}
            <a href="https://svatai.com/" target="_blank">
              Svatai SDK project
            </a>
            . All core "canvas editor" functionality are implemented by{' '}
            <strong>Svatai</strong> npm package (A full Deep Learning).
          </p>
          <p>
            Svat AI Studio is built on top of Svat AI SDK to provide a desktop-app-like experience.
          </p>
          <h2>Who is making Svat AI Studio?</h2>
          <p>
            Team Svat AI{' '}
            <a href="#" target="_blank">
              @lavrton
            </a>
            . SVAT AI{' '}
            <a href="#" target="_blank">
              Konva 2d canvas framework
            </a>
          </p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => toggleFaq(false)}>Close</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
});
