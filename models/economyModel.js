const mongoose = require("mongoose")

const economyModel = new mongoose.Schema({
  userID: { 
    type: String,
    required: true
  },
  guildID: { 
    type: String,
    required: true
  },
  coins: {
    type: Number, 
    default: 0,
    required: true
  }
});

module.exports = mongoose.model('economy', economyModel)
