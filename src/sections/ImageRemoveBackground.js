// src/sections/ImageRemoveBackground.js
import React from 'react';
import axios from 'axios';
import { Button } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';

const ImageRemoveBackground = observer(({ store }) => {
  const handleRemoveBackground = async () => {
    const selectedElement = store.selectedElements[0];
    if (!selectedElement || selectedElement.type !== 'image') {
      alert('Please select an image element first.');
      return;
    }

    const imageUrl = selectedElement.src;

    try {
      // Fetch the image and convert it to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = reader.result; // Includes data URI prefix

        // Send the image to the backend for segmentation
        const result = await axios.post('/api/segmentImage', {
          image: base64data,
        });

        // Process the result and update the canvas
        if (result.data && result.data[0]) {
          const maskData = result.data[0]; // Adjust based on API response
          applyMaskToImage(selectedElement, maskData);
        } else {
          alert('Segmentation failed.');
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error removing background:', error);
    }
  };

  const applyMaskToImage = (element, maskData) => {
    // Implement the logic to apply the mask to the image
    // This involves canvas manipulation to combine the original image with the mask

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = element.src;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);

      // Create mask image
      const maskImg = new Image();
      maskImg.onload = () => {
        // Apply the mask to the image
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(maskImg, 0, 0, img.width, img.height);

        const newDataUrl = canvas.toDataURL();

        // Update the element's image source
        element.set({ src: newDataUrl });
        store.saveHistory();
      };
      maskImg.src = 'data:image/png;base64,' + maskData;
    };
  };

  return (
    <Button icon="eraser" onClick={handleRemoveBackground}>
      Remove Background
    </Button>
  );
});

export { ImageRemoveBackground };
