const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constructorSchema = new Schema({
  constructorId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  color: {
    type: Object,
    required: false,
  }

}, {timestamps: true})

module.exports = mongoose.model('constructor', constructorSchema)