import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { supabase } from '../supabaseClient'; // Ensure Supabase is imported correctly

const ChatPage = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [theme, setTheme] = useState({
    backgroundColor1: '#f0f0f0',
    backgroundColor2: '#ffffff',
    containerColor1: '#ffffff',
    containerColor2: '#e0e0e0',
  });
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [avatarDropdown, setAvatarDropdown] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const avatarRef = useRef(null);
  const themePickerRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  // Ensure the user is authenticated; if not, redirect to login
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login'); // Redirect to login if not authenticated
      }
    };
    checkAuth();
  }, [navigate]);

  // Logout functionality
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('session'); // Clear local storage session
    navigate('/login'); // Redirect to login page after logout
  };

  // Load theme from local storage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('chatTheme');
    const savedBackgroundImage = localStorage.getItem('chatBackgroundImage');
    if (savedTheme) {
      setTheme(JSON.parse(savedTheme));
    }
    if (savedBackgroundImage) {
      setBackgroundImage(savedBackgroundImage);
    }
  }, []);

  // Simulated loading percentage
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingProgress((oldProgress) => {
          if (oldProgress < 100) {
            return oldProgress + 10;
          } else {
            clearInterval(interval);
            return 100;
          }
        });
      }, 300);
    } else {
      setLoadingProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Trigger image generation with "Enter" key or button click
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleGenerateImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [prompt]);

  // Scroll to the bottom whenever a new image is generated
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [generatedImages]);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://backendsvatai-37d34386095c.herokuapp.com/generate-image',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        throw new Error('Error generating image');
      }

      const data = await response.json();
      const imageUrl = data.imageUrl;

      // Add new image to the chat history
      setGeneratedImages([...generatedImages, { prompt, imagePath: imageUrl }]);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image');
    } finally {
      setLoading(false);
      setPrompt('');
    }
  };

  const handleEditImage = (imagePath) => {
    const studioUrl = `https://www.svatai.com/studio?image=${encodeURIComponent(imagePath)}`;
    window.location.href = studioUrl;
  };

  const handleThemeChange = (e) => {
    const { name, value } = e.target;
    setTheme((prevTheme) => ({
      ...prevTheme,
      [name]: value,
    }));
  };

  const handleBackgroundChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setBackgroundImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Save the current theme and background image to local storage
  const applyTheme = () => {
    localStorage.setItem('chatTheme', JSON.stringify(theme));
    if (backgroundImage) {
      localStorage.setItem('chatBackgroundImage', backgroundImage);
    }
    setShowThemePicker(false);
  };

  // Close dropdown and theme picker on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target) &&
        themePickerRef.current &&
        !themePickerRef.current.contains(event.target)
      ) {
        setAvatarDropdown(false);
        setShowThemePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderThemeModal = () => {
    return createPortal(
      <div style={styles.themeModalBackdrop}>
        <div ref={themePickerRef} style={styles.themeModal}>
          <h2 style={styles.modalTitle}>Customize Theme</h2>
          <div style={styles.colorInputContainer}>
            <label style={styles.label}>Background Color 1:</label>
            <input
              type="color"
              name="backgroundColor1"
              value={theme.backgroundColor1}
              onChange={handleThemeChange}
              style={styles.colorInput}
            />
          </div>
          <div style={styles.colorInputContainer}>
            <label style={styles.label}>Background Color 2:</label>
            <input
              type="color"
              name="backgroundColor2"
              value={theme.backgroundColor2}
              onChange={handleThemeChange}
              style={styles.colorInput}
            />
          </div>
          <div style={styles.colorInputContainer}>
            <label style={styles.label}>Container Color 1:</label>
            <input
              type="color"
              name="containerColor1"
              value={theme.containerColor1}
              onChange={handleThemeChange}
              style={styles.colorInput}
            />
          </div>
          <div style={styles.colorInputContainer}>
            <label style={styles.label}>Container Color 2:</label>
            <input
              type="color"
              name="containerColor2"
              value={theme.containerColor2}
              onChange={handleThemeChange}
              style={styles.colorInput}
            />
          </div>
          <div style={styles.colorInputContainer}>
            <label style={styles.label}>Background Image (optional):</label>
            <input
              type="file"
              onChange={handleBackgroundChange}
              style={styles.fileInput}
            />
          </div>
          <div style={styles.modalActions}>
            <button style={styles.applyButton} onClick={applyTheme}>
              Apply Theme
            </button>
            <button
              style={styles.revertButton}
              onClick={() => {
                setTheme({
                  backgroundColor1: '#f0f0f0',
                  backgroundColor2: '#ffffff',
                  containerColor1: '#ffffff',
                  containerColor2: '#e0e0e0',
                });
                setBackgroundImage(null);
                localStorage.removeItem('chatTheme');
                localStorage.removeItem('chatBackgroundImage');
              }}
            >
              Revert to Original
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div
      style={{
        ...styles.container(
          theme.backgroundColor1,
          theme.backgroundColor2,
          backgroundImage
        ),
      }}
    >
      <div
        style={styles.chatWindow(theme.containerColor1, theme.containerColor2)}
      >
        <h1 style={styles.title}>Svat AI Chat</h1>

        <div style={styles.chatHistory}>
          {generatedImages.length > 0 ? (
            generatedImages.map((entry, index) => (
              <div key={index} style={styles.chatEntry}>
                <p>
                  <strong>Prompt:</strong> {entry.prompt}
                </p>
                <div style={styles.imageContainer}>
                  <img
                    src={entry.imagePath}
                    alt="Generated"
                    style={styles.generatedImage}
                  />
                  <button
                    style={styles.editButton}
                    onClick={() => handleEditImage(entry.imagePath)}
                  >
                    Edit Image in Svat AI Studio
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.noImagesText}>
              No images generated yet. Start by entering a prompt.
            </p>
          )}
          <div ref={bottomRef}></div>
        </div>

        <div style={styles.inputSection}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt..."
            style={styles.input}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleGenerateImage();
              }
            }}
          />
          <button
            onClick={handleGenerateImage}
            disabled={loading}
            style={styles.generateButton}
          >
            {loading ? `Generating... ${loadingProgress}%` : 'Generate Image'}
          </button>
        </div>

        {/* Avatar and Settings Section */}
        <div ref={avatarRef} style={styles.avatarSection}>
          <div
            style={styles.avatar}
            onClick={() => setAvatarDropdown(!avatarDropdown)}
          >
            👤
          </div>
          {avatarDropdown && (
            <div style={styles.avatarOptions}>
              <button style={styles.avatarButton}>Profile</button>
              <button style={styles.avatarButton}>Tokens</button>
              <button style={styles.avatarButton} onClick={handleLogout}>
                Log Out
              </button>
              <button
                style={styles.avatarButton}
                onClick={() => setShowThemePicker(!showThemePicker)}
              >
                Theme
              </button>
              <input
                type="file"
                onChange={handleBackgroundChange}
                style={styles.fileInput}
              />
            </div>
          )}
        </div>
      </div>

      {/* Theme Picker Modal */}
      {showThemePicker && renderThemeModal()}
    </div>
  );
};

