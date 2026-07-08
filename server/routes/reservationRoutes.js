const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const {
    requestReservation,
    listReservations,
    approveReservation,
    rejectReservation,
    returnReservation
} = require('../controllers/reservationController');

// Any logged-in user can request a reservation and view reservations
// (students see only their own, technicians/admins see all - handled in controller)
router.post('/', verifyToken, requestReservation);
router.get('/', verifyToken, listReservations);

// Only technicians and admins can approve, reject, or mark as returned
router.patch('/:id/approve', verifyToken, requireRole('technician', 'admin'), approveReservation);
router.patch('/:id/reject', verifyToken, requireRole('technician', 'admin'), rejectReservation);
router.patch('/:id/return', verifyToken, requireRole('technician', 'admin'), returnReservation);

module.exports = router;