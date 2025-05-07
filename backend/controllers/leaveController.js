const {
  getUsersOnLeaveToday,
  getTeamLeave,
  getLeaveBalance,
  getLeaveTypes,
  requestLeave,
  getLeaveHistory,
  cancelLeave,
  getIncomingRequests,
  approveLeave,
  rejectLeave,
  addLeaveType,
  updateLeaveType,
  deleteLeaveType
} = require('../models/leaveModel');

//Fetch Users On Leave Today
const fetchUsersOnLeaveToday = async (request, h) => {
  try {
    const users = await getUsersOnLeaveToday();
    if (users.length === 0) {
      return h.response({ message: 'No users are on leave today.' }).code(204);
    }
    return h.response({ count: users.length, users }).code(200);
  } catch (error) {
    console.error('Fetch users on leave error:', error);
    return h.response({ error: 'Failed to fetch users on leave today' }).code(500);
  }
};

// Fetch Team Leave Requests
const fetchTeamLeave = async (request, h) => {
  try {
    const { teamMembers, month, year,role } = request.query;

    if (!teamMembers || !month || !year) {
      return h.response({ error: 'Missing teamMembers, month, or year' }).code(400);
    }

    const userIdArray = teamMembers.split(',').map(id => parseInt(id.trim()));
    const leaveRequests = await getTeamLeave(userIdArray, month, year,role);

    return h.response({ leaveRequests }).code(200);
  } catch (error) {
    console.error('Team leave error:', error);
    return h.response({ error: 'Failed to fetch leave requests' }).code(500);
  }
};

// Fetch User's Leave Balance
const fetchLeaveBalance = async (request, h) => {
  try {
    const userId = parseInt(request.params.userId);
    const currentYear = new Date().getFullYear();
    const balance = await getLeaveBalance(userId, currentYear);

    if (balance.length === 0) {
      return h.response({ error: 'No leave balance found for the current year.' }).code(404);
    }

    let totalBalance = 0, totalLeaves = 0;
    const leaveDetails = balance.map(item => {
      totalBalance += item.balance;
      totalLeaves += (item.balance + item.used);
      return {
        leave_type: item.leaveType.name,
        total: item.balance + item.used,
        balance: item.balance,
        used: item.used
      };
    });

    return h.response({ totalBalance, totalLeaves, leaveDetails }).code(200);
  } catch (error) {
    console.error('Leave balance error:', error);
    return h.response({ error: 'Failed to fetch leave balance' }).code(500);
  }
};

// Fetch Leave Types
const fetchLeaveTypes = async (request, h) => {
  try {
    const leaveTypes = await getLeaveTypes();
    if (!leaveTypes || leaveTypes.length === 0) {
      return h.response({ error: 'No leave types found.' }).code(404);
    }
    return h.response(leaveTypes).code(200);
  } catch (error) {
    console.error('Leave types error:', error);
    return h.response({ error: 'Failed to fetch leave types' }).code(500);
  }
};

// Request Leave
const requestLeaveHandler = async (request, h) => {
  try {
    const { userId, leaveTypeId, startDate, endDate, isHalfDay, halfDayType, reason } = request.payload;
    const result = await requestLeave(userId, leaveTypeId, startDate, endDate, isHalfDay, halfDayType, reason);
    return h.response({ message: 'Leave requested successfully', result }).code(201);
  } catch (err) {
    console.error('Request leave error:', err);
    return h.response({ error: err.message || 'An error occurred' }).code(400);
  }
};

// Get Leave History
const getLeaveHistoryHandler = async (request, h) => {
  try {
    const userId = parseInt(request.params.userId);
    const leaveHistory = await getLeaveHistory(userId);
    return h.response({ leaveHistory }).code(200);
  } catch (err) {
    console.error('Leave history error:', err);
    return h.response({ error: 'Internal server error' }).code(500);
  }
};

// Cancel Leave
const cancelLeaveHandler = async (request, h) => {
  try {
    const leaveRequestId = parseInt(request.params.leaveRequestId);
    await cancelLeave(leaveRequestId);
    return h.response({ message: 'Leave canceled successfully' }).code(200);
  } catch (err) {
    console.error('Cancel leave error:', err);
    return h.response({ error: 'Internal server error' }).code(500);
  }
};

// Get Incoming Leave Requests
const getIncomingRequestsHandler = async (request, h) => {
  try {
    const userId = parseInt(request.params.userId);
    const requests = await getIncomingRequests(userId);
    return h.response({ incomingRequests: requests }).code(200);
  } catch (err) {
    console.error('Incoming requests error:', err);
    return h.response({ error: 'Failed to fetch incoming requests' }).code(500);
  }
};

// Approve Leave
const approveLeaveHandler = async (request, h) => {
  try {
    const requestId = parseInt(request.params.approveId);
    const result = await approveLeave(requestId);
    return h.response({ message: 'Leave approval processed', result }).code(200);
  } catch (err) {
    console.error('Approve leave error:', err);
    return h.response({ error: 'Failed to approve leave' }).code(500);
  }
};

// Reject Leave
const rejectLeaveHandler = async (request, h) => {
  try {
    const rejectId = parseInt(request.params.rejectId);
    const result = await rejectLeave(rejectId);
    return h.response({ message: 'Leave rejected', result }).code(200);
  } catch (err) {
    console.error('Reject leave error:', err);
    return h.response({ error: 'Failed to reject leave' }).code(500);
  }
};

// Create Leave Type
const createLeaveHandler = async (request, h) => {
  try {
    const { name, maxPerYear, multiApprover } = request.payload;
    const result = await addLeaveType(name, maxPerYear, multiApprover);
    return h.response({ message: 'Leave type added successfully', result }).code(200);
  } catch (err) {
    console.error('Create leave type error:', err);
    return h.response({ error: 'Failed to add leave type' }).code(500);
  }
};

// Update Leave Type
const updateLeaveHandler = async (request, h) => {
  try {
    const id = parseInt(request.params.id);
    const { name, maxPerYear, multiApprover } = request.payload;
    const result = await updateLeaveType(id, name, maxPerYear, multiApprover);
    return h.response({ message: 'Leave type updated successfully', result }).code(200);
  } catch (err) {
    console.error('Update leave type error:', err);
    return h.response({ error: 'Failed to update leave type' }).code(500);
  }
};

// Delete Leave Type
const deleteLeaveHandler = async (request, h) => {
  try {
    const id = parseInt(request.params.id);
    const result = await deleteLeaveType(id);
    return h.response({ message: 'Leave type deleted successfully', result }).code(200);
  } catch (err) {
    console.error('Delete leave type error:', err);
    return h.response({ error: 'Failed to delete leave type' }).code(500);
  }
};

module.exports = {
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
  deleteLeaveHandler,
};
