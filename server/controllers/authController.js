const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/hash');
const { createUser, findUserByEmail } = require('../models/User');

// Generate a JWT for a given user
function generateToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role },   // payload: what's stored inside the token
        process.env.JWT_SECRET,             // secret key used to sign it
        { expiresIn: '2h' }                 // token expires after 2 hours
    );
}

// POST /api/auth/register
async function register(req, res) {
    try {
        const { name, email, password, role } = req.body;

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Prevent duplicate accounts
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists' });
        }

        // Hash the password before storing it
        const passwordHash = await hashPassword(password);

        // Only allow 'student' or 'technician' at signup — never let a user self-assign 'admin'
        const allowedRoles = ['student', 'technician'];
        const finalRole = allowedRoles.includes(role) ? role : 'student';

        const newUser = await createUser({ name, email, passwordHash, role: finalRole });

        const token = generateToken(newUser);

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during registration' });
    }
}


async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);
logger.info(`User logged in: ${user.email} (role: ${user.role})`);
        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error during login' });
    }
}

module.exports = { register, login };