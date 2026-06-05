const {
  GoogleGenerativeAI,
} = require(
  "@google/generative-ai"
);

console.log(
  "Gemini Key:",
  process.env.GEMINI_API_KEY
);

const genAI =
  new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

module.exports = genAI;