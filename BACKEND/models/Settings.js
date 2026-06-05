const mongoose = require("mongoose");

const settingsSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      theme: {
        type: String,

        enum: [
          "light",
          "dark",
        ],

        default:
          "dark",
      },

      aiModel: {
        type: String,

        default:
          "gpt-3.5-turbo",
      },

      notifications: {
        type: Boolean,

        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Settings",
    settingsSchema
  );