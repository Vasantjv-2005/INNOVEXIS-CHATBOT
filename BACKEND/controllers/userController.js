const User = require("../models/User");

// GET PROFILE
const getProfile =
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.user.id
        ).select(
          "-password"
        );

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// UPDATE PROFILE
const updateProfile =
  async (req, res) => {
    try {
      const updatedUser =
        await User.findByIdAndUpdate(
          req.user.id,
          req.body,
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        updatedUser,
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
  getProfile,
  updateProfile,
};