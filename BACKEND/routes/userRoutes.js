const express = require("express");

const router =
  express.Router();

const {
  getProfile,
  updateProfile,
} = require(
  "../controllers/userController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

// GET PROFILE
router.get(
  "/profile",
  protect,
  getProfile
);

// UPDATE PROFILE
router.put(
  "/profile",
  protect,
  updateProfile
);

module.exports =
  router;