// Styles for the chat page
const styles = {
  container: (backgroundColor1, backgroundColor2, backgroundImage) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    background: backgroundImage
      ? `url(${backgroundImage})`
      : `linear-gradient(${backgroundColor1}, ${backgroundColor2})`,
    backgroundSize: 'cover',
  }),
  chatWindow: (containerColor1, containerColor2) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '95%',
    maxWidth: '1200px',
    height: '90vh',
    background: `linear-gradient(${containerColor1}, ${containerColor2})`,
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative',
  }),
  chatHistory: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '20px',
    color: '#333',
  },
  chatEntry: {
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #ddd',
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  generatedImage: {
    width: '100%',
    maxWidth: '600px',
    marginTop: '10px',
  },
  editButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    textAlign: 'center',
  },
  noImagesText: {
    color: '#666',
    fontSize: '16px',
  },
  inputSection: {
    display: 'flex',
    alignItems: 'center',
    borderTop: '1px solid #ddd',
    paddingTop: '10px',
  },
  input: {
    flex: 1,
    padding: '15px',
    fontSize: '18px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#fff',
    color: '#000',
  },
  generateButton: {
    padding: '15px 30px',
    marginLeft: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  avatarSection: {
    position: 'absolute',
    top: '20px',
    left: '20px',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    cursor: 'pointer',
    border: '2px solid black',
  },
  avatarOptions: {
    backgroundColor: '#007BFF',
    borderRadius: '5px',
    overflow: 'hidden',
    position: 'absolute',
    top: '60px',
    zIndex: 1,
  },
  avatarButton: {
    display: 'block',
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '5px 10px',
    marginBottom: '5px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
  },
  fileInput: {
    display: 'block',
    marginTop: '10px',
    cursor: 'pointer',
  },
  themeModalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  themeModal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '400px',
    position: 'relative',
  },
  modalTitle: {
    marginBottom: '20px',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  colorInputContainer: {
    marginBottom: '10px',
  },
  colorInput: {
    width: '100%',
    height: '40px',
    border: 'none',
    padding: '5px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '16px',
    color: '#333',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  applyButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
  },
  revertButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
  },
  title: {
    color: '#333',
    textAlign: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
};

export default ChatPage;
