const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function protect(req, res, next) {
  try {
    const origin = req.get('origin');
    const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    if (process.env.NODE_ENV === 'development') {
      for (const allowedOrigin of [...allowedOrigins]) {
        const url = new URL(allowedOrigin);
        if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
          url.hostname = url.hostname === 'localhost' ? '127.0.0.1' : 'localhost';
          allowedOrigins.push(url.origin);
        }
      }
    }
    if (origin && !allowedOrigins.includes(origin)) {
      return res.status(403).json({ message: 'This request origin is not allowed.' });
    }

    const token = req.cookies?.blog_token;
    if (!token) {
      return res.status(401).json({ message: 'Please log in to continue.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub).select('_id name email');
    if (!user) {
      return res.status(401).json({ message: 'Your account is no longer available.' });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }
    return next(error);
  }
}

module.exports = { protect };