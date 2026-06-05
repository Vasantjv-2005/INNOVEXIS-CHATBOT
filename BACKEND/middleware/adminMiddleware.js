const adminOnly = (
  req,
  res,
  next
) => {
  try {
    if (
      req.user &&
      req.user.role ===
        "admin"
    ) {
      next();
    } else {
      return res.status(403).json({
        success: false,

        message:
          "Access denied. Admin only.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,

      message:
        error.message,
    });
  }
};

module.exports =
  adminOnly;