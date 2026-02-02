const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // TEMP DEBUG (safe to remove later)
    console.log("Decoded token:", decoded);

    req.user = decoded; // { id }
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};
