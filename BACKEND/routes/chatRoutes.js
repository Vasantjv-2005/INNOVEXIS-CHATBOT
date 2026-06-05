const express = require("express");

const router =
  express.Router();

const upload = require("../config/uploadConfig");

const {
  createChat,
  getChats,
  sendMessage,
  getMessages,
  deleteChat,
} = require(
  "../controllers/chatController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

// CREATE CHAT
router.post(
  "/create",
  protect,
  createChat
);

// GET USER CHATS
router.get(
  "/",
  protect,
  getChats
);

// SEND MESSAGE
router.post(
  "/message",
  protect,
  upload.array("files", 10), // Allow up to 10 files
  sendMessage
);

// GET CHAT MESSAGES
router.get(
  "/messages/:chatId",
  protect,
  getMessages
);

// DELETE CHAT
router.delete(
  "/:chatId",
  protect,
  deleteChat
);

module.exports = router;