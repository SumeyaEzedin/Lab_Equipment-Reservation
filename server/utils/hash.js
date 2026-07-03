const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// Hash a plain-text password before storing it
async function hashPassword(plainPassword) {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// Compare a plain-text password against a stored hash
async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = { hashPassword, comparePassword };