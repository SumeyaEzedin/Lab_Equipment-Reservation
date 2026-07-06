const {
    createEquipment,
    getAllEquipment,
    getEquipmentById,
    updateEquipment,
    deleteEquipment
} = require('../models/Equipment');

// GET /api/equipment - anyone logged in can view
async function listEquipment(req, res) {
    try {
        const equipment = await getAllEquipment();
        res.status(200).json(equipment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching equipment' });
    }
}

// GET /api/equipment/:id
async function getEquipment(req, res) {
    try {
        const equipment = await getEquipmentById(req.params.id);
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }
        res.status(200).json(equipment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching equipment' });
    }
}

// POST /api/equipment - admin only
async function addEquipment(req, res) {
    try {
        const { name, category, description, quantity } = req.body;

        if (!name || !quantity) {
            return res.status(400).json({ message: 'Name and quantity are required' });
        }

        const newEquipment = await createEquipment({
            name,
            category,
            description,
            quantity,
            addedBy: req.user.id // comes from the JWT via verifyToken middleware
        });

        res.status(201).json(newEquipment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error adding equipment' });
    }
}

// PUT /api/equipment/:id - admin only
async function editEquipment(req, res) {
    try {
        const existing = await getEquipmentById(req.params.id);
        if (!existing) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        const { name, category, description, quantity, status } = req.body;

        const updated = await updateEquipment(req.params.id, {
            name: name ?? existing.name,
            category: category ?? existing.category,
            description: description ?? existing.description,
            quantity: quantity ?? existing.quantity,
            status: status ?? existing.status
        });

        res.status(200).json(updated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error updating equipment' });
    }
}

// DELETE /api/equipment/:id - admin only
async function removeEquipment(req, res) {
    try {
        const deleted = await deleteEquipment(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Equipment not found' });
        }
        res.status(200).json({ message: 'Equipment deleted successfully', equipment: deleted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error deleting equipment' });
    }
}

module.exports = { listEquipment, getEquipment, addEquipment, editEquipment, removeEquipment };