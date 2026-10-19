const Equipment = require('../models/Equipment');

const getAllEquipment = async (req, res) => {
  try {
    const { category, status, department } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (department) filter.department = department;

    const equipment = await Equipment.find(filter).populate('teamId', 'teamName');
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate('teamId', 'teamName');
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.create(req.body);
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
    res.json({ message: 'Equipment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllEquipment, getEquipment, createEquipment, updateEquipment, deleteEquipment };