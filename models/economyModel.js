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
  },
  lastDaily: {
    type: Date,
    default: new Date(),
    required: true
  },
  lastWeekly: {
    type: Date,
    default: new Date(),
    required: true
  },
  lastMonthly: {
    type: Date,
    default: new Date(),
    required: true
  }
});

module.exports = mongoose.model('economy', economyModel)
