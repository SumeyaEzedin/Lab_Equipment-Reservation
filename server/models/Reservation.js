const pool = require('../config/db');

// Check how much of a given equipment is already reserved during a time window
async function getReservedQuantity(equipmentId, startTime, endTime) {
    const result = await pool.query(
        `SELECT COALESCE(SUM(quantity_requested), 0) AS reserved
         FROM Reservations
         WHERE equipment_id = $1
           AND status IN ('pending', 'approved')
           AND start_time < $3
           AND end_time > $2`,
        [equipmentId, startTime, endTime]
    );
    return parseInt(result.rows[0].reserved, 10);
}

async function createReservation({ userId, equipmentId, quantityRequested, startTime, endTime }) {
    const result = await pool.query(
        `INSERT INTO Reservations (user_id, equipment_id, quantity_requested, start_time, end_time)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [userId, equipmentId, quantityRequested, startTime, endTime]
    );
    return result.rows[0];
}

async function getAllReservations() {
    const result = await pool.query(
        `SELECT r.*, u.name AS user_name, e.name AS equipment_name
         FROM Reservations r
         JOIN Users u ON r.user_id = u.id
         JOIN Equipment e ON r.equipment_id = e.id
         ORDER BY r.requested_at DESC`
    );
    return result.rows;
}

async function getReservationsByUser(userId) {
    const result = await pool.query(
        `SELECT r.*, e.name AS equipment_name
         FROM Reservations r
         JOIN Equipment e ON r.equipment_id = e.id
         WHERE r.user_id = $1
         ORDER BY r.requested_at DESC`,
        [userId]
    );
    return result.rows;
}

async function getReservationById(id) {
    const result = await pool.query(`SELECT * FROM Reservations WHERE id = $1`, [id]);
    return result.rows[0];
}

async function updateReservationStatus(id, status, approvedBy = null) {
    const result = await pool.query(
        `UPDATE Reservations
         SET status = $1::varchar,
             approved_by = $2,
             approved_at = CASE WHEN $1::varchar IN ('approved', 'rejected') THEN CURRENT_TIMESTAMP ELSE approved_at END,
             returned_at = CASE WHEN $1::varchar = 'returned' THEN CURRENT_TIMESTAMP ELSE returned_at END
         WHERE id = $3
         RETURNING *`,
        [status, approvedBy, id]
    );
    return result.rows[0];
}

module.exports = {
    getReservedQuantity,
    createReservation,
    getAllReservations,
    getReservationsByUser,
    getReservationById,
    updateReservationStatus
};