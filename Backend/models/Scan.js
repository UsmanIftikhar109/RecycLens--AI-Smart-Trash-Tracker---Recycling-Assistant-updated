const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    isRecyclable: {
      type: Boolean,
      required: true,
    },
    confidence: {
      type: Number,
      default: 0.95,
    },
    icon: {
      type: String,
      default: '♻️',
    },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scan', scanSchema);
