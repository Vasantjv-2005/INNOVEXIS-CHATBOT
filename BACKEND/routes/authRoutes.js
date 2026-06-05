const express = require("express");
const passport = require("passport");
const generateToken = require("../utils/generateToken");

const router =
  express.Router();

const {
  registerUser,
  loginUser,
} = require(
  "../controllers/authController"
);

const {
  loginLimiter,
  registerLimiter,
} = require(
  "../middleware/rateLimitMiddleware"
);

// REGISTER
router.post(
  "/register",
  registerLimiter,
  registerUser
);

// LOGIN
router.post(
  "/login",
  loginLimiter,
  loginUser
);

// GOOGLE AUTH TRIGGER
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// GOOGLE AUTH CALLBACK
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL || "http://localhost:3000"}/login?error=google_failed`, session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const userData = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    };
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/auth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
  }
);

module.exports =
  router;