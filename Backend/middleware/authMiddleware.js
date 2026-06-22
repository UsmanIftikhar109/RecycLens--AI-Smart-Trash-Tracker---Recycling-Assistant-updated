const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token in Authorization header
 * Attaches userId to req.userId if token is valid
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Missing or invalid authorization header' 
      });
    }
    
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: 'Invalid or expired token',
      error: error.message 
    });
  }
};

module.exports = authMiddleware;
