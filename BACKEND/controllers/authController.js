const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken = require(
  "../utils/generateToken"
);

// REGISTER USER
const registerUser = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const userExists =
      await User.findOne({
        email,
      });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message:
          "Registration failed",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        name,
        email,
        password:
          hashedPassword,
      });

    res.status(201).json({
      success: true,
      token:
        generateToken(
          user._id
        ),
      user,
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

// LOGIN USER
const loginUser = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    // GENERIC RESPONSE
    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    // ACCOUNT LOCK CHECK
    if (
      user.lockUntil &&
      user.lockUntil >
        Date.now()
    ) {
      return res.status(423).json({
        success: false,
        message:
          "Account temporarily locked. Try again later.",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      user.loginAttempts += 1;

      if (
        user.loginAttempts >=
        5
      ) {
        user.lockUntil =
          Date.now() +
          15 *
            60 *
            1000; // 15 minutes
      }

      await user.save();

      return res.status(401).json({
        success: false,
        message:
          "Invalid credentials",
      });
    }

    // EMAIL VERIFICATION CHECK
    // Uncomment after email verification is implemented

    /*
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Please verify your email",
      });
    }
    */

    // RESET FAILED ATTEMPTS
    user.loginAttempts = 0;
    user.lockUntil = null;

    await user.save();

    res.status(200).json({
      success: true,

      token:
        generateToken(
          user._id
        ),

      user,
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
  registerUser,
  loginUser,
};