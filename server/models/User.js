const pool = require('../config/db');

// Create a new user (password should already be hashed before calling this)
async function createUser({ name, email, passwordHash, role }) {
    const result = await pool.query(
        `INSERT INTO Users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role, created_at`,
        [name, email, passwordHash, role]
    );
    return result.rows[0];
}

// Find a user by email (used during login to check if they exist)
async function findUserByEmail(email) {
    const result = await pool.query(
        `SELECT * FROM Users WHERE email = $1`,
        [email]
    );
    return result.rows[0]; // undefined if not found
}

// Find a user by id (used later for things like "get my profile")
async function findUserById(id) {
    const result = await pool.query(
        `SELECT id, name, email, role, created_at FROM Users WHERE id = $1`,
        [id]
    );
    return result.rows[0];
}

module.exports = { createUser, findUserByEmail, findUserById };