const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateAIResponse = async (
  message
) => {
  try {
    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `IMPORTANT: Format all responses EXACTLY as numbered bullet points, with EACH point on a NEW LINE. Start each line with 1., 2., 3., etc., followed by a space and then your text. You MUST bold important keywords, phrases, or terms by surrounding them with double asterisks like this: **important point**.

When writing code, ALWAYS format it as proper code blocks:
- Start code blocks with \`\`\`language
- End code blocks with \`\`\`
- Use appropriate language identifiers like javascript, python, html, css, etc.
- Example:
\`\`\`javascript
function hello() {
  return "Hello World!";
}
\`\`\`

For inline code, use single backticks like \`code here\`.

Example of a complete response:
1. **First important point** here
2. Here's some code:
\`\`\`javascript
function example() {
  console.log("Hello!");
}
\`\`\`
3. Third important info here with inline code \`const x = 5\``,
          },
          {
            role: "user",
            content: message,
          },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
      });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return "Error generating response";
  }
};

module.exports =
  generateAIResponse;