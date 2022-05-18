const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const raceSchema = new Schema({
  season: {
    type: String,
    required: true,
  },
  round: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  circuit: {
    type: Object,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  }

}, {timestamps: true})

module.exports = mongoose.model('race', raceSchema)