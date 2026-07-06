const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const {
    listEquipment,
    getEquipment,
    addEquipment,
    editEquipment,
    removeEquipment
} = require('../controllers/equipmentController');

// Anyone logged in (student, technician, admin) can view equipment
router.get('/', verifyToken, listEquipment);
router.get('/:id', verifyToken, getEquipment);

// Only admins can add, edit, or delete equipment
router.post('/', verifyToken, requireRole('admin'), addEquipment);
router.put('/:id', verifyToken, requireRole('admin'), editEquipment);
router.delete('/:id', verifyToken, requireRole('admin'), removeEquipment);

module.exports = router;