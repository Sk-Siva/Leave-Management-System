const { register, login, fetchAllUsers } = require('../controllers/authController');
const { authMiddleware, roleMiddleware } = require('../middleware/middleware');

module.exports = [
  {
    method: 'POST',
    path: '/api/auth/register',
    options: {
      pre: [authMiddleware, roleMiddleware('admin')],
      handler: register
    }
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: login
  },
  {
    method: 'GET',
    path: '/api/auth/users',
    options: {
      pre: [authMiddleware],
      handler: fetchAllUsers
    }
  }
];
