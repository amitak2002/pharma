const jwt = require("jsonwebtoken");
const User = require("../models/user.models");

const protect = async (req, res, next) => {
  let token;
  try {
    if (
      !req?.headers?.authorization ||
      !req?.headers?.authorization.startsWith("Bearer")
    ) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    token = req?.headers?.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decode?.id).select("-password");

    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error("error is in authMiddleWare : ", error);
    return res.status(401).json({ success: false, message: "Token is invalid or expired" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }
};

module.exports = { protect, adminOnly };
