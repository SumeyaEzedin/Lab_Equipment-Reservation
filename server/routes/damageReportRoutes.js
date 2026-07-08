const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const {
    reportDamage,
    listDamageReports,
    resolveDamageReport
} = require('../controllers/damageReportController');

// Any logged-in user can report damage and view reports
// (students see only their own, technicians/admins see all - handled in controller)
router.post('/', verifyToken, reportDamage);
router.get('/', verifyToken, listDamageReports);

// Only technicians and admins can mark a damage report as resolved
router.patch('/:id/resolve', verifyToken, requireRole('technician', 'admin'), resolveDamageReport);

module.exports = router;