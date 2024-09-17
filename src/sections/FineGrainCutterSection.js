import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { SectionTab } from 'polotno/side-panel';
import { Button, InputGroup, Spinner } from '@blueprintjs/core';
import FaCut from '@meronex/icons/fa/FaCut';
import axios from 'axios';

export const ImgCutterPanel = observer(({ store }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle object cutting with FineGrain API
  const handleCut = async () => {
    if (!store.activePage) return;
    const imageElement = store.activePage?.selectedElements[0]; // Get the currently selected image on the canvas

    if (imageElement && imageElement.type === 'image') {
      setIsLoading(true);

      try {
        // API call to FineGrain Object Cutter
        const response = await axios.post(
          'https://api-inference.huggingface.co/models/finegrain/finegrain-object-cutter',
          {
            image: imageElement.src, // Send the image source to the API
            prompt, // User's prompt for what to cut
          },
          {
            headers: {
              'Authorization': `Bearer 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`, // Hugging Face API token
            },
          }
        );

        const processedImageUrl = response.data.output; // Get the processed image URL

        // Replace the existing image with the processed one
        store.activePage.updateElement(imageElement.id, {
          src: processedImageUrl,
        });
      } catch (error) {
        console.error('Error cutting object:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <InputGroup
        placeholder="Enter a prompt to cut (e.g., 'cut the person')"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={isLoading}
      />
      <Button
        onClick={handleCut}
        intent="primary"
        icon={isLoading ? <Spinner size={20} /> : <FaCut />}
        loading={isLoading}
        text="Cut Object"
        disabled={!store.activePage?.selectedElements?.length || !prompt}
        style={{ marginTop: '10px' }}
      />
    </div>
  );
});

// Define the new ImgCutterSection
export const ImgCutterSection = {
  name: 'imgCutter',
  Tab: observer((props) => (
    <SectionTab name="Img Cutter" {...props}>
      <FaCut />
    </SectionTab>
  )),
  Panel: ImgCutterPanel,
};
