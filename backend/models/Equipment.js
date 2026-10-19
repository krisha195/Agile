const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  equipmentName: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ['Computer', 'Vehicle', 'Machine', 'Office Equipment', 'Other'],
    required: true
  },
  department: { type: String, required: true },
  location: { type: String },
  purchaseDate: { type: Date },
  warrantyExpiryDate: { type: Date },
  description: { type: String },
  status: {
    type: String,
    enum: ['Active', 'Under Maintenance', 'Scrapped'],
    default: 'Active'
  },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
}, { timestamps: true });

module.exports = mongoose.model('Equipment', equipmentSchema);