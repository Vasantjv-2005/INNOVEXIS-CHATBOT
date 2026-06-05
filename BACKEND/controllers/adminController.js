const User = require("../models/User");

const Chat = require("../models/Chat");

const Message = require(
  "../models/Message"
);

// DASHBOARD STATS
const getDashboardStats =
  async (req, res) => {
    try {
      const users =
        await User.countDocuments();

      const chats =
        await Chat.countDocuments();

      const messages =
        await Message.countDocuments();

      res.status(200).json({
        success: true,

        totalUsers:
          users,

        totalChats:
          chats,

        totalMessages:
          messages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  getDashboardStats,
};