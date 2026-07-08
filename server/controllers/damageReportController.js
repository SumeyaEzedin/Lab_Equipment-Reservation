const {
    createDamageReport,
    getAllDamageReports,
    getDamageReportsByUser,
    getDamageReportById,
    updateDamageReportStatus
} = require('../models/DamageReport');
const { getReservationById } = require('../models/Reservation');

// POST /api/damage-reports - any logged-in user reports damage on their own reservation
async function reportDamage(req, res) {
    try {
        const { reservationId, description } = req.body;

        if (!reservationId || !description) {
            return res.status(400).json({ message: 'reservationId and description are required' });
        }

        const reservation = await getReservationById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Students can only report damage on their own reservations
        if (req.user.role === 'student' && reservation.user_id !== req.user.id) {
            return res.status(403).json({ message: 'You can only report damage on your own reservations' });
        }

        const report = await createDamageReport({
            reservationId,
            reportedBy: req.user.id,
            description
        });

        res.status(201).json(report);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating damage report' });
    }
}

// GET /api/damage-reports - technician/admin sees all, student sees only their own
async function listDamageReports(req, res) {
    try {
        let reports;
        if (req.user.role === 'student') {
            reports = await getDamageReportsByUser(req.user.id);
        } else {
            reports = await getAllDamageReports();
        }
        res.status(200).json(reports);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching damage reports' });
    }
}

// PATCH /api/damage-reports/:id/resolve - technician/admin only
async function resolveDamageReport(req, res) {
    try {
        const report = await getDamageReportById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Damage report not found' });
        }
        if (report.status === 'resolved') {
            return res.status(400).json({ message: 'This damage report is already resolved' });
        }

        const updated = await updateDamageReportStatus(req.params.id, 'resolved');
        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error resolving damage report' });
    }
}

module.exports = { reportDamage, listDamageReports, resolveDamageReport };