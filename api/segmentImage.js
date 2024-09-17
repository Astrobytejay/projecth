// api/segmentImage.js
const axios = require('axios');

const HUGGING_FACE_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { image } = req.body;

      // Ensure the model name and task are correctly defined
      const response = await axios({
        method: 'post',
        url: 'https://api-inference.huggingface.co/models/finegrain/finegrain-box-segmenter',
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: {
          inputs: image, // Send the base64 image
        },
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error(
        'Error segmenting image:',
        error.response ? error.response.data : error.message
      );
      res.status(500).json({ error: 'Failed to segment image' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
