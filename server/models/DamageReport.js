const pool = require('../config/db');

async function createDamageReport({ reservationId, reportedBy, description }) {
    const result = await pool.query(
        `INSERT INTO DamageReports (reservation_id, reported_by, description)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [reservationId, reportedBy, description]
    );
    return result.rows[0];
}

async function getAllDamageReports() {
    const result = await pool.query(
        `SELECT d.*, u.name AS reported_by_name, r.equipment_id
         FROM DamageReports d
         JOIN Users u ON d.reported_by = u.id
         JOIN Reservations r ON d.reservation_id = r.id
         ORDER BY d.reported_at DESC`
    );
    return result.rows;
}

async function getDamageReportsByUser(userId) {
    const result = await pool.query(
        `SELECT d.*, r.equipment_id
         FROM DamageReports d
         JOIN Reservations r ON d.reservation_id = r.id
         WHERE d.reported_by = $1
         ORDER BY d.reported_at DESC`,
        [userId]
    );
    return result.rows;
}

async function getDamageReportById(id) {
    const result = await pool.query(`SELECT * FROM DamageReports WHERE id = $1`, [id]);
    return result.rows[0];
}

async function updateDamageReportStatus(id, status) {
    const result = await pool.query(
        `UPDATE DamageReports
         SET status = $1::varchar,
             resolved_at = CASE WHEN $1::varchar = 'resolved' THEN CURRENT_TIMESTAMP ELSE resolved_at END
         WHERE id = $2
         RETURNING *`,
        [status, id]
    );
    return result.rows[0];
}

module.exports = {
    createDamageReport,
    getAllDamageReports,
    getDamageReportsByUser,
    getDamageReportById,
    updateDamageReportStatus
};