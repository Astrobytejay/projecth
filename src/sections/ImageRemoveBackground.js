import React, { useState } from "react";
import axios from "axios";
import { Button, Spinner } from "@blueprintjs/core";

const ImageRemoveBackground = ({ store }) => {
  const [loading, setLoading] = useState(false);
  const [outputImage, setOutputImage] = useState(null);

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
  
      console.log(response.data); // Log the API response
  
      if (response.data.output) {
        setOutputImage(response.data.output);
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
    <div>
      <Button icon="eraser" onClick={handleRemoveBackground} disabled={loading}>
        {loading ? <Spinner size={20} /> : "Remove Background"}
      </Button>

      {outputImage && (
        <div style={{ marginTop: "20px" }}>
          <h3>Background Removed Image:</h3>
          <img src={outputImage} alt="Processed" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default ImageRemoveBackground;
