const {
    getReservedQuantity,
    createReservation,
    getAllReservations,
    getReservationsByUser,
    getReservationById,
    updateReservationStatus
} = require('../models/Reservation');
const { getEquipmentById } = require('../models/Equipment');

// POST /api/reservations - any logged-in user requests a reservation
async function requestReservation(req, res) {
    try {
        const { equipmentId, quantityRequested, startTime, endTime } = req.body;

        if (!equipmentId || !quantityRequested || !startTime || !endTime) {
            return res.status(400).json({ message: 'equipmentId, quantityRequested, startTime, and endTime are required' });
        }

        if (new Date(startTime) >= new Date(endTime)) {
            return res.status(400).json({ message: 'startTime must be before endTime' });
        }

        const equipment = await getEquipmentById(equipmentId);
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        if (equipment.status !== 'active') {
            return res.status(400).json({ message: 'This equipment is not currently available for reservation' });
        }

        // Check how much is already reserved during this time window
        const alreadyReserved = await getReservedQuantity(equipmentId, startTime, endTime);
        const availableQuantity = equipment.quantity - alreadyReserved;

        if (quantityRequested > availableQuantity) {
            return res.status(409).json({
                message: `Not enough units available. Requested: ${quantityRequested}, Available: ${availableQuantity}`
            });
        }

        const reservation = await createReservation({
            userId: req.user.id,
            equipmentId,
            quantityRequested,
            startTime,
            endTime
        });

        res.status(201).json(reservation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating reservation' });
    }
}

// GET /api/reservations - technician/admin sees all, student sees only their own
async function listReservations(req, res) {
    try {
        let reservations;
        if (req.user.role === 'student') {
            reservations = await getReservationsByUser(req.user.id);
        } else {
            reservations = await getAllReservations();
        }
        res.status(200).json(reservations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching reservations' });
    }
}

// PATCH /api/reservations/:id/approve - technician/admin only
async function approveReservation(req, res) {
    try {
       
        const reservation = await getReservationById(req.params.id);
        
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        if (reservation.status !== 'pending') {
            return res.status(400).json({ message: `Cannot approve a reservation with status '${reservation.status}'` });
        }

        const updated = await updateReservationStatus(req.params.id, 'approved', req.user.id);
        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error approving reservation' });
    }
}

// PATCH /api/reservations/:id/reject - technician/admin only
async function rejectReservation(req, res) {
    try {
        const reservation = await getReservationById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        if (reservation.status !== 'pending') {
            return res.status(400).json({ message: `Cannot reject a reservation with status '${reservation.status}'` });
        }

        const updated = await updateReservationStatus(req.params.id, 'rejected', req.user.id);
        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error rejecting reservation' });
    }
}

// PATCH /api/reservations/:id/return - technician/admin only
async function returnReservation(req, res) {
    try {
        const reservation = await getReservationById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }
        if (reservation.status !== 'approved') {
            return res.status(400).json({ message: `Cannot mark as returned unless the reservation is 'approved'` });
        }

        const updated = await updateReservationStatus(req.params.id, 'returned', req.user.id);
        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error processing return' });
    }
}

module.exports = {
    requestReservation,
    listReservations,
    approveReservation,
    rejectReservation,
    returnReservation
};