import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TextToImagePage = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      // Send the prompt to the backend API to generate the image
      const response = await axios.post('https://www.svatai.com/generate-image', { prompt });
      const imagePath = response.data.image_path.split('/').pop();
      setImageUrl(`https://www.svatai.com/images/${imagePath}`);
    } catch (error) {
      console.error('Error generating image:', error);
    }
    setLoading(false);
  };

  const handleEditImage = () => {
    navigate(`/edit?imageUrl=${encodeURIComponent(imageUrl)}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Generate Image from Text</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a text prompt"
        style={{ width: '300px', marginRight: '10px' }}
      />
      <button onClick={handleGenerateImage} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Image'}
      </button>

      {imageUrl && (
        <div style={{ marginTop: '20px' }}>
          <img src={imageUrl} alt="Generated" style={{ maxWidth: '500px' }} />
          <button onClick={handleEditImage} style={{ display: 'block', marginTop: '10px' }}>
            Edit Image
          </button>
        </div>
      )}
    </div>
  );
};

export default TextToImagePage;
