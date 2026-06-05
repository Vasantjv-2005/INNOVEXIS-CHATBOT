const crypto = require("crypto");

const bcrypt = require("bcryptjs");

const User = require("../models/User");

const sendEmail = require(
  "../utils/sendEmail"
);

// FORGOT PASSWORD
const forgotPassword =
  async (req, res) => {
    try {
      const { email } =
        req.body;

      const user =
        await User.findOne({
          email,
        });

      // GENERIC RESPONSE
      if (!user) {
        return res
          .status(200)
          .json({
            success: true,
            message:
              "If an account exists, a reset email has been sent.",
          });
      }

      const resetToken =
        crypto
          .randomBytes(32)
          .toString("hex");

      user.resetPasswordToken =
        resetToken;

      user.resetPasswordExpire =
        Date.now() +
        15 * 60 * 1000;

      await user.save();

      const resetURL =
        `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      await sendEmail({
        email: user.email,

        subject:
          "Password Reset",

        message:
          `Reset your password:\n\n${resetURL}`,
      });

      res.status(200).json({
        success: true,
        message:
          "If an account exists, a reset email has been sent.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Server error",
      });
    }
  };

// RESET PASSWORD
const resetPassword =
  async (req, res) => {
    try {
      const { token } =
        req.params;

      const {
        password,
      } = req.body;

      const user =
        await User.findOne({
          resetPasswordToken:
            token,

          resetPasswordExpire:
            {
              $gt:
                Date.now(),
            },
        });

      if (!user) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "Invalid or expired token",
          });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      user.password =
        hashedPassword;

      user.resetPasswordToken =
        undefined;

      user.resetPasswordExpire =
        undefined;

      user.loginAttempts = 0;

      user.lockUntil = null;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Password reset successful",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Server error",
      });
    }
  };

module.exports = {
  forgotPassword,
  resetPassword,
};