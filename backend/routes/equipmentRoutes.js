const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllEquipment, getEquipment,
  createEquipment, updateEquipment, deleteEquipment
} = require('../controllers/equipmentController');

router.get('/', protect, getAllEquipment);
router.get('/:id', protect, getEquipment);
router.post('/', protect, createEquipment);
router.put('/:id', protect, updateEquipment);
router.delete('/:id', protect, deleteEquipment);

module.exports = router;