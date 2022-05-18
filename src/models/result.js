const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resultSchema = new Schema({
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
  results: {
    race: {
      result: {
        type: Array,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
    },
    qualifying: {
      result: {
        type: Array,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
    },
    sprint: {
      result: {
        type: Array,
        required: false,
        default: [],
      },
      date: {
        type: String,
        required: false,
      },
    }
  }

}, {timestamps: true})

module.exports = mongoose.model('result', resultSchema)