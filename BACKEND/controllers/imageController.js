const fs = require("fs");
const path = require("path");

const generateImage =
    require(
        "../services/imageService"
    );

const createImage =
    async (req, res) => {
        try {
            const { prompt } =
                req.body;

            if (!prompt) {
                return res
                    .status(400)
                    .json({
                        success: false,
                        message:
                            "Prompt is required",
                    });
            }

            const image =
                await generateImage(
                    prompt
                );

            const fileName =
                `image-${Date.now()}.png`;

            const filePath =
                path.join(
                    __dirname,
                    "../uploads",
                    fileName
                );

            const buffer =
                Buffer.from(
                    await image.arrayBuffer()
                );

            fs.writeFileSync(
                filePath,
                buffer
            );

            res.status(200).json({
                success: true,
                imageUrl:
                    `/uploads/${fileName}`,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Image generation failed",
            });
        }
    };

module.exports = {
    createImage,
};