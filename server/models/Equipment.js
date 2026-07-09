const pool = require('../config/db');

async function createEquipment({ name, category, description, quantity, addedBy, imageUrl }) {
    const result = await pool.query(
        `INSERT INTO Equipment (name, category, description, quantity, added_by, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [name, category, description, quantity, addedBy, imageUrl]
    );
    return result.rows[0];

}

async function getAllEquipment() {
    const result = await pool.query(`SELECT * FROM Equipment ORDER BY created_at DESC`);
    return result.rows;
}

async function getEquipmentById(id) {
    const result = await pool.query(`SELECT * FROM Equipment WHERE id = $1`, [id]);
    return result.rows[0];
}

async function updateEquipment(id, { name, category, description, quantity, status, imageUrl }) {
    const result = await pool.query(
        `UPDATE Equipment
         SET name = $1, category = $2, description = $3, quantity = $4, status = $5, image_url = $6
         WHERE id = $7
         RETURNING *`,
        [name, category, description, quantity, status, imageUrl, id]
    );
    return result.rows[0];
}

async function deleteEquipment(id) {
    const result = await pool.query(`DELETE FROM Equipment WHERE id = $1 RETURNING *`, [id]);
    return result.rows[0];
}

module.exports = { createEquipment, getAllEquipment, getEquipmentById, updateEquipment, deleteEquipment };