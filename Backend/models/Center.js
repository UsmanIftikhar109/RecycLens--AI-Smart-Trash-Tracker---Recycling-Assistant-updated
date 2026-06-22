const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: String,
    accepts: [String], // e.g., ['plastic', 'glass', 'paper', 'metal']
    isOpen: {
      type: Boolean,
      default: true,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    hours: String, // e.g., "Mon-Fri 9AM-5PM"
    distance: Number, // Simulated distance in km
  },
  { timestamps: true }
);

module.exports = mongoose.model('Center', centerSchema);
