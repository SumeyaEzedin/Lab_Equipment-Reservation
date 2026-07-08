process.on('exit', (code) => {
    console.log('Process is exiting with code:', code);
});
const express = require('express');
require('dotenv').config();
const pool = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const verifyToken = require('./middleware/authMiddleware');
const requireRole = require('./middleware/roleMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
const reservationRoutes = require('./routes/reservationRoutes');
const damageReportRoutes = require('./routes/damageReportRoutes');

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/damage-reports', damageReportRoutes);
// Test route to confirm server + DB connection work
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            status: 'ok',
            message: 'Server is running and connected to the database',
            dbTime: result.rows[0].now
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});