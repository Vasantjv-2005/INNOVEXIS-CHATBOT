const mongoose = require("mongoose");

const messageSchema =
  new mongoose.Schema(
    {
      chat: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Chat",

        required: true,
      },

      sender: {
        type: String,

        enum: [
          "user",
          "ai",
        ],

        required: true,
      },

      message: {
        type: String,

        required: true,
      },

      file: {
        type: String,

        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Message",
    messageSchema
  );