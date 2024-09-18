// api/removeObject.js
const Replicate = require('replicate');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const removeObjectFromImage = async (req, res) => {
  const { maskUrl, imageUrl } = req.body;

  try {
    const output = await replicate.run(
      "allenhooo/lama:cdac78a1bec5b23c07fd29692fb70baa513ea403a39e643c48ec5edadb15fe72",
      {
        input: { mask: maskUrl, image: imageUrl },
      }
    );
    res.json({ output });
  } catch (error) {
    res.status(500).send({ error: 'Failed to process image' });
  }
};

module.exports = { removeObjectFromImage };
