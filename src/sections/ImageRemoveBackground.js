import React, { useState } from 'react';
import { Button, Dialog, Spinner } from '@blueprintjs/core';
import axios from 'axios';

const ImageRemoveBackground = ({ store }) => {
  const [isLoading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // For the confirmation dialog
  const [dialogMessage, setDialogMessage] = useState('');  // Message for the dialog

  const handleRemoveBackground = async () => {
    const selectedElement = store.selectedElements[0];
    if (!selectedElement || selectedElement.type !== "image") {
      alert("Please select an image element first.");
      return;
    }

    const imageUrl = selectedElement.src;

    try {
      setLoading(true);

      // Send the image URL to the backend API for processing
      const response = await axios.post("/api/segmentImage", {
        image: imageUrl,
      });

      console.log(response.data); // Log the API response to ensure you get the output URL

      if (response.data.output) {
        // Set the processed image as the new source for the selected element
        selectedElement.set({ src: response.data.output });
        store.history.save();  // Save this change in the history for undo/redo functionality

        // Set the success message and show the dialog
        setDialogMessage('Background removed successfully!');
        setIsDialogOpen(true);
      } else {
        alert("Failed to remove background. No output image received.");
      }
    } catch (error) {
      console.error("Error removing background:", error);
      alert("Failed to remove background.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleRemoveBackground} loading={isLoading}>
        Remove Background
      </Button>

      {/* Confirmation Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Success"
      >
        <div className="bp3-dialog-body">
          {dialogMessage}
        </div>
        <div className="bp3-dialog-footer">
          <Button onClick={() => setIsDialogOpen(false)}>Ok</Button>
        </div>
      </Dialog>
    </>
  );
};

export default ImageRemoveBackground;
