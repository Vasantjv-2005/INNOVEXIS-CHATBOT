const mongoose = require("mongoose");

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
      },

      avatar: {
        type: String,
        default: "",
      },

      bio: {
        type: String,
        default: "",
      },

      role: {
        type: String,
        enum: [
          "user",
          "admin",
        ],
        default: "user",
      },

      // EMAIL VERIFICATION
      isVerified: {
        type: Boolean,
        default: false,
      },

      verificationToken: {
        type: String,
      },

      // LOGIN PROTECTION
      loginAttempts: {
        type: Number,
        default: 0,
      },

      lockUntil: {
        type: Date,
      },

      // PASSWORD RESET
      resetPasswordToken: {
        type: String,
      },

      resetPasswordExpire: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "User",
    userSchema
  );