const {
  fetchUsersOnLeaveToday,
  fetchTeamLeave,
  fetchLeaveBalance,
  fetchLeaveTypes,
  requestLeaveHandler,
  getLeaveHistoryHandler,
  cancelLeaveHandler,
  getIncomingRequestsHandler,
  approveLeaveHandler,
  rejectLeaveHandler,
  createLeaveHandler,
  updateLeaveHandler,
  deleteLeaveHandler
} = require('../controllers/leaveController');

const { authMiddleware, roleMiddleware } = require('../middleware/middleware');

module.exports = [
  // Leave Request and History
  {
    method: 'POST',
    path: '/api/leave/request',
    options: {
      pre: [authMiddleware],
      handler: requestLeaveHandler
    }
  },
  {
    method: 'PUT',
    path: '/api/leave/cancel/{leaveRequestId}',
    options: {
      pre: [authMiddleware],
      handler: cancelLeaveHandler
    }
  },
  {
    method: 'GET',
    path: '/api/leave/history/{userId}',
    options: {
      pre: [authMiddleware],
      handler: getLeaveHistoryHandler
    }
  },

  // Leave Balance
  {
    method: 'GET',
    path: '/api/leave/balance/{userId}',
    options: {
      pre: [authMiddleware],
      handler: fetchLeaveBalance
    }
  },

  // Leave Request Approvals
  {
    method: 'GET',
    path: '/api/leave/requests/{userId}',
    options: {
      pre: [authMiddleware],
      handler: getIncomingRequestsHandler
    }
  },
  {
    method: 'PUT',
    path: '/api/leave/approve/{approveId}',
    options: {
      pre: [authMiddleware],
      handler: approveLeaveHandler
    }
  },
  {
    method: 'PUT',
    path: '/api/leave/reject/{rejectId}',
    options: {
      pre: [authMiddleware],
      handler: rejectLeaveHandler
    }
  },

  // Leave Types
  {
    method: 'GET',
    path: '/api/leave/types',
    options: {
      pre: [authMiddleware],
      handler: fetchLeaveTypes
    }
  },
  {
    method: 'POST',
    path: '/api/leave/types',
    options: {
      pre: [authMiddleware, roleMiddleware('admin')],
      handler: createLeaveHandler
    }
  },
  {
    method: 'PUT',
    path: '/api/leave/types/{id}',
    options: {
      pre: [authMiddleware, roleMiddleware('admin')],
      handler: updateLeaveHandler
    }
  },
  {
    method: 'DELETE',
    path: '/api/leave/types/{id}',
    options: {
      pre: [authMiddleware, roleMiddleware('admin')],
      handler: deleteLeaveHandler
    }
  },

  // Admin Route
  {
    method: 'GET',
    path: '/api/leave/on-leave-today',
    options: {
      pre: [authMiddleware],
      handler: fetchUsersOnLeaveToday
    }
  },

  // Team Leave
  {
    method: 'GET',
    path: '/api/leave/team-leaves',
    options: {
      pre: [authMiddleware],
      handler: fetchTeamLeave
    }
  }
];