import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { image, mask } = req.body;

      const output = await replicate.run(
        "allenhooo/lama:cdac78a1bec5b23c07fd29692fb70baa513ea403a39e643c48ec5edadb15fe72",
        {
          input: { image, mask },
        }
      );

      return res.status(200).json({ output });
    } catch (error) {
      console.error("Error removing object:", error);
      return res.status(500).json({ error: "Object removal failed" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
