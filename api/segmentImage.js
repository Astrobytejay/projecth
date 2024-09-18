import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("Image URL received:", req.body.image); // Log the incoming image URL

      const output = await replicate.run(
        "smoretalk/rembg-enhance:4067ee2a58f6c161d434a9c077cfa012820b8e076efa2772aa171e26557da919",
        {
          input: { image: req.body.image },
        }
      );

      console.log("API Response:", output); // Log the API response

      return res.status(200).json({ output });
    } catch (error) {
      console.error("Error removing background:", error);
      return res.status(500).json({ error: "Failed to remove background" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
