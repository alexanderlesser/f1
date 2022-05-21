const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driverSchema = new Schema({
  driverId: {
    type: String,
    required: true,
  },
  driverNumber: {
    type: Number,
    required: false,
  },
  shortCode: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true,
  },
  birthDate: {
    type: String,
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  image: {
    type: Object,
    required: false,
  }

}, {timestamps: true})

module.exports = mongoose.model('driver', driverSchema)