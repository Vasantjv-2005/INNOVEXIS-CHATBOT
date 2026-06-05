const {
  InferenceClient,
} = require(
  "@huggingface/inference"
);

const client =
  new InferenceClient(
    process.env.HUGGINGFACE_API_KEY
  );

const generateImage =
  async (prompt) => {
    try {
      const image =
        await client.textToImage({
          model:
            "black-forest-labs/FLUX.1-schnell",

          inputs: prompt,
        });

      return image;
    } catch (error) {
      console.error("FLUX.1-schnell failed, trying SDXL fallback...", error);
      try {
        const image = await client.textToImage({
          model: "stabilityai/stable-diffusion-xl-base-1.0",
          inputs: prompt,
        });
        return image;
      } catch (fallbackError) {
        console.error(fallbackError);
        throw fallbackError;
      }
    }
  };

module.exports =
  generateImage;