const mongoose = require('mongoose');

const WhaleTransactionSchema = new mongoose.Schema({
  from: String,
  to: String,
  amount: Number,
  transactionHash: String,
  valueInUSD: Number,
  blockHeight: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BSCWhaleTransaction', WhaleTransactionSchema);