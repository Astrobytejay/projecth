// src/sections/ObjectRemovalSection.js
import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { Button } from '@blueprintjs/core';

const ObjectRemovalSection = observer(({ store }) => {
  const [maskUrl, setMaskUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRemoveObject = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/removeObject', {
        maskUrl,
        imageUrl,
      });
      const processedImageUrl = response.data.output;
      if (store.activePage) {
        store.activePage.addElement({
          type: 'image',
          src: processedImageUrl,
          width: 1024,
          height: 1024,
        });
      }
    } catch (error) {
      console.error('Error removing object:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Mask Image URL"
        value={maskUrl}
        onChange={(e) => setMaskUrl(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <Button onClick={handleRemoveObject} loading={loading}>
        Remove Object
      </Button>
    </div>
  );
});

export default ObjectRemovalSection;
