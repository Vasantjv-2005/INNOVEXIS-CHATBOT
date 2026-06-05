const Chat = require("../models/Chat");
const Message = require("../models/Message");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const generateAIResponse = require(
  "../services/groqService"
);
const generateImage = require("../services/imageService")

// CREATE CHAT
const createChat = async (
  req,
  res
) => {
  try {
    const chat = await Chat.create({
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create chat",
    });
  }
};

// GET USER CHATS
const getChats = async (
  req,
  res
) => {
  try {
    const chats = await Chat.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
};

// Helper function to extract text from files
const extractTextFromFile = async (file) => {
  const filePath = path.join(__dirname, "../", file.path);
  const ext = path.extname(file.originalname).toLowerCase();

  try {
    if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (ext === ".txt") {
      return fs.readFileSync(filePath, "utf8");
    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
      return `[Image file: ${file.originalname} - For image analysis, please use a vision API]`;
    } else if (ext === ".doc") {
      return `[DOC file: ${file.originalname} - DOC files are not supported, please convert to DOCX]`;
    }
    return `[File: ${file.originalname}]`;
  } catch (error) {
    console.error("Error extracting text:", error);
    return `[File: ${file.originalname}]`;
  }
};

// SEND MESSAGE TO AI
const sendMessage = async (
  req,
  res
) => {
  try {
    const { chatId, message } =
      req.body;

    if (!chatId) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Chat ID is required",
        });
    }

    let fullMessage = message || "";

    // Process uploaded files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileText = await extractTextFromFile(file);
        fullMessage += `\n\n--- Uploaded file: ${file.originalname} ---\n${fileText}`;
      }
    }

    if (!fullMessage.trim()) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Message or file is required",
        });
    }

    // Check if this is the first message in the chat to generate a title
    const existingMessages = await Message.find({ chat: chatId });
    if (existingMessages.length === 0) {
      try {
        // Determine what to use for title generation
        let titleContent = message || "";
        if (req.files && req.files.length > 0) {
          titleContent += (titleContent ? "\n" : "") + `Uploaded files: ${req.files.map(f => f.originalname).join(", ")}`;
        }

        // Generate a smart AI title
        const titlePrompt = `Generate a short, concise title (max 6 words) for this conversation. Only return the title, nothing else. Do not use any quotes or special characters.

Content: "${titleContent}"`;

        const aiTitle = await generateAIResponse(titlePrompt);
        const cleanTitle = aiTitle.replace(/["']/g, '').trim().substring(0, 50);

        const fallbackTitle = (message || "File upload").substring(0, 50) + ((message || "File upload").length > 50 ? "..." : "");
        await Chat.findByIdAndUpdate(chatId, { title: cleanTitle || fallbackTitle });
      } catch (error) {
        console.error("Title generation error:", error);
        // Fallback to simple title
        const fallbackTitle = (message || "File upload").substring(0, 50) + ((message || "File upload").length > 50 ? "..." : "");
        await Chat.findByIdAndUpdate(chatId, { title: fallbackTitle });
      }
    }

    // Save user message (only the original message, not full extracted content)
    const userMessage =
      await Message.create({
        chat: chatId,
        sender: "user",
        message: message || `[Attached ${req.files?.length || 0} file(s)]`,
      });

    let aiReply;
    // Check if the message is for image generation
    const isImageRequest = /(generate|create|draw|make)\s*(an?\s*)?image/i.test(fullMessage);

    if (isImageRequest) {
      try {
        const imageBlob = await generateImage(fullMessage);
        const fileName = `image-${Date.now()}.png`;
        const filePath = path.join(__dirname, "../uploads", fileName);
        
        const buffer = Buffer.from(await imageBlob.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        
        const imageUrl = `/uploads/${fileName}`;
        aiReply = `Here's your generated image:\n\n![Generated Image](${imageUrl})\n\n[Download Image](${imageUrl})`;
      } catch (error) {
        console.error("Image generation failed, falling back to text", error);
        aiReply = await generateAIResponse(fullMessage);
      }
    } else {
      aiReply = await generateAIResponse(fullMessage);
    }

    // Save AI message
    const aiMessage =
      await Message.create({
        chat: chatId,
        sender: "ai",
        message: aiReply,
      });

    const updatedChat = await Chat.findById(chatId);

    res.status(200).json({
      success: true,
      userMessage,
      aiMessage,
      chat: updatedChat,
    });
  } catch (error) {
    console.error(
      "Chat Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to generate AI response",
    });
  }
};

// GET CHAT MESSAGES
const getMessages =
  async (req, res) => {
    try {
      const messages =
        await Message.find({
          chat:
            req.params.chatId,
        }).sort({
          createdAt: 1,
        });

      res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch messages",
      });
    }
  };

// DELETE CHAT
const deleteChat = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    // Check if chat exists and belongs to user
    const chat = await Chat.findOne({ _id: chatId, user: req.user._id });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found or unauthorized"
      });
    }

    // Delete all messages for the chat
    await Message.deleteMany({ chat: chatId });

    // Delete the chat itself
    await Chat.findByIdAndDelete(chatId);

    res.status(200).json({
      success: true,
      message: "Chat deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete chat"
    });
  }
};

module.exports = {
  createChat,
  getChats,
  sendMessage,
  getMessages,
  deleteChat,
};