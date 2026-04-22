// ============================================================
// middleware/auth.js - JWT Authentication Middleware
// ============================================================

const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes that require authentication.
 * Checks for a valid JWT token in the Authorization header.
 *
 * Usage: Add `authMiddleware` as a parameter before your route handler.
 * Example: router.get("/protected", authMiddleware, (req, res) => { ... })
 */
const authMiddleware = (req, res, next) => {
  // Get the Authorization header value
  const authHeader = req.headers.authorization;

  // Check if header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Access denied." });
  }

  // Extract the token (remove "Bearer " prefix)
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user info to the request object
    req.user = decoded;

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
