import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditPage = () => {
  const location = useLocation();  // Using useLocation to retrieve image path
  const navigate = useNavigate();

  // Extract image URL from query params or location state
  const imageUrl = new URLSearchParams(location.search).get('image');

  if (!imageUrl) {
    return <p>No image selected for editing.</p>;
  }

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Edit Image</h1>
      <img src={imageUrl} alt="Image to edit" style={{ width: '400px' }} />
      <button onClick={handleBack}>Back to ChatPage</button>
      {/* Add Polotno Studio editor here */}
    </div>
  );
};

export default EditPage;
