const mongoose = require("mongoose")

const levelSchema = new mongoose.Schema({
  userID: { 
    type: String,
    required: true
  },
  guildID: { 
    type: String,
    required: true

  },
  xp: {
    type: Number, 
    default: 0,
    required: true
  },
  level: { 
    type: Number, 
    default: 0,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: new Date(),
    required: true
  }
});

module.exports = mongoose.model('levels', levelSchema)
