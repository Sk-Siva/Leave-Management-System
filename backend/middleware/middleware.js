const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');

// Middleware for authentication
const authMiddleware = async (request, h) => {
  const authHeader = request.headers['authorization'];

  if (!authHeader) {
    throw Boom.forbidden('Access denied. No token provided.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.auth = { credentials: decoded };
    return h.continue;
  } catch (err) {
    throw Boom.unauthorized('Invalid token.');
  }
};

// Middleware for authorization based on roles
const roleMiddleware = (requiredRole) => {
  return async (request, h) => {
    const user = request.auth?.credentials;

    if (!user || user.role !== requiredRole) {
      throw Boom.forbidden('Access denied. You do not have the required access rights.');
    }

    return h.continue;
  };
};

module.exports = { authMiddleware, roleMiddleware };