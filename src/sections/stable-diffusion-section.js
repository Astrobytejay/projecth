import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { InputGroup, Button, Spinner } from '@blueprintjs/core';
import { Clean } from '@blueprintjs/icons';
import { SectionTab } from 'polotno/side-panel';
import { getImageSize } from 'polotno/utils/image';
import { ImagesGrid } from 'polotno/side-panel/images-grid';
import { useProject } from '../project';

// Define backend URL from environment variables
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001'; 

const GenerateTab = observer(({ store }) => {
  const project = useProject();
  const inputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle image generation
  const handleGenerate = async () => {
    setLoading(true);
    setImage(null); // Reset image before generating a new one
    setError(null); // Clear previous errors

    if (!inputRef.current || !inputRef.current.value) {
      setError('Please provide a valid input prompt');
      setLoading(false);
      return;
    }

    try {
      // Send a request to your backend to generate the image
      const response = await fetch(`${BACKEND_URL}/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputRef.current.value,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate image.');
      }

      const data = await response.json();
      const generatedImageUrl = data.imageUrl;
      setImage(generatedImageUrl); // Store the generated image URL in state
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error.message); // Set error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ height: '40px', paddingTop: '5px' }}>
        Generate an Image With Svat AI
      </div>
      <div style={{ padding: '15px 0' }}>
        Generate a new image or add a new image.
      </div>

      <InputGroup
        placeholder="Type your image generation prompt here..."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleGenerate();
          }
        }}
        style={{ marginBottom: '20px' }}
        inputRef={inputRef} // Attach the ref to the input field
      />

      <Button
        onClick={handleGenerate}
        intent="primary"
        loading={loading}
        style={{ marginBottom: '40px' }}
      >
        Generate
      </Button>

      {/* Error Display */}
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Spinner while loading */}
      {loading && <Spinner />}

      {/* Image display after generation */}
      {image && (
        <ImagesGrid
          shadowEnabled={false}
          images={image ? [image] : []} // Display the generated image
          getPreview={(item) => item} // Use the image as the preview
          isLoading={loading}
          onSelect={async (item, pos, element) => {
            const src = item;

            if (element && element.type === 'svg' && element.contentEditable) {
              element.set({ maskSrc: src });
              return;
            }

            if (element && element.type === 'image' && element.contentEditable) {
              element.set({ src: src });
              return;
            }

            const { width, height } = await getImageSize(src);
            const x = (pos?.x || store.width / 2) - width / 2;
            const y = (pos?.y || store.height / 2) - height / 2;

            store.activePage?.addElement({
              type: 'image',
              src: src,
              width,
              height,
              x,
              y,
            });
          }}
          rowsNumber={1}
        />
      )}
    </>
  );
});

const CustomAIImagePanel = observer(({ store }) => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GenerateTab store={store} />
    </div>
  );
});

// Define the new custom section for your model
export const CustomAIImageSection = {
  name: 'custom-ai-image',
  Tab: (props) => (
    <SectionTab name="AI Img" {...props}>
      <Clean />
    </SectionTab>
  ),
  Panel: CustomAIImagePanel,
};
