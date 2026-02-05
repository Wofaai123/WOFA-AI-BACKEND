const jwt = require("jsonwebtoken");

/* ==========================================
   AUTH MIDDLEWARE (JWT PROTECTION)
   ========================================== */
module.exports = function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Must be "Bearer TOKEN"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token missing."
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload (ex: { id: userId })
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please login again."
    });
  }
};
